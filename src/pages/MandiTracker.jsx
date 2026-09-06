import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCw, Search, TrendingUp, TrendingDown, 
  Volume2, VolumeX, ShieldAlert, CheckCircle2, Clock, 
  HelpCircle, ChevronRight, Calculator, MapPin, 
  Building2, Landmark, PhoneCall, ExternalLink, Sparkles,
  ArrowUpRight, SlidersHorizontal, DollarSign, Filter, Info
} from 'lucide-react';
import { 
  COMMODITY_CATEGORIES, 
  STATES_LIST, 
  MANDI_CROPS_DATA, 
  evaluateCropDecision,
  calculateKisanReturn 
} from '../data/mandiData';
import { safeSpeak, safeStopSpeech, isSpeechAvailable } from '../utils/speechUtils';

export default function MandiTracker() {
  // ── States ───────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDecision, setSelectedDecision] = useState('all'); // 'all' | 'SELL_NOW' | 'HOLD' | 'WAIT'
  const [sortBy, setSortBy] = useState('spread'); // 'spread' | 'price-desc' | 'price-asc' | 'change-desc'
  const [selectedLang, setSelectedLang] = useState('en'); // 'en' | 'hi' | 'od'

  // Modals & Drawers
  const [activeMandiModalCrop, setActiveMandiModalCrop] = useState(null);
  const [activeCalcCrop, setActiveCalcCrop] = useState(MANDI_CROPS_DATA[0]);
  const [calcQuantity, setCalcQuantity] = useState(25); // Quintals
  const [calcTransport, setCalcTransport] = useState(35); // ₹/qtl
  const [calcMandiIndex, setCalcMandiIndex] = useState(0);

  // Audio speaking state
  const [speakingCropId, setSpeakingCropId] = useState(null);

  // Refresh animation simulation
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      safeStopSpeech();
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    safeStopSpeech();
    setSpeakingCropId(null);
    setTimeout(() => {
      setIsRefreshing(false);
      const d = new Date();
      setLastUpdated(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 800);
  };

  // ── Filtered & Sorted Crops ──────────────────────────────────────────────────
  const processedCrops = useMemo(() => {
    return MANDI_CROPS_DATA.map(evaluateCropDecision);
  }, []);

  const filteredCrops = useMemo(() => {
    return processedCrops.filter(crop => {
      // Category filter
      if (selectedCategory !== 'all' && crop.category !== selectedCategory) {
        return false;
      }
      // State filter
      if (selectedState !== 'all' && crop.state !== selectedState) {
        return false;
      }
      // Decision filter
      if (selectedDecision !== 'all' && crop.decision !== selectedDecision) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = crop.name.toLowerCase().includes(q);
        const matchesHindi = crop.vernacularHindi.toLowerCase().includes(q);
        const matchesOdia = crop.vernacularOdia.toLowerCase().includes(q);
        const matchesSci = crop.scientificName.toLowerCase().includes(q);
        const matchesMandi = crop.mandis.some(m => m.name.toLowerCase().includes(q));
        if (!matchesName && !matchesHindi && !matchesOdia && !matchesSci && !matchesMandi) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'spread') {
        return Number(b.spreadPercent) - Number(a.spreadPercent);
      }
      if (sortBy === 'price-desc') {
        return b.modalPrice - a.modalPrice;
      }
      if (sortBy === 'price-asc') {
        return a.modalPrice - b.modalPrice;
      }
      if (sortBy === 'change-desc') {
        return b.priceChange7d - a.priceChange7d;
      }
      return 0;
    });
  }, [processedCrops, selectedCategory, selectedState, selectedDecision, searchQuery, sortBy]);

  // ── Voice Speak Handler ──────────────────────────────────────────────────────
  const handleVoiceSpeak = (crop) => {
    if (speakingCropId === crop.id) {
      safeStopSpeech();
      setSpeakingCropId(null);
      return;
    }

    safeStopSpeech();
    setSpeakingCropId(crop.id);

    const langCode = selectedLang === 'hi' ? 'hi-IN' : selectedLang === 'od' ? 'or-IN' : 'en-IN';
    const textToSpeak = crop.guidance[selectedLang] || crop.guidance.en;

    safeSpeak(textToSpeak, langCode, {
      onEnd: () => setSpeakingCropId(null),
      onError: () => setSpeakingCropId(null)
    });
  };

  // ── Calculator Output ────────────────────────────────────────────────────────
  const calcOutput = useMemo(() => {
    if (!activeCalcCrop) return null;
    return calculateKisanReturn({
      cropData: activeCalcCrop,
      quantityQuintals: calcQuantity,
      targetMandiIndex: calcMandiIndex,
      transportCostPerQtl: calcTransport,
      mandiCessPercent: 1.5,
      holdDurationMonths: 1
    });
  }, [activeCalcCrop, calcQuantity, calcMandiIndex, calcTransport]);

  return (
    <div className="min-h-screen bg-pink-50 text-emerald-950 font-body leaf-pattern-bg relative pb-24 selection:bg-emerald-200 selection:text-emerald-950">
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between bg-white/55 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/70 shadow-[0_4px_24px_rgba(6,78,59,0.06)]">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="flex items-center gap-2 group px-3 py-1.5 rounded-full bg-white/60 hover:bg-emerald-50 border border-emerald-900/10 transition-all shadow-xs"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-emerald-800" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-emerald-900 group-hover:text-emerald-950">
              Home
            </span>
          </Link>

          <div className="h-5 w-px bg-emerald-900/15 hidden sm:block" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading italic text-xl sm:text-2xl text-[#D4AF37] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                BloomSense
              </span>
              <span className="bg-emerald-600/10 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-600/20">
                Mandi Pulse
              </span>
            </div>
            <a
              href="https://neural-leaf.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-pink-600 hover:to-purple-600 bg-clip-text text-transparent transition-all"
            >
              Neural Leaf <ArrowUpRight className="w-2.5 h-2.5 text-[#D4AF37]" />
            </a>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Stop Button if currently speaking */}
          {speakingCropId && (
            <button
              onClick={() => { safeStopSpeech(); setSpeakingCropId(null); }}
              className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/20 animate-pulse"
              title="Stop voice playback"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Audio</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center bg-white/60 p-0.5 rounded-full border border-emerald-900/10 shadow-xs text-xs font-bold">
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-2.5 py-1 rounded-full transition-colors ${selectedLang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:text-emerald-950'}`}
            >
              EN
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`px-2.5 py-1 rounded-full transition-colors ${selectedLang === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:text-emerald-950'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLang('od')}
              className={`px-2.5 py-1 rounded-full transition-colors ${selectedLang === 'od' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:text-emerald-950'}`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/70 hover:bg-white border border-emerald-900/10 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
            title="Refresh Mandi Rates"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </nav>

      {/* ── Hero Section & Market Pulse ───────────────────────────────────── */}
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center sm:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-600/10 border border-emerald-600/25 text-emerald-800 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live APMC Market Intelligence • Kharif & Rabi 2024-25
            </div>
            <h1 className="font-heading italic text-3xl sm:text-4xl lg:text-5xl text-emerald-950 leading-tight">
              Mandi Price Tracker & <span className="text-[#D4AF37]">Sell Advisory</span>
            </h1>
            <p className="text-emerald-800/80 text-sm sm:text-base font-medium max-w-2xl mt-1">
              Real-time APMC arrivals, official GoI Minimum Support Price (MSP) benchmarks, and AI-powered <span className="font-bold text-emerald-900">"Sell Now or Wait"</span> market guidance.
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-center gap-1.5 text-xs text-emerald-700/80 font-semibold bg-white/40 md:bg-transparent p-2.5 rounded-2xl border border-white/60 md:border-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-900 font-bold">APMC Mandis Active</span>
            </div>
            <span>Updated today at {lastUpdated} IST</span>
          </div>
        </motion.div>

        {/* ── Summary Stats Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 p-3.5 sm:p-4 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">Crops Tracked</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">18 Commodities</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">🌾 Cereals, Pulses, Oilseeds</div>
          </div>

          <div className="bg-white/45 backdrop-blur-xl border border-white/70 p-3.5 sm:p-4 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">APMC Mandis</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">45+ Hubs</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">🏛️ Odisha & National Coverage</div>
          </div>

          <div className="bg-white/45 backdrop-blur-xl border border-white/70 p-3.5 sm:p-4 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">Top MSP Premium</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">+35.1% (Tur)</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">₹2,650/qtl above floor</div>
          </div>

          <div className="bg-white/45 backdrop-blur-xl border border-white/70 p-3.5 sm:p-4 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">Sell Window</div>
            <div className="text-xl sm:text-2xl font-black text-[#D4AF37] mt-1">11 Crops in Profit</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">🟢 Strong Sell Now Signal</div>
          </div>
        </div>

        {/* ── Search & Filter Controls ────────────────────────────────────── */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          {/* Search bar & State dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, Hindi name, Odia name (e.g. Paddy, धान, ଟମାଟୋ, Sambalpur)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/80 border border-emerald-900/15 text-sm text-emerald-950 placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700/60 hover:text-emerald-950"
                >
                  Clear
                </button>
              )}
            </div>

            {/* State filter */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 hidden sm:block" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full sm:w-44 px-3 py-2.5 rounded-full bg-white/80 border border-emerald-900/15 text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner cursor-pointer"
              >
                {STATES_LIST.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 px-3 py-2.5 rounded-full bg-white/80 border border-emerald-900/15 text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner cursor-pointer"
              >
                <option value="spread">Sort: Highest MSP Spread</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="change-desc">Sort: 7-day Change %</option>
              </select>
            </div>
          </div>

          {/* Commodity Categories Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {COMMODITY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-white/60 hover:bg-white text-emerald-800 border border-emerald-900/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Decision Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/10 text-xs">
            <span className="font-bold text-emerald-900 text-xs mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Decision Filter:
            </span>
            <button
              onClick={() => setSelectedDecision('all')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                selectedDecision === 'all' 
                  ? 'bg-emerald-950 text-white shadow-xs' 
                  : 'bg-white/50 text-emerald-800 hover:bg-white border border-emerald-900/10'
              }`}
            >
              All Signals ({processedCrops.length})
            </button>
            <button
              onClick={() => setSelectedDecision('SELL_NOW')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                selectedDecision === 'SELL_NOW' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sell Now (🟢 High Premium)
            </button>
            <button
              onClick={() => setSelectedDecision('HOLD')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                selectedDecision === 'HOLD' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Hold / Monitor (🟡 Tight Stock)
            </button>
            <button
              onClick={() => setSelectedDecision('WAIT')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                selectedDecision === 'WAIT' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Wait & Store (🔴 Below MSP)
            </button>
          </div>
        </div>

        {/* ── Crops Grid ──────────────────────────────────────────────────── */}
        {filteredCrops.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-12 text-center my-8">
            <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h3 className="font-heading italic text-2xl text-emerald-950 mb-1">No crops match your filters</h3>
            <p className="text-emerald-800/70 text-sm max-w-md mx-auto mb-4">
              Try adjusting your search terms or reset the filters to view all available agricultural commodities.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedState('all'); setSelectedDecision('all'); }}
              className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filteredCrops.map((crop) => (
              <motion.div
                key={crop.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/55 backdrop-blur-xl border border-white/70 rounded-3xl p-5 shadow-[0_8px_30px_rgba(6,78,59,0.06)] hover:shadow-[0_12px_36px_rgba(6,78,59,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top bar: Icon, Name, Decision Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/80 border border-emerald-900/10 flex items-center justify-center text-2xl shadow-xs">
                        {crop.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-emerald-950 leading-snug">
                          {crop.name}
                        </h3>
                        <div className="text-xs text-emerald-700/80 font-medium">
                          <span>{crop.vernacularHindi}</span> • <span className="font-semibold">{crop.vernacularOdia}</span>
                        </div>
                      </div>
                    </div>

                    {/* Decision Badge */}
                    <div className={`px-2.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 ${crop.decisionBadge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${crop.decisionBadge.dotColor} ${crop.decision === 'SELL_NOW' ? 'animate-ping' : ''}`} />
                      <span>{crop.decisionBadge.label}</span>
                    </div>
                  </div>

                  {/* Primary Mandi & Current Rate Block */}
                  <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-3.5 mb-3.5">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-800">
                        {crop.primaryMandi}
                      </span>
                      <span className={`text-xs font-black flex items-center gap-0.5 ${crop.priceChange7d >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {crop.priceChange7d >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {crop.priceChange7d >= 0 ? `+${crop.priceChange7d}%` : `${crop.priceChange7d}%`}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                        ₹{crop.modalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-700/70">
                        / Quintal (Modal)
                      </span>
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center justify-between text-[11px] text-emerald-700/80 font-semibold mt-1.5 pt-1.5 border-t border-emerald-900/10">
                      <span>Min: ₹{crop.mandis[0]?.min}</span>
                      <span className="text-emerald-900 font-bold">Daily Arrivals: {crop.mandis[0]?.arrivals}</span>
                      <span>Max: ₹{crop.mandis[0]?.max}</span>
                    </div>
                  </div>

                  {/* MSP Benchmark Comparison Bar */}
                  <div className="bg-white/60 border border-white/80 rounded-2xl p-3 mb-3.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-emerald-700" />
                        Official GoI MSP:
                      </span>
                      <span className="font-bold text-emerald-950">
                        {crop.msp ? `₹${crop.msp.toLocaleString('en-IN')} / qtl` : 'Perishable (Cost: ₹' + crop.mspBenchmarkEstimated + ')'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-700/80 text-[11px]">
                        Market vs MSP Spread:
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                        crop.spread >= 0 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {crop.spread >= 0 ? `+₹${crop.spread} (+${crop.spreadPercent}%)` : `-₹${Math.abs(crop.spread)} (${crop.spreadPercent}%)`}
                      </span>
                    </div>
                  </div>

                  {/* "Sell Now or Wait" Algorithmic Rationale */}
                  <div className="bg-white/40 border border-emerald-900/10 rounded-2xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>AI Guidance: {crop.timeHorizon}</span>
                      </div>
                      
                      {/* Audio Button */}
                      <button
                        onClick={() => handleVoiceSpeak(crop)}
                        className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-[10px] font-bold ${
                          speakingCropId === crop.id
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Listen to advisory"
                      >
                        {speakingCropId === crop.id ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-emerald-900/90 leading-relaxed font-medium">
                      {crop.guidance[selectedLang] || crop.guidance.en}
                    </p>

                    <div className="mt-2 pt-2 border-t border-emerald-900/10 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                      <span>Model Confidence: {crop.confidence}%</span>
                      <span className="text-emerald-900 font-bold">{crop.arrivalStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-900/10">
                  <button
                    onClick={() => setActiveMandiModalCrop(crop)}
                    className="px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-emerald-900/15 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nearby Mandis</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveCalcCrop(crop);
                      const el = document.getElementById('kisan-calculator-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-emerald-600/20"
                  >
                    <Calculator className="w-3.5 h-3.5 text-white" />
                    <span>Calc Profit</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Interactive Kisan Mandi & Storage Calculator ─────────────────── */}
        <div id="kisan-calculator-section" className="scroll-mt-24 mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(6,78,59,0.08)]"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-900/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-800 text-xs font-bold mb-1.5">
                  <Calculator className="w-3.5 h-3.5" />
                  Kisan Net Profit & Storage Simulator
                </div>
                <h2 className="font-heading italic text-2xl sm:text-3xl text-emerald-950">
                  Calculate Your Net Harvest Revenue
                </h2>
                <p className="text-xs sm:text-sm text-emerald-800/80 font-medium">
                  Compare immediate Mandi payout against official MSP and evaluate if holding in WDRA godowns yields net profit after storage fees.
                </p>
              </div>

              {/* Crop Selector for Calculator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 whitespace-nowrap">Select Crop:</span>
                <select
                  value={activeCalcCrop?.id || ''}
                  onChange={(e) => {
                    const found = MANDI_CROPS_DATA.find(c => c.id === e.target.value);
                    if (found) {
                      setActiveCalcCrop(found);
                      setCalcMandiIndex(0);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-emerald-900/20 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                >
                  {MANDI_CROPS_DATA.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Left Column: Sliders & Form Controls */}
              <div className="lg:col-span-6 space-y-5">
                {/* Quantity in Quintals */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-1.5">
                    <span>Harvest Yield Quantity:</span>
                    <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                      {calcQuantity} Quintals ({calcQuantity * 2} Bags of 50kg)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-900/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-700/60 font-bold mt-1">
                    <span>5 Qtl (Smallholder)</span>
                    <span>100 Qtl</span>
                    <span>200 Qtl (Commercial)</span>
                  </div>
                </div>

                {/* Mandi Selection */}
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                    Destination Mandi:
                  </label>
                  <select
                    value={calcMandiIndex}
                    onChange={(e) => setCalcMandiIndex(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-900/20 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                  >
                    {activeCalcCrop?.mandis.map((m, idx) => (
                      <option key={m.name} value={idx}>
                        {m.name} • Modal Rate: ₹{m.modal}/qtl (Distance: {m.distance})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transport Cost slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-1.5">
                    <span>Transportation Cost:</span>
                    <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                      ₹{calcTransport} / Quintal
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={calcTransport}
                    onChange={(e) => setCalcTransport(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-900/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-700/60 font-bold mt-1">
                    <span>₹10 (Local Mandi)</span>
                    <span>₹75 (District RMC)</span>
                    <span>₹150 (Inter-state Terminal)</span>
                  </div>
                </div>

                {/* Explanatory Note */}
                <div className="bg-emerald-50/60 border border-emerald-900/10 rounded-2xl p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    APMC market cess is calculated at standard 1.5%. WDRA warehouse storage rent is standardized at ₹18 per 50kg bag/month.
                  </p>
                </div>
              </div>

              {/* Right Column: Calculations Breakdown & Decision Verdict */}
              {calcOutput && (
                <div className="lg:col-span-6 flex flex-col justify-between bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-5">
                  <div className="space-y-3.5">
                    <h3 className="font-bold text-sm text-emerald-950 flex items-center justify-between border-b border-emerald-900/10 pb-2">
                      <span>Revenue Breakdown ({calcQuantity} Qtl)</span>
                      <span className="text-xs font-semibold text-emerald-700">Mandi Rate: ₹{calcOutput.modalRate}/qtl</span>
                    </h3>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-800">Gross Mandi Value:</span>
                      <span className="font-bold text-emerald-950">₹{calcOutput.grossMandiRevenue.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-800">Guaranteed Floor (MSP Value):</span>
                      <span className="font-bold text-emerald-950">₹{calcOutput.grossMspRevenue.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-800">Mandi Spread vs MSP:</span>
                      <span className={`font-black ${calcOutput.mspGainOrLoss >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {calcOutput.mspGainOrLoss >= 0 ? `+₹${calcOutput.mspGainOrLoss.toLocaleString('en-IN')} Profit` : `-₹${Math.abs(calcOutput.mspGainOrLoss).toLocaleString('en-IN')} Loss`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-rose-700 pt-1.5 border-t border-emerald-900/10">
                      <span>Transport & APMC Cess Deductions:</span>
                      <span className="font-semibold">-₹{Math.round(calcOutput.totalTransport + calcOutput.totalMandiCess).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-emerald-900/15">
                      <span className="text-xs font-black text-emerald-900 uppercase">Immediate Net In-Hand:</span>
                      <span className="text-2xl font-black text-emerald-600">
                        ₹{Math.round(calcOutput.netInHandImmediate).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* 30-Day Storage Simulator Verdict */}
                  <div className="mt-4 pt-4 border-t border-emerald-900/15 bg-white/70 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-emerald-950">30-Day Storage Simulation:</span>
                      <span className={`font-black text-[11px] px-2 py-0.5 rounded-full ${
                        calcOutput.isHoldProfitable 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {calcOutput.isHoldProfitable ? '✨ GAIN FROM HOLDING' : '⚡ SELL IMMEDIATELY'}
                      </span>
                    </div>

                    <div className="text-xs text-emerald-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Projected Rate (in 30 days):</span>
                        <span className="font-bold text-emerald-950">₹{calcOutput.projectedFutureRate}/qtl</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warehouse Rent (WDRA Godown):</span>
                        <span className="text-rose-700 font-semibold">-₹{calcOutput.totalWarehouseRent}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-emerald-900/10 font-bold">
                        <span>Net Outcome of Waiting 30 Days:</span>
                        <span className={calcOutput.netHoldBenefit >= 0 ? 'text-emerald-700' : 'text-amber-800'}>
                          {calcOutput.netHoldBenefit >= 0 ? `+₹${calcOutput.netHoldBenefit} Net Gain` : `-₹${Math.abs(calcOutput.netHoldBenefit)} Opportunity Loss`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Government MSP Procurement & Warehousing Schemes ────────────── */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-3xl p-6 sm:p-8 mb-12 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <Landmark className="w-4 h-4 text-[#D4AF37]" />
            Official Support & Farmer Safety Net
          </div>
          <h2 className="font-heading italic text-2xl sm:text-3xl text-emerald-950 mb-4">
            Government Procurement Portals & Storage Subsidies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 border border-white/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-emerald-950 mb-1">
                  Odisha P-PAS (Paddy e-Procurement)
                </h4>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  Direct Benefit Transfer (DBT) into farmer bank accounts within 48 hours for paddy procurement via PACS/LAMPS.
                </p>
              </div>
              <a
                href="https://foododisha.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-950 mt-3"
              >
                <span>Visit Food Odisha Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white/60 border border-white/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-emerald-950 mb-1">
                  WDRA e-NWR Warehouse Financing
                </h4>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  Store grains in accredited godowns and pledge electronic negotiable warehouse receipts (e-NWR) for 7% interest bank loans without distress sale.
                </p>
              </div>
              <a
                href="https://wdra.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-950 mt-3"
              >
                <span>WDRA Accreditation Info</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white/60 border border-white/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-emerald-950 mb-1">
                  Kisan Mandi Call Center (Toll-Free)
                </h4>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  Dial 1800-180-1551 for free crop pricing, APMC dispute resolution, and MSP procurement registration assistance in Odia & Hindi.
                </p>
              </div>
              <a
                href="tel:18001801551"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-950 mt-3"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call 1800-180-1551</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nearby Mandis Modal / Drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {activeMandiModalCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveMandiModalCrop(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-pink-50 border border-white/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{activeMandiModalCrop.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-emerald-950 leading-tight">
                      {activeMandiModalCrop.name}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">
                      APMC Mandi Rate Comparison & Arbitrage
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMandiModalCrop(null)}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-emerald-950 flex items-center justify-center text-sm font-bold shadow-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-emerald-800/80 mb-4">
                Compare modal prices across top regional and terminal APMCs. Selling at a neighboring mandi with a higher rate can significantly increase profit even after transport costs.
              </p>

              <div className="space-y-3 mb-5">
                {activeMandiModalCrop.mandis.map((mandi, idx) => (
                  <div
                    key={mandi.name}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      idx === 0 
                        ? 'bg-white/80 border-emerald-600/30 shadow-xs' 
                        : 'bg-white/50 border-white/70'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-xs text-emerald-950">{mandi.name}</span>
                      <span className="text-xs font-black text-emerald-700">₹{mandi.modal} / qtl</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-700/80 font-medium">
                      <span>Range: ₹{mandi.min} – ₹{mandi.max}</span>
                      <span>Arrivals: {mandi.arrivals}</span>
                      <span className="font-bold text-emerald-900">Dist: {mandi.distance}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action checklist */}
              <div className="bg-white/60 rounded-2xl p-3.5 border border-white/80 mb-4">
                <h4 className="text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Quality Specifications for Top Rate:
                </h4>
                <ul className="text-[11px] text-emerald-800/90 space-y-1 pl-4 list-disc">
                  {activeMandiModalCrop.actionPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setActiveMandiModalCrop(null)}
                className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Close Comparison
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
