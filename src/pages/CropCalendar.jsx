import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, Calendar, Bell, BellOff, ChevronRight, 
  Check, Sprout, Wheat, Apple, CircleDot, Layers,
  ArrowLeft, Sun, CloudRain, Thermometer, RefreshCw
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {CROPS.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-200 group ${
                      selectedCrop === crop.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-200'
                        : 'border-emerald-100 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <p className="font-bold text-emerald-950 text-sm">{crop.label}</p>
                      <p className="text-emerald-600/70 text-xs font-semibold">{crop.hint}</p>
                      <p className="text-emerald-700/50 text-xs mt-0.5">{crop.desc}</p>
                    </div>
                    {selectedCrop === crop.id && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
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

export default function CropCalendar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // { crop, sowingMonth }
  const [loading, setLoading] = useState(true);
  const [notifStatus, setNotifStatus] = useState('default'); // 'default' | 'granted' | 'denied'
  const [savingProfile, setSavingProfile] = useState(false);

  const currentMonth = new Date().getMonth() + 1; // 1-indexed
  const currentMonthData = profile ? (advisories[profile.crop]?.[String(currentMonth)] || null) : null;

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  // Load saved profile from Firestore or localStorage
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      // Try localStorage first (works offline)
      const local = localStorage.getItem('bloomsense_crop_profile');
      if (local) {
        try { setProfile(JSON.parse(local)); } catch {}
      }
      // If logged in, fetch from Firestore (may be richer / synced)
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid, 'cropProfile', 'main'));
          if (snap.exists()) {
            const data = snap.data();
            setProfile({ crop: data.crop, sowingMonth: data.sowingMonth });
            localStorage.setItem('bloomsense_crop_profile', JSON.stringify({ crop: data.crop, sowingMonth: data.sowingMonth }));
          }
        } catch (e) {
          // Offline — use localStorage data
        }
      }
      setLoading(false);

      // Notification permission status
      if ('Notification' in window) setNotifStatus(Notification.permission);
    };
    loadProfile();
  }, [user]);

  const handleSetupComplete = async ({ crop, sowingMonth }) => {
    const profileData = { crop, sowingMonth };
    setProfile(profileData);
    setSavingProfile(true);
    // Persist locally (offline-safe)
    localStorage.setItem('bloomsense_crop_profile', JSON.stringify(profileData));
    // Persist to Firestore if logged in
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'cropProfile', 'main'), {
          crop, sowingMonth, updatedAt: Date.now()
        }, { merge: true });
      } catch (e) { /* offline — will sync later */ }
    }
    setSavingProfile(false);
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotifStatus(permission);
    if (permission === 'granted') {
      // In a full setup you'd grab FCM token here and save to Firestore
      // For now show a success notification as demonstration
      new Notification('🌾 BloomSense Advisories Enabled', {
        body: `You'll get weekly ${profile?.crop || 'crop'} tips every Monday morning.`,
        icon: '/icons/icon-192.png'
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem('bloomsense_crop_profile');
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-10 h-10 text-emerald-600 animate-bounce" />
          <p className="text-emerald-800 font-bold text-sm uppercase tracking-widest">Loading your farm...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  const cropInfo = CROPS.find(c => c.id === profile.crop);

  return (
    <div className="min-h-screen bg-pink-50 leaf-pattern-bg text-emerald-950 font-body">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex items-center gap-4 bg-pink-50/80 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to BloomSense
        </Link>
        <span className="text-emerald-300">|</span>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-emerald-950 text-sm">Crop Calendar</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-semibold text-emerald-700/60">{cropInfo?.icon} {profile.crop}</span>
          <button onClick={handleReset} className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors">
            <RefreshCw className="w-3 h-3" /> Change Crop
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto">

        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-pink-500 font-bold uppercase tracking-[0.25em] text-xs mb-3 block">Personalised Farm Intelligence</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-heading italic text-5xl md:text-7xl text-emerald-950 leading-none">
                {cropInfo?.icon} {profile.crop}
              </h1>
              <p className="text-emerald-700/70 font-medium mt-2 text-lg">{cropInfo?.hint} · Sowing month: {MONTH_NAMES[profile.sowingMonth - 1]}</p>
            </div>

            {/* Notification CTA */}
            <div>
              {notifStatus === 'granted' ? (
                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-3 rounded-full text-sm font-bold">
                  <Bell className="w-4 h-4" /> Weekly advisories enabled
                </div>
              ) : notifStatus === 'denied' ? (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-3 rounded-full text-sm font-bold border border-rose-200">
                  <BellOff className="w-4 h-4" /> Notifications blocked
                </div>
              ) : (
                <button
                  onClick={handleRequestNotifications}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Bell className="w-4 h-4" /> Enable Weekly Alerts
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Phase Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-6 md:p-8 mb-8 border border-emerald-200/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-heading italic text-2xl text-emerald-950">Growth Phase Timeline</h2>
              <p className="text-emerald-700/60 text-xs font-semibold uppercase tracking-wider">Full year at a glance</p>
            </div>
          </div>
          <CropPhaseCalendar crop={profile.crop} />
        </motion.div>

        {/* Current Month Advisory */}
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-emerald-200/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h2 className="font-heading italic text-2xl text-emerald-950">
                    {MONTH_NAMES[currentMonth - 1]} Advisory
                  </h2>
                  {currentMonthData && (
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full mt-1 inline-block">
                      {currentMonthData.phase}
                    </span>
                  )}
                </div>
              </div>

              {currentMonthData ? (
                <div className="flex flex-col gap-3">
                  {['week1','week2','week3','week4'].map((week, i) => (
                    currentMonthData[week] && (
                      <AdvisoryCard
                        key={week}
                        week={`Week ${i + 1}`}
                        tip={currentMonthData[week]}
                        delay={i * 0.08}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Leaf className="w-12 h-12 text-emerald-200 mb-4" />
                  <p className="text-emerald-800/40 font-semibold">No advisory data for this month yet.</p>
                  <p className="text-emerald-700/30 text-sm mt-1">We're adding more crops and months continuously.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Alerts & Right Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Season Alerts */}
            {currentMonthData?.alerts?.length > 0 && (
              <div className="liquid-glass rounded-3xl p-6 border border-rose-200/50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="font-heading italic text-xl text-emerald-950">Season Alerts</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {currentMonthData.alerts.map((alert, i) => (
                    <AdvisoryCard key={i} week="Alert" tip={alert} delay={i * 0.1} isAlert />
                  ))}
                </div>
              </div>
            )}

            {/* Offline Note */}
            <div className="bg-emerald-950 rounded-3xl p-6 text-white">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center mb-4">
                <CloudRain className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading italic text-xl mb-2">Works Offline</h3>
              <p className="text-emerald-300/80 text-sm font-medium leading-relaxed">
                All advisory data is stored on your device. Your crop calendar works even without internet — perfect for the field.
              </p>
            </div>

            {/* Quick links */}
            <div className="liquid-glass rounded-3xl p-6 border border-emerald-200/50">
              <h3 className="font-heading italic text-xl text-emerald-950 mb-4">More from BloomSense</h3>
              <div className="flex flex-col gap-2">
                {[
                  { to: '/#network', label: 'Disease Heatmap', icon: '🗺️' },
                  { to: '/#home',   label: 'Scan Your Crop',  icon: '🔬' },
                  { to: '/community', label: 'Farmer Community', icon: '👨‍🌾' },
                ].map(link => (
                  <Link key={link.to} to={link.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group">
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-sm font-bold text-emerald-800 group-hover:text-emerald-950 transition-colors">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400 ml-auto group-hover:text-emerald-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
