import React, { useState, useMemo, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { 
  Leaf, ArrowUpRight, Play, Zap, Shield, Microscope, 
  Cpu, Cloud, Database, Scan, Beaker, ChevronDown, ChevronRight, Camera,
  Layers, Focus, Activity, X, Loader2, CheckCircle, AlertTriangle, Search, Sparkles, Map, Bell, LogIn, LogOut, Menu, Brain,
  Mic, MicOff, Volume2, VolumeX
} from 'lucide-react';
const DiseaseMap = lazy(() => import('./components/DiseaseMap'));
const AlertNetwork = lazy(() => import('./components/AlertNetwork'));
import AuthModal from './components/AuthModal';
import WeatherIntelligence from './components/WeatherIntelligence';
import GovernmentSchemesHub from './components/GovernmentSchemesHub';
import InstallBanner from './components/InstallBanner';
import KisanEmergencyBar from './components/KisanEmergencyBar';
import AmaniaVoiceModal from './components/AmaniaVoiceModal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
const Hardware = lazy(() => import('./pages/Hardware'));
const Community = lazy(() => import('./pages/Community'));
const CropCalendar = lazy(() => import('./pages/CropCalendar'));
const About = lazy(() => import('./pages/About'));
import { initialAlerts, initialDiseasePoints, floraDatabase } from './data/constants';
import RobotGuide from './components/RobotGuide';
import SplashScreen from './components/SplashScreen';
import { InteractiveHoverButton, InteractiveHoverLink } from './components/ui/interactive-hover-button';






const AmaniaBadge = React.memo(({ onClick }) => (
  <motion.div 
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="absolute bottom-3 left-3 md:bottom-4 md:left-6 z-[60] flex items-center gap-3 liquid-glass px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-all shadow-xl hover:shadow-pink-500/20 border border-pink-200/50 bg-white/40"
  >
    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-inner">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="flex flex-col justify-center pr-3">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-800/60 leading-none mb-1">Powered By</span>
      <span translate="no" className="font-heading italic text-2xl bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent leading-none notranslate">Amania AI</span>
    </div>
  </motion.div>
));



const customEase = [0.16, 1, 0.3, 1];

const BlurText = ({ text, className = "" }) => {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
      className={`inline-block ${className}`}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden whitespace-nowrap">
          <motion.span
            variants={{
              hidden: { filter: 'blur(4px)', opacity: 0, y: 40 },
              visible: { filter: 'blur(0px)', opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } }
            }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

const ScrollReveal = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: customEase }}
    className={className}
    style={{ willChange: "transform, opacity" }}
  >
    {children}
  </motion.div>
);

