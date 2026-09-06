// ─── BloomSense Speech & Voice Engine ─────────────────────────────────────────
// Provides cross-browser reliable Text-to-Speech, Odia phonetics transliteration,
// garbage-collection protection, Chrome keep-alive, and instant stop mechanisms.

// Unicode 1-to-1 Mapping from Odia (U+0B00-U+0B7F) to Devanagari (U+0900-U+097F)
const ODIA_TO_DEVA = {
  // Independent Vowels
  '\u0B05': '\u0905', // ଅ -> अ
  '\u0B06': '\u0906', // ଆ -> आ
  '\u0B07': '\u0907', // ଇ -> इ
  '\u0B08': '\u0908', // ଈ -> ई
  '\u0B09': '\u0909', // ଉ -> उ
  '\u0B0A': '\u090A', // ଊ -> ऊ
  '\u0B0B': '\u090B', // ଋ -> ऋ
  '\u0B0C': '\u090C', // ଌ -> ऌ
  '\u0B0F': '\u090F', // ଏ -> ए
  '\u0B10': '\u0910', // ଐ -> ऐ
  '\u0B13': '\u0913', // ଓ -> ओ
  '\u0B14': '\u0914', // ଔ -> औ

  // Consonants
  '\u0B15': '\u0915', // କ -> क
  '\u0B16': '\u0916', // ଖ -> ख
  '\u0B17': '\u0917', // ଗ -> ग
  '\u0B18': '\u0918', // ଘ -> घ
  '\u0B19': '\u0919', // ଙ -> ङ
  '\u0B1A': '\u091A', // ଚ -> च
  '\u0B1B': '\u091B', // ଛ -> छ
  '\u0B1C': '\u091C', // ଜ -> ज
  '\u0B1D': '\u091D', // ଝ -> झ
  '\u0B1E': '\u091E', // ଞ -> ञ
  '\u0B1F': '\u091F', // ଟ -> ट
  '\u0B20': '\u0920', // ଠ -> ठ
  '\u0B21': '\u0921', // ଡ -> ड
  '\u0B22': '\u0922', // ଢ -> ढ
  '\u0B23': '\u0923', // ଣ -> ण
  '\u0B24': '\u0924', // ତ -> त
  '\u0B25': '\u0925', // ଥ -> थ
  '\u0B26': '\u0926', // ଦ -> द
  '\u0B27': '\u0927', // ଧ -> ध
  '\u0B28': '\u0928', // ନ -> न
  '\u0B2A': '\u092A', // ପ -> प
  '\u0B2B': '\u092B', // ଫ -> फ
  '\u0B2C': '\u092C', // ବ -> ब
  '\u0B2D': '\u092D', // ଭ -> भ
  '\u0B2E': '\u092E', // ମ -> म
  '\u0B2F': '\u092F', // ଯ -> य
  '\u0B30': '\u0930', // ର -> र
  '\u0B32': '\u0932', // ଲ -> ल
  '\u0B33': '\u0933', // ଳ -> ळ
  '\u0B35': '\u0935', // ଵ -> व
  '\u0B36': '\u0936', // ଶ -> श
  '\u0B37': '\u0937', // ଷ -> ष
  '\u0B38': '\u0938', // ସ -> स
  '\u0B39': '\u0939', // ହ -> ह

  // Additional variants
  '\u0B5C': '\u0921\u093C', // ଡ଼ -> ड़
  '\u0B5D': '\u0922\u093C', // ଢ଼ -> ढ़
  '\u0B5F': '\u092F',       // ୟ -> य
  '\u0B71': '\u0935',       // ୱ -> व

  // Dependent Vowel Signs (Matras)
  '\u0B3E': '\u093E', // ା -> ा
  '\u0B3F': '\u093F', // ି -> ि
  '\u0B40': '\u0940', // ୀ -> ी
  '\u0B41': '\u0941', // ୁ -> ु
  '\u0B42': '\u0942', // ୂ -> ू
  '\u0B43': '\u0943', // ୃ -> ृ
  '\u0B47': '\u0947', // େ -> े
  '\u0B48': '\u0948', // ୈ -> ै
  '\u0B4B': '\u094B', // ୋ -> ो
  '\u0B4C': '\u094C', // ୌ -> औ

  // Signs & Diacritics
  '\u0B01': '\u0901', // ଁ -> ँ (candrabindu)
  '\u0B02': '\u0902', // ଂ -> ं (anusvara)
  '\u0B03': '\u0903', // ଃ -> ः (visarga)
  '\u0B4D': '\u094D', // ୍ -> ् (virama)
  '\u0B3C': '\u093C', // ଼ -> ़ (nukta)
  '\u0B56': '\u0956', // ୖ -> ॖ
  '\u0B57': '\u0957', // ୗ -> ॗ

  // Digits
  '\u0B66': '\u0966', '\u0B67': '\u0967', '\u0B68': '\u0968', '\u0B69': '\u0969', '\u0B6A': '\u096A',
  '\u0B6B': '\u096B', '\u0B6C': '\u096C', '\u0B6D': '\u096D', '\u0B6E': '\u096E', '\u0B6F': '\u096F'
};

