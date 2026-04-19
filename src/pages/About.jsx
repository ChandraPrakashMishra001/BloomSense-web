import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, Scan, Cpu, Map, Brain,
  Cloud, Layers, Activity, Shield, Microscope, Zap, Database, Focus, Leaf
} from 'lucide-react';

const customEase = [0.16, 1, 0.3, 1];

const ScrollReveal = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.8, delay, ease: customEase }}
    className={className}
    style={{ willChange: 'transform, opacity' }}
  >
    {children}
  </motion.div>
);

const features = [
  {
    icon: Scan,
    accent: 'from-pink-400 to-rose-500',
    tag: 'Core Feature',
    title: 'AI Plant & Disease Scanning',
    desc: 'Powered by AmanAI (Gemini 3.1 Pro & Flash), BloomSense lets any farmer point their phone at a leaf and receive an instant, clinical-grade diagnosis of diseases, pests, and contamination — with 98.4% confidence. Supports camera input and real-time processing.'
  },
  {
    icon: Cpu,
    accent: 'from-emerald-500 to-teal-600',
    tag: 'Hardware',
    title: 'Agri-Probe Neural Leaf Device',
    desc: 'A purpose-built, IP65-rated field scanner with a 200x macro-optical lens, ESP32-S3 edge AI processor (240 MHz, 16MB Flash), 6-SMD LED Ring Light, 14-hour battery, and sunlight-readable OLED. Fully offline-capable; auto-syncs on any signal.'
  },
  {
    icon: Map,
    accent: 'from-blue-400 to-indigo-500',
    tag: 'Intelligence',
    title: 'Live Disease Heatmap & Alert Network',
    desc: 'Every scan logs a GPS-stamped disease signature to a shared Firebase database. A real-time Leaflet heatmap visualizes active infection zones. Farmers within a 5 km radius receive instant push-notification alerts about nearby outbreaks — a world-first farmer-to-farmer network.'
  },
  {
    icon: Brain,
    accent: 'from-purple-400 to-violet-600',
    tag: 'AI Powerhouse',
    title: 'ANANT — Multi-Model AI Consensus',
    desc: "ANANT (अनंत) is BloomSense's advanced AI engine that races multiple frontier LLMs (GPT-4o, Gemini, Llama, Mistral, DeepSeek and more) simultaneously via OpenRouter and returns the highest-scoring consensus answer. It applies Parseltongue obfuscation for prompt privacy and auto-classifies queries by sector to tune model parameters."
  },
  {
    icon: Cloud,
    accent: 'from-sky-400 to-cyan-500',
    tag: 'Environmental',
    title: 'Weather Intelligence Engine',
    desc: "Real-time weather data — temperature, humidity, wind speed, and UV index — pulled from the Open-Meteo API using the farmer's live GPS coordinates. Correlates atmospheric conditions with disease risk forecasts to give actionable warnings before outbreaks begin."
  },
  {
    icon: Layers,
    accent: 'from-amber-400 to-orange-500',
    tag: 'Farmer Resource',
    title: 'Crop Phase Calendar',
    desc: 'An interactive calendar that maps crop growth phases (sowing, vegetative, flowering, harvest) to the Gregorian calendar. Farmers get day-specific advisories, critical intervention windows, and task reminders tailored to their crop cycle — from paddy to wheat and beyond.'
  },
  {
    icon: Activity,
    accent: 'from-rose-400 to-pink-600',
    tag: 'Social',
    title: 'Community Hub & Public Feed',
    desc: 'A real-time social layer for farmers — post updates, share scan results, react with emojis, and comment on disease alerts. Firebase-powered and mobile-optimized, the Community page functions like a hyperlocal agricultural Twitter, built specifically for rural Odisha and beyond.'
  },
  {
    icon: Shield,
    accent: 'from-green-400 to-emerald-600',
    tag: 'Information',
    title: 'Government Schemes Hub',
    desc: 'An always-live ticker and card grid displaying the latest Central and State government schemes for farmers — including PM-KISAN, Samrudha Krushaka Yojana, Shree Anna Abhiyan, and CM-KISAN. Personalized AmanAI recommendations suggest schemes based on recent scan history.'
  },
  {
    icon: Microscope,
    accent: 'from-teal-400 to-emerald-600',
    tag: 'Knowledge Base',
    title: 'Botanical Archive',
    desc: 'A searchable, illustrated database of 12+ medicinal herbs and plants (Ashwagandha, Tulsi, Neem, Brahmi, Turmeric, Aloe Vera, and more) with scientific names, key phytochemical properties, diseases targeted, and traditional cure methods — all accessible offline.'
  },
  {
    icon: Zap,
    accent: 'from-yellow-400 to-amber-500',
    tag: 'Authentication',
    title: 'Secure Firebase Auth & PWA',
    desc: 'Full Google Sign-In authentication via Firebase for personalized access. BloomSense is a Progressive Web App (PWA) — installable on Android and iOS directly from the browser with custom install prompts, offline caching via service workers, and push notification support.'
  },

  {
    icon: Focus,
    accent: 'from-pink-500 to-fuchsia-600',
    tag: 'Accessibility',
    title: 'Multi-Language & Localization',
    desc: 'Google Translate integration across all pages supports 14+ languages including Hindi, Odia, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Punjabi, Assamese, and Indonesian — making BloomSense the first truly multilingual precision agri-platform for India.'
  }
];

