import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, Calendar, Bell, BellOff, ChevronRight, 
  Check, Sprout, Wheat, Apple, CircleDot, Layers,
  ArrowLeft, Sun, CloudRain, Thermometer, RefreshCw, Volume2
} from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import advisories from '../data/advisories.json';
import CropPhaseCalendar from '../components/CropPhaseCalendar';
import AdvisoryCard from '../components/AdvisoryCard';

const CROPS = [
  { id: 'Rice',   label: 'Rice / Paddy', icon: '🌾', desc: 'Kharif staple, Odisha & Eastern India', hint: 'Oryza sativa' },
  { id: 'Wheat',  label: 'Wheat',        icon: '🌿', desc: 'Rabi crop, Northern & Central India', hint: 'Triticum aestivum' },
  { id: 'Tomato', label: 'Tomato',       icon: '🍅', desc: 'Cash crop, year-round cultivation', hint: 'Solanum lycopersicum' },
  { id: 'Cotton', label: 'Cotton',       icon: '☁️', desc: 'Kharif cash crop, Vidarbha & Gujarat', hint: 'Gossypium hirsutum (Bt)' },
  { id: 'Maize',  label: 'Maize',        icon: '🌽', desc: 'Kharif & Rabi, versatile cereal', hint: 'Zea mays' },
  { id: 'Sugarcane', label: 'Sugarcane', icon: '🎋', desc: 'Long duration cash crop, UP & Maharashtra', hint: 'Saccharum officinarum' },
  { id: 'Potato', label: 'Potato',       icon: '🥔', desc: 'Rabi tuber crop, key vegetable', hint: 'Solanum tuberosum' },
  { id: 'Soybean', label: 'Soybean',     icon: '🫘', desc: 'Kharif oilseed, MP & Maharashtra', hint: 'Glycine max' },
  { id: 'Banana', label: 'Banana',       icon: '🍌', desc: 'Fruit crop, high water requirement', hint: 'Musa spp.' },
  { id: 'Mango',  label: 'Mango',        icon: '🥭', desc: 'Perennial orchard crop, summer fruit', hint: 'Mangifera indica' },
  { id: 'Onion',  label: 'Onion',        icon: '🧅', desc: 'Rabi & Kharif cash crop', hint: 'Allium cepa' },
  { id: 'Chilli', label: 'Chilli',       icon: '🌶️', desc: 'Spice & vegetable crop, Andhra Pradesh', hint: 'Capsicum annuum' }
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Setup Wizard ─────────────────────────────────────────────────────────────

function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [sowingMonth, setSowingMonth] = useState(new Date().getMonth());

  const handleFinish = () => {
    onComplete({ crop: selectedCrop, sowingMonth: sowingMonth + 1 });
  };

  return (
    <div className="min-h-screen bg-pink-50 leaf-pattern-bg flex items-center justify-center px-4 py-20">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-3 flex items-center bg-pink-50/90 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
        <Link to="/" className="flex items-center gap-2 group mr-auto">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-emerald-100/50 group-hover:bg-emerald-200 transition-colors">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-700" />
          </div>
          <span className="font-bold text-emerald-800 text-sm hidden lg:block mr-2 group-hover:text-emerald-950 transition-colors">Back to BloomSense</span>
          <div className="flex flex-col drop-shadow-sm border-l border-emerald-900/10 pl-3">
            <span className="font-heading italic text-lg md:text-xl text-emerald-950 leading-none">BloomSense</span>
            <a
              href="https://neural-leaf.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 text-[8px] md:text-[9px] font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-pink-600 hover:to-purple-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-[1.04] cursor-pointer select-none mt-0.5 pl-0.5"
              title="Visit Neural Leaf"
            >
              Neural Leaf ↗
            </a>
          </div>
        </Link>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mt-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading italic text-5xl text-emerald-950 mb-2">Crop Calendar</h1>
          <p className="text-emerald-700/70 font-medium">Tell us about your farm to get personalised advisories</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${step >= s ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-emerald-100 text-emerald-400'}`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 2 && <div className={`w-16 h-0.5 rounded-full transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-emerald-100'}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Crop */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading italic text-3xl text-emerald-950 mb-6 text-center">Which crop are you growing?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {CROPS.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`relative p-5 rounded-3xl border text-left flex flex-col gap-3 transition-all duration-300 group overflow-hidden ${
                      selectedCrop === crop.id
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-xl shadow-emerald-600/20 scale-[1.02] ring-2 ring-emerald-500 ring-offset-2 ring-offset-pink-50'
                        : 'border-emerald-200/60 bg-white/60 backdrop-blur-sm hover:border-emerald-400 hover:bg-white hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{crop.icon}</span>
                      <AnimatePresence>
                        {selectedCrop === crop.id && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="mt-2">
                      <p className="font-heading italic text-xl text-emerald-950">{crop.label}</p>
                      <p className="text-emerald-600/80 text-[10px] font-bold uppercase tracking-widest mt-1">{crop.hint}</p>
                      <p className="text-emerald-700/60 text-xs mt-2 leading-relaxed line-clamp-2">{crop.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedCrop}
                className="w-full bg-emerald-600 text-white py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Sowing Month */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading italic text-3xl text-emerald-950 mb-2 text-center">When did you sow?</h2>
              <p className="text-center text-emerald-700/60 font-medium text-sm mb-6">Select your sowing or transplanting month</p>
              <div className="grid grid-cols-4 gap-2 mb-8">
                {MONTH_NAMES.map((name, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSowingMonth(idx)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      sowingMonth === idx
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-white border border-emerald-100 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-emerald-200 text-emerald-800 py-4 rounded-full font-bold hover:bg-emerald-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Sprout className="w-5 h-5" /> Set Up My Calendar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Main Calendar Page ────────────────────────────────────────────────────────

const CROP_METADATA = {
  Rice: {
    durationDays: 125,
    msp: "₹2,300 / quintal (Common) | ₹2,320 / quintal (Grade A)",
    waterReq: "1100 - 1250 mm",
    soilType: "Clayey loam to silty clay (high water retention)",
    optimalPh: "5.5 - 6.5",
    fertilizerDose: { basalDAP: 40, basalMOP: 25, basalZinc: 10, topDress1Urea: 45, topDress2Urea: 35, topDress2MOP: 15, organicCompostTons: 4 },
    keyThreats: [
      { name: "Rice Blast (Pyricularia oryzae)", stage: "Tillering to Panicle", chemical: "Tricyclazole 75% WP @ 0.6g/L", organic: "5% Neem Seed Extract or Pseudomonas fluorescens @ 5g/L", severity: "high" },
      { name: "Yellow Stem Borer (Scirpophaga incertulas)", stage: "Active Tillering", chemical: "Chlorantraniliprole 18.5% SC @ 0.3ml/L", organic: "Install Pheromone Traps @ 8/acre + Trichogramma parasitoids", severity: "high" },
      { name: "Brown Plant Hopper (Nilaparvata lugens)", stage: "Milking to Dough", chemical: "Pymetrozine 50% WDG @ 0.6g/L", organic: "Azadirachtin 1500 ppm @ 3ml/L targeting lower stem", severity: "medium" }
    ],
    schemes: [
      { name: "PM-KISAN", desc: "Direct benefit transfer of ₹6,000/yr in 3 installments", link: "https://pmkisan.gov.in" },
      { name: "PMFBY Crop Insurance", desc: "Comprehensive risk coverage against flood, drought & pest epidemic", link: "https://pmfby.gov.in" },
      { name: "Kalia & Samrudha Krushaka (Odisha)", desc: "Direct seed subsidy & input support for paddy farmers", link: "https://agri.odisha.gov.in" }
    ]
  },
  Wheat: {
    durationDays: 120,
    msp: "₹2,275 / quintal",
    waterReq: "450 - 650 mm (4-6 irrigations)",
    soilType: "Well-drained fertile loamy soil",
    optimalPh: "6.0 - 7.5",
    fertilizerDose: { basalDAP: 55, basalMOP: 20, basalZinc: 8, topDress1Urea: 50, topDress2Urea: 40, topDress2MOP: 10, organicCompostTons: 3 },
    keyThreats: [
      { name: "Yellow Rust (Puccinia striiformis)", stage: "Tillering to Heading", chemical: "Propiconazole 25% EC @ 1ml/L", organic: "Foliar spray of Sour Buttermilk (10%) + Cow Urine", severity: "high" },
      { name: "Termites (Odontotermes obesus)", stage: "Seedling Stage", chemical: "Chlorpyrifos 20% EC @ 3ml/kg seed", organic: "Neem cake soil application @ 100kg/acre", severity: "medium" },
      { name: "Karnal Bunt (Tilletia indica)", stage: "Earhead Stage", chemical: "Tebuconazole 25.9% EC @ 1ml/L", organic: "Trichoderma viride seed treatment @ 4g/kg", severity: "high" }
    ],
    schemes: [
      { name: "National Food Security Mission (NFSM)", desc: "High Yield Variety (HYV) seed distribution subsidies", link: "https://nfsm.gov.in" },
      { name: "Sub-Mission on Agricultural Mechanization", desc: "Up to 50% subsidy on Happy Seeder & Super Seeder", link: "https://agrimachinery.nic.in" }
    ]
  },
  Tomato: {
    durationDays: 105,
    msp: "Market Price Driven (Cold Storage Subsidy ₹10,000/ton)",
    waterReq: "600 - 800 mm (Drip recommended)",
    soilType: "Rich organic sandy loam with good drainage",
    optimalPh: "6.0 - 6.8",
    fertilizerDose: { basalDAP: 50, basalMOP: 30, basalZinc: 5, topDress1Urea: 35, topDress2Urea: 35, topDress2MOP: 20, organicCompostTons: 6 },
    keyThreats: [
      { name: "Early & Late Blight", stage: "Vegetative & Flowering", chemical: "Mancozeb 75% WP @ 2.5g/L or Metalaxyl", organic: "Bordeaux Mixture 1% foliar spray", severity: "high" },
      { name: "Tomato Fruit Borer (Helicoverpa armigera)", stage: "Fruiting Stage", chemical: "Emamectin Benzoate 5% SG @ 0.5g/L", organic: "Helicoverpa NPV @ 250 LE/acre + Marigold trap crops", severity: "high" }
    ],
    schemes: [
      { name: "MIDH (Mission for Integrated Horticulture)", desc: "Subsidies for Polyhouse, Shadenet & Drip Irrigation", link: "https://midh.gov.in" }
    ]
  },
  Cotton: {
    durationDays: 165,
    msp: "₹7,121 / quintal (Medium) | ₹7,521 / quintal (Long Staple)",
    waterReq: "700 - 1200 mm",
    soilType: "Deep black cotton soil (Regur) with good aeration",
    optimalPh: "6.5 - 8.0",
    fertilizerDose: { basalDAP: 45, basalMOP: 35, basalZinc: 10, topDress1Urea: 40, topDress2Urea: 40, topDress2MOP: 25, organicCompostTons: 5 },
    keyThreats: [
      { name: "Pink Bollworm (Pectinophora gossypiella)", stage: "Squaring & Boll Formation", chemical: "Profenofos 50% EC @ 2ml/L", organic: "Pheromone traps (PB-Rope L) @ 10/acre", severity: "high" },
      { name: "Whitefly & Leaf Curl Virus", stage: "Early Vegetative", chemical: "Diafenthiuron 50% WP @ 1.2g/L", organic: "Yellow Sticky Traps @ 20/acre + Neem oil 1500ppm", severity: "high" }
    ],
    schemes: [
      { name: "Cotton Corporation of India (CCI) MSP Procurement", desc: "Guaranteed minimum support price at designated APMC mandis", link: "https://cotcorp.org.in" }
    ]
  },
  Maize: {
    durationDays: 100,
    msp: "₹2,090 / quintal",
    waterReq: "500 - 700 mm",
    soilType: "Deep, well-drained loamy soil",
    optimalPh: "5.8 - 7.2",
    fertilizerDose: { basalDAP: 45, basalMOP: 25, basalZinc: 10, topDress1Urea: 45, topDress2Urea: 30, topDress2MOP: 15, organicCompostTons: 4 },
    keyThreats: [
      { name: "Fall Armyworm (Spodoptera frugiperda)", stage: "Seedling to Knee-High", chemical: "Chlorantraniliprole @ 0.4ml/L in whorl", organic: "Metarhizium anisopliae @ 5g/L bio-spray", severity: "high" }
    ],
    schemes: [
      { name: "NFSM Coarse Cereals", desc: "Seed minikit and bio-fertilizer incentives", link: "https://nfsm.gov.in" }
    ]
  },
  Sugarcane: {
    durationDays: 340,
    msp: "₹340 / quintal (FRP)",
    waterReq: "1500 - 2500 mm",
    soilType: "Deep, well-drained loamy soil with high fertility",
    optimalPh: "6.5 - 7.5",
    fertilizerDose: { basalDAP: 60, basalMOP: 40, basalZinc: 15, topDress1Urea: 65, topDress2Urea: 65, topDress2MOP: 35, organicCompostTons: 10 },
    keyThreats: [
      { name: "Red Rot (Colletotrichum falcatum)", stage: "Caning & Maturation", chemical: "Carbendazim 50% WP @ 1g/L sett treatment", organic: "Trichoderma harzianum soil application @ 10kg/acre", severity: "high" },
      { name: "Early Shoot Borer", stage: "Formative Phase", chemical: "Fipronil 5% SC @ 2ml/L", organic: "Granulosis Virus (Chilo-GV) + light traps", severity: "high" }
    ],
    schemes: [
      { name: "Sugar Cane Development Scheme", desc: "Tissue culture sett subsidy and drip irrigation grants", link: "https://dfpd.gov.in" }
    ]
  },
  Potato: {
    durationDays: 95,
    msp: "Market Price Driven (Cold Storage & Transport Subsidy)",
    waterReq: "500 - 600 mm",
    soilType: "Loose, friable sandy loam rich in organic matter",
    optimalPh: "5.2 - 6.4",
    fertilizerDose: { basalDAP: 60, basalMOP: 40, basalZinc: 8, topDress1Urea: 45, topDress2Urea: 35, topDress2MOP: 25, organicCompostTons: 6 },
    keyThreats: [
      { name: "Late Blight (Phytophthora infestans)", stage: "Tuber Formation", chemical: "Cymoxanil 8% + Mancozeb 64% @ 2g/L", organic: "Prophylactic spray of Trichoderma + copper sulfate", severity: "high" }
    ],
    schemes: [
      { name: "Operation Greens TOP Scheme", desc: "50% subsidy on transportation and cold storage evacuation", link: "https://mofpi.gov.in" }
    ]
  },
  Soybean: {
    durationDays: 95,
    msp: "₹4,892 / quintal",
    waterReq: "450 - 600 mm",
    soilType: "Well drained fertile black soils or clay loams",
    optimalPh: "6.0 - 7.5",
    fertilizerDose: { basalDAP: 40, basalMOP: 20, basalZinc: 8, topDress1Urea: 20, topDress2Urea: 20, topDress2MOP: 10, organicCompostTons: 3 },
    keyThreats: [
      { name: "Girdle Beetle (Oberia brevis)", stage: "Vegetative Phase", chemical: "Thiamethoxam + Lambdacyhalothrin @ 0.5ml/L", organic: "Neem Seed Kernel Extract (NSKE 5%) foliar spray", severity: "high" }
    ],
    schemes: [
      { name: "National Mission on Edible Oils (NMEO-OS)", desc: "Certified seed minikits and cluster demonstrations", link: "https://nmeo.gov.in" }
    ]
  },
  Banana: {
    durationDays: 330,
    msp: "Market Price Driven (Export promotion subsidy ₹15,000/ha)",
    waterReq: "1800 - 2200 mm (Drip fertigation)",
    soilType: "Deep, rich, well-drained loamy soil",
    optimalPh: "6.5 - 7.5",
    fertilizerDose: { basalDAP: 50, basalMOP: 40, basalZinc: 10, topDress1Urea: 60, topDress2Urea: 60, topDress2MOP: 40, organicCompostTons: 8 },
    keyThreats: [
      { name: "Sigatoka Leaf Spot", stage: "Shooting & Fruiting", chemical: "Propiconazole 25% EC @ 1ml/L + mineral oil", organic: "Pseudomonas fluorescens @ 10g/L foliar spray", severity: "high" }
    ],
    schemes: [
      { name: "MIDH Banana Tissue Culture Grants", desc: "40% capital subsidy on Grand Naine tissue culture plantlets", link: "https://midh.gov.in" }
    ]
  },
  Mango: {
    durationDays: 365,
    msp: "Commercial Orcharding (APEDA Export Certification)",
    waterReq: "700 - 1000 mm",
    soilType: "Deep alluvial well drained loamy soil",
    optimalPh: "5.5 - 7.5",
    fertilizerDose: { basalDAP: 60, basalMOP: 50, basalZinc: 15, topDress1Urea: 50, topDress2Urea: 50, topDress2MOP: 35, organicCompostTons: 8 },
    keyThreats: [
      { name: "Mango Hopper & Powdery Mildew", stage: "Flowering & Panicle Emergence", chemical: "Hexaconazole 5% SC @ 1ml/L + Imidacloprid", organic: "Wettable Sulfur 80% WP @ 2g/L", severity: "high" }
    ],
    schemes: [
      { name: "National Horticulture Board (NHB) Grants", desc: "Back-ended capital subsidy on commercial mango orchards", link: "https://nhb.gov.in" }
    ]
  },
  Onion: {
    durationDays: 120,
    msp: "Price Stabilization Fund (PSF) Procurement",
    waterReq: "500 - 700 mm",
    soilType: "Sandy loam to clay loam with rich humus",
    optimalPh: "6.0 - 7.0",
    fertilizerDose: { basalDAP: 45, basalMOP: 30, basalZinc: 8, topDress1Urea: 40, topDress2Urea: 35, topDress2MOP: 15, organicCompostTons: 5 },
    keyThreats: [
      { name: "Purple Blotch (Alternaria porri)", stage: "Bulb Development", chemical: "Tebuconazole 25.9% EC @ 1ml/L", organic: "Neem oil + Cow urine fermented extract 10%", severity: "high" }
    ],
    schemes: [
      { name: "Mission for Integrated Development of Horticulture", desc: "Low-cost onion storage structure (50MT) subsidy up to ₹87,500", link: "https://midh.gov.in" }
    ]
  },
  Chilli: {
    durationDays: 150,
    msp: "Market Price Driven (Spices Board Incentive)",
    waterReq: "600 - 800 mm",
    soilType: "Well-drained black soil or sandy loam",
    optimalPh: "6.5 - 7.8",
    fertilizerDose: { basalDAP: 45, basalMOP: 30, basalZinc: 8, topDress1Urea: 40, topDress2Urea: 40, topDress2MOP: 25, organicCompostTons: 5 },
    keyThreats: [
      { name: "Chilli Murda / Leaf Curl Complex (Thrips & Mites)", stage: "Vegetative to Fruiting", chemical: "Fipronil 5% SC @ 1.5ml/L or Diafenthiuron", organic: "Dashaparni Kashayam + Blue Sticky Traps", severity: "high" }
    ],
    schemes: [
      { name: "Spices Board Export Promotion Scheme", desc: "Subsidy on solar tunnel dryers and cleaning machinery", link: "https://indianspices.com" }
    ]
  }
};

export default function CropCalendar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    // Immediate synchronous load from localStorage for instant 0ms rendering
    const local = localStorage.getItem('bloomsense_crop_profile');
    if (local) {
      try { return JSON.parse(local); } catch {}
    }
    // Default to Rice if no profile exists yet so the calendar is ALWAYS working and never blank!
    return { crop: 'Rice', sowingMonth: 6 };
  });
  const [notifStatus, setNotifStatus] = useState('default');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [activeTab, setActiveTab] = useState('tasks');
  const [acreage, setAcreage] = useState(2);
  const [completedTasks, setCompletedTasks] = useState(() => {
    const localTasks = localStorage.getItem('bloomsense_completed_tasks');
    if (localTasks) {
      try { return JSON.parse(localTasks); } catch {}
    }
    return {};
  });
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentActualMonth = new Date().getMonth() + 1;
  const currentCropKey = profile?.crop || 'Rice';
  const meta = CROP_METADATA[currentCropKey] || CROP_METADATA['Rice'];
  const monthData = (advisories[currentCropKey]?.[String(selectedMonth)]) || (advisories['Rice']?.[String(selectedMonth)]) || null;

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  // Background sync with Firestore (non-blocking)
  useEffect(() => {
    let isMounted = true;
    if (user) {
      const syncProfile = async () => {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid, 'cropProfile', 'main'));
          if (snap.exists() && isMounted) {
            const data = snap.data();
            if (data?.crop && data?.sowingMonth) {
              setProfile({ crop: data.crop, sowingMonth: data.sowingMonth });
              localStorage.setItem('bloomsense_crop_profile', JSON.stringify({ crop: data.crop, sowingMonth: data.sowingMonth }));
            }
          }
        } catch (e) {
          console.warn("Background calendar sync:", e.message);
        }
      };
      syncProfile();
    }
    if ('Notification' in window) setNotifStatus(Notification.permission);
    return () => { isMounted = false; };
  }, [user]);

  // Toggle checklist item done state
  const handleToggleTask = (taskKey) => {
    const updated = { ...completedTasks, [taskKey]: !completedTasks[taskKey] };
    setCompletedTasks(updated);
    localStorage.setItem('bloomsense_completed_tasks', JSON.stringify(updated));
  };

  // Text-to-speech voice reader
  const handleSpeakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92;
    utt.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => (v.lang.startsWith(voiceLang.split('-')[0])) && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google')))
      || voices.find(v => v.lang.startsWith('en'));
    if (pref) utt.voice = pref;

    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const handleSetupComplete = async ({ crop, sowingMonth }) => {
    const profileData = { crop, sowingMonth };
    setProfile(profileData);
    setSelectedMonth(new Date().getMonth() + 1);
    localStorage.setItem('bloomsense_crop_profile', JSON.stringify(profileData));
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'cropProfile', 'main'), {
          crop, sowingMonth, updatedAt: Date.now()
        }, { merge: true });
      } catch (e) {}
    }
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotifStatus(permission);
    if (permission === 'granted') {
      new Notification('🌾 BloomSense Crop Intelligence Active', {
        body: `Weekly precision agronomic alerts scheduled for your ${profile?.crop || 'farm'}.`,
        icon: '/icons/icon-192.png'
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem('bloomsense_crop_profile');
    setProfile(null);
  };

  if (!profile) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  const cropInfo = CROPS.find(c => c.id === profile.crop) || CROPS[0];

  // Calculate approximate Days After Sowing (DAS)
  const currentMonthIdx = new Date().getMonth() + 1;
  const monthDiff = (currentMonthIdx - profile.sowingMonth + 12) % 12;
  const approximateDAS = Math.min(meta.durationDays, Math.max(10, monthDiff * 30 + 15));
  const progressPercent = Math.min(100, Math.round((approximateDAS / meta.durationDays) * 100));
  const daysRemaining = Math.max(0, meta.durationDays - approximateDAS);

  return (
    <div className="min-h-screen bg-pink-50 leaf-pattern-bg text-emerald-950 font-body">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-3 flex items-center bg-pink-50/90 backdrop-blur-md border-b border-emerald-900/10 shadow-sm print:hidden">
        <Link to="/" className="flex items-center gap-2 group mr-auto">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-emerald-100/50 group-hover:bg-emerald-200 transition-colors">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-700" />
          </div>
          <span className="font-bold text-emerald-800 text-sm hidden lg:block mr-2 group-hover:text-emerald-950 transition-colors">Back to BloomSense</span>
          <div className="flex flex-col drop-shadow-sm border-l border-emerald-900/10 pl-3">
            <span className="font-heading italic text-lg md:text-xl text-emerald-950 leading-none">BloomSense</span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Crop Calendar 3.0</span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Print Farm Plan Button */}
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-emerald-800 border border-emerald-200 shadow-sm transition-all"
            title="Print printable farm schedule sheet"
          >
            🖨️ <span>Print Plan</span>
          </button>

          {/* Switch Crop */}
          <button 
            onClick={handleReset} 
            className="text-xs text-emerald-700 hover:text-emerald-950 font-bold flex items-center gap-1.5 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 
            <span>{cropInfo.icon} {profile.crop}</span>
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        
        {/* ── Section 1: Dynamic Farm & Crop Progress Dashboard ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="liquid-glass rounded-[2.5rem] p-6 sm:p-8 border border-emerald-200/60 shadow-xl bg-gradient-to-r from-emerald-50/90 via-white to-pink-50/80 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              {/* Crop identity & Sowing Meta */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl">{cropInfo.icon}</span>
                  <div>
                    <h1 className="font-heading italic text-3xl sm:text-5xl text-emerald-950 leading-none">
                      {profile.crop} Farm Plan
                    </h1>
                    <p className="text-emerald-700/80 font-bold text-xs sm:text-sm mt-0.5">{cropInfo.hint} • Sown in {MONTH_NAMES[profile.sowingMonth - 1]}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold text-emerald-900/80">
                  <span className="bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                    ⏱️ Total Cycle: {meta.durationDays} Days
                  </span>
                  <span className="bg-pink-100/80 text-pink-900 px-3 py-1 rounded-full border border-pink-200">
                    💧 Water Req: {meta.waterReq}
                  </span>
                  <span className="bg-amber-100/80 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                    🌱 Soil pH: {meta.optimalPh}
                  </span>
                </div>
              </div>

              {/* Live Growth Stage Tracker */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/80 shadow-md min-w-[280px] sm:min-w-[340px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Crop Growth Tracker</span>
                  <span className="text-xs font-black text-emerald-950">{approximateDAS} DAS ({progressPercent}%)</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden mb-3 relative">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progressPercent}%` }} 
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-600 rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-emerald-900/80">
                  <span>Current: {monthData?.phase || "Vegetative Stage"}</span>
                  <span className="text-pink-600 font-extrabold">{daysRemaining > 0 ? `${daysRemaining}d to Harvest` : "Ready to Harvest!"}</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* ── Section 2: Interactive 12-Month Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-6 sm:p-8 mb-8 border border-emerald-200/60 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading italic text-2xl text-emerald-950">12-Month Phenological Roadmap</h2>
                <p className="text-emerald-700/70 text-xs font-semibold">Click any month below to switch the advisory & field schedule</p>
              </div>
            </div>

            {/* Viewing Month Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800/80">Viewing:</span>
              <span className="bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                {MONTH_NAMES[selectedMonth - 1]} ({monthData?.phase || 'Active Stage'})
              </span>
            </div>
          </div>

          <CropPhaseCalendar 
            crop={profile.crop} 
            selectedMonth={selectedMonth} 
            onSelectMonth={(m) => setSelectedMonth(m)} 
          />
        </motion.div>

        {/* ── Section 3: 5-Tab Production Agronomy Suite ── */}
        <div className="mb-6">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-emerald-900/10">
            {[
              { id: 'tasks', label: '📋 Weekly Action Tasks', desc: 'Step-by-step field checklist' },
              { id: 'fertilizer', label: '🧪 NPK Nutrient Calculator', desc: 'Precision fertilizer doses' },
              { id: 'pests', label: '🛡️ Pest & Disease Radar', desc: 'Bio & chemical protocols' },
              { id: 'water', label: '💧 Water & Irrigation', desc: 'Moisture requirements' },
              { id: 'schemes', label: '🏛️ MSP & Govt Subsidies', desc: 'Direct financial assistance' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer
                  ${activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]' 
                    : 'bg-white/70 text-emerald-900/70 hover:bg-white hover:text-emerald-950 border border-emerald-100'}`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Weekly Action Checklist */}
        {activeTab === 'tasks' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
            <div className="lg:col-span-2 space-y-4">
              <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-lg">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div>
                    <h3 className="font-heading italic text-2xl text-emerald-950">
                      {MONTH_NAMES[selectedMonth - 1]} Field Checklist
                    </h3>
                    <p className="text-emerald-700/70 text-xs font-semibold">Mark completed tasks as you perform them in your field</p>
                  </div>

                  {/* Audio voice advisory reader */}
                  <button
                    onClick={() => {
                      const allTips = ['week1', 'week2', 'week3', 'week4'].map((w, i) => monthData?.[w] ? `Week ${i + 1}: ${monthData[w]}` : '').filter(Boolean).join('. ');
                      handleSpeakText(`Advisory for ${MONTH_NAMES[selectedMonth - 1]}. ${allTips}`);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all shadow-sm
                      ${isSpeaking ? 'bg-pink-500 text-white border-pink-400 animate-pulse' : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'}`}
                    title="Listen to full monthly advisory aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isSpeaking ? "Speaking..." : "Read Month Advisory"}</span>
                  </button>
                </div>

                {monthData ? (
                  <div className="flex flex-col gap-3.5">
                    {['week1', 'week2', 'week3', 'week4'].map((weekKey, i) => {
                      const tip = monthData[weekKey];
                      if (!tip) return null;
                      const taskKey = `${profile.crop}-${selectedMonth}-${weekKey}`;
                      const isDone = !!completedTasks[taskKey];

                      return (
                        <AdvisoryCard
                          key={weekKey}
                          week={`Week ${i + 1}`}
                          tip={tip}
                          delay={i * 0.06}
                          isCompleted={isDone}
                          onToggleComplete={() => handleToggleTask(taskKey)}
                          onSpeak={(t) => handleSpeakText(t)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-emerald-800/50 font-bold">
                    <p>No specific field operations recorded for this rest period.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar: Alerts & Notifications */}
            <div className="space-y-6">
              {/* Critical Season Alerts */}
              {monthData?.alerts?.length > 0 && (
                <div className="liquid-glass rounded-3xl p-6 border border-rose-200/60 shadow-lg bg-rose-50/40">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                      <Bell className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading italic text-xl text-rose-950">High-Risk Season Alerts</h4>
                  </div>
                  <div className="space-y-2.5">
                    {monthData.alerts.map((alert, idx) => (
                      <AdvisoryCard key={idx} week="Critical" tip={alert} delay={idx * 0.08} isAlert />
                    ))}
                  </div>
                </div>
              )}

              {/* Notification Banner */}
              <div className="liquid-glass rounded-3xl p-6 border border-emerald-200/60 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading italic text-lg text-emerald-950">Weekly SMS & Push Alerts</h4>
                    <p className="text-emerald-700/70 text-xs">Never miss fertilizer timing or spray windows</p>
                  </div>
                </div>

                {notifStatus === 'granted' ? (
                  <div className="bg-emerald-100/90 text-emerald-800 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Weekly alerts active for {profile.crop}
                  </div>
                ) : (
                  <button
                    onClick={handleRequestNotifications}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-2xl shadow-md transition-colors"
                  >
                    Enable Browser Push Advisories
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: NPK & Fertilizer Calculator */}
        {activeTab === 'fertilizer' && (
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-lg animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-emerald-900/10">
              <div>
                <h3 className="font-heading italic text-3xl text-emerald-950">
                  Precision NPK & Micronutrient Calculator
                </h3>
                <p className="text-emerald-700/80 text-xs sm:text-sm font-semibold mt-1">
                  Scientifically calculated based on ICAR & State Agricultural University fertilizer dosage charts
                </p>
              </div>

              {/* Acreage Slider */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm min-w-[260px]">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-2">
                  <span>Farm Size (Acres):</span>
                  <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">{acreage} Acres</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={acreage}
                  onChange={(e) => setAcreage(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Split Dosages Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Basal Dose */}
              <div className="bg-white/90 p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider bg-lime-100 text-lime-900 px-2.5 py-0.5 rounded-full">Basal Dose</span>
                  <span className="text-[11px] text-emerald-700/60 font-semibold">At Sowing / Transplanting</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-emerald-950">
                  <li className="flex justify-between border-b border-emerald-100 pb-1.5">
                    <span>DAP (18:46:0):</span>
                    <strong className="text-emerald-700">{Math.round(meta.fertilizerDose.basalDAP * acreage)} kg</strong>
                  </li>
                  <li className="flex justify-between border-b border-emerald-100 pb-1.5">
                    <span>MOP (Potash):</span>
                    <strong className="text-emerald-700">{Math.round(meta.fertilizerDose.basalMOP * acreage)} kg</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Zinc Sulphate (21%):</span>
                    <strong className="text-emerald-700">{Math.round(meta.fertilizerDose.basalZinc * acreage)} kg</strong>
                  </li>
                </ul>
              </div>

              {/* 1st Top Dressing */}
              <div className="bg-white/90 p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">1st Top Dressing</span>
                  <span className="text-[11px] text-emerald-700/60 font-semibold">20–25 DAT (Active Tillering)</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-emerald-950">
                  <li className="flex justify-between border-b border-emerald-100 pb-1.5">
                    <span>Neem-Coated Urea:</span>
                    <strong className="text-emerald-700">{Math.round(meta.fertilizerDose.topDress1Urea * acreage)} kg</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Neem Cake Bio-Shield:</span>
                    <strong className="text-emerald-700">{Math.round(50 * acreage)} kg</strong>
                  </li>
                </ul>
              </div>

              {/* 2nd Top Dressing */}
              <div className="bg-white/90 p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full">2nd Top Dressing</span>
                  <span className="text-[11px] text-emerald-700/60 font-semibold">45–50 DAT (Panicle Initiation)</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-emerald-950">
                  <li className="flex justify-between border-b border-emerald-100 pb-1.5">
                    <span>Neem-Coated Urea:</span>
                    <strong className="text-emerald-700">{Math.round(meta.fertilizerDose.topDress2Urea * acreage)} kg</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>MOP (Potash for Grain Size):</span>
                    <strong className="text-emerald-700">{Math.round(meta.fertilizerDose.topDress2MOP * acreage)} kg</strong>
                  </li>
                </ul>
              </div>
            </div>

            {/* Organic Alternative Box */}
            <div className="bg-emerald-950 text-white p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">🌿 Zero-Chemical Organic Alternative</span>
                <h4 className="font-heading italic text-xl mt-1">Bio-Enriched Soil Nutrition Package</h4>
                <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl">
                  Incorporate {Math.round(meta.fertilizerDose.organicCompostTons * acreage)} tonnes of well-rotted FYM enriched with Trichoderma viride (5kg) + 200L Jeevamrutha per acre during peak tillering.
                </p>
              </div>
              <span className="bg-emerald-800 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
                100% Soil Friendly
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Pest & Disease Threat Radar */}
        {activeTab === 'pests' && (
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-lg animate-in fade-in duration-200">
            <h3 className="font-heading italic text-3xl text-emerald-950 mb-2">
              Pathogen & Pest Defense Matrix for {profile.crop}
            </h3>
            <p className="text-emerald-700/80 text-xs sm:text-sm font-semibold mb-6">
              Clinical symptoms and dual-protocol treatments (Chemical vs 100% Organic)
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {meta.keyThreats.map((threat, idx) => (
                <div key={idx} className="bg-white/90 p-5 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                        {threat.severity} Risk
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold">{threat.stage}</span>
                    </div>

                    <h4 className="font-heading italic text-xl text-emerald-950 mb-3">{threat.name}</h4>

                    <div className="space-y-2.5 text-xs">
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                        <strong className="text-emerald-950 block mb-0.5">🧪 Chemical Intervention:</strong>
                        <p className="text-emerald-800">{threat.chemical}</p>
                      </div>

                      <div className="bg-lime-50 p-2.5 rounded-xl border border-lime-200/60">
                        <strong className="text-lime-950 block mb-0.5">🌿 Organic Bio-Shield:</strong>
                        <p className="text-lime-900">{threat.organic}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Water & Irrigation Schedule */}
        {activeTab === 'water' && (
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-lg animate-in fade-in duration-200">
            <h3 className="font-heading italic text-3xl text-emerald-950 mb-2">
              Irrigation & Water Depth Protocol
            </h3>
            <p className="text-emerald-700/80 text-xs sm:text-sm font-semibold mb-6">
              Optimized for water savings, root aeration, and preventing fungal mycelium buildup
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { stage: "Transplanting / Seedling", depth: "2–3 cm Standing Water", desc: "Prevents seedling shock and suppresses early broadleaf weeds." },
                { stage: "Active Tillering", depth: "Intermittent Drying (AWD)", desc: "Drain field for 3–4 days to allow oxygen into root zone and stimulate tillers." },
                { stage: "Panicle Initiation & Flowering", depth: "3–5 cm Continuous Saturation", desc: "Most moisture-critical phase. Moisture stress causes spikelet sterility." },
                { stage: "Pre-Harvest Drying", depth: "Completely Drain Field", desc: "Drain 10–12 days prior to harvest for uniform grain drying & machine harvesting." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/90 p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">Stage {idx + 1}</span>
                  <h4 className="font-heading italic text-lg text-emerald-950 mb-2">{item.stage}</h4>
                  <span className="bg-sky-100 text-sky-900 font-extrabold text-xs px-2.5 py-1 rounded-md block mb-2">{item.depth}</span>
                  <p className="text-xs text-emerald-800/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Government Schemes & MSP */}
        {activeTab === 'schemes' && (
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-lg animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-900/10">
              <div>
                <h3 className="font-heading italic text-3xl text-emerald-950">
                  Government Support & MSP for {profile.crop}
                </h3>
                <p className="text-emerald-700/80 text-xs sm:text-sm font-semibold mt-1">
                  Official government welfare schemes, minimum support prices, and direct benefit transfers
                </p>
              </div>

              <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-200">Government MSP (2025–26)</span>
                <span className="text-base sm:text-lg font-black">{meta.msp}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {meta.schemes.map((scheme, idx) => (
                <div key={idx} className="bg-white/90 p-6 rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full mb-3 inline-block">
                      Official Scheme
                    </span>
                    <h4 className="font-heading italic text-xl text-emerald-950 mb-2">{scheme.name}</h4>
                    <p className="text-xs text-emerald-800/80 leading-relaxed mb-4">{scheme.desc}</p>
                  </div>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-950 transition-colors"
                  >
                    Visit Official Portal ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
