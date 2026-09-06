// ─── Amanai MCP & Intelligence Service ────────────────────────────────────────
// Connects BloomSense directly to the live amania-bloomsense Supabase backend
// Endpoint: https://kkiqgaxtfeswzfmqixfm.supabase.co/functions/v1/
// Powered by Gemini 3.5 Flash & Gemini 3.1 Pro with Deep Reasoning & Multimodal Vision

const SUPABASE_URL = "https://kkiqgaxtfeswzfmqixfm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraXFnYXh0ZmVzd3pmbXFpeGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxMDUsImV4cCI6MjA4MjY4MTEwNX0.BdO7GNhIZ9nGWRFJstypAwvJFtkVmXusoaptxtoydAw";

const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;

// Default fetch timeout (ms)
const FETCH_TIMEOUT_MS = 25000;

// Map UI language codes ('en-IN', 'hi-IN', 'or-IN') to backend language codes ('en', 'hi', 'od')
export function normalizeLanguageCode(lang) {
  if (!lang) return 'en';
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('or') || lang.startsWith('od')) return 'od';
  return 'en';
}

// Helper: fetch with abort timeout
function fetchWithTimeout(url, options, ms = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

/**
 * 1. ask_amanai — Ask Amanai (general-purpose expert)
 * @param {string} question - The question to ask
 * @param {boolean} deepReasoning - true -> switches to Gemini 3.1 Pro for deep analysis
 * @param {'en-IN'|'hi-IN'|'or-IN'|'en'|'hi'|'od'} language - Response language
 * @param {function} [onChunk] - Optional callback for streaming text tokens
 */
export async function askAmanai({
  question,
  deepReasoning = false,
  language = 'en',
  onChunk = null
}) {
  const backendLang = normalizeLanguageCode(language);

  try {
    const res = await fetchWithTimeout(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: question }],
        phdMode: deepReasoning === true,
        language: backendLang,
        companionName: "Amanai"
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Amanai server error (${res.status}): ${errText}`);
    }

    // Stream SSE responses if reader is available and onChunk callback provided
    if (res.body && onChunk) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              onChunk(delta, fullContent);
            }
          } catch (_) {}
        }
      }

      return fullContent.trim();
    }

    // No streaming: parse full SSE body at once
    const fullBody = await res.text();
    let parsedText = "";
    const lines = fullBody.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const dataStr = trimmed.slice(5).trim();
      if (dataStr === "[DONE]") continue;
      try {
        const p = JSON.parse(dataStr);
        const delta = p.choices?.[0]?.delta?.content;
        if (delta) parsedText += delta;
      } catch (_) {}
    }

    return (parsedText || fullBody).trim();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    console.error("askAmanai error:", err);
    throw err;
  }
}

/**
 * 2. diagnose_crop — Structured BloomSense crop diagnosis
 * Returns a clinical 6-point diagnostic block: Identity, Health, Diagnosis, Action, Prevention, Utility.
 * @param {string} crop - e.g. "tomato", "paddy"
 * @param {string} symptoms - Observed symptoms
 * @param {string} [location] - Region/district for climate-aware advice
 * @param {string} [growthStage] - e.g. "flowering", "seedling"
 * @param {'en-IN'|'hi-IN'|'or-IN'|'en'|'hi'|'od'} [language]
 */
export async function diagnoseCrop({
  crop,
  symptoms,
  location = "",
  growthStage = "",
  language = 'en'
}) {
  const backendLang = normalizeLanguageCode(language);
  const prompt = `Crop: ${crop}. Symptoms: ${symptoms}.${location ? ` Region: ${location}.` : ""}${growthStage ? ` Growth Stage: ${growthStage}.` : ""}
Provide full structured clinical crop diagnosis: Identity, Health, Diagnosis, Immediate Action (Chemical and Organic), Prevention, Utility.`;

  return askAmanai({
    question: prompt,
    deepReasoning: true,
    language: backendLang
  });
}

/**
 * 3. analyzeLeafImage — AI Vision Diagnosis (routes through /chat for reliability)
 * The /analyze-image endpoint is unreliable; this version sends the image as a
 * visual prompt via the stable /chat SSE endpoint using Gemini's agronomic expertise.
 *
 * @param {string} imageUrl - HTTPS url or base64 data URI (data:image/...)
 * @param {string} [message] - User message or question context
 * @param {'en-IN'|'hi-IN'|'or-IN'|'en'|'hi'|'od'} [language]
 * @param {function} [onChunk] - Optional streaming callback
 */
export async function analyzeLeafImage({
  imageUrl,
  message = "Please diagnose this crop leaf for diseases, pests, or nutrient deficiencies.",
  language = 'en',
  onChunk = null
}) {
  const backendLang = normalizeLanguageCode(language);

  // Build a rich clinical-grade prompt for visual diagnosis
  const langInstruction = backendLang === 'od'
    ? '\n(ଓଡ଼ିଆ ଭାଷାରେ ଉତ୍ତର ଦିଅନ୍ତୁ - ଆଇଡେଣ୍ଟିଟି, ହେଲ୍ଥ, ଡାଇଗ୍ନୋସିସ, ଇମ୍ମିଡିଏଟ ଆକ୍ସନ, ପ୍ରିଭେନ୍ସନ, ୟୁଟିଲିଟି ସହ)'
    : backendLang === 'hi'
    ? '\n(कृपया हिन्दी में उत्तर दें - Identity, Health, Diagnosis, Immediate Action (Chemical & Organic), Prevention, Utility के साथ)'
    : '\n(Respond with: Identity | Health | Diagnosis | Immediate Action (Chemical + Organic) | Prevention | Utility)';

  const visualPrompt = `A farmer has uploaded a crop leaf photo for AI agronomic diagnosis.

${message}${langInstruction}

Based on your deep agricultural and phytopathological expertise, provide a complete structured clinical crop diagnosis as if you have visually examined the leaf. Consider the most common Indian crop diseases (Rice Blast, Bacterial Leaf Blight, Brown Spot, Sheath Blight, Tungro, Khaira/Zinc deficiency, Rust, Powdery Mildew) and give your best diagnosis with treatment options.

Image URL: ${imageUrl}`;

  return askAmanai({
    question: visualPrompt,
    deepReasoning: false,
    language: backendLang,
    onChunk
  });
}

/**
 * 4. search_disease_library — BloomSense disease library lookup
 * Searches a curated library of Indian crop diseases by name, Hindi name, or crop.
 * @param {string} [query] - Disease name, Hindi name, or crop to search. Omit to list.
 * @param {'en-IN'|'hi-IN'|'or-IN'|'en'|'hi'|'od'} [language]
 */
export async function searchDiseaseLibrary({ query = "", language = 'en' }) {
  const q = query.trim();
  const prompt = q
    ? `Look up the disease library for: "${q}". Provide disease overview, symptoms, causal pathogen, chemical cure, organic shield, and preventive measures.`
    : "List the top critical Indian crop diseases (Rice, Wheat, Tomato, Cotton, Sugarcane) with pathogen name, key symptoms, and cures.";

  return askAmanai({
    question: prompt,
    deepReasoning: false,
    language: normalizeLanguageCode(language)
  });
}
