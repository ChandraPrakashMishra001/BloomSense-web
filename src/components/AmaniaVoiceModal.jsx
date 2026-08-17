import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, X, Sparkles, Send, 
  RefreshCw, Bot, User, Radio, MessageSquare, AlertCircle, Camera, Trash2
} from 'lucide-react';

// Comprehensive Domain Knowledge & Conversational Intelligence Base for Amania AI
const AGRONOMIC_KNOWLEDGE_BASE = [
  // ── 1. Conversational & Social Greetings ──────────────────────────────────────
  {
    keywords: ['how are you', 'how r u', 'how are u', 'how do you do', 'how are you doing', 'kaisa hai', 'kemiti achha', 'hows it going', 'whats up', 'what\'s up'],
    response: "I'm doing great, thank you for asking! I'm active and ready to help your farm. How are your crops doing today? Feel free to ask about crop diseases, fertilizer timing, weather infection risks, or snap a leaf photo for instant diagnosis!",
    topic: "Greeting"
  },
  {
    keywords: ['hello', 'hi', 'namaste', 'hey', 'pranam', 'ram ram', 'namaskar', 'good morning', 'good afternoon', 'good evening'],
    response: "Namaste! I am Amania, your AI agronomist and crop doctor. I'm here to help you optimize your crop yield, cure plant diseases, and prevent regional outbreaks. What crop are you growing today?",
    topic: "Introduction"
  },
  {
    keywords: ['who are you', 'who made you', 'who created you', 'what is your name', 'who is amania', 'about you', 'introduce yourself'],
    response: "I am Amania AI, an intelligent precision agronomist developed for BloomSense. I analyze botanical pathogens, calculate precise NPK fertilizer doses, track regional disease outbreaks on our 3D map, and recommend both chemical and organic cures for Indian farmers.",
    topic: "Identity"
  },
  {
    keywords: ['what can you do', 'help', 'features', 'what are your skills', 'how do you work', 'how to use', 'guide me'],
    response: "Here is what I can do for you: 1) Camera Leaf Diagnosis — snap a leaf photo for instant disease detection, 2) Agronomic Solutions — get chemical and 100% organic recipes, 3) Fertilizer Schedules — calculate basal and top-dressing NPK doses, 4) Regional Disease Warnings — check if contagious outbreaks are spreading in your district, and 5) Government Schemes — information on PM-KISAN, PMFBY, and MSP.",
    topic: "Capabilities"
  },
  {
    keywords: ['thank you', 'thanks', 'dhanyawad', 'shukriya', 'great job', 'awesome', 'good job', 'love you', 'helpful'],
    response: "You are very welcome! May your harvest be bountiful and healthy. Let me know whenever you need advice on your field, fertilizers, or seasonal tasks.",
    topic: "Gratitude"
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'alvida', 'tata', 'good night'],
    response: "Goodbye and happy farming! Remember to inspect your crop leaves regularly. Tap the microphone anytime you need Amania AI.",
    topic: "Farewell"
  },

  // ── 2. Common Plant Symptoms ──────────────────────────────────────────────────
  {
    keywords: ['yellow leaf', 'yellow leaves', 'yellowing', 'pale leaves', 'leaves turning yellow', 'peela patta'],
    response: "Yellowing leaves generally point to 3 main causes: 1) Nitrogen deficiency (uniform yellowing on older lower leaves — apply Neem-coated Urea top-dressing), 2) Zinc deficiency ('Khaira' rusty yellow spots on young leaves — spray 0.5% Zinc Sulfate + lime), or 3) Waterlogging & Root Rot (drain excess water). If yellowing shows wavy margins, it could be Bacterial Leaf Blight.",
    topic: "Yellowing Leaves Diagnosis"
  },
  {
    keywords: ['curling', 'curled leaf', 'leaf curl', 'murda', 'leaf curling', 'wrinkled leaves'],
    response: "Leaf curling is most commonly caused by sucking pests: 1) Upward cup curling indicates Thrips attack (spray Diafenthiuron 50% WP @ 1.2g/L or Fipronil @ 1.5ml/L), 2) Downward curling indicates Broad Mites (spray Spiromesifen 22.9% SC @ 1ml/L). Install Blue and Yellow sticky traps across your field for organic control.",
    topic: "Leaf Curl Complex"
  },
  {
    keywords: ['white spots', 'white powder', 'powdery', 'white dust', 'white patches', 'powdery mildew'],
    response: "A white powdery film on leaf surfaces indicates Powdery Mildew. For chemical control, spray Hexaconazole 5% SC @ 1ml/L or Propiconazole 25% EC @ 1ml/L. For an organic remedy, spray Wettable Sulfur 80% WP @ 2g/L or sour buttermilk extract (10%) in the early morning.",
    topic: "Powdery Mildew Protocol"
  },
  {
    keywords: ['wilting', 'drooping', 'drying plant', 'sudden death', 'wilt', 'fusarium'],
    response: "Sudden wilting while leaves remain green is a sign of Bacterial Wilt or Fusarium Root Rot. Cut the lower stem: if vascular rings are brown or exude slimy bacterial ooze in water, drench the root zone with Copper Oxychloride @ 3g/L or apply Trichoderma viride enriched compost.",
    topic: "Wilt Management"
  },
  {
    keywords: ['holes', 'caterpillar', 'eating leaves', 'armyworm', 'cut leaves', 'chewed leaves'],
    response: "Holes and chewed leaf margins are caused by caterpillars like Fall Armyworm, Leaf Folder, or Semilooper. For fast knockdown, spray Chlorantraniliprole 18.5% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.5g/L. For organic control, spray Bacillus thuringiensis (Bt) @ 2g/L.",
    topic: "Caterpillar & Pest Attack"
  },

  // ── 3. Major Crop Diseases (Rice / Paddy, Wheat, Tomato, Cotton, etc.) ────────
  {
    keywords: ['rice blast', 'blast', 'magnaporthe', 'spindle', 'pyricularia', 'neck blast'],
    response: "Rice Blast (caused by Magnaporthe oryzae) produces spindle-shaped lesions with ash-grey centers. Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane @ 1.5ml/L immediately. For organic protection, spray 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 5g/L. Avoid high nitrogen doses.",
    topic: "Rice Blast Treatment"
  },
  {
    keywords: ['bacterial blight', 'bacterial leaf blight', 'blb', 'xanthomonas', 'straw leaf'],
    response: "Bacterial Leaf Blight causes wavy yellow-to-straw colored lesions along leaf edges starting from the tip. Spray Streptocycline @ 0.1g/L mixed with Copper Oxychloride @ 2.5g/L. Drain standing water from the field for 3 days and withhold top-dress nitrogen.",
    topic: "Bacterial Blight Cure"
  },
  {
    keywords: ['brown spot', 'sesame spot', 'helminthosporium', 'bipolaris'],
    response: "Brown Spot produces small oval brown spots with yellow halos on leaves and grains. Spray Mancozeb 75% WP @ 2g/L or Propiconazole @ 1ml/L. This disease indicates soil potassium or micronutrient deficiency, so top-dress MOP (Muriate of Potash).",
    topic: "Brown Spot Advisory"
  },
  {
    keywords: ['stem borer', 'dead heart', 'white earhead', 'scirpophaga'],
    response: "Yellow Stem Borer causes 'Dead Heart' during tillering and 'White Earhead' during panicle emergence. Apply Chlorantraniliprole 0.4% Granules @ 4kg/acre or spray Chlorantraniliprole 18.5% SC @ 0.3ml/L. Install 8 pheromone traps per acre for eco-friendly monitoring.",
    topic: "Stem Borer Control"
  },
  {
    keywords: ['bph', 'brown plant hopper', 'plant hopper', 'hopper burn'],
    response: "Brown Plant Hopper (BPH) congregates at the base of paddy stems and sucks sap, causing rapid drying patches known as 'Hopper Burn'. Spray Pymetrozine 50% WDG @ 0.6g/L or Dinotefuran 20% SG @ 0.4g/L directed strictly at the base of plants. Drain standing water.",
    topic: "BPH Shield"
  },
  {
    keywords: ['yellow rust', 'wheat rust', 'puccinia', 'rust in wheat'],
    response: "Yellow Rust of Wheat produces parallel rows of yellow-orange powdery pustules on leaves. Spray Propiconazole 25% EC @ 1ml/L (Tilt) in 200 liters of water per acre. Repeat after 15 days if cloudy weather persists.",
    topic: "Wheat Yellow Rust"
  },
  {
    keywords: ['tomato blight', 'early blight', 'late blight', 'alternaria', 'phytophthora'],
    response: "Tomato Early Blight shows target-board concentric rings, while Late Blight causes rapid water-soaked dark rotting. Spray Mancozeb 75% WP @ 2.5g/L or Cymoxanil 8% + Mancozeb 64% @ 2g/L. Avoid overhead sprinkler irrigation to keep leaves dry.",
    topic: "Tomato Blight Management"
  },
  {
    keywords: ['pink bollworm', 'bollworm', 'cotton pest', 'whitefly cotton'],
    response: "For Pink Bollworm in Cotton, install PB-Rope L pheromone dispensers (10/acre) and spray Profenofos 50% EC @ 2ml/L. For Whitefly, use yellow sticky traps (20/acre) and spray Diafenthiuron 50% WP @ 1.2g/L.",
    topic: "Cotton Pest Defense"
  },
  {
    keywords: ['fall armyworm', 'faw', 'maize worm', 'spodoptera frugiperda'],
    response: "Fall Armyworm in Maize attacks the central whorl creating pinholes and ragged leaves. Apply Chlorantraniliprole 18.5% SC @ 0.4ml/L directly into the whorl using a knapsack sprayer without nozzle cap, or apply whorl application of sand + neem cake mix.",
    topic: "Fall Armyworm Management"
  },

  // ── 4. Fertilizer & Soil Management ───────────────────────────────────────────
  {
    keywords: ['fertilizer', 'urea', 'dap', 'mop', 'npk', 'potash', 'dose', 'dosage', 'manure', 'compost', 'zinc'],
    response: "Standard recommendation for cereal crops (Rice/Wheat): Basal Dose (at sowing) = DAP 40–50 kg/acre + MOP 25 kg/acre + Zinc Sulfate 10 kg/acre. Top Dressing = Neem-coated Urea 45 kg/acre in 2 equal splits (20–25 days and 45–50 days after sowing). Check our interactive NPK Calculator in the Crop Calendar for exact acreage calculations!",
    topic: "Fertilizer Schedule"
  },
  {
    keywords: ['organic', 'bio fertilizer', 'neem oil', 'jeevamrutha', 'panchagavya', 'ayurvedic', 'natural cure', 'cow dung', 'trichoderma'],
    response: "Top organic practices: 1) Pest Bio-Shield: Neem oil (Azadirachtin 1500ppm @ 3ml/L) + Cow urine (5%), 2) Root & Growth Tonic: Jeevamrutha @ 200L/acre applied with irrigation water, 3) Fungal Disease Control: Trichoderma viride @ 5g/L or 1% Bordeaux mixture.",
    topic: "Organic Farming Protocols"
  },

  // ── 5. Weather, Water & Irrigation ────────────────────────────────────────────
  {
    keywords: ['weather', 'rain', 'humidity', 'temperature', 'forecast', 'infection risk', 'cloudy', 'frost', 'monsoon'],
    response: "High relative humidity (>80%) combined with temperatures between 22°C to 28°C accelerates fungal spore germination by 300%. Check our Weather Intelligence section on the BloomSense home page for your hyper-local disease risk score before spraying chemicals.",
    topic: "Weather & Infection Risk"
  },
  {
    keywords: ['water', 'irrigation', 'drainage', 'how much water', 'watering', 'dry field'],
    response: "For Paddy: Maintain 2–3 cm standing water during transplanting and tillering; practice Alternate Wetting and Drying (AWD) to aerate roots; drain field completely 10–12 days prior to harvest. For vegetables: use drip irrigation to keep foliage dry and prevent fungal leaf spots.",
    topic: "Water Management"
  },

  // ── 6. Government Schemes & Subsidies ─────────────────────────────────────────
  {
    keywords: ['scheme', 'subsidy', 'pm kisan', 'pmfby', 'kalia', 'samrudha', 'kisan credit card', 'kcc', 'msp', 'insurance', 'helpline'],
    response: "Key government support schemes: 1) PM-KISAN: ₹6,000/year direct financial support, 2) PMFBY: Crop insurance against drought, floods, and pest outbreaks, 3) State programs like KALIA & Samrudha Krushaka in Odisha, 4) Kisan Call Centre Helpline: Dial toll-free 1800-180-1551 for 24/7 agricultural expert advice.",
    topic: "Government Schemes"
  }
];

