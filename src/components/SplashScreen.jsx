import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

const mainEase = [0.16, 1, 0.3, 1];

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Counter logic simulating precision AI model loading
  useEffect(() => {
    let start = 0;
    const end = 100;
    const duration = 2200; // 2.2 seconds loader
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setProgress(start);
      if (start >= end) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          // Wait for exit animation to complete before calling onComplete
          setTimeout(onComplete, 600);
        }, 300);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Split title characters for staggering
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
            scale: 0.96,
            filter: 'blur(10px)',
            transition: { duration: 0.6, ease: mainEase }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-pink-50 text-emerald-950 overflow-hidden select-none leaf-pattern-bg"
        >
          {/* Subtle Ambient Radial Gradients to match Home page */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
          </div>

          {/* Core Animation Container */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* Logo Button - Matches Navbar Top Left Branding */}
            <motion.div
              initial={{ scale: 0, rotate: -35 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 14, 
                delay: 0.2 
              }}
              className="liquid-glass w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-xl border border-emerald-200/50 bg-white/40 mb-8 cursor-default group"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.06, 1],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                <Leaf className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 drop-shadow-sm" />
              </motion.div>
            </motion.div>

            {/* BloomSense Title with Staggered Character Fade-in */}
            <div className="flex overflow-hidden mb-3">
              {titleChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 35, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + index * 0.05,
                    ease: mainEase
                  }}
                  className={`text-4xl md:text-5xl font-heading italic text-emerald-950 drop-shadow-sm ${
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
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-emerald-800/80 text-center">
                Neural Leaf Scan &bull; Precision AI
              </p>
              
              {/* Tech Progress Line */}
              <div className="flex items-center gap-4 mt-1">
                <div className="w-28 h-[2px] bg-emerald-900/10 relative overflow-hidden rounded-full border border-emerald-900/5">
                  <motion.div 
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-pink-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]"
                  />
                </div>
                <span className="text-[10px] md:text-xs font-mono font-bold text-emerald-800 w-8">
                  {String(progress).padStart(3, '0')}%
                </span>
              </div>
            </motion.div>

          </div>

          {/* Neural Laser Scan Effect - soft glow sweeps screen */}
          <motion.div
            initial={{ top: "5%", opacity: 0 }}
            animate={{
              top: ["5%", "95%", "5%"],
              opacity: [0, 0.6, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)] z-20 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-emerald-500/10 blur-sm animate-pulse" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
