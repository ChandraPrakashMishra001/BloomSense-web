import { sendMessage } from './openrouter.js';

export const ULTRAPLINIAN_MODELS = {
  top7: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.5-pro',
    'deepseek/deepseek-v3.2',
    'qwen/qwen-2.5-72b-instruct',
    'mistralai/mistral-large-2512',
    'meta-llama/llama-3.1-405b-instruct'
  ],
  fast: [
    'google/gemini-2.5-flash',
    'deepseek/deepseek-chat',
    'perplexity/sonar',
    'meta-llama/llama-3.1-8b-instruct',
    'moonshotai/kimi-k2.5',
    'x-ai/grok-code-fast-1',
    'xiaomi/mimo-v2-flash',
    'openai/gpt-oss-20b',
    'stepfun/step-3.5-flash',
    'google/gemini-3.1-flash-lite',
    'mistralai/mistral-small-3.2-24b-instruct',
    'nvidia/nemotron-3-nano-30b-a3b',
  ],
  standard: [
    'anthropic/claude-3.5-sonnet',
    'meta-llama/llama-4-scout',
    'deepseek/deepseek-v3.2',
    'nousresearch/hermes-3-llama-3.1-70b',
    'openai/gpt-4o',
    'google/gemini-2.5-pro',
    'anthropic/claude-sonnet-4',
    'anthropic/claude-sonnet-4.6',
    'mistralai/mixtral-8x22b-instruct',
    'meta-llama/llama-3.3-70b-instruct',
    'qwen/qwen-2.5-72b-instruct',
    'nousresearch/hermes-4-70b',
    'mistralai/mistral-medium-3.1',
    'z-ai/glm-5-turbo',
    'google/gemini-3-flash-preview',
    'google/gemma-3-27b-it',
  ],
  smart: [
    'openai/gpt-5',
    'openai/gpt-5.3-chat',
    'qwen/qwen3.5-plus-02-15',
    'z-ai/glm-5',
    'openai/gpt-5.2',
    'google/gemini-3-pro-preview',
    'anthropic/claude-opus-4.6',
    'openai/gpt-oss-120b',
    'deepseek/deepseek-r1',
    'meta-llama/llama-3.1-405b-instruct',
    'nousresearch/hermes-4-405b',
    'nousresearch/hermes-3-llama-3.1-405b',
    'nvidia/nemotron-3-super-120b-a12b',
  ],
  power: [
    'x-ai/grok-4',
    'openai/gpt-5.4',
    'z-ai/glm-4.7',
    'meta-llama/llama-4-maverick',
    'qwen/qwen3-235b-a22b',
    'qwen/qwen3-coder',
    'minimax/minimax-m2.5',
    'mistralai/mistral-large-2512',
    'google/gemini-3.1-pro-preview',
    'moonshotai/kimi-k2',
    'xiaomi/mimo-v2-pro',
  ],
  ultra: [
    'x-ai/grok-4-fast',
    'x-ai/grok-4.1-fast',
    'anthropic/claude-opus-4',
    'qwen/qwen-2.5-coder-32b-instruct',
    'qwen/qwq-32b',
    'mistralai/codestral-2508',
    'mistralai/devstral-medium',
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