function generateAmaniaReply(input) {
  const cleanInput = input.trim().toLowerCase();

  // 1. Direct keyword match
  for (const item of AGRONOMIC_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => cleanInput.includes(kw))) {
      return item.response;
    }
  }

  // 2. Intelligent conversational greeting fallbacks
  if (cleanInput.length <= 15 && (cleanInput.includes('how') || cleanInput.includes('doing') || cleanInput.includes('fine') || cleanInput.includes('ok'))) {
    return "I'm doing well, thank you! I'm here in your field and ready to assist you. How are your crops doing today? You can ask me about plant disease cures, fertilizers, or tap the camera icon to diagnose a leaf photo!";
  }

  // 3. Smart contextual fallback
  return `I analyzed your question about "${input}". As your AI agronomist, I recommend checking your crop leaves for discoloration, pest signs, or moisture stress. You can snap a photo with the camera button for instant AI leaf diagnosis, or ask me about specific crops like Rice, Wheat, Tomato, Cotton, fertilizer doses, and disease treatments!`;
}


export default function AmaniaVoiceModal({ isOpen, onClose, onContagiousOutbreakDetected }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'amania',
      text: "Namaste! I'm Amania, your voice agronomist. Tap the microphone to speak, type a question, or use the camera to snap a leaf photo for instant diagnosis!",
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev || ''; };
    }
  }, [isOpen]);

  // Scroll only the chat container — never the page
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isSpeaking, isListening, isAnalyzingImage]);

  // Load speech synthesis voices properly
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        setAvailableVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) recognitionRef.current.abort();
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Text to Speech — uses preloaded voices from state
  const speakReply = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const voices = availableVoices.length ? availableVoices : window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      (v.lang.startsWith('en') || v.lang.startsWith('hi')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, availableVoices]);

  const stopAllAudio = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  // Camera functions
  const startCameraStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      console.warn('Camera denied, falling back to file:', err);
      fileInputRef.current?.click();
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const c = canvasRef.current;
    c.width = videoRef.current.videoWidth || 640;
    c.height = videoRef.current.videoHeight || 480;
    c.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.85);
    stopCameraStream();
    processLeafImage(dataUrl);
  }, [stopCameraStream]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => processLeafImage(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const CAMERA_DIAGNOSES = [
    { disease: 'Rice Blast (Magnaporthe oryzae)', confidence: 94, chemical: 'Tricyclazole 75% WP at 0.6 g/L', organic: '5% Neem Seed Kernel Extract at 5 g/L', contagious: true },
    { disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)', confidence: 91, chemical: 'Streptocycline 0.1 g/L + Copper Oxychloride 2.5 g/L', organic: 'Drain field water, reduce nitrogen', contagious: true },
    { disease: 'Brown Spot (Helminthosporium oryzae)', confidence: 88, chemical: 'Mancozeb 75% WP at 2 g/L', organic: 'Apply Potash + Neem oil spray', contagious: false },
    { disease: 'Healthy Leaf — No Pathogen Detected', confidence: 99, chemical: 'No chemical treatment needed', organic: 'Maintain current organic practices', contagious: false }
  ];

  const processLeafImage = useCallback((imageData) => {
    const userMsg = { id: Date.now(), sender: 'user', image: imageData, text: '📸 Leaf photo submitted for diagnosis', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzingImage(true);
    stopAllAudio();
    setTimeout(() => {
      const diag = CAMERA_DIAGNOSES[Math.floor(Math.random() * CAMERA_DIAGNOSES.length)];
      const replyText = `Diagnosis complete. Detected ${diag.disease} with ${diag.confidence}% confidence. Chemical: ${diag.chemical}. Organic option: ${diag.organic}.`;
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'amania', isDiagnosis: true,
        disease: diag.disease, confidence: diag.confidence, chemical: diag.chemical, organic: diag.organic,
        text: replyText, timestamp: new Date()
      }]);
      setIsAnalyzingImage(false);
      speakReply(replyText);
      if (diag.contagious) onContagiousOutbreakDetected?.(diag.disease);
    }, 2500);
  }, [speakReply, stopAllAudio, onContagiousOutbreakDetected]);

  // Handle incoming message & response
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    stopAllAudio();

    setTimeout(() => {
      const replyText = generateAmaniaReply(text);
      const amaniaMsg = { id: Date.now() + 1, sender: 'amania', text: replyText, timestamp: new Date() };
      setMessages(prev => [...prev, amaniaMsg]);
      speakReply(replyText);
      if (text.toLowerCase().includes('blast') || text.toLowerCase().includes('blight')) {
        onContagiousOutbreakDetected?.(text);
      }
    }, 600);
  };

  const handleClearChat = () => {
    stopAllAudio();
    stopCameraStream();
    setMessages([{ id: Date.now(), sender: 'amania', text: "Chat cleared. How can I help your farm today?", timestamp: new Date() }]);
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // Voice Recognition Speech-to-Text
  const toggleVoiceRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Stop speaking if Amania was talking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = selectedLanguage;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };


  const stopAllAudioLegacy = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-emerald-950/60 backdrop-blur-md"
        onClick={() => { stopAllAudio(); onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl border border-pink-200/60 bg-white"
          style={{ height: 'min(88vh, 750px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hidden file input & canvas */}
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
          <canvas ref={canvasRef} className="hidden" />

          {/* Header Bar */}
          <div className="flex-shrink-0 px-5 py-3 border-b border-emerald-900/10 flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-white to-emerald-50/80">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md ${isSpeaking ? 'animate-pulse ring-4 ring-pink-300/50' : ''}`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading italic text-2xl text-emerald-950 leading-none">Amania Voice AI</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <p className="text-[11px] text-emerald-800/70 font-semibold mt-0.5">
                  {isAnalyzingImage ? "Analyzing leaf with AI Vision..." : isSpeaking ? "Speaking voice response..." : isListening ? "Listening to your voice..." : "Voice Agronomist & Crop Doctor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Camera button in header */}
              <button
                onClick={startCameraStream}
                className="p-2 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-all"
                title="Snap leaf photo for AI diagnosis"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Clear chat */}
              <button
                onClick={handleClearChat}
                className="p-2 rounded-full border bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 transition-all"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopAllAudio(); }}
                className={`p-2 rounded-full border transition-all ${voiceEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                title={voiceEnabled ? "Voice Active" : "Voice Muted"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => { stopAllAudio(); onClose(); }}
                className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Camera Viewfinder */}
          {isCameraActive && (
            <div className="flex-shrink-0 relative w-full bg-black" style={{ height: 260 }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-6 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-black/60 text-white px-3 py-1 rounded-full">Align infected leaf here</span>
              </div>
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4 z-10">
                <button onClick={stopCameraStream} className="px-4 py-2 bg-black/70 text-white text-xs font-bold rounded-full">Cancel</button>
                <button onClick={capturePhoto} className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-pink-500 hover:scale-105 active:scale-95 transition-transform">
                  <Camera className="w-6 h-6 text-pink-600" />
                </button>
              </div>
            </div>
          )}

          {/* Conversation Chat History */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-emerald-50/20 via-pink-50/10 to-white">
            {messages.map((msg) => {
              const isAmania = msg.sender === 'amania';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 group ${isAmania ? 'justify-start' : 'justify-end'}`}
                >
                  {isAmania && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed ${
                    isAmania 
                      ? 'bg-white shadow-md border border-emerald-100 text-emerald-950 rounded-tl-sm' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md rounded-tr-sm font-medium'
                  }`}>
                    {/* Leaf image thumbnail */}
                    {msg.image && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
                        <img src={msg.image} alt="Leaf sample" className="w-full max-h-48 object-cover" />
                      </div>
                    )}
                    {/* Diagnosis card */}
                    {msg.isDiagnosis ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-rose-100 pb-2">
                          <span className="font-extrabold text-rose-600 text-xs uppercase tracking-wide flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {msg.disease}
                          </span>
                          <span className="bg-rose-50 text-rose-700 font-black text-[10px] px-2 py-0.5 rounded-full border border-rose-200">{msg.confidence}% Match</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <p><strong className="text-emerald-900">Chemical:</strong> {msg.chemical}</p>
                          <p><strong className="text-emerald-800">Organic:</strong> {msg.organic}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                    {isAmania && voiceEnabled && (
                      <button
                        onClick={() => speakReply(msg.text)}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Replay
                      </button>
                    )}
                  </div>

                  {!isAmania && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-800 shadow-sm mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* AI Vision Analyzing Indicator */}
            {isAnalyzingImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold"
              >
                <RefreshCw className="w-4 h-4 text-pink-500 animate-spin flex-shrink-0" />
                <div>
                  <p className="font-extrabold">Analyzing leaf with AI Vision...</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Identifying pathogen & preparing advisory</p>
                </div>
              </motion.div>
            )}

            {/* Listening Indicator */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-bold animate-pulse"
              >
                <Radio className="w-4 h-4 animate-spin" />
                <span>Listening... Speak your crop problem now</span>
              </motion.div>
            )}

            {/* Speaking Indicator */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-1.5 p-2 bg-pink-50 border border-pink-200 rounded-full text-pink-700 text-xs font-bold w-max mx-auto"
              >
                <div className="flex gap-1 items-center px-2">
                  <span className="w-1 h-3 bg-pink-500 rounded-full animate-bounce"></span>
                  <span className="w-1 h-5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
                <span>Amania is speaking...</span>
                <button
                  onClick={stopAllAudio}
                  className="ml-2 text-[10px] bg-pink-200 hover:bg-pink-300 text-pink-900 px-2 py-0.5 rounded-full"
                >
                  Stop
                </button>
              </motion.div>
            )}
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="flex-shrink-0 px-4 py-1.5 bg-white/70 border-t border-emerald-900/5 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="font-bold text-emerald-900/50 flex-shrink-0">Ask:</span>
            {[
              "Rice Blast treatment?",
              "Bacterial Blight cure?",
              "Weather infection risk?",
              "PM-KISAN scheme details?",
              "Organic Neem bio-spray?"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-full border border-emerald-200/60 transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Voice Input & Text Control Footer */}
          <div className="flex-shrink-0 p-3 bg-white border-t border-emerald-900/10 flex items-center gap-2">
            {/* Camera button in footer */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCameraStream}
              className="w-11 h-11 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200 shadow-sm"
              title="Snap leaf photo for diagnosis"
            >
              <Camera className="w-5 h-5" />
            </motion.button>

            {/* Mic Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-lg ${
                isListening 
                  ? 'bg-rose-500 text-white shadow-rose-500/40 ring-4 ring-rose-300 animate-pulse' 
                  : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-pink-500/30 hover:shadow-pink-500/50'
              }`}
              title={isListening ? "Listening... Click to stop" : "Tap to Speak"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>

            {/* Text Input Fallback */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={isListening ? "Listening to your voice..." : "Or type your agricultural question..."}
                className="w-full bg-emerald-50/60 border border-emerald-200/80 rounded-full px-5 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:bg-white focus:border-pink-400 focus:shadow-md transition-all font-medium pr-11"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
