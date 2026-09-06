// ─── Amanai MCP & Intelligence Service ────────────────────────────────────────
// Connects BloomSense directly to the live amania-bloomsense Supabase backend
// Endpoint: https://kkiqgaxtfeswzfmqixfm.supabase.co/functions/v1/
// Powered by Gemini 3.5 Flash & Gemini 3.1 Pro with Deep Reasoning & Multimodal Vision

const SUPABASE_URL = "https://kkiqgaxtfeswzfmqixfm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraXFnYXh0ZmVzd3pmbXFpeGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxMDUsImV4cCI6MjA4MjY4MTEwNX0.BdO7GNhIZ9nGWRFJstypAwvJFtkVmXusoaptxtoydAw";

const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;
const ANALYZE_IMAGE_URL = `${SUPABASE_URL}/functions/v1/analyze-image`;

// Map UI language codes ('en-IN', 'hi-IN', 'or-IN') to backend language codes ('en', 'hi', 'od')
export function normalizeLanguageCode(lang) {
  if (!lang) return 'en';
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('or') || lang.startsWith('od')) return 'od';
  return 'en';
}

/**
 * 1. ask_amanai — Ask Amanai (general-purpose expert)
 * @param {string} question - The question to ask
 * @param {boolean} deepReasoning - true -> switches to Gemini 3.1 Pro for deep analysis
 * @param {'en'|'hi'|'od'} language - Response language: en / hi / od
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
    const res = await fetch(CHAT_URL, {
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

    // Stream SSE responses if reader is available
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

    // Fallback: Read full text response
    const fullBody = await res.text();
    // Parse SSE lines if returned as single block
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
 * @param {'en'|'hi'|'od'} [language] - en / hi / od
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
    deepReasoning: true, // Always uses deep reasoning model as specified
    language: backendLang
  });
}

/**
 * 3. analyzeLeafImage — Multimodal Vision Diagnosis with Gemini 3.5 Flash
 * @param {string} imageUrl - HTTPS url or base64 data URI (data:image/...)
 * @param {string} [message] - User message or question
 * @param {'en'|'hi'|'od'} [language] - en / hi / od
 */
export async function analyzeLeafImage({
  imageUrl,
  message = "Please diagnose this crop leaf for diseases, pests, or nutrient deficiencies.",
  language = 'en'
}) {
  const backendLang = normalizeLanguageCode(language);
  const langPrompt = backendLang === 'od'
    ? `${message}\n(Please respond in Odia - ଓଡ଼ିଆ with Identity, Health, Diagnosis, Immediate Action, Prevention, Utility)`
    : backendLang === 'hi'
    ? `${message}\n(Please respond in Hindi - हिन्दी with Identity, Health, Diagnosis, Immediate Action, Prevention, Utility)`
    : message;

  try {
    const res = await fetch(ANALYZE_IMAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        imageUrl,
        message: langPrompt,
        companionName: "Amanai"
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Analyze image error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.text || "";
  } catch (err) {
    console.error("analyzeLeafImage error:", err);
    throw err;
  }
}

/**
 * 4. search_disease_library — BloomSense disease library lookup
 * Searches a curated library of Indian crop diseases by name, Hindi name, or crop.
 * @param {string} [query] - Disease name, Hindi name, or crop to search. Omit to list.
 * @param {'en'|'hi'|'od'} [language] - en / hi / od
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
