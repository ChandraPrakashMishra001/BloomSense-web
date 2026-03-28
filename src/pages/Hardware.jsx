import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, Camera, Cpu, Battery, Wifi, ArrowDownLeft, ArrowUpRight, 
  ChevronRight, LayoutGrid, Star, Calendar, User, Plus, Hexagon, 
  ArrowLeft, Microscope, Sun, Maximize, Zap, Droplets, ShieldCheck, HardDrive, X, Minimize
} from 'lucide-react';

const componentDetails = {
  OPTICS: {
    icon: Camera,
    title: "OPTICS",
    description: "200x Macro-Optical Lens Assembly with integrated 6-SMD LED Ring Light. Captures microscopic detail at 2mm focal distance — fungal spores, pest eggs, and early lesions completely invisible to the naked eye.",
    specs: [
      "200x magnification macro-optical assembly",
      "6-SMD LED Ring Light — shadowless illumination",
      "2mm focal distance for precise surface scanning",
      "4K resolution image capture pipeline"
    ]
  },
  "EDGE AI": {
    icon: Cpu,
    title: "EDGE AI",
    description: "ESP32-S3 Dual-Core 240MHz Microcontroller running quantized vision models entirely on-device. No internet required for diagnosis. If confidence exceeds 75%, result is instant. Below 75%, scan escalates automatically to Amania Cloud.",
    specs: [
      "ESP32-S3 — 240MHz dual-core processor",
      "16MB Flash + 8MB PSRAM on-board memory",
      "50+ regional crop diseases in local library",
      "Auto-escalation to Amania Gemini 2.5 Pro at <75% confidence"
    ]
  },
  POWER: {
    icon: Battery,
    title: "POWER",
    description: "High-density Lithium-Ion Battery Pack with trigger-based power logic for maximum efficiency. Weather-sealed USB-C port for fast charging and secure data sync with the Amania farmer app.",
    specs: [
      "14 hours continuous field operation",
      "Approximately 2,000 scans per full charge",
      "Trigger-based power logic between scans",
      "Weather-sealed USB-C charging and sync port"
    ]
  },
  NETWORK: {
    icon: Wifi,
    title: "NETWORK",
    description: "Hybrid connectivity architecture built for zero-signal rural Odisha. Fully functional offline using Edge AI. When any signal is detected, automatically syncs data, updates the live disease heatmap, and triggers community alerts.",
    specs: [
      "Fully offline-capable — no internet dependency",
      "Auto-sync on 2G/3G/4G signal detection",
      "Updates live regional disease heatmap on sync",
      "Triggers 5km radius farmer alert network automatically"
    ]
  }
};
import { Link } from 'react-router-dom';
import '@google/model-viewer';

