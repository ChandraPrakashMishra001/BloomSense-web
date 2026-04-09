const modelsToTest = [
  'google/gemini-2.0-flash-exp:free',
  'google/gemini-2.0-pro-exp-02-05:free',
  'qwen/qwen-vl-plus:free',
  'liquid/lfm-40b:free',
  'mistralai/mistral-nemo:free',
  'google/gemini-2.5-flash',
  'google/gemini-2.5-pro',
  'google/gemini-2.0-flash-lite-preview-02-05:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'deepseek/deepseek-chat:free',
  'sophosympatheia/rogue-rose-103b-v0.2:free',
  'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free',
  'gryphe/mythomax-l2-13b:free',
  'undershiy/chupacabra-7b:free'
];

async function testModel(model) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{role: "user", content: "Hi"}]
      })
    });
    const data = await res.json();
    if (data.error) {
      console.log(`[${model}]: ${data.error.message}`);
    } else {
      console.log(`[${model}]: OK`);
    }
  } catch(e) {
    console.log(`[${model}]: Error - ${e.message}`);
  }
}

async function testModels() {
  await Promise.all(modelsToTest.map(model => testModel(model)));
}

testModels();
