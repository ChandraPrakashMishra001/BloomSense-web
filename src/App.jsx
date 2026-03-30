import React, { useState, useMemo, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { 
  Leaf, ArrowUpRight, Play, Zap, Shield, Microscope, 
  Cpu, Cloud, Database, Scan, Beaker, ChevronDown, 
  Layers, Focus, Activity, X, Loader2, CheckCircle, AlertTriangle, Search, Sparkles, Map, Bell, LogIn, LogOut, Menu
} from 'lucide-react';
import DiseaseMap from './components/DiseaseMap';
import AlertNetwork from './components/AlertNetwork';
import AuthModal from './components/AuthModal';
import WeatherIntelligence from './components/WeatherIntelligence';
import { Routes, Route, Link } from 'react-router-dom';
const Hardware = lazy(() => import('./pages/Hardware'));

const initialAlerts = [
  { id: 1, disease: 'Rice Blast', distance: '1.2', farmCount: 4, timeAgo: '2h ago', severity: 'high' },
  { id: 2, disease: 'Bacterial Leaf Blight', distance: '3.5', farmCount: 2, timeAgo: '5h ago', severity: 'medium' },
  { id: 3, disease: 'Brown Spot', distance: '4.8', farmCount: 1, timeAgo: '1d ago', severity: 'medium' }
];

const initialDiseasePoints = [
  { lat: 21.4669, lng: 83.9812, disease: 'Rice Blast', severity: 'high', intensity: 0.91, confidence_score: 91, radius: 1500, timestamp: new Date('2026-03-20T08:23:00').getTime() },
  { lat: 21.4721, lng: 83.9756, disease: 'Rice Blast', severity: 'medium', intensity: 0.88, confidence_score: 88, radius: 1200, timestamp: new Date('2026-03-21T09:15:00').getTime() },
  { lat: 21.4598, lng: 83.9901, disease: 'Brown Plant Hopper', severity: 'low', intensity: 0.79, confidence_score: 79, radius: 1300, timestamp: new Date('2026-03-22T07:44:00').getTime() },
  { lat: 20.4625, lng: 85.8830, disease: 'Sheath Blight', severity: 'medium', intensity: 0.85, confidence_score: 85, radius: 1100, timestamp: new Date('2026-03-22T10:30:00').getTime() },
  { lat: 20.4701, lng: 85.8912, disease: 'Sheath Blight', severity: 'medium', intensity: 0.82, confidence_score: 82, radius: 1400, timestamp: new Date('2026-03-23T08:10:00').getTime() },
  { lat: 20.4550, lng: 85.8778, disease: 'Leaf Folder', severity: 'low', intensity: 0.77, confidence_score: 77, radius: 900, timestamp: new Date('2026-03-23T11:22:00').getTime() },
  { lat: 20.2961, lng: 85.8189, disease: 'Powdery Mildew', severity: 'medium', intensity: 0.83, confidence_score: 83, radius: 1600, timestamp: new Date('2026-03-24T09:05:00').getTime() },
  { lat: 20.3021, lng: 85.8245, disease: 'Bacterial Blight', severity: 'high', intensity: 0.90, confidence_score: 90, radius: 1700, timestamp: new Date('2026-03-24T14:33:00').getTime() },
  { lat: 20.7167, lng: 83.4833, disease: 'Rice Blast', severity: 'high', intensity: 0.93, confidence_score: 93, radius: 1900, timestamp: new Date('2026-03-25T07:55:00').getTime() },
  { lat: 20.7210, lng: 83.4901, disease: 'Stem Rot', severity: 'medium', intensity: 0.81, confidence_score: 81, radius: 1200, timestamp: new Date('2026-03-25T10:18:00').getTime() },
  { lat: 18.8135, lng: 82.7110, disease: 'Late Blight', severity: 'medium', intensity: 0.87, confidence_score: 87, radius: 1600, timestamp: new Date('2026-03-26T08:40:00').getTime() },
  { lat: 18.8190, lng: 82.7055, disease: 'Leaf Curl', severity: 'low', intensity: 0.76, confidence_score: 76, radius: 1000, timestamp: new Date('2026-03-26T12:15:00').getTime() },
  { lat: 21.9522, lng: 86.7322, disease: 'Rice Blast', severity: 'medium', intensity: 0.89, confidence_score: 89, radius: 1400, timestamp: new Date('2026-03-27T07:30:00').getTime() },
  { lat: 21.9478, lng: 86.7401, disease: 'Brown Spot', severity: 'medium', intensity: 0.84, confidence_score: 84, radius: 1300, timestamp: new Date('2026-03-27T09:45:00').getTime() },
  { lat: 19.3870, lng: 84.9750, disease: 'Downy Mildew', severity: 'medium', intensity: 0.80, confidence_score: 80, radius: 1500, timestamp: new Date('2026-03-28T08:20:00').getTime() },
  { lat: 19.3920, lng: 84.9810, disease: 'Fusarium Wilt', severity: 'medium', intensity: 0.86, confidence_score: 86, radius: 1100, timestamp: new Date('2026-03-28T11:05:00').getTime() },
  { lat: 22.1167, lng: 84.0333, disease: 'Rice Blast', severity: 'high', intensity: 0.92, confidence_score: 92, radius: 1800, timestamp: new Date('2026-03-29T07:15:00').getTime() },
  { lat: 22.1210, lng: 84.0389, disease: 'Neck Rot', severity: 'low', intensity: 0.78, confidence_score: 78, radius: 1200, timestamp: new Date('2026-03-29T10:30:00').getTime() },
  { lat: 19.8135, lng: 85.8312, disease: 'Bacterial Leaf Blight', severity: 'medium', intensity: 0.88, confidence_score: 88, radius: 1600, timestamp: new Date('2026-03-29T08:55:00').getTime() },
  { lat: 19.8190, lng: 85.8278, disease: 'Sheath Blight', severity: 'medium', intensity: 0.83, confidence_score: 83, radius: 1300, timestamp: new Date('2026-03-29T13:20:00').getTime() }
];

const AmaniaChatbot = React.memo(() => {
  useEffect(() => {
    if (document.querySelector('script[src="https://cpmishra.lovable.app/embed.js"]')) {
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cpmishra.lovable.app/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
});

const AmaniaBadge = React.memo(() => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-[60] flex items-center gap-3 liquid-glass px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-all shadow-xl hover:shadow-pink-500/20 border border-pink-200/50 bg-white/40"
  >
    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-inner">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="flex flex-col justify-center pr-3">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-800/60 leading-none mb-1">Powered By</span>
      <span className="font-heading italic text-2xl bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent leading-none">Amania AI</span>
    </div>
  </motion.div>
));

const floraDatabase = [
  {
    id: 1,
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    image: "/ashwagandha.webp",
    properties: ["Adaptogenic", "Anti-inflammatory", "Stress Relief"],
    diseasesTargeted: ["Insomnia", "Anxiety", "Arthritis"],
    cures: "Used to lower cortisol levels and improve brain function. Often consumed as a root powder mixed with warm milk.",
  },
  {
    id: 2,
    name: "Tulsi (Holy Basil)",
    scientificName: "Ocimum tenuiflorum",
    image: "/tulsi.webp",
    properties: ["Antibacterial", "Antiviral", "Immunity Booster"],
    diseasesTargeted: ["Common Cold", "Asthma", "Fever"],
    cures: "Leaves are boiled in water to extract essential oils, acting as a powerful expectorant for respiratory illnesses.",
  },
  {
    id: 3,
    name: "Neem",
    scientificName: "Azadirachta indica",
    image: "/neem.webp",
    properties: ["Antifungal", "Blood Purifier", "Detoxifying"],
    diseasesTargeted: ["Acne", "Eczema", "Dental Plaque"],
    cures: "Neem paste is applied directly to the skin to cure fungal infections and acne. Chewing twigs improves oral hygiene.",
  },
  {
    id: 4,
    name: "Brahmi",
    scientificName: "Bacopa monnieri",
    image: "/brahmi.webp",
    properties: ["Nootropic", "Antioxidant", "Neuroprotective"],
    diseasesTargeted: ["Memory Loss", "ADHD", "Anxiety"],
    cures: "Enhances cognitive function and memory retention. Extracted as an oil for scalp massage or consumed as a dietary supplement.",
  },
  {
    id: 5,
    name: "Turmeric",
    scientificName: "Curcuma longa",
    image: "/turmeric.webp",
    properties: ["Curcumin", "Anti-inflammatory", "Antioxidant"],
    diseasesTargeted: ["Joint Pain", "Digestive Issues", "Wounds"],
    cures: "Curcumin compound reduces inflammation at the molecular level. Applied topically to wounds for rapid healing.",
  },
  {
    id: 6,
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    image: "/aloe vera.webp",
    properties: ["Hydrating", "Healing", "Antimicrobial"],
    diseasesTargeted: ["Sunburn", "Psoriasis", "Acid Reflux"],
    cures: "The clear gel inside the leaves provides instant relief for burns and skin irritations. Juice aids in digestive health.",
  },
  {
    id: 7,
    name: "Peppermint",
    scientificName: "Mentha piperita",
    image: "/peppermint.webp",
    properties: ["Cooling", "Digestive", "Antibacterial"],
    diseasesTargeted: ["IBS", "Headaches", "Nausea"],
    cures: "Menthol compound soothes upset stomachs and provides relief for tension headaches when applied as oil.",
  },
  {
    id: 8,
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    image: "/lavender.webp",
    properties: ["Calming", "Sedative", "Antiseptic"],
    diseasesTargeted: ["Insomnia", "Anxiety", "Restlessness"],
    cures: "Widely used in aromatherapy and sleep aids due to its profound soothing and nervous system-regulating effects.",
  },
  {
    id: 9,
    name: "Ginger",
    scientificName: "Zingiber officinale",
    image: "/ginger.webp",
    properties: ["Anti-nausea", "Anti-inflammatory", "Warming"],
    diseasesTargeted: ["Motion Sickness", "Morning Sickness", "Osteoarthritis"],
    cures: "Contains gingerol, a substance with powerful anti-inflammatory and antioxidant properties, used to treat all forms of nausea.",
  },
  {
    id: 10,
    name: "Ginseng",
    scientificName: "Panax ginseng",
    image: "https://images.unsplash.com/photo-1528659556209-66c10ff5fb82?auto=format&fit=crop&q=80&w=800",
    properties: ["Energy Boosting", "Cognitive", "Immune Booster"],
    diseasesTargeted: ["Fatigue", "Brain Fog", "Weak Immunity"],
    cures: "Revered in traditional medicine for giving a sustained energy lift without jitters and bolstering white blood cell function.",
  },
  {
    id: 11,
    name: "Echinacea",
    scientificName: "Echinacea purpurea",
    image: "/echinacea.webp",
    properties: ["Immune Stimulant", "Antiviral", "Pain Relief"],
    diseasesTargeted: ["Common Cold", "Upper Respiratory Infections", "Sore Throat"],
    cures: "Increases the number of white blood cells which fight infections; heavily utilized preventatively during flu seasons.",
  },
  {
    id: 12,
    name: "Chamomile",
    scientificName: "Matricaria chamomilla",
    image: "https://images.unsplash.com/photo-1621217631317-a169b50ceba7?auto=format&fit=crop&q=80&w=800",
    properties: ["Relaxing", "Spasmolytic", "Anti-inflammatory"],
    diseasesTargeted: ["Sleeplessness", "Muscle Spasms", "Skin Irritation"],
    cures: "Apigenin, a natural antioxidant in the flower, binds to specific brain receptors that decrease anxiety and initiate sleep.",
  }
];

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
  const elements = useMemo(() => Array.from({ length: 45 }).map((_, i) => ({
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

const FloraArchive = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => document.body.style.overflow = 'unset';
  }, [selectedImage]);

  const filteredPlants = floraDatabase.filter(plant => {
    if (searchTerm.trim() === "") {
      return plant.id <= 6; // Only show the main featured plants when not searching
    }
    return plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plant.diseasesTargeted.some(disease => disease.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <section id="flora" className="py-32 px-6 lg:px-12 max-w-[1400px] mx-auto z-10 relative">
      <ScrollReveal className="text-center mb-16">
        <h2 className="font-heading italic text-6xl tracking-tight mb-8 text-emerald-950">Botanical Archive</h2>
        
        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 opacity-70 group-hover:opacity-100 transition-opacity" />
          <input 
            type="text" 
            placeholder="Search by plant name or disease (e.g., Anxiety)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full liquid-glass rounded-full pl-14 pr-6 py-4 text-emerald-950 placeholder:text-emerald-800/50 outline-none focus:bg-white/80 transition-colors border border-emerald-900/10 shadow-lg font-body font-semibold"
          />
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredPlants.map((plant, i) => (
            <motion.div 
              key={plant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="liquid-glass rounded-3xl overflow-hidden group border border-emerald-200/50 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500"
            >
              <div 
                className="h-56 overflow-hidden relative border-b border-emerald-900/5 cursor-pointer group/img"
                onClick={() => setSelectedImage(plant)}
              >
                <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-90 group-hover/img:scale-100 transition-transform">
                    <Scan className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-50 via-pink-50/20 to-transparent" />
                <h3 className="absolute bottom-4 left-6 font-heading italic text-4xl text-emerald-950 drop-shadow-sm">{plant.name}</h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-5 bg-white/40">
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.2em]">{plant.scientificName}</p>
                
                <div>
                  <h4 className="text-emerald-800/50 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Key Properties</h4>
                  <div className="flex flex-wrap gap-2">
                    {plant.properties.map(prop => (
                      <span key={prop} className="text-xs border border-emerald-500/20 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-emerald-800/50 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Treats</h4>
                  <p className="text-sm text-emerald-900 font-bold">{plant.diseasesTargeted.join(", ")}</p>
                </div>

                <div className="mt-auto pt-5 border-t border-emerald-900/10">
                  <p className="text-sm text-emerald-800/80 leading-relaxed font-semibold">
                    {plant.cures}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredPlants.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center text-emerald-800/50 py-12 font-body text-lg font-bold"
        >
          No botanical records found matching "{searchTerm}".
        </motion.div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/70 backdrop-blur-md p-4 md:p-8 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[95vh] overflow-y-auto flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-emerald-200/50 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)} 
                className="absolute top-5 right-5 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-md text-emerald-900 transition-transform hover:scale-110 z-30 shadow-lg border border-emerald-100"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-full relative bg-pink-50/50 flex items-center justify-center min-h-[30vh]">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.name} 
                  className="w-full max-h-[50vh] object-contain p-4"
                />
              </div>
              
              <div className="px-8 py-6 text-center w-full bg-white border-t border-emerald-50 relative z-20">
                <span className="text-pink-500 font-bold uppercase tracking-[0.2em] text-xs mb-1 block">{selectedImage.scientificName}</span>
                <h3 className="font-heading italic text-4xl text-emerald-950 mb-3">{selectedImage.name}</h3>
                <p className="text-sm text-emerald-800/80 font-medium max-w-2xl mx-auto">{selectedImage.cures}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.05]);


  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showAmaniaCamera, setShowAmaniaCamera] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [diseasePoints, setDiseasePoints] = useState(initialDiseasePoints);
  const [userLocation, setUserLocation] = useState(null);

  // Phase 3: Authentication
  const [user, setUser] = useState(null);
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

  // Phase 5: Regional Odia Localization using Google Translate API
  useEffect(() => {
    // Avoid re-injecting script heavily on hot reloads
    if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      addScript.async = true;
      document.body.appendChild(addScript);
      
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,or', // English, Hindi, Odia
          autoDisplay: false
        }, 'google_translate_element');
      };
    }
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

  const handleSimulateScan = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Drop the pin using the user's ACTUAL real-world GPS coordinates!
    const baseLat = userLocation ? userLocation.lat : 20.2961;
    const baseLng = userLocation ? userLocation.lng : 85.8245;

    // Add a slight jitter to simulate scanning a neighboring farm 
    const lat = baseLat + (Math.random() - 0.5) * 0.08;
    const lng = baseLng + (Math.random() - 0.5) * 0.08;

    // Push the disease detection to the unified Global Firebase Database!
    await addDoc(collection(db, 'diseasePoints'), {
      lat,
      lng,
      disease: 'Rice Blast (Local)',
      severity: 'high',
      intensity: 0.6 + Math.random() * 0.3,
      timestamp: Date.now(),
      radius: 800 + Math.random() * 800
    });

    // Broadcast the alert to the feed globally across all devices instantly!
    await addDoc(collection(db, 'alerts'), {
      disease: 'Rice Blast',
      severity: 'high',
      farmCount: 1,
      lat,
      lng,
      timestamp: Date.now()
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
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowAmaniaCamera(true);
  };



  return (
    <div className="bg-pink-50 min-h-screen text-emerald-950 selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden font-body leaf-pattern-bg">


      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex justify-between items-center bg-pink-50/80 backdrop-blur-md border-b border-emerald-900/10 shadow-sm transition-all duration-300">
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-2 xl:gap-6">
          <div className="flex items-center gap-4">
            <button className="liquid-glass w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-sm border border-emerald-200/50">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </button>
            <div className="flex flex-col drop-shadow-sm">
              <span className="font-heading italic text-3xl md:text-4xl text-emerald-950 leading-none">BloomSense</span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-800/70 mt-1 pl-1 hidden sm:block">A part of Neural Leaf</span>
            </div>
          </div>
          {/* Phase 5: Regional Localization Google Context */}
          <div id="google_translate_element" className="google-translate-container min-h-[36px]"></div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 p-1.5 rounded-full liquid-glass">
          {['Home', 'Technology', 'Hardware', 'Network', 'Flora'].map((item) => (
            item === 'Hardware' ? (
              <Link key={item} to="/technology/hardware" className="px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors tracking-wide">
                Hardware Specs
              </Link>
            ) : (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors tracking-wide">
                {item}
              </a>
            )
          ))}
          
          {user ? (
            <button onClick={() => signOut(auth)} className="px-5 py-2.5 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors tracking-wide flex items-center gap-2">
              Log Out
            </button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="px-5 py-2.5 text-sm font-bold text-emerald-900 hover:text-emerald-950 transition-colors tracking-wide flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Log In
            </button>
          )}

          <button onClick={handleScanClick} className="bg-emerald-600/90 text-white px-7 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30">
            Scan Sample <ArrowUpRight className="w-4 h-4" />
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
          <button onClick={handleScanClick} className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors">
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
              {['Home', 'Technology', 'Hardware', 'Network', 'Flora'].map((item) => (
                item === 'Hardware' ? (
                  <Link key={item} to="/technology/hardware" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                    Hardware Specs
                  </Link>
                ) : (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-heading italic text-emerald-950 border-b border-emerald-900/10 pb-4 tracking-wide">
                    {item}
                  </a>
                )
              ))}
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
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-pink-50">
          <AmaniaBadge />
          {showAnimation && <MixedFlora />}

          <motion.div 
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0 w-full h-full z-0 bg-[url('/bg.webp')] bg-cover bg-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-pink-50/40 to-emerald-50/90 pointer-events-none" />
          </motion.div>

          <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
            <h1 className="font-heading italic text-4xl md:text-5xl lg:text-7xl tracking-tight text-balance leading-[0.9] mb-6 text-emerald-950 text-shadow-sm">
              <BlurText text="Decode Nature's Secrets with Precision AI" />
            </h1>
            
            <ScrollReveal delay={0.2}>
              <p className="text-base md:text-lg text-emerald-800/90 font-body leading-relaxed max-w-2xl mx-auto mb-10 text-balance font-medium">
                Advanced computer vision meets traditional phytochemistry. Ensure the quality, potency, and purity of herbal medicines with unparalleled microscopic accuracy in a bright, modern ecosystem.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={handleScanClick} className="bg-emerald-600 text-white px-12 py-5 rounded-full text-lg font-extrabold flex items-center gap-3 hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-600/30">
                Initiate Analysis <Scan className="w-5 h-5" />
              </button>
            </ScrollReveal>
          </div>
        </section>

        <FloraArchive />

        <section id="technology" className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <Link to="/technology/hardware" className="block relative h-[400px] md:h-[650px] rounded-[2.5rem] liquid-glass overflow-hidden border border-emerald-900/10 shadow-xl group cursor-pointer lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1600&auto=format&fit=crop" 
                alt="Pink and Green Leaf Pattern Botanical" 
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
            
            <button 
              onClick={handleSimulateScan}
              className="mt-8 bg-pink-500/10 text-pink-600 border border-pink-500/30 px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-pink-500 hover:text-white transition-all mx-auto shadow-sm"
            >
              <Zap className="w-4 h-4" /> Simulate Local Scan Detection
            </button>
          </ScrollReveal>

          <WeatherIntelligence userLocation={userLocation} />

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 h-[600px]">
              <ScrollReveal delay={0.2} className="h-full">
                <DiseaseMap diseasePoints={diseasePoints} />
              </ScrollReveal>
            </div>
            
            <div className="lg:col-span-1 h-[600px]">
              <ScrollReveal delay={0.4} className="h-full">
                <AlertNetwork alerts={alerts} />
              </ScrollReveal>
            </div>
          </div>
        </section>

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
                <li><a href="#" className="hover:text-pink-500 transition-colors">About Project</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Research Papers</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Contact</a></li>
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
                      <h3 className="font-heading italic text-2xl tracking-tight text-emerald-950 leading-none">Amania AI</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1">Botanical Analysis Mode</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAmaniaCamera(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors border border-emerald-100 shadow-sm"
                  >
                    <X className="w-6 h-6 text-emerald-900/60" />
                  </button>
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



        <AnimatePresence>
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </AnimatePresence>

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

        {/* Adds Amania AI globally */}
        <AmaniaChatbot />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-pink-50 flex flex-col items-center justify-center animate-pulse"><Leaf className="w-12 h-12 text-emerald-600 mb-4" /><p className="text-emerald-800 font-bold uppercase tracking-[0.2em] text-sm">Loading Environment...</p></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technology/hardware" element={<Hardware />} />
      </Routes>
    </Suspense>
  );
}
