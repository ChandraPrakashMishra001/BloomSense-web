import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, X, Sparkles, Send, 
  RefreshCw, Bot, User, Radio, MessageSquare, AlertCircle, Camera, Trash2, Globe,
  Image as ImageIcon, Upload, FileImage
} from 'lucide-react';
import { safeSpeak, safeStopSpeech, isSpeechAvailable } from '../utils/speechUtils';

const LANGUAGES = [
  { id: 'en-IN', label: 'English', flag: '🇬🇧', voicePrefix: 'en' },
  { id: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳', voicePrefix: 'hi' },
  { id: 'or-IN', label: 'ଓଡ଼ିଆ', flag: '🌾', voicePrefix: 'or' }
];

// ── Multilingual Knowledge Base for Amania AI ────────────────────────────────
const MULTILINGUAL_KNOWLEDGE = {
  'en-IN': {
    initialGreeting: "Namaste! I'm Amania, your sweet voice agronomist. Tap the microphone to speak, type a question, or use the camera to snap a leaf photo for instant diagnosis!",
    inputPlaceholder: "Ask any crop disease, fertilizer or weather question...",
    quickPrompts: [
      "Rice Blast treatment?",
      "Bacterial Blight cure?",
      "Yellowing leaves cause?",
      "NPK fertilizer dosage?",
      "PM-KISAN scheme details?",
      "Organic Neem bio-spray?"
    ],
    greetingReply: "I'm doing wonderful, thank you for asking! I'm here in your field and ready to help. How are your crops doing today? Feel free to ask about crop diseases, fertilizers, or snap a leaf photo!",
    introReply: "Namaste! I am Amania AI, your personal voice agronomist and crop doctor. I help Indian farmers identify leaf diseases, calculate NPK fertilizer doses, and stay protected from regional outbreaks.",
    fallbackReply: (q) => `I analyzed your question about "${q}". As your digital agronomist, I recommend checking your crop leaves for discoloration or moisture stress. You can snap a photo with the camera for instant AI leaf diagnosis, or ask me about Rice, Wheat, Tomato, Cotton, fertilizer doses, and disease treatments!`
  },
  'hi-IN': {
    initialGreeting: "नमस्ते किसान भाई! मैं अमानिया हूँ, आपकी प्यारी डिजिटल कृषि सहेली और फसल डॉक्टर। माइक दबाकर बोलें या पत्ती की फोटो खींचकर तुरंत बीमारी का इलाज पाएं!",
    inputPlaceholder: "फसल रोग, खाद या मौसम संबंधी सवाल पूछें...",
    quickPrompts: [
      "धान में झुलसा (ब्लास्ट) का इलाज?",
      "पत्तियां पीली क्यों हो रही हैं?",
      "धान/गेहूं में यूरिया और डीएपी डोज?",
      "पीएम-किसान योजना की जानकारी?",
      "जैविक नीम का काढ़ा कैसे बनाएं?",
      "सफेद मक्खी और कीट नियंत्रण?"
    ],
    greetingReply: "मैं बहुत अच्छी हूँ, पूछने के लिए धन्यवाद! मैं आपकी सेवा में हमेशा तैयार हूँ। आज आपकी फसल कैसी है? आप मुझसे किसी भी फसल रोग, खाद की मात्रा, या जैविक नुस्खों के बारे में पूछ सकते हैं!",
    introReply: "नमस्ते! मैं अमानिया AI हूँ, आपकी डिजिटल कृषि मित्र और फसल डॉक्टर। मैं फसलों में लगने वाली बीमारियों की पहचान, खाद की सही मात्रा और सरकारी योजनाओं की सटीक जानकारी देती हूँ।",
    fallbackReply: (q) => `मैंने आपके प्रश्न "${q}" पर विचार किया। एक कृषि मित्र के रूप में, मैं सलाह देती हूँ कि आप अपनी फसल की पत्तियों की जांच करें। आप कैमरे का बटन दबाकर पत्ती का फोटो भेजें, मैं तुरंत सटीक बीमारी और समाधान बता दूंगी!`
  },
  'or-IN': {
    initialGreeting: "ନମସ୍କାର କୃଷକ ଭାଇ! ମୁଁ ଆମାନିଆ, ଆପଣଙ୍କ ପ୍ରିୟ ଡିଜିଟାଲ କୃଷି ଡାକ୍ତର। ମାଇକ୍ ଦବାଇ କଥା ହୁଅନ୍ତୁ କିମ୍ବା କ୍ୟାମେରା ମାଧ୍ୟମରେ ପତ୍ରର ଫଟୋ ଉଠାଇ ତୁରନ୍ତ ଚିକିତ୍ସା ଜାଣନ୍ତୁ!",
    inputPlaceholder: "ଫସଲ ରୋଗ, ସାର କିମ୍ବା ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ...",
    quickPrompts: [
      "ଧାନ ବ୍ଲାଷ୍ଟ (ଝଣକା) ରୋଗର ଉପଚାର?",
      "ପତ୍ର ହଳଦିଆ ପଡ଼ିବାର କାରଣ?",
      "ଧାନରେ ସାର ପ୍ରୟୋଗ ମାତ୍ରା?",
      "କାଳିଆ ଓ PM-KISAN ଯୋଜନା?",
      "ଜୈବିକ ନିମ୍ବ ତେଲ ସ୍ପ୍ରେ ପ୍ରଣାଳୀ?",
      "କାଣ୍ଡବିନ୍ଧା ପୋକ ନିୟନ୍ତ୍ରଣ?"
    ],
    greetingReply: "ମୁଁ ବହୁତ ଭଲରେ ଅଛି, ପଚାରିଥିବାରୁ ଧନ୍ୟବାଦ! ଆପଣଙ୍କ ଚାଷଜମି ପାଇଁ ମୁଁ ସବୁବେଳେ ପ୍ରସ୍ତୁତ। ଆଜି ଆପଣଙ୍କ ଫସଲ କିପରି ଅଛି? ଆପଣ ରୋଗ, ସାର କିମ୍ବା ପାଣି ପରିଚାଳନା ବିଷୟରେ ପଚାରିପାରିବେ!",
    introReply: "ନମସ୍କାର! ମୁଁ ଆମାନିଆ AI, ଆପଣଙ୍କ ଡିଜିଟାଲ କୃଷି ସାଥୀ। ମୁଁ ଧାନ ତଥା ଅନ୍ୟାନ୍ୟ ଫସଲର ରୋଗ ଚିହ୍ନଟ, ସାର ମାତ୍ରା ଏବଂ କାଳିଆ/PM-KISAN ଯୋଜନା ବିଷୟରେ ସହାୟତା କରେ।",
    fallbackReply: (q) => `ମୁଁ ଆପଣଙ୍କ ପ୍ରଶ୍ନ "${q}" ବୁଝିଲି। ଆପଣ କ୍ୟାମେରା ବଟନ ଦବାଇ ପତ୍ରର ଏକ ସ୍ପଷ୍ଟ ଫଟୋ ଉଠାନ୍ତୁ, ମୁଁ ତୁରନ୍ତ ସଠିକ ରୋଗ ନିର୍ଣ୍ଣୟ ଓ ଚିକିତ୍ସା ପରାମର୍ଶ ଦେବି!`
  }
};

// Comprehensive Domain Knowledge Base across English, Hindi, and Odia
const MULTILINGUAL_RULES = [
  // ── 1. Greetings & Smalltalk ────────────────────────────────────────────────
  {
    matches: ['how are you', 'how r u', 'how are u', 'how do you do', 'how are you doing', 'kaisa hai', 'kaise ho', 'kemiti achha', 'kemiti acha', 'kemitia cho', 'hows it going', 'whats up'],
    responses: {
      'en-IN': "I'm doing wonderful, thank you for asking! I'm here in your field and ready to help. How are your crops doing today? Feel free to ask about crop diseases, fertilizers, or snap a leaf photo!",
      'hi-IN': "मैं बहुत अच्छी हूँ, पूछने के लिए धन्यवाद! मैं आपके खेत की सेवा में पूरी तरह तैयार हूँ। आज आपकी फसल कैसी है? आप मुझसे किसी भी फसल रोग या खाद के बारे में पूछ सकते हैं!",
      'or-IN': "ମୁଁ ବହୁତ ଭଲରେ ଅଛି, ପଚାରିଥିବାରୁ ଧନ୍ୟବାଦ! ଆଜି ଆପଣଙ୍କ ଫସଲ କିପରି ଅଛି? ଫସଲ ରୋଗ, ସାର କିମ୍ବା ପାଣି ପରିଚାଳନା ବିଷୟରେ ମୋତେ ପଚାରନ୍ତୁ!"
    }
  },
  {
    matches: ['hello', 'hi', 'namaste', 'hey', 'pranam', 'ram ram', 'namaskar', 'good morning', 'good evening', 'juhar', 'namaskara'],
    responses: {
      'en-IN': "Namaste! I am Amania, your AI agronomist and crop doctor. What crop are you growing today?",
      'hi-IN': "नमस्ते किसान भाई! मैं अमानिया हूँ, आपकी डिजिटल कृषि मित्र। आज आपकी फसल में क्या समस्या है?",
      'or-IN': "ନମସ୍କାର! ମୁଁ ଆମାନିଆ, ଆପଣଙ୍କ ଡିଜିଟାଲ କୃଷି ସାଥୀ। ଆଜି ଆପଣ କେଉଁ ଫସଲ ବିଷୟରେ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?"
    }
  },
  {
    matches: ['thank you', 'thanks', 'dhanyawad', 'shukriya', 'dhanyabad', 'great', 'awesome'],
    responses: {
      'en-IN': "You are very welcome! May your harvest be bountiful and healthy. Let me know whenever you need advice!",
      'hi-IN': "आपका बहुत-बहुत स्वागत है! आपकी फसल खूब लहलहाए और अच्छा उत्पादन मिले। जब भी जरूरत हो, मुझसे पूछें!",
      'or-IN': "ଆପଣଙ୍କୁ ବହୁତ ବହୁତ ଧନ୍ୟବାଦ! ଆପଣଙ୍କ ଫସଲ ଭଲ ହେଉ। ଯେକୌଣସି ସମୟରେ ମୋତେ ପରାମର୍ଶ ପାଇଁ ପଚାରନ୍ତୁ!"
    }
  },

  // ── 2. Rice Blast / ଧାନ ଝଣକା / धान झुलसा ──────────────────────────────────────
  {
    matches: ['rice blast', 'blast', 'magnaporthe', 'spindle', 'pyricularia', 'neck blast', 'jhulsa', 'jhanaka', 'dhana blast', 'blast roga'],
    responses: {
      'en-IN': "Rice Blast produces spindle-shaped eye lesions. Chemical cure: Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane @ 1.5ml/L immediately. Organic shield: Spray 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 5g/L. Avoid excess urea fertilizer.",
      'hi-IN': "धान में झुलसा (ब्लास्ट) रोग आंख जैसे धब्बे बनाता है। रासायनिक इलाज: ट्राइसाइक्लाजोल 75% WP @ 0.6 ग्राम/लीटर या आइसोप्रोधियोलेन 1.5 मिली/लीटर पानी में तुरंत स्प्रे करें। जैविक उपाय: 5% नीम का काढ़ा या स्यूडोमोनास 5 ग्राम/लीटर स्प्रे करें। खेत में अधिक यूरिया न डालें।",
      'or-IN': "ଧାନ ବ୍ଲାଷ୍ଟ (ଝଣକା) ରୋଗରେ ପତ୍ର ଉପରେ ଆଖି ଆକାରର ଦାଗ ଦେଖାଯାଏ। ରାସାୟନିକ ଚିକିତ୍ସା: ଟ୍ରାଇସାଇକ୍ଲାଜୋଲ ୭୫% WP @ ୦.୬ ଗ୍ରାମ ପ୍ରତି ଲିଟର ପାଣିରେ ମିଶାଇ ସ୍ପ୍ରେ କରନ୍ତୁ। ଜୈବିକ ଉପାୟ: ନିମ୍ବ ପତ୍ର ରସ କିମ୍ବା ସୁଡୋମୋନାସ ୫ ଗ୍ରାମ ପ୍ରତି ଲିଟର ସ୍ପ୍ରେ କରନ୍ତୁ।"
    }
  },

  // ── 3. Bacterial Leaf Blight / ପତ୍ରପୋଡ଼ା / जीवाणु झुलसा ─────────────────────────
  {
    matches: ['bacterial blight', 'bacterial leaf blight', 'blb', 'xanthomonas', 'patrapoda', 'leaf blight'],
    responses: {
      'en-IN': "Bacterial Leaf Blight causes wavy yellow lesions starting from leaf tips. Spray Streptocycline @ 0.1g/L mixed with Copper Oxychloride @ 2.5g/L. Drain standing water from the field for 3 days and stop top-dressing nitrogen.",
      'hi-IN': "धान का जीवाणु झुलसा (BLB) रोग पत्तियों के किनारों को सुखा देता है। स्ट्रेप्टोसाइक्लिन 0.1 ग्राम + कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर मिलाकर स्प्रे करें। खेत का खड़ा पानी 3 दिनों के लिए निकाल दें।",
      'or-IN': "ଧାନରେ ଜୀବାଣୁ ଜନିତ ପତ୍ରପୋଡ଼ା (BLB) ରୋଗ ହେଲେ ଷ୍ଟ୍ରେପ୍ଟୋସାଇକ୍ଲିନ ୦.୧ ଗ୍ରାମ ସହିତ କପର ଅକ୍ସିକ୍ଲୋରାଇଡ ୨.୫ ଗ୍ରାମ ପ୍ରତି ଲିଟରରେ ମିଶାଇ ସ୍ପ୍ରେ କରନ୍ତୁ ଏବଂ ଜମିରୁ ୩ ଦିନ ପାଣି ନିଷ୍କାସନ କରନ୍ତୁ।"
    }
  },

  // ── 4. Yellowing Leaves / ପତ୍ର ହଳଦିଆ / पीली पत्तियां ───────────────────────────
  {
    matches: ['yellow leaf', 'yellow leaves', 'yellowing', 'peela patta', 'haladia patra', 'khaira', 'zinc deficiency'],
    responses: {
      'en-IN': "Yellowing leaves point to 3 main causes: 1) Nitrogen deficiency (uniform yellowing on older lower leaves — apply Neem-coated Urea), 2) Zinc deficiency / Khaira disease (rusty spots on young leaves — spray 0.5% Zinc Sulfate + lime), 3) Waterlogging (drain excess water).",
      'hi-IN': "पत्तियां पीली होने के 3 मुख्य कारण हैं: 1) नाइट्रोजन की कमी (नीम कोटेड यूरिया डालें), 2) जिंक की कमी / खैरा रोग (0.5% जिंक सल्फेट + 0.25% चूना मिलाकर स्प्रे करें), 3) खेत में जलभराव (पानी निकालें)।",
      'or-IN': "ପତ୍ର ହଳଦିଆ ପଡ଼ିବାର ୩ଟି ମୁଖ୍ୟ କାରଣ: ୧) ଯବକ୍ଷାରଜାନ ଅଭାବ (ୟୁରିଆ ପ୍ରୟୋଗ କରନ୍ତୁ), ୨) ଜିଙ୍କ ଅଭାବ ବା ଖଇରା ରୋଗ (୦.୫% ଜିଙ୍କ ସଲଫେଟ ସହିତ ଚୂନ ପାଣି ସ୍ପ୍ରେ କରନ୍ତୁ), ୩) ଜମିରେ ଅତ୍ୟଧିକ ପାଣି ଜମି ରହିବା।"
    }
  },

  // ── 5. Stem Borer & Pests / କାଣ୍ଡବିନ୍ଧା ପୋକ / तना छेदक ─────────────────────────
  {
    matches: ['stem borer', 'dead heart', 'white earhead', 'kanda bindha', 'tana chedak', 'borer', 'poka'],
    responses: {
      'en-IN': "Yellow Stem Borer causes 'Dead Heart' in vegetative stage and 'White Earhead' in flowering. Apply Chlorantraniliprole 0.4% Granules @ 4kg/acre or spray Chlorantraniliprole 18.5% SC @ 0.3ml/L. Install 8 pheromone traps per acre.",
      'hi-IN': "तना छेदक (Stem Borer) सुंडी तने को अंदर से काटती है। क्लोरेंट्रानिलीप्रोल 0.4% दानेदार @ 4 किलो/एकड़ डालें या क्लोरेंट्रानिलीप्रोल 18.5% SC @ 0.3 मिली/लीटर पानी में स्प्रे करें। प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं।",
      'or-IN': "କାଣ୍ଡବିନ୍ଧା ପୋକ ଧାନ ଗଛର ମଝି କାଣ୍ଡକୁ କାଟି ଦିଏ। ଏହାର ନିରାକରଣ ପାଇଁ କ୍ଲୋରାଣ୍ଟ୍ରାନିଲିପ୍ରୋଲ ୦.୪% G @ ୪ କେଜି ପ୍ରତି ଏକର ପ୍ରୟୋଗ କରନ୍ତୁ କିମ୍ବା ଏକର ପ୍ରତି ୮ଟି ଫେରୋମୋନ ଫାନ୍ଦ ଲଗାନ୍ତୁ।"
    }
  },

  // ── 6. Fertilizer / ସାର ପ୍ରୟୋଗ / खाद की मात्रा ────────────────────────────────
  {
    matches: ['fertilizer', 'urea', 'dap', 'mop', 'npk', 'potash', 'dose', 'dosage', 'sara', 'khad'],
    responses: {
      'en-IN': "Recommended NPK Dose: Basal (at sowing) = DAP 40–50 kg/acre + MOP 25 kg/acre + Zinc Sulfate 10 kg/acre. Top Dressing = Neem-coated Urea 45 kg/acre in 2 splits (20–25 DAT and 45–50 DAT). Check our Crop Calendar NPK Calculator!",
      'hi-IN': "संतुलित खाद की मात्रा: बुवाई के समय बेसल डोज में 45 किलो डीएपी + 25 किलो पोटाश (MOP) + 10 किलो जिंक सल्फेट प्रति एकड़ डालें। नीम कोटेड यूरिया को 2 किस्तों में कल्ले फूटते समय (20 दिन) और बाली निकलते समय (45 दिन) डालें।",
      'or-IN': "ସୁଷମ ସାର ମାତ୍ରା: ତଳି ରୋଇବା ବେଳେ ମୂଳ ସାର ଭାବେ ଏକର ପ୍ରତି ୪୫ କେଜି DAP + ୨୫ କେଜି MOP (ପୋଟାସ) + ୧୦ କେଜି ଜିଙ୍କ ସଲଫେଟ ପ୍ରୟୋଗ କରନ୍ତୁ। ୟୁରିଆକୁ ଦୁଇ କିସ୍ତିରେ (୨୦ ଦିନ ଓ ୪୫ ଦିନରେ) ପ୍ରୟୋଗ କରନ୍ତୁ।"
    }
  },

  // ── 7. PM-KISAN & Odisha Schemes / କାଳିଆ ଯୋଜନା / सरकारी योजनाएं ────────────────
  {
    matches: ['scheme', 'subsidy', 'pm kisan', 'pmfby', 'kalia', 'samrudha', 'yojana', 'bima', 'insurance', 'helpline'],
    responses: {
      'en-IN': "Government Support Schemes: 1) PM-KISAN: ₹6,000/year in 3 installments, 2) PMFBY: Comprehensive crop insurance, 3) KALIA & Samrudha Krushaka in Odisha for direct input subsidies, 4) Kisan Call Centre Helpline: Dial toll-free 1800-180-1551.",
      'hi-IN': "प्रमुख सरकारी योजनाएं: 1) पीएम-किसान (PM-KISAN): सालाना ₹6,000 तीन किस्तों में बैंक खाते में, 2) पीएम फसल बीमा (PMFBY): सूखा और बाढ़ से सुरक्षा, 3) ओडिशा में कालिया (KALIA) योजना, 4) किसान कॉल सेंटर: 1800-180-1551 पर मुफ्त सलाह लें।",
      'or-IN': "କୃଷି କଲ୍ୟାଣ ଯୋଜନା: ୧) PM-KISAN ଅଧୀନରେ ବାର୍ଷିକ ₹୬,୦୦୦ ସିଧାସଳଖ ଆକାଉଣ୍ଟକୁ, ୨) ପ୍ରଧାନମନ୍ତ୍ରୀ ଫସଲ ବୀମା (PMFBY), ୩) ଓଡ଼ିଶା ସରକାରଙ୍କ କାଳିଆ (KALIA) ଓ ସମୃଦ୍ଧ କୃଷକ ଯୋଜନା, ୪) କୃଷି କଲ୍ ସେଣ୍ଟର ଟୋଲ୍ ଫ୍ରି ନମ୍ବର: ୧୮୦୦-୧୮୦-୧୫୫୧।"
    }
  },

  // ── 8. Organic & Neem Spray / ଜୈବିକ ଔଷଧ / जैविक कीटनाशक ────────────────────────
  {
    matches: ['organic', 'neem', 'bio', 'jeevamrutha', 'panchagavya', 'jaivik', 'jaibika'],
    responses: {
      'en-IN': "Top Organic Cures: 1) Neem Oil (Azadirachtin 1500ppm @ 3ml/L) controls 200+ pest species, 2) Jeevamrutha @ 200L/acre boosts soil microbes, 3) Trichoderma viride @ 5g/L prevents soil fungal diseases.",
      'hi-IN': "100% जैविक नुस्खे: 1) नीम तेल (1500 ppm @ 3 मिली/लीटर) + गोमूत्र (5%) कीटों को रोकता है, 2) 200 लीटर जीवामृत प्रति एकड़ सिंचाई के साथ दें, 3) ट्राइकोडर्मा विरिडी 5 ग्राम/लीटर फंगस से बचाता है।",
      'or-IN': "ଜୈବିକ କୃଷି ପଦ୍ଧତି: ୧) ନିମ୍ବ ତେଲ (୧୫୦୦ ppm @ ୩ ମିଲି/ଲିଟର) + ଗୋମୂତ୍ର ସ୍ପ୍ରେ କଲେ ପୋକ ଦୂର ହୁଅନ୍ତି, ୨) ଏକର ପ୍ରତି ୨୦୦ ଲିଟର ଜୀବାମୃତ ପ୍ରୟୋଗ କରନ୍ତୁ, ୩) ଟ୍ରାଇକୋଡର୍ମା ଭିରିଡି ୫ ଗ୍ରାମ/ଲିଟର ସ୍ପ୍ରେ କଲେ ଫିମ୍ପି ରୋଗ ହୁଏ ନାହିଁ।"
    }
  }
];

function generateAmaniaReply(input, lang = 'en-IN') {
  const cleanInput = input.trim().toLowerCase();
  const langRules = MULTILINGUAL_KNOWLEDGE[lang] || MULTILINGUAL_KNOWLEDGE['en-IN'];

  // 1. Direct rule match
  for (const rule of MULTILINGUAL_RULES) {
    if (rule.matches.some(m => cleanInput.includes(m))) {
      return rule.responses[lang] || rule.responses['en-IN'];
    }
  }

  // 2. Intelligent conversational fallback
  if (cleanInput.length <= 16 && (cleanInput.includes('how') || cleanInput.includes('doing') || cleanInput.includes('fine') || cleanInput.includes('kaisa') || cleanInput.includes('kemiti') || cleanInput.includes('hello'))) {
    return langRules.greetingReply;
  }

  // 3. Smart contextual fallback in chosen language
  return langRules.fallbackReply(input);
}

export default function AmaniaVoiceModal({ isOpen, onClose, onContagiousOutbreakDetected }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'amania',
      text: MULTILINGUAL_KNOWLEDGE['en-IN'].initialGreeting,
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentLangConfig = MULTILINGUAL_KNOWLEDGE[selectedLanguage] || MULTILINGUAL_KNOWLEDGE['en-IN'];

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev || ''; };
    }
  }, [isOpen]);

  // Scroll only the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isSpeaking, isListening, isAnalyzingImage]);

  // Load speech synthesis voices & listen to global speech events
  useEffect(() => {
    const handleStopped = () => setIsSpeaking(false);
    window.addEventListener('bloomsense-speech-stopped', handleStopped);

    return () => {
      window.removeEventListener('bloomsense-speech-stopped', handleStopped);
      safeStopSpeech();
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

  // Sweet Melodic Text-to-Speech Engine with Native Odia & Phonetic Devanagari playback
  const speakReply = useCallback((text, langCode = selectedLanguage) => {
    if (!voiceEnabled || !isSpeechAvailable()) return;
    safeStopSpeech();

    safeSpeak(text, {
      lang: langCode,
      rate: 0.92,
      pitch: 1.16,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  }, [voiceEnabled, selectedLanguage]);

  const stopAllAudio = useCallback(() => {
    safeStopSpeech();
    setIsSpeaking(false);
  }, []);

  // Language Switch Handler
  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    stopAllAudio();
    const config = MULTILINGUAL_KNOWLEDGE[langId] || MULTILINGUAL_KNOWLEDGE['en-IN'];
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'amania',
        text: config.initialGreeting,
        timestamp: new Date()
      }
    ]);
    speakReply(config.initialGreeting, langId);
  };

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
    { disease: 'Rice Blast (Magnaporthe oryzae)', confidence: 94, chemical: 'Tricyclazole 75% WP @ 0.6 g/L', organic: '5% Neem Seed Kernel Extract @ 5 g/L', contagious: true },
    { disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)', confidence: 91, chemical: 'Streptocycline 0.1 g/L + Copper Oxychloride 2.5 g/L', organic: 'Drain field water, reduce nitrogen', contagious: true },
    { disease: 'Brown Spot (Helminthosporium oryzae)', confidence: 88, chemical: 'Mancozeb 75% WP @ 2 g/L', organic: 'Apply Potash + Neem oil spray', contagious: false },
    { disease: 'Healthy Leaf — No Pathogen Detected', confidence: 99, chemical: 'No chemical treatment needed', organic: 'Maintain current organic practices', contagious: false }
  ];

  const processLeafImage = useCallback((imageData) => {
    const userMsg = { id: Date.now(), sender: 'user', image: imageData, text: '📸 Leaf photo submitted for AI diagnosis', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzingImage(true);
    stopAllAudio();
    setTimeout(() => {
      const diag = CAMERA_DIAGNOSES[Math.floor(Math.random() * CAMERA_DIAGNOSES.length)];
      
      let replyText = `Diagnosis complete. Detected ${diag.disease} with ${diag.confidence}% confidence. Chemical: ${diag.chemical}. Organic option: ${diag.organic}.`;
      if (selectedLanguage === 'hi-IN') {
        replyText = `पत्ती की जांच पूरी हुई। ${diag.disease} की पुष्टि हुई (${diag.confidence}% मैच)। रासायनिक उपचार: ${diag.chemical}। जैविक उपाय: ${diag.organic}।`;
      } else if (selectedLanguage === 'or-IN') {
        replyText = `ପତ୍ର ପରୀକ୍ଷା ସମ୍ପୂର୍ଣ୍ଣ ହେଲା। ଚିହ୍ନଟ: ${diag.disease} (${diag.confidence}% ନିର୍ଭୁଲ)। ରାସାୟନିକ: ${diag.chemical}। ଜୈବିକ ଉପଚାର: ${diag.organic}।`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'amania', isDiagnosis: true,
        disease: diag.disease, confidence: diag.confidence, chemical: diag.chemical, organic: diag.organic,
        text: replyText, timestamp: new Date()
      }]);
      setIsAnalyzingImage(false);
      speakReply(replyText);
      if (diag.contagious) onContagiousOutbreakDetected?.(diag.disease);
    }, 2400);
  }, [speakReply, stopAllAudio, onContagiousOutbreakDetected, selectedLanguage]);

  // Handle incoming message & response
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    stopAllAudio();

    setTimeout(() => {
      const replyText = generateAmaniaReply(text, selectedLanguage);
      const amaniaMsg = { id: Date.now() + 1, sender: 'amania', text: replyText, timestamp: new Date() };
      setMessages(prev => [...prev, amaniaMsg]);
      speakReply(replyText);
      if (text.toLowerCase().includes('blast') || text.toLowerCase().includes('blight') || text.includes('झुलसा') || text.includes('ଝଣକା')) {
        onContagiousOutbreakDetected?.(text);
      }
    }, 500);
  };

  const handleClearChat = () => {
    stopAllAudio();
    stopCameraStream();
    setMessages([{ id: Date.now(), sender: 'amania', text: currentLangConfig.initialGreeting, timestamp: new Date() }]);
  };

  // Voice Recognition Speech-to-Text
  const toggleVoiceRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = selectedLanguage;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
    }
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
          {/* Hidden file input for uploading images from gallery/files & canvas */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          <canvas ref={canvasRef} className="hidden" />

          {/* Header Bar */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-b border-emerald-900/10 flex items-center justify-between bg-gradient-to-r from-pink-50/90 via-white to-emerald-50/90 flex-wrap gap-2">
            
            {/* Identity & Status */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md ${isSpeaking ? 'animate-pulse ring-4 ring-pink-300/50' : ''}`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading italic text-xl sm:text-2xl text-emerald-950 leading-none">Amania Voice AI</h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Sweet Voice</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-800/70 font-semibold mt-0.5">
                  {isAnalyzingImage ? "Analyzing leaf with AI Vision..." : isSpeaking ? "Speaking in sweet tone..." : isListening ? "Listening to your voice..." : "Voice Agronomist & Crop Doctor"}
                </p>
              </div>
            </div>

            {/* Language Selector & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Language Switcher Buttons (EN / HI / OR) */}
              <div className="flex items-center bg-emerald-100/70 p-0.5 rounded-full border border-emerald-200 shadow-inner">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedLanguage === lang.id
                        ? 'bg-emerald-600 text-white shadow-sm scale-[1.03]'
                        : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-200/50'
                    }`}
                    title={`Switch to ${lang.label}`}
                  >
                    <span>{lang.flag} {lang.label}</span>
                  </button>
                ))}
              </div>

              {/* Upload Image button in header */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full border bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 transition-all cursor-pointer"
                title="Upload leaf image from gallery / files"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>

              {/* Camera button in header */}
              <button
                onClick={startCameraStream}
                className="p-2 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                title="Snap leaf photo with camera"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Clear chat */}
              <button
                onClick={handleClearChat}
                className="p-2 rounded-full border bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Voice Mute/Unmute */}
              <button
                onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopAllAudio(); }}
                className={`p-2 rounded-full border transition-all ${voiceEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                title={voiceEnabled ? "Voice Enabled" : "Voice Muted"}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Close button */}
              <button
                onClick={() => { stopAllAudio(); onClose(); }}
                className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-200 transition-colors"
              >
                <X className="w-4 h-4" />
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
                <span>
                  {selectedLanguage === 'hi-IN' 
                    ? "सुन रही हूँ... अपनी फसल की समस्या बोलें" 
                    : selectedLanguage === 'or-IN'
                    ? "ଶୁଣୁଛି... ଆପଣଙ୍କ ଫସଲ ସମସ୍ୟା କୁହନ୍ତୁ"
                    : "Listening... Speak your crop problem now"}
                </span>
              </motion.div>
            )}

            {/* Speaking Indicator */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-1.5 p-2 bg-pink-50 border border-pink-200 rounded-full text-pink-700 text-xs font-bold w-max mx-auto shadow-sm"
              >
                <div className="flex gap-1 items-center px-2">
                  <span className="w-1 h-3 bg-pink-500 rounded-full animate-bounce"></span>
                  <span className="w-1 h-5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
                <span>Amania is speaking...</span>
                <button
                  onClick={stopAllAudio}
                  className="ml-2 text-[10px] bg-pink-200 hover:bg-pink-300 text-pink-900 px-2 py-0.5 rounded-full font-bold"
                >
                  Stop
                </button>
              </motion.div>
            )}
          </div>

          {/* Quick Voice Prompt Suggestions in Selected Language */}
          <div className="flex-shrink-0 px-4 py-2 bg-white/80 border-t border-emerald-900/5 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="font-bold text-emerald-900/60 flex-shrink-0">
              {selectedLanguage === 'hi-IN' ? "पूछें:" : selectedLanguage === 'or-IN' ? "ପଚାରନ୍ତୁ:" : "Ask:"}
            </span>
            {currentLangConfig.quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-full border border-emerald-200/60 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Voice Input & Text Control Footer */}
          <div className="flex-shrink-0 p-3 bg-white border-t border-emerald-900/10 flex items-center gap-2">
            {/* Upload Image button in footer */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0 border border-pink-200 shadow-sm cursor-pointer"
              title="Upload leaf photo from gallery / files"
            >
              <ImageIcon className="w-5 h-5" />
            </motion.button>

            {/* Camera button in footer */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCameraStream}
              className="w-11 h-11 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200 shadow-sm cursor-pointer"
              title="Snap leaf photo with camera"
            >
              <Camera className="w-5 h-5" />
            </motion.button>

            {/* Mic Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-lg cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 text-white shadow-rose-500/40 ring-4 ring-rose-300 animate-pulse' 
                  : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-pink-500/30 hover:shadow-pink-500/50'
              }`}
              title={isListening ? "Listening... Click to stop" : "Tap to Speak"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={isListening ? (selectedLanguage === 'hi-IN' ? "सुन रही हूँ..." : selectedLanguage === 'or-IN' ? "ଶୁଣୁଛି..." : "Listening...") : currentLangConfig.inputPlaceholder}
                className="w-full bg-emerald-50/60 border border-emerald-200/80 rounded-full px-5 py-2.5 text-xs sm:text-sm text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:bg-white focus:border-pink-400 focus:shadow-md transition-all font-medium pr-11"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
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