// Odia to Latin phonetic transliteration (as fallback if only English voices exist)
const ODIA_TO_LATIN = {
  '\u0B05': 'a', '\u0B06': 'aa', '\u0B07': 'i', '\u0B08': 'ee', '\u0B09': 'u', '\u0B0A': 'oo', '\u0B0B': 'ri',
  '\u0B0F': 'e', '\u0B10': 'ai', '\u0B13': 'o', '\u0B14': 'au',
  '\u0B15': 'ka', '\u0B16': 'kha', '\u0B17': 'ga', '\u0B18': 'gha', '\u0B19': 'nga',
  '\u0B1A': 'cha', '\u0B1B': 'chha', '\u0B1C': 'ja', '\u0B1D': 'jha', '\u0B1E': 'nya',
  '\u0B1F': 'ta', '\u0B20': 'tha', '\u0B21': 'da', '\u0B22': 'dha', '\u0B23': 'na',
  '\u0B24': 'ta', '\u0B25': 'tha', '\u0B26': 'da', '\u0B27': 'dha', '\u0B28': 'na',
  '\u0B2A': 'pa', '\u0B2B': 'pha', '\u0B2C': 'ba', '\u0B2D': 'bha', '\u0B2E': 'ma',
  '\u0B2F': 'ya', '\u0B30': 'ra', '\u0B32': 'la', '\u0B33': 'la', '\u0B35': 'va',
  '\u0B36': 'sha', '\u0B37': 'sha', '\u0B38': 'sa', '\u0B39': 'ha',
  '\u0B5C': 'da', '\u0B5D': 'dha', '\u0B5F': 'ya', '\u0B71': 'wa',
  '\u0B3E': 'aa', '\u0B3F': 'i', '\u0B40': 'ee', '\u0B41': 'u', '\u0B42': 'oo', '\u0B43': 'ri',
  '\u0B47': 'e', '\u0B48': 'ai', '\u0B4B': 'o', '\u0B4C': 'au',
  '\u0B01': 'n', '\u0B02': 'n', '\u0B03': 'h', '\u0B4D': ''
};

export function odiaToDevanagari(text) {
  if (!text) return '';
  return text.replace(/[\u0B00-\u0B7F]/g, char => ODIA_TO_DEVA[char] || char);
}

export function odiaToLatin(text) {
  if (!text) return '';
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch >= '\u0B00' && ch <= '\u0B7F') {
      const next = text[i + 1];
      const isConsonant = (ch >= '\u0B15' && ch <= '\u0B39') || ch === '\u0B5C' || ch === '\u0B5D' || ch === '\u0B5F' || ch === '\u0B71';
      const isNextMatra = (next >= '\u0B3E' && next <= '\u0B4C') || next === '\u0B4D';
      
      if (isConsonant && isNextMatra) {
        const base = ODIA_TO_LATIN[ch] || '';
        res += base.endsWith('a') ? base.slice(0, -1) : base;
      } else {
        res += ODIA_TO_LATIN[ch] || ch;
      }
    } else {
      res += ch;
    }
  }
  return res;
}

export function containsOdia(text) {
  return /[\u0B00-\u0B7F]/.test(text);
}

// Global speech engine state & keep-alive
let activeUtterance = null;
let keepAliveTimer = null;
let activeStopCallback = null;

