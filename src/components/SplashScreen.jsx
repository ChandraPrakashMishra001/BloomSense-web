import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

const mainEase = [0.16, 1, 0.3, 1];

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Counter logic simulating precision AI model loading
  useEffect(() => {
    let start = 0;
    const end = 100;
    const duration = 2000; // 2.0s loader
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 2;
      if (start > end) start = end;
      setProgress(start);
      if (start >= end) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 500);
        }, 250);
      }
    }, incrementTime * 2);

    return () => clearInterval(timer);
  }, [onComplete]);

  const titleText = "BloomSense";
  const titleChars = Array.from(titleText);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.98,
            filter: 'blur(8px)',
            transition: { duration: 0.5, ease: mainEase }
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-pink-50 text-emerald-950 overflow-hidden select-none leaf-pattern-bg"
        >
          {/* Grain overlay */}
          <div className="grain-overlay" aria-hidden="true" />

          {/* Ambient Radial Lighting */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-[100px] animate-pulse" />
          </div>

          {/* Core Animation Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            
            {/* Logo Orb with Floating Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 140, 
                damping: 14, 
                delay: 0.15 
              }}
              className="liquid-glass w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl border-2 border-emerald-200/70 bg-white/70 mb-6 cursor-default relative group"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotate: [0, 6, -6, 0]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                <Leaf className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 drop-shadow-md" />
              </motion.div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </motion.div>

            {/* BloomSense Title with Staggered Gold/Emerald Letters */}
            <div className="flex overflow-hidden mb-2">
              {titleChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.04,
                    ease: mainEase
                  }}
                  className={`text-4xl md:text-6xl font-heading italic text-[#D4AF37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] ${
                    char === 'S' ? 'ml-0.5' : ''
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Neural Subtext and Percentage Counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-center gap-3 mt-1"
            >
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-emerald-900/80 text-center">
                Neural Vision &bull; Phytochemical AI &bull; Sovereign Farmer Hub
              </p>
              
              {/* Tech Progress Bar */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-36 md:w-44 h-1.5 bg-emerald-900/10 relative overflow-hidden rounded-full border border-emerald-900/10 shadow-inner">
                  <motion.div 
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-pink-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-75"
                  />
                </div>
                <span className="text-[11px] font-mono font-black text-emerald-900 w-10 text-left">
                  {String(progress).padStart(3, '0')}%
                </span>
              </div>
            </motion.div>

          </div>

          {/* Neural Laser Scan Line */}
          <motion.div
            initial={{ y: "5vh", opacity: 0 }}
            animate={{
              y: ["5vh", "95vh", "5vh"],
              opacity: [0, 0.7, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent shadow-[0_0_12px_rgba(16,185,129,0.4)] z-20 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500/15 blur-md animate-pulse" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
