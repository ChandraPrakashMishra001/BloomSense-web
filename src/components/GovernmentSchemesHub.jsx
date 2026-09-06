import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Sparkles, Loader2, RefreshCw, Clock, ExternalLink, 
  PhoneCall, FileText, CheckCircle2, ShieldCheck, Calculator, 
  ChevronRight, Volume2, VolumeX, Search, X, Award, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { safeSpeak, safeStopSpeech, isSpeechAvailable } from '../utils/speechUtils';

const SCHEME_CATEGORIES = [
  { id: 'all', label: '🌟 All Schemes' },
  { id: 'Price Support', label: '🌾 MSP & Price Support' },
  { id: 'Direct Benefit', label: '💰 Direct Cash Transfer' },
  { id: 'Insurance', label: '🛡️ Crop Loss Insurance' },
  { id: 'Machinery', label: '🚜 Tractor & Machinery Subsidy' },
  { id: 'Solar & Irrigation', label: '☀️ Solar Pump & Water' },
  { id: 'Credit', label: '💳 4% Kisan Credit (KCC)' }
];

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Deadline: 'bg-amber-50 text-amber-700 border-amber-200',
  New: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function GovernmentSchemesHub({ onAskAmania }) {
  const [schemes, setSchemes] = useState([]);
  const [ticker, setTicker] = useState("⚡ Odisha: ₹3,100/Quintal Paddy Procurement active for Kharif 2026 | PM-KISAN 18th DBT installment live | CM-KISAN ₹4,000 annual transfer to 51 lakh families | 50% to 80% Subsidy on Farm Machinery & Solar Pumps");
  const [lastUpdated, setLastUpdated] = useState("August 2026");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [speakingSchemeId, setSpeakingSchemeId] = useState(null);
  
  // Eligibility Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calcState, setCalcState] = useState({
    region: 'odisha',
    landSize: 'marginal', // 'marginal' (< 2 Ha), 'landless', 'large'
    crop: 'paddy', // 'paddy', 'millets', 'vegetables'
    needEquipment: 'yes'
  });
  const [calcResult, setCalcResult] = useState(null);

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/data/schemes.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.schemes && data.schemes.length > 0) setSchemes(data.schemes);
        if (data.ticker) setTicker(data.ticker);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.warn("Using default scheme data:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // Audio Speech synthesis for scheme details with cross-browser support
  const handleToggleSpeech = (scheme, e) => {
    if (e) e.stopPropagation();
    if (!isSpeechAvailable()) return;

    if (speakingSchemeId === scheme.id) {
      safeStopSpeech();
      setSpeakingSchemeId(null);
      return;
    }

    safeStopSpeech();
    const textToSpeak = `${scheme.nameEn}. In Odia: ${scheme.nameOr || ''}. Benefit: ${scheme.benefit}. Financial support: ${scheme.subsidyAmount || ''}. Eligibility: ${scheme.eligibility || ''}. Required documents: ${scheme.documents ? scheme.documents.join(', ') : 'Aadhaar and Land Record'}. Helpline: ${scheme.helpline || '1800-180-1551'}.`;
    
    setSpeakingSchemeId(scheme.id);
    safeSpeak(textToSpeak, {
      lang: 'en-IN',
      rate: 0.94,
      pitch: 1.14,
      onStart: () => setSpeakingSchemeId(scheme.id),
      onEnd: () => setSpeakingSchemeId(null),
      onError: () => setSpeakingSchemeId(null)
    });
  };

  // Sync with global speech stop events
  useEffect(() => {
    const handleStopped = () => setSpeakingSchemeId(null);
    window.addEventListener('bloomsense-speech-stopped', handleStopped);
    return () => {
      window.removeEventListener('bloomsense-speech-stopped', handleStopped);
      safeStopSpeech();
    };
  }, []);

  // Stop scheme voice if modal is closed or changed
  useEffect(() => {
    if (!selectedScheme && speakingSchemeId) {
      safeStopSpeech();
      setSpeakingSchemeId(null);
    }
  }, [selectedScheme]);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        scheme.nameEn.toLowerCase().includes(q) ||
        (scheme.nameOr && scheme.nameOr.includes(searchQuery)) ||
        (scheme.nameHi && scheme.nameHi.includes(searchQuery)) ||
        scheme.benefit.toLowerCase().includes(q) ||
        (scheme.subsidyAmount && scheme.subsidyAmount.toLowerCase().includes(q)) ||
        (scheme.eligibility && scheme.eligibility.toLowerCase().includes(q))
      );
    });
  }, [schemes, selectedCategory, searchQuery]);

  // Calculate Eligibility
  const handleCalculate = () => {
    let directCash = 0;
    let schemesMatched = [];
    let highlights = [];

    // PM-KISAN
    if (calcState.landSize !== 'landless') {
      directCash += 6000;
      schemesMatched.push("PM-KISAN (₹6,000/yr)");
    }

    // Odisha CM-KISAN
    if (calcState.region === 'odisha') {
      directCash += 4000;
      schemesMatched.push("Odisha CM-KISAN (₹4,000/yr)");
    }

    // Crop specific
    if (calcState.crop === 'paddy' && calcState.region === 'odisha') {
      highlights.push("Assured Paddy Procurement @ ₹3,100/Quintal under Samrudha Krushaka Yojana");
    } else if (calcState.crop === 'millets') {
      highlights.push("₹10,000 to ₹14,000/Ha direct incentive under Shree Anna Abhiyan (Millets Mission)");
    }

    // Equipment & Solar
    if (calcState.needEquipment === 'yes') {
      highlights.push("50% to 80% Subsidy on Tractors & Implements (SMAM)");
      highlights.push("60% to 90% Financial Subsidy on Solar Irrigation Pumps (PM-KUSUM / Jalanidhi)");
    }

    highlights.push("Kisan Credit Card (KCC) collateral-free crop loan up to ₹1.6 Lakh @ 4% Interest");
    highlights.push("PMFBY Crop Loss Insurance @ 2% nominal premium");

    setCalcResult({
      totalDirectTransfer: directCash > 0 ? `₹${directCash.toLocaleString('en-IN')}/year` : "Eligible for Landless Input Subsidies",
      schemesMatched,
      highlights
    });
  };

  const tickerItems = ticker.split(' | ');

  return (
    <section id="support-hub" className="py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">

      {/* Ambient background lighting */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-emerald-300/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-pink-300/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Outer Section Card */}
      <div className="relative rounded-[2.5rem] border border-emerald-200/70 bg-white/70 backdrop-blur-xl shadow-2xl shadow-emerald-900/5 overflow-hidden p-6 sm:p-10">

        {/* Section Header */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-full px-4 py-1.5 shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-800 text-xs font-extrabold uppercase tracking-[0.2em]">National & State Portals</span>
          </div>

          <h2 className="font-heading italic text-4xl sm:text-6xl tracking-tight text-emerald-950">
            Sovereign Farmer Support Hub
          </h2>

          <p className="text-emerald-800/80 text-xs sm:text-sm font-semibold max-w-2xl mx-auto mt-3 leading-relaxed">
            Direct access to verified government subsidies, ₹3,100/Qtl paddy price support, PM-KISAN, CM-KISAN, solar irrigation, and 24/7 Kisan emergency helplines.
          </p>

          {/* Sync Timestamp & Eligibility Button */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-emerald-700/70 text-xs font-bold uppercase tracking-wider bg-emerald-50/60 px-3 py-1 rounded-full border border-emerald-100">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified: {lastUpdated}</span>
            </div>

            <button
              onClick={() => { setIsCalculatorOpen(true); handleCalculate(); }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Check My Subsidy Eligibility</span>
            </button>
          </div>
        </div>

        {/* Live Broadcast Ticker */}
        <div className="w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-800 text-emerald-100 py-3 rounded-2xl overflow-hidden flex items-center shadow-lg shadow-emerald-950/20 mb-8 relative">
          <div className="flex w-max animate-marquee relative z-10 px-4">
            {Array.from({ length: 3 }).flatMap((_, repeatIdx) =>
              tickerItems.map((item, i) => (
                <span key={`${repeatIdx}-${i}`} className="flex items-center mx-6 font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap">
                  <Zap className="w-4 h-4 text-pink-400 mr-2 flex-shrink-0" />
                  <span className="text-emerald-50">{item.trim()}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 opacity-70" />
            <input
              type="text"
              placeholder="Search scheme name or benefit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-emerald-200/80 rounded-full pl-10 pr-4 py-2 text-xs font-semibold text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:border-emerald-500 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-700">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar w-full md:w-auto">
            {SCHEME_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                    : 'bg-emerald-50/80 text-emerald-900/80 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            <span className="text-emerald-800 font-bold text-sm">Syncing latest government budget schemes...</span>
          </div>
        )}

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
          {filteredSchemes.map((scheme, i) => (
            <motion.div 
              key={scheme.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass card-luxury-hover p-6 rounded-3xl border border-emerald-200/70 flex flex-col h-full bg-white/85 shadow-sm relative cursor-pointer"
              onClick={() => setSelectedScheme(scheme)}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                  {scheme.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleToggleSpeech(scheme, e)}
                    title={speakingSchemeId === scheme.id ? "Stop Speech" : "Listen to Scheme Details"}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      speakingSchemeId === scheme.id 
                        ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {speakingSchemeId === scheme.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusStyles[scheme.status] || 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {scheme.status}
                  </span>
                </div>
              </div>

              {/* Title & Vernacular Name */}
              <h3 className="text-xl font-heading italic text-emerald-950 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                {scheme.nameEn}
              </h3>
              {scheme.nameOr && (
                <p className="text-xs font-bold text-pink-700 mb-2">{scheme.nameOr}</p>
              )}

              {/* Subsidy Highlight Badge */}
              {scheme.subsidyAmount && (
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">Financial Benefit</span>
                  <span className="text-xs font-black text-emerald-950">{scheme.subsidyAmount}</span>
                </div>
              )}
              
              {/* Benefit Summary */}
              <p className="text-emerald-900/80 font-medium text-xs leading-relaxed flex-1 mb-4 line-clamp-3">
                {scheme.benefit}
              </p>
              
              {/* Action Buttons */}
              <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2 mt-auto">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:underline">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {scheme.portalUrl && (
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title="Open Official Government Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 24/7 Sovereign Farmer Helplines Directory */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-pink-50 p-6 border border-emerald-200/80 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PhoneCall className="w-4 h-4 text-emerald-700 animate-bounce" />
                <h4 className="font-heading italic text-xl sm:text-2xl text-emerald-950">24/7 Kisan Emergency & Subsidy Helplines</h4>
              </div>
              <p className="text-xs text-emerald-800/80 font-semibold">Toll-free direct government assistance for crop insurance, DBT queries, and agri-loans.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a 
                href="tel:18001801551" 
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-emerald-200 shadow-sm hover:shadow-md text-emerald-950 text-xs font-bold transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kisan Call Centre: <strong>1800-180-1551</strong></span>
              </a>

              <a 
                href="tel:155261" 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 text-xs font-bold transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Odisha CM-Kisan: <strong>155261</strong></span>
              </a>
            </div>
          </div>
        </div>

        {/* Personalized Amania AI Advice Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="liquid-glass max-w-2xl mx-auto rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 border border-pink-200 shadow-xl shadow-pink-900/5 bg-gradient-to-br from-white/90 to-pink-50/70 relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-inner flex-shrink-0 mt-1 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="font-heading italic text-xl text-emerald-950">Amania AI Support Advisor</span>
              <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest border border-pink-200">Active</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-900/80 leading-relaxed mb-3">
              Need help verifying eligibility or filing an application for Odisha Paddy MSP (₹3,100/Qtl) or PM-KISAN?
            </p>
            <button
              onClick={() => onAskAmania?.("Tell me about government schemes, PM-KISAN, and Odisha ₹3,100 paddy MSP")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-full shadow-sm transition-all cursor-pointer"
            >
              <span>Ask Amania Voice AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Modal 1: Scheme Detail & Document Checklist Modal ── */}
      <AnimatePresence>
        {selectedScheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-950/70 backdrop-blur-md p-4 sm:p-6 cursor-pointer"
            onClick={() => setSelectedScheme(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full max-h-[88vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl border border-emerald-200/70 p-6 sm:p-8 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedScheme(null)}
                className="absolute top-5 right-5 w-10 h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center border border-emerald-200 transition-transform cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6 pr-12">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                  {selectedScheme.type || "Government Scheme"} • {selectedScheme.category}
                </span>
                <h3 className="font-heading italic text-3xl sm:text-4xl text-emerald-950 mt-2 mb-1">
                  {selectedScheme.nameEn}
                </h3>
                {selectedScheme.nameOr && (
                  <p className="text-sm font-bold text-pink-700">{selectedScheme.nameOr}</p>
                )}
              </div>

              {/* Benefit & Subsidy Highlight */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 mb-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-1">Financial & Price Benefit</h4>
                <p className="text-sm font-extrabold text-emerald-950 mb-2">{selectedScheme.benefit}</p>
                {selectedScheme.subsidyAmount && (
                  <div className="text-xs font-bold text-emerald-700 bg-white/80 px-3 py-1.5 rounded-xl inline-block border border-emerald-100">
                    💰 {selectedScheme.subsidyAmount}
                  </div>
                )}
              </div>

              {/* Eligibility Criteria */}
              {selectedScheme.eligibility && (
                <div className="mb-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Who is Eligible?</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900/90 font-medium p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
                    {selectedScheme.eligibility}
                  </p>
                </div>
              )}

              {/* Required Documents Checklist */}
              {selectedScheme.documents && (
                <div className="mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Required Documents (Checklist)</span>
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedScheme.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-emerald-950">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpline & Apply Button */}
              <div className="pt-4 border-t border-emerald-100 flex items-center justify-between gap-3 flex-wrap">
                {selectedScheme.helpline && (
                  <a
                    href={`tel:${selectedScheme.helpline.split('/')[0].trim()}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Helpline: {selectedScheme.helpline}</span>
                  </a>
                )}

                {selectedScheme.portalUrl && (
                  <a
                    href={selectedScheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all ml-auto"
                  >
                    <span>Apply on Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal 2: Interactive Eligibility Calculator Modal ── */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-950/70 backdrop-blur-md p-4 sm:p-6 cursor-pointer"
            onClick={() => setIsCalculatorOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative max-w-xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl border border-emerald-200/70 p-6 sm:p-8 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center border border-emerald-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-heading italic text-2xl sm:text-3xl text-emerald-950">Farmer Subsidy Calculator</h3>
              </div>
              <p className="text-xs text-emerald-800/70 font-semibold mb-6">Select your farming profile to see exact matched financial transfers and equipment subsidies.</p>

              {/* Form Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-emerald-800 block mb-1.5">State / Region</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ id: 'odisha', label: '🌾 Odisha' }, { id: 'other', label: '🇮🇳 Other Indian State' }].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setCalcState(prev => ({ ...prev, region: opt.id })); setTimeout(handleCalculate, 50); }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          calcState.region === opt.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-emerald-800 block mb-1.5">Land Holding</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'marginal', label: 'Small (< 2 Ha)' },
                      { id: 'landless', label: 'Landless / Tenant' },
                      { id: 'large', label: 'Large (> 2 Ha)' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setCalcState(prev => ({ ...prev, landSize: opt.id })); setTimeout(handleCalculate, 50); }}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          calcState.landSize === opt.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-emerald-800 block mb-1.5">Primary Cultivation</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'paddy', label: '🌾 Paddy (Rice)' },
                      { id: 'millets', label: '🥣 Millets (Ragi)' },
                      { id: 'vegetables', label: '🥬 Vegetables/Cash' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setCalcState(prev => ({ ...prev, crop: opt.id })); setTimeout(handleCalculate, 50); }}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          calcState.crop === opt.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Result Box */}
              {calcResult && (
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 mb-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Estimated Direct Cash Benefit</span>
                    <span className="text-lg font-black text-emerald-950 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                      {calcResult.totalDirectTransfer}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block mb-2">Entitled Subsidies & Benefits:</span>
                    <ul className="space-y-1.5 text-xs font-semibold text-emerald-950">
                      {calcResult.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Close & Browse Schemes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