export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function safeStopSpeech() {
  if (!isSpeechAvailable()) return;

  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
  } catch (err) {
    console.warn('Speech cancellation error:', err);
  }

  if (activeStopCallback) {
    try {
      activeStopCallback();
    } catch (_) {}
    activeStopCallback = null;
  }

  activeUtterance = null;

  // Dispatch global event so all components update UI immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bloomsense-speech-stopped'));
  }
}

export function safeSpeak(text, options = {}) {
  if (!isSpeechAvailable() || !text) return false;

  const {
    lang = 'en-IN',
    rate = 0.92,
    pitch = 1.12,
    onStart,
    onEnd,
    onError
  } = options;

  // 1. Immediately cancel any prior speech
  safeStopSpeech();

  const voices = window.speechSynthesis.getVoices();
  const isOdiaLang = lang.startsWith('or') || lang.startsWith('ori') || containsOdia(text);

  let textToSpeak = text;
  let targetLang = lang;
  let chosenVoice = null;

  if (isOdiaLang) {
    // Check if there is an actual native Odia voice available on this OS
    const nativeOdiaVoice = voices.find(v => 
      v.lang.startsWith('or') || v.lang.startsWith('ori') || v.name.toLowerCase().includes('odia') || v.name.toLowerCase().includes('oriya')
    );

    if (nativeOdiaVoice) {
      chosenVoice = nativeOdiaVoice;
      targetLang = 'or-IN';
      textToSpeak = text;
    } else {
      // Find sweetest Hindi or Indian voice for phonetically accurate Odia playback
      const hindiVoice = voices.find(v => 
        (v.lang.startsWith('hi') || v.lang === 'hi_IN') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('google'))
      ) || voices.find(v => v.lang.startsWith('hi'));

      if (hindiVoice) {
        chosenVoice = hindiVoice;
        targetLang = 'hi-IN';
        textToSpeak = odiaToDevanagari(text);
      } else {
        // Fallback to Indian English or global voice with Latin phonetic transliteration
        const indianEngVoice = voices.find(v => v.lang === 'en-IN' && v.name.toLowerCase().includes('female'))
          || voices.find(v => v.lang === 'en-IN')
          || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
          || voices.find(v => v.lang.startsWith('en'));

        if (indianEngVoice) {
          chosenVoice = indianEngVoice;
          targetLang = 'en-IN';
          textToSpeak = odiaToLatin(text);
        } else {
          chosenVoice = voices[0] || null;
          textToSpeak = odiaToLatin(text);
        }
      }
    }
  } else if (lang.startsWith('hi')) {
    // Hindi
    chosenVoice = voices.find(v => 
      (v.lang.startsWith('hi') || v.lang === 'hi_IN') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('google'))
    ) || voices.find(v => v.lang.startsWith('hi'))
      || voices.find(v => v.lang.startsWith('en'));
    targetLang = 'hi-IN';
  } else {
    // English & others (Sweet pleasant tone)
    chosenVoice = voices.find(v => 
      (v.name.toLowerCase().includes('uk english female') || v.name.toLowerCase().includes('sonia') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('natural'))
    ) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang.startsWith('en-IN'))
      || voices.find(v => v.lang.startsWith('en'));
    targetLang = 'en-IN';
  }

  // Small delay to ensure previous speech cancellation cycle completes cleanly in Chromium
  setTimeout(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = targetLang;
      if (chosenVoice) utterance.voice = chosenVoice;

      activeUtterance = utterance;

      const cleanup = () => {
        if (keepAliveTimer) {
          clearInterval(keepAliveTimer);
          keepAliveTimer = null;
        }
        activeUtterance = null;
        activeStopCallback = null;
      };

      activeStopCallback = () => {
        cleanup();
        onEnd?.();
      };

      utterance.onstart = () => {
        // Keep-alive timer for Chrome (>14 seconds cut-off bug)
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        keepAliveTimer = setInterval(() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bloomsense-speech-started', { detail: { text, lang } }));
        }
        onStart?.();
      };

      utterance.onend = () => {
        cleanup();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bloomsense-speech-stopped'));
        }
        onEnd?.();
      };

      utterance.onerror = (err) => {
        cleanup();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bloomsense-speech-stopped'));
        }
        onError?.(err);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('safeSpeak error:', err);
      onError?.(err);
      return false;
    }
  }, 40);

  return true;
}