const stats = [
  { val: '98.4%', label: 'Diagnostic Accuracy' },
  { val: '50+',   label: 'Crop Diseases Detected' },
  { val: '14 h',  label: 'Field Battery Life' },
  { val: '14',    label: 'Languages Supported' },
];

const techStack = [
  'React + Vite', 'Firebase Firestore', 'Firebase Auth', 'Gemini 3.1 Pro & Flash',
  'Google Translate API', 'Framer Motion', 'Open-Meteo API', 'Leaflet.js',
  'OpenRouter AI', 'ESP32-S3 Edge AI', 'Node.js + TypeScript', 'PWA + Service Worker',
  'Tailwind CSS', 'Lucide Icons', 'Cloudflare', 'Railway'
];

export default function About() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-pink-50 min-h-screen text-emerald-950 font-body leaf-pattern-bg overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex justify-between items-center bg-pink-50/80 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
        <Link to="/" className="flex items-center gap-3 text-emerald-800 hover:text-emerald-950 transition-colors group">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200/60">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="font-heading italic text-2xl text-emerald-950">BloomSense</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 text-center overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-emerald-200/40 to-pink-200/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-pink-300/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-60 -right-40 w-[400px] h-[400px] bg-emerald-200/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: customEase }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <span className="text-pink-500 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">About the Project</span>
          <h1 className="font-heading italic text-6xl md:text-8xl tracking-tight text-emerald-950 leading-[0.9] mb-8">
            What is<br />BloomSense?
          </h1>
          <p className="text-emerald-800/80 font-medium text-lg md:text-xl max-w-3xl mx-auto text-balance leading-relaxed">
            BloomSense is an end-to-end, AI-powered agri-health platform built for Bharat's farmers — combining advanced computer vision, edge hardware, community intelligence, and real-time data to put precision agriculture into every farmer's hand.
          </p>
        </motion.div>
      </section>

      {/* ── MISSION ── */}
      <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
        <ScrollReveal>
          <div className="liquid-glass rounded-[2.5rem] p-10 md:p-16 border border-emerald-200/50 text-center relative overflow-hidden bg-gradient-to-br from-white/60 to-white/30">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/40 via-pink-50/30 to-emerald-50/40 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-pink-400 to-emerald-400 rounded-full" />
                <span className="text-emerald-900/50 uppercase tracking-[0.3em] font-black text-xs">Our Mission</span>
                <div className="w-1 h-10 bg-gradient-to-b from-emerald-400 to-pink-400 rounded-full" />
              </div>
              <blockquote className="font-heading italic text-3xl md:text-4xl text-emerald-950 leading-tight max-w-4xl mx-auto">
                "To democratize precision agriculture by merging cutting-edge AI with rugged field hardware — ensuring every farmer, regardless of connectivity or literacy, can protect their crops with clinical accuracy."
              </blockquote>
              <p className="mt-6 text-pink-600/80 text-sm font-bold tracking-[0.1em] uppercase">
                Chandra Prakash Mishra · Founder, BloomSense
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading italic text-5xl md:text-6xl text-emerald-950 mb-4 tracking-tight">Everything Inside BloomSense</h2>
          <p className="text-emerald-800/60 font-medium text-lg text-balance max-w-2xl mx-auto">
            A complete ecosystem — from leaf-level scanning to nationwide disease intelligence.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="liquid-glass rounded-3xl p-8 border border-emerald-200/50 group hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 h-full flex flex-col bg-white/40 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feat.accent} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`} />
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.accent} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-800/50 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="font-heading italic text-2xl text-emerald-950 mb-3 tracking-tight leading-tight">{feat.title}</h3>
                  <p className="text-emerald-800/70 text-sm leading-relaxed font-medium flex-1">{feat.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
        <ScrollReveal>
          <div className="liquid-glass rounded-[2.5rem] border border-emerald-200/50 px-8 py-14 bg-white/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="font-heading italic text-5xl md:text-6xl text-emerald-950 mb-2 leading-none">{s.val}</p>
                  <p className="text-emerald-800/50 text-xs font-black uppercase tracking-[0.2em]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── TECH STACK ── */}
      <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-heading italic text-4xl md:text-5xl text-emerald-950">Built With</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="liquid-glass text-emerald-800 text-sm font-bold border border-emerald-900/10 px-5 py-2.5 rounded-full hover:bg-white/90 hover:shadow-md transition-all duration-300 cursor-default hover:-translate-y-0.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── CREATOR CARD ── */}
      <section className="px-6 lg:px-12 pb-32 max-w-[1400px] mx-auto">
        <ScrollReveal>
          <div className="liquid-glass rounded-[2.5rem] p-10 md:p-14 border border-emerald-200/50 bg-gradient-to-br from-white/70 to-emerald-50/40 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-pink-200/40 to-emerald-200/30 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
              {/* Avatar — Creator Photo */}
              <div className="flex-shrink-0">
                <div className="w-44 h-56 md:w-52 md:h-64 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-400/20 border-4 border-white ring-2 ring-emerald-200/60">
                  <img
                    src="/kunmun.jpeg"
                    alt="Chandra Prakash Mishra"
                    className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-700 bg-white/50"
                  />
                </div>
              </div>
              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <p className="text-pink-500 font-bold uppercase tracking-[0.25em] text-xs mb-3">Creator &amp; Developer</p>
                <h3 className="font-heading italic text-4xl md:text-5xl text-emerald-950 mb-4 leading-tight">
                  Chandra Prakash Mishra
                </h3>
                <p className="text-emerald-800/70 font-medium text-base md:text-lg leading-relaxed max-w-2xl mb-8 text-balance">
                  A student-developer from Odisha building technology for the real India. BloomSense was conceived as a complete, production-grade solution to protect the agricultural heartland of Bharat using AI, open-source tools, and a deep respect for the farmer's daily reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a
                    href="mailto:mishrac373@gmail.com"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-600/25"
                  >
                    Get in Touch <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 liquid-glass border border-emerald-900/10 text-emerald-800 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Main App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-emerald-900/10 py-8 px-6 lg:px-12 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading italic text-xl text-emerald-950">BloomSense</span>
          <span className="text-emerald-800/40 text-xs font-bold uppercase tracking-[0.2em]">Neural Leaf</span>
        </div>
        <p className="text-emerald-800/50 text-sm font-semibold">
          © {new Date().getFullYear()} BloomSense. Made by Chandra Prakash Mishra.
        </p>
      </footer>

    </div>
  );
}
