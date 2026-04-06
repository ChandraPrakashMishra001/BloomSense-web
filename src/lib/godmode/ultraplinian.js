import { sendMessage } from './openrouter.js';

export const ULTRAPLINIAN_MODELS = {
  top7: [
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'qwen/qwen-2.5-coder-32b-instruct:free',
    'mistralai/mistral-small-24b-instruct-2501:free',
    'deepseek/deepseek-chat:free',
    'sophosympatheia/rogue-rose-103b-v0.2:free',
    'cognitivecomputations/dolphin3.0-r1-mistral-24b:free'
  ],
  fast: [
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-2.0-pro-exp-02-05:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-vl-plus:free',
    'liquid/lfm-40b:free',
    'mistralai/mistral-nemo:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'huggingfaceh4/zephyr-7b-beta:free',
    'openchat/openchat-7b:free',
    'gryphe/mythomax-l2-13b:free',
    'undershiy/chupacabra-7b:free'
  ],
  standard: [
    'meta-llama/llama-3.2-11b-vision-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'deepseek/deepseek-r1-distill-llama-70b:free',
    'google/gemma-2-9b-it:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'microsoft/wizardlm-2-8x22b:free',
  ],
  smart: [
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-haiku',
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'openai/o1-mini',
  ],
  power: [
    'x-ai/grok-2-1212',
    'deepseek/deepseek-reasoner',
    'mistralai/pixtral-12b:free',
    'deepseek/deepseek-r1-distill-qwen-32b:free',
    'meta-llama/llama-3-8b-instruct:free',
  ],
  ultra: [
    'anthropic/claude-3-opus',
    'cognitivecomputations/dolphin3.0-qwen2.5-32b:free',
    'nvidia/llama-3.1-nemotron-70b-instruct:free',
  ]
};

export function getModelsForTier(tier) {
  const tiers = ULTRAPLINIAN_MODELS;
  let models = [];
  switch (tier) {
    case 'top7': models = tiers.top7; break;
    case 'fast': models = tiers.fast; break;
    case 'standard': models = [...tiers.fast, ...tiers.standard]; break;
    case 'smart': models = [...tiers.fast, ...tiers.standard, ...tiers.smart]; break;
    case 'power': models = [...tiers.fast, ...tiers.standard, ...tiers.smart, ...tiers.power]; break;
    case 'ultra': models = [...tiers.fast, ...tiers.standard, ...tiers.smart, ...tiers.power, ...tiers.ultra]; break;
    default: models = tiers.standard; break;
  }
  return [...new Set(models)]; // Deduplicate models
}

export function scoreResponse(content, userQuery) {
  if (!content || content.length < 10) return 0;

  // Fix: userQuery can be an array if multi-modal
  let queryString = '';
  if (Array.isArray(userQuery)) {
    queryString = userQuery.find(c => c.type === 'text')?.text || '';
  } else if (typeof userQuery === 'string') {
    queryString = userQuery;
  }

  let score = 0;
  score += Math.min(content.length / 40, 25);
  
  const headers = (content.match(/^#{1,3}\s/gm) || []).length;
  const listItems = (content.match(/^[\s]*[-*•]\s/gm) || []).length;
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  score += Math.min(headers * 3 + listItems * 1.5 + codeBlocks * 5, 20);

  const refusalPatterns = [
    /I cannot|I can't|I'm unable to/i,
    /I apologize|I'm sorry, but/i,
    /I must decline|I have to refuse/i,
  ];
  const refusalCount = refusalPatterns.filter(p => p.test(content)).length;
  score += Math.max(25 - refusalCount * 8, 0);

  const trimmed = content.trim();
  const hasPreamble = [/^(Sure|Of course|Certainly)/i].some(p => p.test(trimmed));
  score += hasPreamble ? 8 : 15;

  const queryWords = queryString.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const contentLower = content.toLowerCase();
  const matchedWords = queryWords.filter(w => contentLower.includes(w));
  const relevance = queryWords.length > 0 ? matchedWords.length / queryWords.length : 0.5;
  score += relevance * 15;

  return Math.round(Math.min(score, 100));
}

export async function queryModel(model, messages, apiKey, params, signal) {
  const startTime = Date.now();
  try {
    const res = await sendMessage({ messages, model, apiKey, ...params, signal });
    return {
      model,
      content: res.content,
      duration_ms: Date.now() - startTime,
      success: true,
      score: 0
    };
  } catch (err) {
    return {
      model,
      content: '',
      duration_ms: Date.now() - startTime,
      success: false,
      error: err.message,
      score: 0
    };
  }
}

export function raceModels(models, messages, apiKey, params, config = {}) {
  const minResults = config.minResults ?? 3;
  const gracePeriod = config.gracePeriod ?? 5000;
  const hardTimeout = config.hardTimeout ?? 45000;
  const userQuery = messages.length > 0 ? messages[messages.length - 1].content : '';

  return new Promise(resolve => {
    const results = [];
    let successCount = 0;
    let settled = 0;
    let graceTimer = null;
    let resolved = false;

    const controller = new AbortController();

    const finish = () => {
      if (resolved) return;
      resolved = true;
      controller.abort();
      if (graceTimer) clearTimeout(graceTimer);
      if (hardTimer) clearTimeout(hardTimer);
      // Give each a score
      results.forEach(r => {
        if (r.success) {
           r.score = scoreResponse(r.content, userQuery);
        }
      });
      // Sort by score descending
      resolve(results.sort((a,b) => b.score - a.score));
    };

    const hardTimer = setTimeout(finish, hardTimeout);

    models.forEach((model, i) => {
      // stagger slightly to avoid instantaneous rate limit across 10 models
      setTimeout(() => {
        if(resolved) return;
        queryModel(model, messages, apiKey, params, controller.signal)
          .then(result => {
             if (resolved) return;
             
             // Score it immediately out here to pass to onResult if needed
             if (result.success) {
               result.score = scoreResponse(result.content, userQuery);
             }
             
             results.push(result);
             settled++;
             if (result.success) successCount++;

             if (config.onResult) {
               try { config.onResult(result); } catch {}
             }

             if (successCount >= minResults && !graceTimer) {
               graceTimer = setTimeout(finish, gracePeriod);
             }

             if (settled === models.length) {
               finish();
             }
          });
      }, i * 50);
    });

    if (models.length === 0) finish();
  });
}

export async function classifySector(query, apiKey) {
  const prompt = `You are the ANANT classification engine. 
Based on the following query, dynamically determine the most appropriate conceptual sector and recommend sampling parameters.
Return ONLY a valid JSON object in this exact format, with no markdown formatting or backticks:
{"name": "Sector Name", "temperature": 0.5, "top_p": 0.8}
Query: "${query}"`;

  try {
    const response = await sendMessage({
      messages: [{ role: 'user', content: prompt }],
      model: 'google/gemini-2.5-flash',
      apiKey,
      temperature: 0.1,
      maxTokens: 150
    });
    
    let content = response.content.replace(/```json/gi, '').replace(/```/gi, '').trim();
    return JSON.parse(content);
  } catch (err) {
    return { name: "Universal", temperature: 0.6, top_p: 0.9 };
  }
}
