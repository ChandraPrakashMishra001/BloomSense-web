export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function sendMessage({
  messages,
  model,
  apiKey,
  temperature = 0.7,
  maxTokens = 4096,
  top_p,
  signal
}) {
  if (!apiKey) {
    throw new Error('No API key set.');
  }

  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens
  };

  if (top_p !== undefined) body.top_p = top_p;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bloomsense.co.in',
      'X-Title': 'BloomSense God Mode'
    },
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from model');
  }

  return {
    content: data.choices[0].message.content,
    model: data.model || model
  };
}