export default function Hardware() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const [activeCard, setActiveCard] = React.useState(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const modelContainerRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (modelContainerRef.current) {
        if (modelContainerRef.current.requestFullscreen) {
          modelContainerRef.current.requestFullscreen();
        } else if (modelContainerRef.current.webkitRequestFullscreen) {
          modelContainerRef.current.webkitRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Explicitly play the background video to prevent browser autoplay blockers (which makes it look like a static photo)
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video auto-play was prevented by the browser:", error);
      });
    }
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-gray-200 overflow-x-hidden font-sans selection:bg-white/20 selection:text-white">
      
      {/* Navigation Return */}
      <nav className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-transparent mix-blend-difference">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Software
        </Link>
      </nav>

      {/* Section 1: Hero */}
      <section 
        className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden border-b border-white/[0.03]"
      >
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/Hardwarebackground.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-0" />
        
        <motion.div 
          style={{ opacity, y }}
          className="relative z-10 text-center flex flex-col items-center px-6"
        >
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/40 mb-8 block">
            BloomSense
          </span>
          <h1 
            className="font-serif italic text-6xl md:text-8xl lg:text-[120px] leading-[0.9] text-white mb-6 drop-shadow-2xl tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Engineered<br className="md:hidden" /> for the Field.
          </h1>
          <p className="text-sm md:text-base text-gray-400 font-light max-w-xl mx-auto tracking-[0.2em] uppercase mt-4">
            Built for Bharat. Offline instinct. Online precision.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 z-10"
        >
          <ArrowDown className="w-6 h-6 text-white/30" />
        </motion.div>
      </section>

      {/* Section 2: Dashboard Design */}
      <section className="relative z-20 md:-mt-24 px-4 md:px-8 w-full flex justify-center pb-24 border-b border-white/5 bg-[#050505]">
        <div className="w-full max-w-[1300px] flex flex-col md:flex-row bg-[#0A0A0A] rounded-[40px] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative">
          
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-screen pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

          {/* Sidebar */}
          <div className="w-full md:w-[80px] bg-white/[0.01] border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center py-6 px-6 md:px-0 gap-8 justify-between md:justify-start relative z-10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Hexagon className="w-5 h-5 fill-black" />
            </div>
            
            {/* Removed Sidebar Icons */}

            <div className="md:mt-auto w-10 h-10 rounded-[14px] bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-12 lg:p-14 flex flex-col gap-12 relative z-10">
            
            {/* Top Pipeline Card */}
            <div 
              ref={modelContainerRef}
              className="w-full h-[300px] md:h-[400px] relative rounded-[40px] overflow-hidden bg-[#0A0A0A] border border-white/[0.08] group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-[#151515] opacity-80" />
              
              {/* Fullscreen Toggle Button */}
              <button 
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors z-20 text-white/50 backdrop-blur-md"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

              <div className="absolute inset-0 z-0">
                {/* 3D Model injected into the dashboard card */}
                <model-viewer
                  src="/AgriProbe-compressed.glb"
                  alt="3D Agri-Probe Hardware Model"
                  auto-rotate
                  camera-controls
                  touch-action="pan-y"
                  shadow-intensity="1"
                  environment-image="neutral"
                  exposure="0.8"
                  style={{ width: '100%', height: '100%', outline: 'none' }}
                  class="opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
                ></model-viewer>
                {/* Soft gradient bottom over the image to make text readable, pointer disabled so model-viewer gets events */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 pointer-events-none" />
              </div>
              
              {/* Card Texts */}
              <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end pr-8 md:pr-10 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-extrabold">LIVE HARDWARE LINK</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl text-white mb-2 tracking-tight drop-shadow-xl" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Agri-Probe Pipeline</h2>
                  <p className="text-gray-500 text-xs md:text-sm font-light italic">Calibrating optics and neural edge processing...</p>
                </div>

                <div className="px-6 py-3 rounded-full border border-white/10 bg-[#050505]/60 backdrop-blur-xl flex flex-col items-center shadow-2xl mr-8 md:mr-4">
                  <span className="text-gray-500 text-[8px] uppercase tracking-[0.4em] font-bold mb-1">FIRMWARE</span>
                  <span className="text-white text-sm font-medium font-serif italic">v1.2.0-beta</span>
                </div>
              </div>
            </div>

            {/* Operator Middle Row Removed */}

            {/* Bottom Grid Actions */}
            <div className="w-full">
              
              {/* Left Grid Panel (Pills) */}
              <div className="w-full flex flex-col gap-6">
                
                {/* 4 Square Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    {name: "OPTICS", icon: Camera},
                    {name: "EDGE AI", icon: Cpu},
                    {name: "POWER", icon: Battery},
                    {name: "NETWORK", icon: Wifi}
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveCard(item.name)}
                      className="bg-[#111111]/80 rounded-[32px] md:rounded-[40px] p-6 pb-8 flex flex-col items-center justify-center border border-white/[0.04] hover:bg-[#151515] hover:border-white/10 transition-all cursor-pointer group aspect-[4/5] md:aspect-square relative overflow-hidden"
                    >
                      {/* Subtle reflection */}
                      <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#050505] border border-white/5 flex items-center justify-center mb-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:border-[#00FF88]/30 transition-all duration-300">
                        <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-[#00FF88] transition-colors" />
                      </div>
                      <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-bold group-hover:text-[#00FF88]/80 transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* 2 Wide Pills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Left Pill */}
                  <div className="bg-[#111111]/80 rounded-[32px] p-6 md:p-8 flex items-center gap-6 border border-white/[0.04] cursor-pointer hover:bg-[#151515] transition-all group overflow-hidden relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="relative z-10">
                       <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-bold mb-2">DIAGNOSTIC CONFIDENCE</p>
                       <p className="text-white text-3xl md:text-4xl" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>98.4%</p>
                    </div>
                  </div>
                  
                  {/* Right Pill */}
                  <div className="bg-[#111111]/80 rounded-[32px] p-6 md:p-8 flex items-center gap-6 border border-white/[0.04] cursor-pointer hover:bg-[#151515] transition-all group overflow-hidden relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="relative z-10">
                       <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-bold mb-2">BATTERY LIFE</p>
                       <p className="text-white text-3xl md:text-4xl" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>14.2h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Hardware Specifications */}
      <section className="py-24 px-6 md:px-12 w-full flex justify-center bg-[#050505]">
        <div className="max-w-[1300px] w-full">
          <div className="text-center md:text-left mb-16 px-2">
            <h2 className="text-5xl md:text-6xl text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Hardware Specifications</h2>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-extrabold">Detailed Internal Telemetry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { icon: Microscope, title: "200x Macro Optics", desc: "Captures fungal spores invisible to the naked eye." },
               { icon: Sun, title: "6-SMD LED Ring Light", desc: "Shadowless illumination at 2mm focal distance." },
               { icon: Cpu, title: "ESP32-S3 Edge AI", desc: "On-device inference, zero cloud dependency." },
               { icon: Maximize, title: "1.3\" OLED Display", desc: "Sunlight-readable results in Odia and English." },
               { icon: Battery, title: "14-Hour Battery", desc: "Approximately 2,000 scans per charge." },
               { icon: Zap, title: "Sealed USB-C Port", desc: "Weather-proof charging and data sync." },
               { icon: Droplets, title: "IP65 Rated", desc: "Monsoon and pesticide resistant." },
               { icon: ShieldCheck, title: "1.5m Drop Tested", desc: "Concrete drop survival rating." },
               { icon: HardDrive, title: "One-Handed Operation", desc: "Glove-friendly sealed button cluster." },
             ].map((spec, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="bg-[#0A0A0A] border border-white/[0.03] p-8 md:p-10 rounded-[40px] hover:bg-[#111111] hover:border-white/[0.06] transition-all duration-300 group shadow-lg"
               >
                 <spec.icon className="w-8 h-8 text-white/30 mb-8 group-hover:text-white transition-colors" />
                 <h3 className="text-white/90 font-serif italic text-2xl mb-3">{spec.title}</h3>
                 <p className="text-white/40 text-sm leading-relaxed font-light">{spec.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Section 4: Full Width Hardware Image */}
      <section className="bg-black w-full flex flex-col items-center justify-center py-24 relative overflow-hidden border-t border-white/[0.03]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full max-w-[1300px] mx-auto px-4 md:px-12 relative z-10"
        >
          <img 
            src="/probe-render.webp" 
            alt="3D Probe Render" 
            className="w-full h-auto object-cover rounded-[40px] border border-white/[0.05] opacity-[0.85] mix-blend-screen shadow-[0_0_50px_rgba(255,255,255,0.02)]"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-[40vh] md:h-[60vh] flex flex-col items-center justify-center border border-white/5 rounded-[40px] bg-[#050505]"><Maximize class="w-12 h-12 text-white/10 mb-6" /><p class="text-white/20 text-[10px] uppercase tracking-[0.3em]">[ missing: /probe-render.webp ]</p></div>';
            }}
          />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/40 font-serif italic mt-12 text-sm text-center"
        >
          Agri-Probe Neural Leaf v1.2 — High Resolution Render
        </motion.p>
      </section>

      {/* Component Details Modal */}
      <AnimatePresence>
        {activeCard && componentDetails[activeCard] && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCard(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none p-4 md:p-6">
              <motion.div 
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 md:border-[#00FF88]/20 rounded-[40px] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto relative overflow-hidden"
              >
                {/* Subtle top reflection / glow */}
                <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-[#00FF88]/[0.05] to-transparent pointer-events-none" />
                
                {/* Close Button */}
                <button 
                  onClick={() => setActiveCard(null)}
                  className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors z-10 group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>

                <div className="relative z-10">
                  {/* Floating Icon */}
                  <div className="w-20 h-20 rounded-full bg-[#050505] border border-[#00FF88]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
                    {React.createElement(componentDetails[activeCard].icon, { className: "w-8 h-8 text-[#00FF88]" })}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-4xl md:text-5xl text-white font-serif italic mb-6">
                    {componentDetails[activeCard].title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                    {componentDetails[activeCard].description}
                  </p>

                  {/* Green Divider line */}
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#00FF88]/50 via-[#00FF88]/10 to-transparent mb-8" />

                  {/* Spec Bullets */}
                  <ul className="space-y-4">
                    {componentDetails[activeCard].specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-4 text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-[#00FF88] mt-2 shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
                        <span className="text-sm md:text-base">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Footer / Contact Section */}
      <footer className="w-full bg-[#030303] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 flex flex-col items-center relative z-20">
        <div className="max-w-[1300px] w-full flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-serif italic text-white mb-2 tracking-wide">BloomSense</h4>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">A part of Neural Leaf</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end p-6 md:p-8 border border-white/5 rounded-3xl bg-white/[0.02] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-3 font-extrabold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] opacity-80" />
              PARTNERSHIPS & INQUIRIES
            </p>
            <a href="mailto:mishrac373@gmail.com" className="text-white text-lg md:text-xl font-light hover:text-[#00FF88] transition-colors tracking-wide">
              mishrac373@gmail.com
            </a>
          </div>
        </div>
        
        <div className="w-full max-w-[1300px] border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-semibold text-center md:text-left">
            © {new Date().getFullYear()} BloomSense. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">Home</Link>
            <Link to="/technology" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">Technology</Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
