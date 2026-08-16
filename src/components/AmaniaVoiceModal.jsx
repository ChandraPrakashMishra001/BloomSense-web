import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, X, Sparkles, Send, 
  RefreshCw, Bot, User, Radio, MessageSquare, AlertCircle
} from 'lucide-react';

// Domain knowledge responses for Amania AI Agronomic Voice Assistant
const AGRONOMIC_KNOWLEDGE_BASE = [
  {
    keywords: ['rice blast', 'blast', 'paddy disease', 'magnaporthe', 'spindle'],
    response: "Rice Blast is caused by the fungus Magnaporthe oryzae. For immediate chemical control, spray Tricyclazole 75% WP at 0.6 grams per liter or Isoprothiolane at 1.5 ml per liter. For an organic remedy, spray 5% Neem Seed Kernel Extract or Pseudomonas fluorescens at 5 grams per liter. Apply within 48 hours to prevent panicle blast.",
    topic: "Rice Blast Treatment"
  },
  {
    keywords: ['bacterial blight', 'bacterial leaf blight', 'yellowing leaf', 'blight'],
    response: "Bacterial Leaf Blight causes yellow to straw-colored lesions along leaf margins. Spray Streptocycline at 0.1 grams per liter mixed with Copper Oxychloride at 2.5 grams per liter. Ensure you drain standing water from the paddy field and avoid excess nitrogen fertilizer.",
    topic: "Bacterial Blight Protocol"
  },
  {
    keywords: ['brown spot', 'sesame spot', 'potassium'],
    response: "Brown Spot appears as oval brown spots on leaves and grains. Spray Mancozeb 75% WP at 2 grams per liter or Propiconazole at 1 ml per liter. It often indicates potassium deficiency, so apply muriate of potash alongside balanced fertilization.",
    topic: "Brown Spot Advisory"
  },
  {
    keywords: ['weather', 'rain', 'temperature', 'humidity', 'forecast'],
    response: "High relative humidity above 80% combined with temperatures between 20 to 28 degrees Celsius significantly accelerates fungal spore germination. Check our Weather Intelligence section to monitor your hyper-local infection risk score.",
    topic: "Weather & Infection Risk"
  },
  {
    keywords: ['scheme', 'subsidy', 'pm kisan', 'financial', 'samrudha', 'kalia', 'insurance', 'pmfby'],
    response: "Under PM-KISAN, eligible landholding farmers receive ₹6,000 annually in three installments. For crop loss, register with PMFBY (Pradhan Mantri Fasal Bima Yojana). In Odisha, check out the Samrudha Krushaka Yojana and CM-KISAN programs in our Government Schemes Hub.",
    topic: "Government Schemes"
  },
  {
    keywords: ['neem', 'organic', 'bio', 'ayurvedic', 'natural cure', 'tulsi', 'ashwagandha'],
    response: "Organic botanical treatments are highly effective! Neem oil spray with Azadirachtin 1500 ppm controls over 200 species of chewing and sucking pests. For fungal issues, fresh cow dung extract with asafoetida or Trichoderma viride creates a natural bio-shield.",
    topic: "Organic Bio-Pesticides"
  },
  {
    keywords: ['fertilizer', 'urea', 'npk', 'soil', 'dose'],
    response: "For optimal paddy growth, use balanced NPK ratio of 4:2:1. Apply 50% Nitrogen and full Phosphorus and Potassium as basal dose, then top-dress the remaining Nitrogen during active tillering and panicle initiation stages.",
    topic: "Fertilizer Schedule"
  },
  {
    keywords: ['hello', 'hi', 'namaste', 'hey', 'amania', 'who are you'],
    response: "Namaste! I am Amania, your AI agronomist and crop doctor. You can speak to me about any plant disease, leaf symptoms, fertilizer timing, organic bio-remedies, or weather risk alerts. How can I help your farm today?",
    topic: "Introduction"
  }
];

function generateAmaniaReply(input) {
  const cleanInput = input.toLowerCase();

  for (const item of AGRONOMIC_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => cleanInput.includes(kw))) {
      return item.response;
    }
  }

  return `I analyzed your query regarding "${input}". To protect your field, ensure proper field drainage, inspect the lower stem and leaf undersides for fungal mycelium or pest eggs, and upload a clear photo using our Amania Vision Scanner for clinical-grade disease stage identification.`;
}

export default function AmaniaVoiceModal({ isOpen, onClose, onContagiousOutbreakDetected }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'amania',
      text: "Namaste! I'm Amania, your voice agronomist. Tap the microphone and talk to me about your crops, leaf diseases, weather, or natural cures.",
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking, isListening]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Text to Speech Function
  const speakReply = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Try to pick a natural, clear voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('hi-IN')) && 
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
    ) || voices.find(v => v.lang.includes('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Handle incoming message & response
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent response
    setTimeout(() => {
      const replyText = generateAmaniaReply(text);
      const amaniaMsg = {
        id: Date.now() + 1,
        sender: 'amania',
        text: replyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, amaniaMsg]);
      speakReply(replyText);

      // If user mentions a contagious outbreak, optionally notify parent
      if (text.toLowerCase().includes('blast') || text.toLowerCase().includes('blight')) {
        if (onContagiousOutbreakDetected) {
          onContagiousOutbreakDetected(text);
        }
      }
    }, 600);
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

  const stopAllAudio = () => {
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
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-emerald-950/60 backdrop-blur-md"
        onClick={() => {
          stopAllAudio();
          onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="liquid-glass-strong w-full max-w-2xl h-[85vh] max-h-[750px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-pink-200/60 bg-white/95 flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-emerald-900/10 flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-white to-emerald-50/80 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md ${isSpeaking ? 'animate-pulse ring-4 ring-pink-300/50' : ''}`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading italic text-2xl text-emerald-950 leading-none">Amania Voice AI</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Live Voice</span>
                </div>
                <p className="text-[11px] text-emerald-800/70 font-semibold mt-0.5">
                  {isSpeaking ? "Speaking voice response..." : isListening ? "Listening to your voice..." : "Voice Agronomist & Crop Doctor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (isSpeaking) stopAllAudio();
                }}
                className={`p-2 rounded-full border transition-all ${voiceEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                title={voiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopAllAudio();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Chat History */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-emerald-50/20 via-pink-50/10 to-white">
            {messages.map((msg) => {
              const isAmania = msg.sender === 'amania';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isAmania ? 'justify-start' : 'justify-end'}`}
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
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {isAmania && voiceEnabled && (
                      <button
                        onClick={() => speakReply(msg.text)}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Replay Audio
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

            {/* Neural Listening / Speaking Visualizer */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-bold animate-pulse"
              >
                <Radio className="w-4 h-4 animate-spin" />
                <span>Listening... Speak your crop problem or question now</span>
              </motion.div>
            )}

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

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="px-4 py-2 bg-white/70 border-t border-emerald-900/5 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
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
          <div className="p-4 bg-white border-t border-emerald-900/10 flex items-center gap-3">
            {/* Big Mic Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceRecording}
              className={`w-13 h-13 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-lg ${
                isListening 
                  ? 'bg-rose-500 text-white shadow-rose-500/40 ring-4 ring-rose-300 animate-pulse' 
                  : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-pink-500/30 hover:shadow-pink-500/50'
              }`}
              title={isListening ? "Listening... Click to send" : "Tap to Speak (Voice Input)"}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
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
                className="w-full bg-emerald-50/60 border border-emerald-200/80 rounded-full px-5 py-3 text-sm text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:bg-white focus:border-pink-400 focus:shadow-md transition-all font-medium pr-11"
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