const MixedFlora = React.memo(() => {
  const elements = useMemo(() => Array.from({ length: window.innerWidth < 768 ? 8 : 12 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 12 + 12}s`,
    delay: `${Math.random() * -20}s`,
    scale: Math.random() * 0.45 + 0.3,
    isPink: Math.random() > 0.4 
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {elements.map((el) => (
        <div
           key={el.id}
           className={`absolute drop-shadow-md animate-flora ${el.isPink ? 'text-pink-400/80' : 'text-emerald-500/70'}`}
           style={{ 
             left: el.left, 
             top: '-10%', 
             '--duration': el.duration, 
             '--delay': el.delay 
           }}
        >
          {el.isPink ? (
            <svg style={{ transform: `scale(${el.scale})` }} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2 C15,-3 25,6 18,14 C15,18 12,22 12,22 C12,22 9,18 6,14 C-1,6 9,-3 12,2 Z" />
            </svg>
          ) : (
            <Leaf style={{ transform: `scale(${el.scale})` }} />
          )}
        </div>
      ))}
    </div>
  );
});

const FLORA_CATEGORIES = [
  { id: 'all', label: '🌿 All Plants' },
  { id: 'Pest & Bio-Shield', label: '🛡️ Pest & Bio-Shield' },
  { id: 'Ayurveda & Immunity', label: '🍵 Ayurveda & Immunity' },
  { id: 'Brain & Stress', label: '🧠 Brain & Stress' },
  { id: 'Skin & Wounds', label: '🩹 Skin & Wounds' },
  { id: 'Digestion & Pain', label: '🫚 Digestion & Pain' }
];

// Curated High-Accuracy Botanical Taxon Dictionary for Instant Guaranteed Floral & Plant Queries
const BOTANICAL_TAXON_MAP = {
  'lotus': {
    title: 'Nelumbo nucifera',
    commonName: 'Sacred Lotus (Kamal)',
    hindiName: 'कमल',
    scientificName: 'Nelumbo nucifera',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    properties: ['Cardiotonic', 'Astringent', 'Refrigerant', 'Calming Alkaloid'],
    activeCompound: 'Nuciferine & Nelumboside',
    diseasesTargeted: ['Cardiac Arrhythmia', 'Internal Bleeding', 'Heat Stress', 'Restlessness'],
    cures: 'Sacred Lotus (Nelumbo nucifera) petals and rhizomes are widely used in Ayurveda and traditional herbal medicine. Contains the alkaloid Nuciferine which exerts calming antispasmodic effects and promotes cardiovascular stability.',
    preparation: 'Dried petal infusion (Lotus tea) or rhizome powder decoction. For agriculture, lotus pond silt provides nutrient-dense bio-fertilizer.',
    dosage: '1–2 cups brewed petal tea or 3g rhizome powder'
  },
  'kamal': {
    title: 'Nelumbo nucifera',
    commonName: 'Sacred Lotus (Kamal)',
    hindiName: 'कमल',
    scientificName: 'Nelumbo nucifera',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    properties: ['Cardiotonic', 'Astringent', 'Refrigerant', 'Calming Alkaloid'],
    activeCompound: 'Nuciferine & Nelumboside',
    diseasesTargeted: ['Cardiac Arrhythmia', 'Internal Bleeding', 'Heat Stress', 'Restlessness'],
    cures: 'Sacred Lotus (Nelumbo nucifera) petals and rhizomes are widely used in Ayurveda and traditional herbal medicine. Contains the alkaloid Nuciferine which exerts calming antispasmodic effects and promotes cardiovascular stability.',
    preparation: 'Dried petal infusion (Lotus tea) or rhizome powder decoction. For agriculture, lotus pond silt provides nutrient-dense bio-fertilizer.',
    dosage: '1–2 cups brewed petal tea or 3g rhizome powder'
  },
  'rose': {
    title: 'Rosa (plant)',
    commonName: 'Rose (Gulab)',
    hindiName: 'गुलाब',
    scientificName: 'Rosa damascena',
    category: 'Skin & Wounds',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    properties: ['Cooling', 'Anti-inflammatory', 'Skin Toner', 'Antidepressant'],
    activeCompound: 'Geraniol, Citronellol & Kaempferol',
    diseasesTargeted: ['Skin Inflammation', 'Digestive Heat (Pitta)', 'Eye Fatigue'],
    cures: 'Rose petals are steam-distilled into pure Rose Water (Gulab Jal) or preserved in Gulkand. Regulates skin pH, alleviates acid reflux, and soothes ocular strain.',
    preparation: 'Steam-distilled hydrosol or Gulkand (sun-cured rose petal jam).',
    dosage: '1 tsp Gulkand twice daily or 2 drops rose water in eyes'
  },
  'gulab': {
    title: 'Rosa (plant)',
    commonName: 'Rose (Gulab)',
    hindiName: 'गुलाब',
    scientificName: 'Rosa damascena',
    category: 'Skin & Wounds',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    properties: ['Cooling', 'Anti-inflammatory', 'Skin Toner', 'Antidepressant'],
    activeCompound: 'Geraniol, Citronellol & Kaempferol',
    diseasesTargeted: ['Skin Inflammation', 'Digestive Heat (Pitta)', 'Eye Fatigue'],
    cures: 'Rose petals are steam-distilled into pure Rose Water (Gulab Jal) or preserved in Gulkand. Regulates skin pH, alleviates acid reflux, and soothes ocular strain.',
    preparation: 'Steam-distilled hydrosol or Gulkand (sun-cured rose petal jam).',
    dosage: '1 tsp Gulkand twice daily or 2 drops rose water in eyes'
  },
  'hibiscus': {
    title: 'Hibiscus rosa-sinensis',
    commonName: 'Hibiscus (Gudhal)',
    hindiName: 'गुड़हल',
    scientificName: 'Hibiscus rosa-sinensis',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=800&q=80',
    properties: ['Hair Follicle Stimulant', 'Cardiovascular', 'Antioxidant'],
    activeCompound: 'Anthocyanins & Hibiscus Acid',
    diseasesTargeted: ['Hair Thinning', 'Hypertension', 'Kidney Health'],
    cures: 'Rich in polyphenols and vitamin C. Lowers systolic blood pressure naturally and stimulates dormant hair follicles when infused in virgin coconut oil.',
    preparation: 'Fresh flower cold infusion or crushed flower hair oil mask.',
    dosage: '1–2 cups tart hibiscus tea or topical oil weekly'
  },
  'gudhal': {
    title: 'Hibiscus rosa-sinensis',
    commonName: 'Hibiscus (Gudhal)',
    hindiName: 'गुड़हल',
    scientificName: 'Hibiscus rosa-sinensis',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=800&q=80',
    properties: ['Hair Follicle Stimulant', 'Cardiovascular', 'Antioxidant'],
    activeCompound: 'Anthocyanins & Hibiscus Acid',
    diseasesTargeted: ['Hair Thinning', 'Hypertension', 'Kidney Health'],
    cures: 'Rich in polyphenols and vitamin C. Lowers systolic blood pressure naturally and stimulates dormant hair follicles when infused in virgin coconut oil.',
    preparation: 'Fresh flower cold infusion or crushed flower hair oil mask.',
    dosage: '1–2 cups tart hibiscus tea or topical oil weekly'
  },
  'jasmine': {
    title: 'Jasminum sambac',
    commonName: 'Jasmine (Mogra)',
    hindiName: 'मोगरा / चमेली',
    scientificName: 'Jasminum sambac',
    category: 'Brain & Stress',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    properties: ['Sedative', 'Cooling Antipyretic', 'Skin Soothing'],
    activeCompound: 'Linalool, Benzyl Acetate & Jasmone',
    diseasesTargeted: ['Anxiety', 'Headaches', 'Skin Dermatitis'],
    cures: 'Revered for its soothing, relaxing aroma. Relieves nervous tension, cools skin erythema, and reduces fever temperature when applied as a floral compress.',
    preparation: 'Floral water infusion or essential oil diluted in jojoba oil.',
    dosage: '2–3 drops essential oil diffused or fresh floral tea'
  },
  'mogra': {
    title: 'Jasminum sambac',
    commonName: 'Jasmine (Mogra)',
    hindiName: 'मोगरा / चमेली',
    scientificName: 'Jasminum sambac',
    category: 'Brain & Stress',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    properties: ['Sedative', 'Cooling Antipyretic', 'Skin Soothing'],
    activeCompound: 'Linalool, Benzyl Acetate & Jasmone',
    diseasesTargeted: ['Anxiety', 'Headaches', 'Skin Dermatitis'],
    cures: 'Revered for its soothing, relaxing aroma. Relieves nervous tension, cools skin erythema, and reduces fever temperature when applied as a floral compress.',
    preparation: 'Floral water infusion or essential oil diluted in jojoba oil.',
    dosage: '2–3 drops essential oil diffused or fresh floral tea'
  },
  'marigold': {
    title: 'Tagetes',
    commonName: 'Marigold (Genda)',
    hindiName: 'गेंदा',
    scientificName: 'Tagetes erecta',
    category: 'Pest & Bio-Shield',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    properties: ['Nematocide', 'Lutein Rich', 'Wound Healing'],
    activeCompound: 'Alpha-terthienyl & Lutein',
    diseasesTargeted: ['Root-knot Nematodes', 'Macular Degeneration', 'Skin Ulcers'],
    cures: 'Root exudates produce alpha-terthienyl, eliminating subterranean nematodes in agricultural soils by 90%. Petal lutein protects retinal health.',
    preparation: 'Intercropped along crop rows for nematode bio-shield, or petal balm.',
    dosage: 'Intercrop 1 marigold per 5 crop plants; external balm for ulcers'
  },
  'genda': {
    title: 'Tagetes',
    commonName: 'Marigold (Genda)',
    hindiName: 'गेंदा',
    scientificName: 'Tagetes erecta',
    category: 'Pest & Bio-Shield',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    properties: ['Nematocide', 'Lutein Rich', 'Wound Healing'],
    activeCompound: 'Alpha-terthienyl & Lutein',
    diseasesTargeted: ['Root-knot Nematodes', 'Macular Degeneration', 'Skin Ulcers'],
    cures: 'Root exudates produce alpha-terthienyl, eliminating subterranean nematodes in agricultural soils by 90%. Petal lutein protects retinal health.',
    preparation: 'Intercropped along crop rows for nematode bio-shield, or petal balm.',
    dosage: 'Intercrop 1 marigold per 5 crop plants; external balm for ulcers'
  },
  'moringa': {
    title: 'Moringa oleifera',
    commonName: 'Moringa (Sahjan / Drumstick)',
    hindiName: 'सहजन',
    scientificName: 'Moringa oleifera',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
    properties: ['Nutritional Superfood', 'Antidiabetic', 'Anti-inflammatory'],
    activeCompound: 'Isothiocyanates & Pterygospermin',
    diseasesTargeted: ['Malnutrition', 'Blood Glucose Spikes', 'Joint Pain'],
    cures: 'Leaves contain 7x vitamin C of oranges and 4x calcium of milk. Isothiocyanates help stabilize insulin sensitivity and reduce cellular inflammation.',
    preparation: 'Shade-dried leaf powder mixed into warm water or curries.',
    dosage: '1–2 teaspoons (5g) leaf powder daily'
  },
  'sahjan': {
    title: 'Moringa oleifera',
    commonName: 'Moringa (Sahjan / Drumstick)',
    hindiName: 'सहजन',
    scientificName: 'Moringa oleifera',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
    properties: ['Nutritional Superfood', 'Antidiabetic', 'Anti-inflammatory'],
    activeCompound: 'Isothiocyanates & Pterygospermin',
    diseasesTargeted: ['Malnutrition', 'Blood Glucose Spikes', 'Joint Pain'],
    cures: 'Leaves contain 7x vitamin C of oranges and 4x calcium of milk. Isothiocyanates help stabilize insulin sensitivity and reduce cellular inflammation.',
    preparation: 'Shade-dried leaf powder mixed into warm water or curries.',
    dosage: '1–2 teaspoons (5g) leaf powder daily'
  },
  'amla': {
    title: 'Phyllanthus emblica',
    commonName: 'Indian Gooseberry (Amla)',
    hindiName: 'आंवला',
    scientificName: 'Phyllanthus emblica',
    category: 'Ayurveda & Immunity',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    properties: ['Super Antioxidant', 'Immunomodulator', 'Digestive Tonic'],
    activeCompound: 'Emblicanin A & B (Ascorbic Acid complex)',
    diseasesTargeted: ['Immune Deficiency', 'Hyperacidity', 'Hair Graying'],
    cures: 'King of Rasayanas in Ayurveda. The heat-stable bioavailable vitamin C complex boosts white blood cell response and strengthens hepatic detoxification.',
    preparation: 'Fresh fruit juice or Chyawanprash formulation.',
    dosage: '15–20 ml fresh juice with water on empty stomach'
  }
};

const FloraArchive = React.memo(({ onCameraClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalTab, setModalTab] = useState('overview'); // 'overview' | 'phytochemistry' | 'prep' | 'agri'
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResult, setWebResult] = useState(null);
  const [webSearchError, setWebSearchError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingPlantId, setSpeakingPlantId] = useState(null);

  // Speech-to-text Voice Search for farmers
  const handleVoiceSearch = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice search is not supported on this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) setSearchTerm(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Text-to-speech Audio Reader for farmers
  const handleToggleSpeech = (plant, e) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (speakingPlantId === plant.id) {
      window.speechSynthesis.cancel();
      setSpeakingPlantId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const curesText = typeof plant.cures === 'string' ? plant.cures : '';
    const textToSpeak = `${plant.name} (${plant.hindiName || ''}). Botanical name: ${plant.scientificName || ''}. Active compound: ${plant.activeCompound || ''}. Key properties: ${plant.properties ? plant.properties.join(', ') : ''}. Treats: ${plant.diseasesTargeted ? plant.diseasesTargeted.join(', ') : ''}. Clinical details: ${curesText}. Preparation: ${plant.preparation || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.12;
    utterance.onend = () => setSpeakingPlantId(null);
    utterance.onerror = () => setSpeakingPlantId(null);
    setSpeakingPlantId(plant.id);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setWebResult(null);
    setWebSearchError(null);
    
    if (searchTerm.trim() !== "" && floraDatabase.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (plant.hindiName && plant.hindiName.includes(searchTerm)) ||
      (plant.scientificName && plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (plant.activeCompound && plant.activeCompound.toLowerCase().includes(searchTerm.toLowerCase())) ||
      plant.diseasesTargeted.some(disease => disease.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length === 0) {
      const timer = setTimeout(() => {
        searchWeb(searchTerm);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);

  const filteredPlants = useMemo(() => {
    const matched = floraDatabase.filter(plant => {
      const matchesCategory = activeCategory === 'all' || plant.category === activeCategory;
      if (!matchesCategory) return false;

      if (searchTerm.trim() === "") return true;

      const term = searchTerm.toLowerCase();
      return (
        plant.name.toLowerCase().includes(term) ||
        (plant.hindiName && plant.hindiName.includes(searchTerm)) ||
        (plant.scientificName && plant.scientificName.toLowerCase().includes(term)) ||
        (plant.activeCompound && plant.activeCompound.toLowerCase().includes(term)) ||
        (plant.cures && plant.cures.toLowerCase().includes(term)) ||
        plant.properties.some(prop => prop.toLowerCase().includes(term)) ||
        plant.diseasesTargeted.some(disease => disease.toLowerCase().includes(term))
      );
    });

    // In default catalog view (no search term and all categories), show top 6 flagship plants
    if (searchTerm.trim() === "" && activeCategory === 'all') {
      return matched.slice(0, 6);
    }
    return matched;
  }, [searchTerm, activeCategory]);

  const displayPlants = useMemo(() => {
    return webResult ? [...filteredPlants, webResult] : filteredPlants;
  }, [filteredPlants, webResult]);

  // Intelligent Multi-Tier Botanical & Floral Web Search Engine
  const searchWeb = async (query) => {
    if (!query.trim()) return;
    setIsSearchingWeb(true);
    setWebResult(null);
    setWebSearchError(null);

    const cleanQuery = query.trim().toLowerCase();

    // 1. Direct Instant Hit from Curated Botanical Taxon Dictionary
    const directMatchKey = Object.keys(BOTANICAL_TAXON_MAP).find(k => 
      cleanQuery === k || cleanQuery.includes(k) || k.includes(cleanQuery)
    );

    if (directMatchKey) {
      const taxon = BOTANICAL_TAXON_MAP[directMatchKey];
      setWebResult({
        id: `taxon-${directMatchKey}-${Date.now()}`,
        name: taxon.commonName,
        hindiName: taxon.hindiName,
        scientificName: taxon.scientificName,
        category: taxon.category,
        image: taxon.image,
        properties: taxon.properties,
        activeCompound: taxon.activeCompound,
        diseasesTargeted: taxon.diseasesTargeted,
        cures: taxon.cures,
        description: taxon.cures,
        preparation: taxon.preparation,
        dosage: taxon.dosage,
        isWeb: true,
        hasFullDetails: true,
        wikiTitle: taxon.title
      });
      setIsSearchingWeb(false);
      return;
    }
    
    // 2. Botanical Keyword Classifier & Wikipedia Search
    const botanicalKeywords = [
      'plant', 'flower', 'herb', 'tree', 'shrub', 'fern', 'moss', 'succulent',
      'vine', 'grass', 'weed', 'flora', 'botanical', 'botany', 'horticulture',
      'species', 'genus', 'family', 'cultivar', 'hybrid', 'variety',
      'leaf', 'leaves', 'petal', 'seed', 'root', 'stem', 'bark', 'rhizome',
      'medicinal plant', 'herbal', 'ayurved', 'phytotherapy', 'nelumbo', 'blossom', 'bloom'
    ];

    const isBotanicalResult = (description = '', extract = '') => {
      const text = `${description} ${extract}`.toLowerCase();
      return botanicalKeywords.some(kw => text.includes(kw));
    };

    const fetchSummary = async (title) => {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.type === 'disambiguation' || !data.title) return null;
        return data;
      } catch {
        return null;
      }
    };

    const buildResult = (data) => ({
      id: `web-${Date.now()}`,
      name: data.title,
      scientificName: data.description || 'Botanical Species',
      category: 'Botanical Record',
      image: data.thumbnail?.source || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      properties: ['Phytochemical Record', 'Botanical Taxonomy'],
      activeCompound: 'Natural Phyto-Extracts',
      diseasesTargeted: ['Traditional Herbal Efficacy', 'General Wellness'],
      cures: data.extract,
      description: data.extract,
      preparation: 'Sourced from live global botanical taxonomy.',
      dosage: 'Consult certified herbalist or agronomist',
      isWeb: true,
      hasFullDetails: false,
      wikiTitle: data.title
    });

    try {
      // Try direct summary with botanical query suffixes first
      const searchQueries = [
        `${query.trim()} flower`,
        `${query.trim()} plant`,
        `${query.trim()} species`,
        query.trim()
      ];

      for (const searchQuery of searchQueries) {
        const searchRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srlimit=6&format=json&origin=*`
        );
        
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const results = searchData.query?.search || [];
          
          for (const result of results) {
            // Reject non-botanical results (cars, computing, software, movies)
            const titleLower = result.title.toLowerCase();
            if (titleLower.includes('car') || titleLower.includes('software') || titleLower.includes('album') || titleLower.includes('film')) {
              continue;
            }

            const summaryData = await fetchSummary(result.title);
            if (summaryData && isBotanicalResult(summaryData.description, summaryData.extract)) {
              setWebResult(buildResult(summaryData));
              setIsSearchingWeb(false);
              return;
            }
          }
        }
      }
      
      setWebSearchError(`No verified botanical records found for "${query}". Try searching for flowers like Lotus, Rose, Hibiscus, Marigold, or Jasmine.`);
    } catch {
      setWebSearchError("Failed to connect to botanical database. Please check your internet connection.");
    }
    setIsSearchingWeb(false);
  };

  const fetchMoreDetails = async (title) => {
    setIsLoadingMore(true);
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=false&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`);
      if (response.ok) {
        const data = await response.json();
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          const extract = pages[pageId].extract;
          if (extract) {
            setSelectedImage(prev => ({ ...prev, cures: extract, hasFullDetails: true }));
            setWebResult(prev => ({ ...prev, cures: extract, hasFullDetails: true }));
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch full details", err);
    }
    setIsLoadingMore(false);
  };


  return (
    <section id="flora" className="py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto z-10 relative">

      {/* Ambient Background Glows */}
      <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Outer premium container */}
      <div className="relative rounded-[2.5rem] border border-emerald-200/60 bg-white/60 backdrop-blur-xl shadow-2xl shadow-emerald-900/5 overflow-hidden">

        {/* Top gradient shimmer bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-emerald-400 to-teal-400 opacity-80" />

        {/* Inner ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-emerald-100/50 to-transparent blur-3xl pointer-events-none" />

        {/* Box Header */}
        <div className="px-6 sm:px-10 pt-10 pb-8 border-b border-emerald-900/8 relative">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 rounded-full px-4 py-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 text-xs font-extrabold uppercase tracking-[0.2em]">Pharmacopeia & Bio-Shield Index</span>
            </div>
            
            <ScrollReveal>
              <h2 className="font-heading italic text-4xl sm:text-6xl tracking-tight text-emerald-950">Botanical Archive</h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="text-emerald-700/80 text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed">
                Explore our scientifically verified botanical index — integrating Ayurvedic heritage with modern phytochemical compounds, active bio-pesticides, and clinical preparations.
              </p>
            </ScrollReveal>
            
            {/* Search Bar */}
            <ScrollReveal delay={0.15} className="w-full max-w-2xl mt-2">
              <div className="relative group flex items-center">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <input 
                  type="text" 
                  placeholder={isListening ? "Listening... Speak plant name or ailment now..." : "Search by plant (Tulsi, Neem), active compound (Curcumin), or ailment (Insomnia, Pests)..."} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full bg-white/90 rounded-full pl-14 pr-28 py-4 text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:bg-white border shadow-inner shadow-emerald-50 font-body text-xs sm:text-sm font-semibold transition-all focus:shadow-lg ${isListening ? 'border-rose-400 bg-rose-50/40 animate-pulse' : 'border-emerald-200/80 focus:border-emerald-400/60'}`}
                />
                
                {/* Voice Search Button */}
                <button 
                  type="button"
                  onClick={handleVoiceSearch}
                  title={isListening ? "Listening... Click to stop" : "Voice Search (Speak plant/disease name)"}
                  className={`absolute right-14 top-1/2 -translate-y-1/2 w-10 h-10 ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'} rounded-full flex items-center justify-center transition-colors shadow-sm border border-emerald-200 cursor-pointer`}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* AI Camera Button */}
                <button 
                  onClick={onCameraClick}
                  title="Scan leaf with AI Camera"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center transition-colors shadow-sm border border-emerald-200 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 pt-2 no-scrollbar">
              {FLORA_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                      : 'bg-white/80 text-emerald-900/80 hover:bg-white hover:text-emerald-950 border border-emerald-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-6 md:p-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence>
              {displayPlants.map((plant, i) => (
                <motion.div 
                  key={plant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="liquid-glass rounded-3xl overflow-hidden group border border-emerald-200/60 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 shadow-md shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 bg-white/70"
                >
                  {/* Image banner with overlay */}
                  <div 
                    className="h-60 overflow-hidden relative border-b border-emerald-900/5 cursor-pointer group/img"
                    onClick={() => { setSelectedImage(plant); setModalTab('overview'); }}
                  >
                    <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover/img:scale-100 transition-transform flex items-center gap-2 text-emerald-900 text-xs font-bold">
                        <Scan className="w-4 h-4 text-emerald-700" />
                        <span>Inspect Phyto-Details</span>
                      </div>
                    </div>
                    
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1466692476877-361ad33333cc?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-50 via-pink-50/20 to-transparent" />
                    
                    {/* Category pill top left */}
                    {plant.category && (
                      <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider bg-white/90 text-emerald-800 px-2.5 py-1 rounded-full shadow-sm border border-emerald-200/60 backdrop-blur-md">
                        {plant.category}
                      </span>
                    )}

                    <h3 className="absolute bottom-3 left-5 font-heading italic text-3xl sm:text-4xl text-emerald-950 drop-shadow-sm">
                      {plant.name}
                    </h3>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col gap-4 bg-white/50">
                    
                    {/* Scientific & Hindi Name + Speech Button */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-emerald-700 text-xs font-bold italic tracking-wide">{plant.scientificName}</p>
                        {plant.hindiName && (
                          <p className="text-[11px] font-bold text-pink-700 mt-0.5">{plant.hindiName}</p>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => handleToggleSpeech(plant, e)}
                        title={speakingPlantId === plant.id ? "Stop Reading" : "Listen to Plant Details"}
                        className={`p-2 rounded-full border transition-all cursor-pointer ${speakingPlantId === plant.id ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                      >
                        {speakingPlantId === plant.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Active Phytochemical Compound */}
                    {plant.activeCompound && (
                      <div className="bg-pink-50/80 border border-pink-200/80 rounded-xl p-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-700">Active Compound</span>
                        <span className="text-xs font-black text-pink-900">{plant.activeCompound}</span>
                      </div>
                    )}
                    
                    {/* Key Properties */}
                    <div>
                      <h4 className="text-emerald-800/50 text-[10px] uppercase tracking-[0.2em] mb-1.5 font-extrabold">Properties</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {plant.properties.map(prop => (
                          <span key={prop} className="text-[11px] border border-emerald-500/20 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Treats / Applications */}
                    <div>
                      <h4 className="text-emerald-800/50 text-[10px] uppercase tracking-[0.2em] mb-1 font-extrabold">Target Applications</h4>
                      <p className="text-xs text-emerald-950 font-bold leading-relaxed">{plant.diseasesTargeted.join(" • ")}</p>
                    </div>

                    {/* Cures / Bio-action summary */}
                    <div className="mt-auto pt-3 border-t border-emerald-900/10">
                      <p className="text-xs text-emerald-900/80 leading-relaxed font-medium line-clamp-3">
                        {plant.cures}
                      </p>
                      <button 
                        onClick={() => { setSelectedImage(plant); setModalTab('overview'); }}
                        className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-950 flex items-center gap-1 group/btn cursor-pointer"
                      >
                        <span>Full Recipe & Preparation</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredPlants.length === 0 && !webResult && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center gap-5 py-12"
            >
              {webSearchError ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-emerald-800/50 font-body text-base font-bold">
                    No botanical records found matching "{searchTerm}".
                  </p>
                  <p className="text-rose-600 font-bold mt-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm">{webSearchError}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-12">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                  <p className="text-emerald-800/70 font-bold animate-pulse text-sm">Searching global botanical taxonomy for "{searchTerm}"...</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Bottom gradient shimmer bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      </div>

      {/* ── Rich Detail Modal for Selected Plant ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-950/70 backdrop-blur-md p-3 sm:p-6 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-emerald-200/60 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedImage(null)} 
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-md text-emerald-900 transition-transform hover:scale-110 z-30 shadow-md border border-emerald-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Modal Top Banner */}
              <div className="w-full relative bg-gradient-to-br from-pink-50 via-emerald-50 to-white flex flex-col sm:flex-row items-center p-6 border-b border-emerald-100 gap-6">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0">
                  <img 
                    src={selectedImage.image} 
                    alt={selectedImage.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1466692476877-361ad33333cc?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                    <span className="text-pink-600 font-extrabold uppercase tracking-[0.2em] text-xs block">
                      {selectedImage.scientificName}
                    </span>
                    {selectedImage.category && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {selectedImage.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-heading italic text-3xl sm:text-4xl text-emerald-950 mb-2">
                    {selectedImage.name} {selectedImage.hindiName ? `(${selectedImage.hindiName})` : ''}
                  </h3>

                  {selectedImage.activeCompound && (
                    <p className="text-xs font-bold text-emerald-800/80 mb-3">
                      🧬 Primary Phyto-Compound: <strong className="text-emerald-950">{selectedImage.activeCompound}</strong>
                    </p>
                  )}

                  {/* Audio reader button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleSpeech(selectedImage, e)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      speakingPlantId === selectedImage.id 
                        ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {speakingPlantId === selectedImage.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{speakingPlantId === selectedImage.id ? "Stop Audio" : "Voice Reader"}</span>
                  </button>
                </div>
              </div>
              
              {/* Modal Navigation Tabs */}
              <div className="flex items-center px-6 pt-3 border-b border-emerald-100 bg-emerald-50/30 gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: '🌿 Clinical Overview' },
                  { id: 'prep', label: '🍵 Preparation & Dosage' },
                  { id: 'agri', label: '🚜 Farm & Bio-Shield' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      modalTab === tab.id 
                        ? 'border-emerald-600 text-emerald-950' 
                        : 'border-transparent text-emerald-800/50 hover:text-emerald-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Tab Content */}
              <div className="p-6 overflow-y-auto max-h-[45vh] text-sm text-emerald-950 leading-relaxed bg-white">
                
                {modalTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">Therapeutic Action & Efficacy</h4>
                      <p className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-900/90 font-medium">
                        {selectedImage.cures}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-2">Targeted Ailments & Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.diseasesTargeted.map(d => (
                          <span key={d} className="bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">
                            ✓ {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'prep' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">Traditional Preparation Protocol</h4>
                      <p className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-emerald-900/90 font-medium">
                        {selectedImage.preparation || "Boil fresh or dried parts in water to make a decoction (Kwath), or use cold-pressed extract."}
                      </p>
                    </div>

                    {selectedImage.dosage && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">Recommended Usage & Dosage</h4>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold text-xs">
                          ⚖️ {selectedImage.dosage}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalTab === 'agri' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">Agricultural & Bio-Shield Application</h4>
                      <p className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-900/90 font-medium">
                        Botanical phyto-compounds from {selectedImage.name} contain natural bio-deterrents. When fermented with cow urine and neem extract, it creates a powerful zero-chemical pest repellent for paddy, vegetables, and fruit orchards.
                      </p>
                    </div>
                  </div>
                )}

                {selectedImage.isWeb && !selectedImage.hasFullDetails && (
                  <button 
                    onClick={() => fetchMoreDetails(selectedImage.wikiTitle)}
                    disabled={isLoadingMore}
                    className="mt-4 inline-flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-5 py-2 rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isLoadingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>{isLoadingMore ? "Fetching Data..." : "Load Extended Botanical Taxonomy"}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});


function Home() {
  const [isNewLanding, setIsNewLanding] = useState(true);


  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showAmaniaCamera, setShowAmaniaCamera] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [diseasePoints, setDiseasePoints] = useState(initialDiseasePoints);
  const [userLocation, setUserLocation] = useState(null);

  // Phase 3: Authentication
  const [user, setUser] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setShowAuthModal(false); // Close modal on successful auth
    });
    return () => unsubscribe();
  }, []);



  // Phase 2: Real Device GPS Tracking
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("GPS Location Denied/Error:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Phase 2: Real-time Firebase Firestore Sync
  useEffect(() => {
    const qPoints = query(collection(db, 'diseasePoints'), orderBy('timestamp', 'desc'));
    const unsubPoints = onSnapshot(qPoints, (snapshot) => {
      const pts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Only override the mock initial prototypes if we have actual live data
      if (pts.length > 0) setDiseasePoints(pts);
    });

    const qAlerts = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'));
    const unsubAlerts = onSnapshot(qAlerts, (snapshot) => {
      
      // Phase 4: Push Notification Listener
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          // Only trigger push notifications for strictly new events (added < 5 seconds ago)
          if (Date.now() - data.timestamp < 5000) {
              setActiveToast(data);
              setTimeout(() => setActiveToast(null), 7000); 
          }
        }
      });

      const alts = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Calculate dynamic real-time string based on timestamp
        const secondsAgo = Math.floor((Date.now() - data.timestamp) / 1000);
        let timeAgoStr = 'Just now';
        if (secondsAgo > 60) timeAgoStr = `${Math.floor(secondsAgo / 60)}m ago`;
        if (secondsAgo > 3600) timeAgoStr = `${Math.floor(secondsAgo / 3600)}h ago`;

        // Calculate rough distance if user GPS location is actively tracking
        let distStr = data.distance || '?';
        if (userLocation && data.lat && data.lng) {
            const dx = userLocation.lat - data.lat;
            const dy = userLocation.lng - data.lng;
            const distKm = Math.sqrt(dx*dx + dy*dy) * 111; // rough degree to km approximation
            distStr = distKm < 1 ? '<1' : distKm.toFixed(1);
        }

        return { 
           id: doc.id, 
           ...data,
           timeAgo: timeAgoStr,
           distance: distStr
        };
      });
      if (alts.length > 0) setAlerts(alts);
    });

    return () => {
      unsubPoints();
      unsubAlerts();
    };
  }, [userLocation]);

  // Processes scan results from Amania AI Vision and links with the 3D Outbreak Map
  const processAmaniaScanResult = async ({ disease, severity, isContagious, confidence, notes }) => {
    const contagiousDiseases = [
      'Rice Blast', 'Bacterial Blight', 'Bacterial Leaf Blight', 
      'Brown Spot', 'Sheath Blight', 'Late Blight', 'Downy Mildew', 
      'Powdery Mildew', 'Brown Plant Hopper', 'Leaf Folder'
    ];

    // Determine if this diagnosis represents a contagious crop disease
    const isActuallyContagious = isContagious !== undefined 
      ? isContagious 
      : contagiousDiseases.some(d => (disease || '').toLowerCase().includes(d.toLowerCase())) || severity === 'high' || severity === 'medium';

    const baseLat = userLocation ? userLocation.lat : 20.2961;
    const baseLng = userLocation ? userLocation.lng : 85.8245;
    const lat = baseLat + (Math.random() - 0.5) * 0.03;
    const lng = baseLng + (Math.random() - 0.5) * 0.03;

    if (isActuallyContagious) {
      const diseaseName = disease || 'Rice Blast';
      const severityLevel = severity || 'high';
      const confidenceScore = confidence || 94;

      const newPoint = {
        lat,
        lng,
        disease: diseaseName,
        severity: severityLevel,
        intensity: severityLevel === 'high' ? 0.92 : 0.82,
        confidence_score: confidenceScore,
        timestamp: Date.now(),
        radius: 1400,
        source: 'Amania AI Neural Vision'
      };

      try {
        await addDoc(collection(db, 'diseasePoints'), newPoint);
        await addDoc(collection(db, 'alerts'), {
          disease: diseaseName,
          severity: severityLevel,
          farmCount: 1,
          lat,
          lng,
          timestamp: Date.now()
        });
      } catch (err) {
        // Fallback for offline / demo mode
        setDiseasePoints(prev => [newPoint, ...prev]);
        setAlerts(prev => [{ id: `alt-${Date.now()}`, ...newPoint, timeAgo: 'Just now', distance: '<1' }, ...prev]);
      }

      setActiveToast({
        disease: `${diseaseName} (Contagious Outbreak)`,
        severity: severityLevel
      });
      setTimeout(() => setActiveToast(null), 8000);
    } else {
      // Non-contagious / healthy plant scan: do NOT mark the map
      setActiveToast({
        disease: `${disease || 'Crop'} (Healthy / Non-Contagious)`,
        severity: 'low',
        isHealthy: true
      });
      setTimeout(() => setActiveToast(null), 5000);
    }
  };

  // Listen for real-time messages from Amania AI Camera scanner iframe
  useEffect(() => {
    const handleAmaniaMessage = (event) => {
      if (event.data && typeof event.data === 'object' && event.data.type === 'AMANIA_SCAN_RESULT') {
        processAmaniaScanResult(event.data.payload);
      }
    };
    window.addEventListener('message', handleAmaniaMessage);
    return () => window.removeEventListener('message', handleAmaniaMessage);
  }, [userLocation]);

  const handleSimulateContagiousScan = async () => {
    if (!user && !isGuestMode) {
      setShowAuthModal(true);
      return;
    }
    await processAmaniaScanResult({
      disease: 'Rice Blast (Magnaporthe oryzae)',
      severity: 'high',
      isContagious: true,
      confidence: 96
    });
  };

  const handleSimulateHealthyScan = async () => {
    if (!user && !isGuestMode) {
      setShowAuthModal(true);
      return;
    }
    await processAmaniaScanResult({
      disease: 'Healthy Paddy (Oryza sativa)',
      severity: 'none',
      isContagious: false,
      confidence: 99
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };


  const handleScanClick = () => {
    if (!user && !isGuestMode) {
      setShowAuthModal(true);
      return;
    }
    setShowVoiceModal(true);
  };



  return (
    <div className="bg-pink-50 min-h-screen text-emerald-950 selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden font-body leaf-pattern-bg">


      <nav className="absolute top-4 left-4 right-4 lg:left-12 lg:right-12 z-50 px-6 lg:px-8 py-3 flex justify-between items-center bg-white/20 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-2 xl:gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsNewLanding(!isNewLanding)} className="liquid-glass w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-sm border border-emerald-200/50">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </button>
            <div className="flex flex-col drop-shadow-sm">
              <span className="font-heading italic  text-2xl md:text-3xl xl:text-4xl text-[#D4AF37] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">BloomSense</span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-1 pl-1">
                <a 
                  href="https://neural-leaf.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-0.5 text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-pink-600 hover:to-purple-600 bg-clip-text text-transparent transition-all duration-300 transform hover:scale-[1.03] select-none cursor-pointer"
                  title="Visit Neural Leaf"
                >
                  Neural Leaf <ArrowUpRight className="w-2.5 h-2.5 text-[#D4AF37] hover:text-purple-600" />
                </a>
              </div>
            </div>
          </div>
          <div id="google_translate_element" className="google-translate-container min-h-[36px] block mt-2 xl:mt-0 xl:ml-6 scale-75 origin-left sm:scale-100"></div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 p-1.5 rounded-full liquid-glass">
          {['Home', 'Community', 'Calendar', 'Technology', 'Map'].map((item) => {
            if (item === 'Technology') {
              return (
                <InteractiveHoverLink key={item} as={Link} to="/technology/hardware" text="Technology" />
              );
            } else if (item === 'Map') {
              return (
                <InteractiveHoverLink key={item} as="a" href="/#network" text="Map" />
              );
            } else if (item === 'Community') {
              return (
                <InteractiveHoverLink key={item} as={Link} to="/community" text="Community" />
              );
            } else if (item === 'Calendar') {
              return (
                <InteractiveHoverLink key={item} as={Link} to="/calendar" text="Calendar" />
              );
            } else {
              return (
                <InteractiveHoverLink key={item} as="a" href={`#${item.toLowerCase()}`} text={item} />
              );
            }
          })}
          
          {user ? (
            <InteractiveHoverButton onClick={() => signOut(auth)} text="Log Out" className="border-rose-200/50 bg-rose-50/30 [&_span]:text-rose-600 [&>div:last-child]:bg-rose-500 [&>div.absolute:nth-child(2)]:text-white" />
          ) : (
            <InteractiveHoverButton onClick={() => setShowAuthModal(true)} text="Log In" />
          )}

          <button 
            onClick={() => setShowVoiceModal(true)} 
            className="liquid-glass border border-pink-200/80 bg-white/60 text-pink-700 px-3.5 lg:px-4 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-bold flex items-center gap-1.5 hover:bg-white transition-all shadow-sm hover:shadow-pink-500/20"
            title="Talk with Amania Voice AI"
          >
            <Mic className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>

          <button onClick={handleScanClick} className="ml-1 bg-[#D4AF37] text-black px-4 lg:px-7 py-2 lg:py-2.5 rounded-full text-sm font-bold flex items-center gap-1.5 lg:gap-2 hover:bg-[#C5A028] transition-colors shadow-lg hover:shadow-[#D4AF37]/30">
            <span className="hidden lg:inline">Scan Sample</span><span className="lg:hidden">Scan</span> <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <button onClick={() => signOut(auth)} className="p-2 rounded-full focus:bg-rose-50 border border-rose-900/10 shadow-sm transition-colors text-rose-600">
               <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="p-2 rounded-full focus:bg-emerald-50 border border-emerald-900/10 shadow-sm transition-colors text-emerald-800">
               <LogIn className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => setShowVoiceModal(true)} 
            className="w-11 h-11 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center border border-pink-200 shadow-sm"
            title="Voice AI"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button onClick={handleScanClick} className="bg-[#D4AF37] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#C5A028] transition-colors">
            <Scan className="w-5 h-5" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 ml-1 rounded-full focus:bg-emerald-50 border border-emerald-900/10 shadow-sm transition-colors text-emerald-800">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-pink-50 flex flex-col pt-24 px-6 pb-6 overflow-y-auto"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/50 border border-emerald-900/10 shadow-sm transition-colors text-emerald-800">
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col gap-6 mt-8">
              {['Home', 'Community', 'Calendar', 'Technology', 'Map'].map((item) => {
                if (item === 'Technology') {
                  return (
                    <Link key={item} to="/technology/hardware" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                      Technology
                    </Link>
                  );
                } else if (item === 'Map') {
                  return (
                    <a key={item} href="/#network" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                      Map
                    </a>
                  );
                } else if (item === 'Community') {
                  return (
                    <Link key={item} to="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                      Community
                    </Link>
                  );
                } else if (item === 'Calendar') {
                  return (
                    <Link key={item} to="/calendar" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                      Calendar
                    </Link>
                  );
                } else {
                  return (
                    <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                      {item}
                    </a>
                  );
                }
              })}
            </div>
            {user ? (
                 <button onClick={() => { signOut(auth); setIsMobileMenuOpen(false); }} className="mt-8 px-5 py-4 text-xl font-bold rounded-full bg-rose-100 text-rose-600 flex items-center justify-center gap-2 w-full">
                  <LogOut className="w-5 h-5" /> Log Out
                </button>
            ) : (
                <button onClick={() => { setShowAuthModal(true); setIsMobileMenuOpen(false); }} className="mt-8 px-5 py-4 text-xl font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center gap-2 w-full">
                  <LogIn className="w-5 h-5" /> Log In
                </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="home" className="relative h-screen w-full overflow-hidden bg-black flowpath-font">
          {/* Background Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/10 z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-0 pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-20 flex-1 flex flex-col items-center justify-start pt-48 sm:pt-56 md:pt-64 px-6 text-center">

            <div className="max-w-4xl mx-auto mt-6">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.02em] font-semibold drop-shadow-lg text-balance">
                <BlurText text="Decode Nature's Secrets" />
                <br />
                <span className="text-white/80">with Precision AI.</span>
              </h1>
              
              <ScrollReveal delay={0.2}>
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-6 sm:mt-8 font-medium drop-shadow">
                  Advanced computer vision meets traditional phytochemistry. Ensure the quality, potency, and purity of herbal medicines with unparalleled microscopic accuracy in a bright, modern ecosystem.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3} className="flex flex-wrap items-center justify-center gap-4 mt-10 sm:mt-12">
                <div className="flowpath-glass rounded-2xl p-1.5 shadow-2xl shadow-black/20">
                  <button 
                    onClick={handleScanClick} 
                    className="px-8 sm:px-10 py-4 sm:py-5 bg-[#D4AF37] text-black text-lg font-bold rounded-xl hover:bg-[#C5A028] transition-all flex items-center gap-3 hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/30"
                  >
                    Initiate Analysis <Scan className="w-6 h-6" />
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Interactive Floating Amania AI Badge */}
          <AmaniaBadge onClick={() => setShowVoiceModal(true)} />
        </section>

        <FloraArchive onCameraClick={handleScanClick} />

        <section id="technology" className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <Link to="/technology/hardware" className="block relative h-[400px] md:h-[650px] rounded-[2.5rem] liquid-glass overflow-hidden border border-emerald-900/10 shadow-xl group cursor-pointer lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop" 
                alt="Pink and Green Leaf Pattern Botanical" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent transition-opacity duration-500" />
              <div className="absolute bottom-10 left-10 right-10 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                <p className="text-emerald-100 text-sm uppercase tracking-[0.25em] mb-3 font-bold bg-white/20 backdrop-blur-md border border-white/30 inline-block px-4 py-1.5 rounded-full shadow-sm flex items-center w-max gap-2 group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-colors">
                  Explore Hardware <ArrowUpRight className="w-3 h-3" />
                </p>
                <h3 className="font-heading italic text-4xl md:text-6xl text-white mt-2 drop-shadow-md">The Apex Sensor</h3>
              </div>
            </Link>

            <div className="relative">
              {/* Ambient Glow for Glassmorphism */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-pink-300/30 to-emerald-300/20 blur-3xl rounded-full opacity-50 pointer-events-none -z-10" />
              
              <ScrollReveal>
                <h2 className="font-heading italic text-5xl mb-10 tracking-tight text-emerald-950">Unrivaled Botanical Engineering</h2>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Microscope, label: 'Micro-Resolution', val: '0.5 μm' },
                  { icon: Cpu, label: 'Neural Processing', val: '0.12s' },
                  { icon: Focus, label: 'Classification', val: '99.8%' },
                  { icon: Beaker, label: 'Phytochemistry', val: 'Spectral' },
                  { icon: Shield, label: 'Contamination', val: 'Zero-Tol' },
                  { icon: Cloud, label: 'Edge Sync', val: 'Real-time' },
                ].map((stat, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="liquid-glass p-8 rounded-3xl group cursor-default hover:-translate-y-2 hover:bg-white/90 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 border border-white/60 hover:border-emerald-200/50 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-emerald-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                      <stat.icon className="w-8 h-8 text-pink-500 mb-5 group-hover:scale-110 transition-transform duration-500" />
                      <p className="text-emerald-700/80 text-xs font-bold mb-1 uppercase tracking-[0.15em]">{stat.label}</p>
                      <p className="text-4xl font-heading italic text-emerald-950 group-hover:text-emerald-700 transition-colors duration-300">{stat.val}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <ScrollReveal delay={0.6} className="mt-8 flex justify-start">
                <Link to="/technology/hardware" className="text-emerald-600 font-bold group flex items-center gap-2 hover:text-emerald-800 transition-colors">
                  View full hardware specifications
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                     <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="research" className="relative py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <ScrollReveal className="text-center mb-20 relative z-10">
            <h2 className="font-heading italic text-6xl tracking-tight text-emerald-950">Engineering Botanical Clarity</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[
              { icon: Layers, title: 'Morphology Tracking', desc: 'Analyzes leaf structure, vein patterns, and surface texture to authenticate species instantaneously.' },
              { icon: Zap, title: 'Phytochemical AI', desc: 'Correlates visual markers with historical potency data to estimate grading without destructive testing.' },
              { icon: Activity, title: 'Quality Grading', desc: 'Automatically sorts samples into Grade A, B, or C based on moisture damage or structural integrity.' },
              { icon: Shield, title: 'Contamination Alert', desc: 'Identifies foreign matter, fungal spots, and adulterants that traditional human inspection misses.' },
              { icon: Database, title: 'Seamless API', desc: 'Integrates directly with your existing supply chain software or LIMS via our ultra-fast RESTful API.' },
              { icon: Cpu, title: 'Edge Computing', desc: 'Run models locally on offline hardware in remote farms or dense jungle processing centers.' },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="liquid-glass p-2 rounded-3xl group hover:-translate-y-2 transition-transform duration-500 h-full">
                  <div className="bg-white/40 rounded-2xl p-8 h-full group-hover:bg-white/60 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-inner">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-3xl font-heading italic mb-3 tracking-tight text-emerald-900">{feature.title}</h3>
                    <p className="text-emerald-800/80 leading-relaxed text-sm font-medium">{feature.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="lab" className="py-32 px-6 max-w-5xl mx-auto relative">
          <ScrollReveal className="text-center mb-24">
            <h2 className="font-heading italic text-6xl tracking-tight">The Analysis Pipeline</h2>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-pink-300 to-transparent hidden md:block" />

            {[
              { step: '01', title: 'Sample Preparation', desc: 'Raw material is placed in a standardized lightbox environment to eliminate shadows and stabilize color representation.' },
              { step: '02', title: 'Microscopic Scanning', desc: 'High-fidelity macro lenses capture multispectral images, focusing on venation and surface anomalies.' },
              { step: '03', title: 'Neural Processing', desc: 'Gemini-powered models cross-reference the visual data against millions of botanical records.' },
              { step: '04', title: 'Quality Certification', desc: 'A verified digital certificate is generated in real-time, detailing the authenticated species and purity grade.' },
            ].map((item, i) => {
              const isEven = i % 2 === 0;
              return (
              <div key={i} className={`relative flex flex-col md:flex-row items-center mb-24 last:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.6)] z-10" 
                />
                
                <motion.div 
                  initial={{ x: isEven ? 60 : -60, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'} mb-8 md:mb-0`}
                >
                  <div className="liquid-glass p-10 rounded-[2.5rem]">
                    <span className="text-pink-500 text-sm font-black tracking-[0.25em] mb-4 inline-block bg-pink-100 px-3 py-1 rounded-full">PHASE {item.step}</span>
                    <h3 className="text-4xl font-heading italic mb-4 tracking-tight text-emerald-950">{item.title}</h3>
                    <p className="text-emerald-800/80 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Predictive Disease Spread Interface Component */}
        <section id="network" className="py-32 px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
          <ScrollReveal className="text-center mb-16 max-w-4xl mx-auto">
            <span className="text-pink-500 font-bold uppercase tracking-[0.25em] mb-4 block">Outbreak Early Warning System</span>
            <h2 className="font-heading italic text-6xl tracking-tight text-emerald-950 mb-6">Predictive Disease Spread Mapping</h2>
            <p className="text-emerald-800/80 font-medium text-lg text-balance">
              Every Amania scan logs disease signatures. Discover hyper-local infection zones before they reach your farm. This decentralized, farmer-to-farmer alert network is the first of its kind.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={handleSimulateContagiousScan}
                className="bg-rose-500/10 text-rose-700 border border-rose-500/30 px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                title="Simulate Amania AI detecting contagious Rice Blast"
              >
                <Zap className="w-4 h-4 text-rose-500" /> Amania Scan: Contagious Outbreak
              </button>

              <button 
                onClick={handleSimulateHealthyScan}
                className="bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                title="Simulate Amania AI detecting healthy crop (no map marking)"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Amania Scan: Healthy Field
              </button>
            </div>

            <p className="mt-4 text-xs font-semibold text-emerald-800/60 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              Connected to Amania AI • Only verified contagious infections create markings on the map
            </p>
          </ScrollReveal>

          <WeatherIntelligence userLocation={userLocation} />

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 h-[600px]">
              <ScrollReveal delay={0.2} className="h-full">
                <Suspense fallback={<div className="w-full h-full liquid-glass rounded-[2rem] animate-pulse"></div>}>
                   <DiseaseMap diseasePoints={diseasePoints} userLocation={userLocation} />
                </Suspense>
              </ScrollReveal>
            </div>
            
            <div className="lg:col-span-1 h-[600px]">
              <ScrollReveal delay={0.4} className="h-full">
                <Suspense fallback={<div className="w-full h-full liquid-glass rounded-[2rem] animate-pulse"></div>}>
                   <AlertNetwork alerts={alerts} />
                </Suspense>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <GovernmentSchemesHub />




        <footer className="border-t border-emerald-900/10 pt-24 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold tracking-[0.2em] uppercase text-sm text-emerald-900">BloomSense</span>
              </div>
              <h2 className="font-heading italic text-6xl md:text-7xl mb-10 leading-none tracking-tight text-emerald-950">Nature is calling.</h2>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md liquid-glass p-2 rounded-full relative">
                <AnimatePresence>
                  {subscribed && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute -top-10 left-0 right-0 text-center text-sm font-bold text-emerald-600 bg-white/80 py-1.5 px-4 rounded-full shadow-sm backdrop-blur-sm"
                    >
                      Thanks for subscribing! Check your inbox soon.
                    </motion.div>
                  )}
                </AnimatePresence>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your lab email" 
                  className="flex-1 bg-transparent px-6 py-3 text-sm outline-none placeholder:text-emerald-800/50 font-semibold text-emerald-950"
                  required
                />
                <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 min-w-[120px]">
                  {subscribed ? 'Subscribed ✓' : 'Subscribe'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-emerald-900/50 uppercase tracking-[0.25em] text-xs font-black mb-8">Technology</h4>
              <ul className="space-y-4 text-sm text-emerald-800 font-semibold">
                <li><Link to="/technology/hardware" className="hover:text-pink-500 transition-colors">Computer Vision</Link></li>
                <li><Link to="/technology/hardware" className="hover:text-pink-500 transition-colors">Phyto-AI Models</Link></li>
                <li><Link to="/technology/hardware" className="hover:text-pink-500 transition-colors">Edge Processing</Link></li>
                <li><Link to="/technology/hardware" className="hover:text-pink-500 transition-colors">Hardware Specs</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-emerald-900/50 uppercase tracking-[0.25em] text-xs font-black mb-8">Company</h4>
              <ul className="space-y-4 text-sm text-emerald-800 font-semibold">
                <li className="py-1">
                  <Link 
                    to="/about" 
                    className="inline-flex items-center gap-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 transition-all group lg:-ml-2"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    About the Project
                    <Sparkles className="w-3.5 h-3.5 text-white/90 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                  </Link>
                </li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Research Papers</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Careers</a></li>
                <li className="relative group/contact">
                  <a href="mailto:mishrac373@gmail.com" className="hover:text-pink-500 transition-colors">Contact</a>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-full bg-emerald-950 text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 scale-90 group-hover/contact:opacity-100 group-hover/contact:scale-100 transition-all duration-200 pointer-events-none select-none">
                    mishrac373@gmail.com
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-950"></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-emerald-900/10 text-sm font-semibold text-emerald-800/60">
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left mb-4 md:mb-0">
              <p>© 2026 BloomSense. All rights reserved.</p>
              <p className="text-pink-600/80 text-xs font-bold tracking-[0.1em] uppercase">Made by Chandra Prakash Mishra</p>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>

        {/* Modal Overlay for Amania AI Camera */}
        <AnimatePresence>
          {showAmaniaCamera && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="liquid-glass-strong w-full max-w-4xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col bg-white"
              >
                <div className="px-8 py-4 border-b border-emerald-900/10 flex justify-between items-center bg-white/80 z-10 backdrop-blur-md absolute top-0 left-0 right-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 translate="no" className="font-heading italic text-2xl tracking-tight text-emerald-950 leading-none notranslate">Amania AI</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1">Botanical Analysis Mode</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowAmaniaCamera(false);
                        setShowVoiceModal(true);
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 transition-colors shadow-sm"
                      title="Switch to Voice AI Conversation"
                    >
                      <Mic className="w-3.5 h-3.5 text-pink-500" />
                      <span>Voice Conversation Mode</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowAmaniaCamera(false)}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors border border-emerald-100 shadow-sm"
                    >
                      <X className="w-6 h-6 text-emerald-900/60" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full h-full pt-[73px]">
                  <iframe 
                    src="https://cpmishra.lovable.app" 
                    allow="camera; microphone" 
                    className="w-full h-full border-0"
                    title="Amania AI Interface"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full-Duplex Amania AI Voice Modal */}
        <AmaniaVoiceModal 
          isOpen={showVoiceModal} 
          onClose={() => setShowVoiceModal(false)} 
          onContagiousOutbreakDetected={(text) => {
            processAmaniaScanResult({
              disease: text.toLowerCase().includes('blast') ? 'Rice Blast (Voice Report)' : 'Bacterial Blight (Voice Report)',
              severity: 'high',
              isContagious: true,
              confidence: 93
            });
          }}
        />

        <AnimatePresence>
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onGuestLogin={() => { setIsGuestMode(true); setShowAuthModal(false); setShowAmaniaCamera(true); }} />}
        </AnimatePresence>

        <InstallBanner />

        {/* Phase 4: Custom Push Notification Toast */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-[300] bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_40px_rgba(225,29,72,0.2)] border-l-[6px] border-l-rose-500 border-y border-r border-emerald-100 flex gap-4 pr-12 max-w-sm"
            >
              <button 
                onClick={() => setActiveToast(null)} 
                className="absolute top-2 right-2 text-emerald-900/40 hover:text-emerald-900 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-emerald-50"
              >
                <X size={16}/>
              </button>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 relative">
                <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20 hidden"></div>
                <Bell className="w-5 h-5 text-rose-600 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600 block mb-1">Emergency Push Alert</span>
                <h4 className="font-heading italic text-xl text-emerald-950 leading-tight mb-1">{activeToast.disease} Found</h4>
                <p className="text-xs text-emerald-800/80 font-medium leading-relaxed">A high-risk mapping hit was just logged locally. Check the Network Map immediately.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // Global Language Localization using Google Translate API
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      addScript.async = true;
      document.body.appendChild(addScript);
      
      window.googleTranslateElementInit = () => {
        window.isGoogleTranslateLoaded = true;
        window.dispatchEvent(new Event('google-translate-loaded'));
      };
    }
  }, []);

  useEffect(() => {
    const initTranslate = () => {
      if (window.google && window.google.translate) {
        const containers = ['google_translate_element'];
        containers.forEach(id => {
          const el = document.getElementById(id);
          if (el && el.innerHTML === '') {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,or,ml,pa,as,id',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            }, id);
          }
        });
      }
    };

    if (window.isGoogleTranslateLoaded) {
      setTimeout(initTranslate, 300);
    } else {
      window.addEventListener('google-translate-loaded', () => setTimeout(initTranslate, 300));
    }
  }, [location]);

  return (
    <div className="w-full min-h-screen bg-pink-50 text-emerald-950">
      <Suspense fallback={<div className="h-screen w-full bg-pink-50 flex flex-col items-center justify-center animate-pulse"><Leaf className="w-12 h-12 text-emerald-600 mb-4" /><p className="text-emerald-800 font-bold uppercase tracking-[0.2em] text-sm">Loading BloomSense...</p></div>}>
        <RobotGuide />
        <KisanEmergencyBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technology/hardware" element={<Hardware />} />
          <Route path="/community" element={<Community />} />
          <Route path="/calendar" element={<CropCalendar />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </div>
  );
}
