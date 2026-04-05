import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getModelsForTier } from '../../lib/godmode/ultraplinian';
import { Sparkles } from 'lucide-react';

export default function ConstellationFooter() {
  const models = useMemo(() => {
    // getModelsForTier('ultra') returns all deduplicated ~56+ models based on ultraplinian.js
    const ultraModels = getModelsForTier('ultra');
    return ultraModels.map(fullName => {
      const parts = fullName.split('/');
      return parts.length > 1 ? parts[1] : fullName;
    });
  }, []);

  return (
    <footer className="w-full relative z-10 pt-24 pb-12 overflow-hidden flex flex-col items-center">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] text-center mb-10 px-4">
        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-8 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          The Full Constellation Network
          <Sparkles className="w-4 h-4" />
        </h3>

        {/* Elegant Grid Setup optimized for performance */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.03 }
            }
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mx-auto opacity-80"
        >
          {models.map((modelName, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              className="px-3 py-2 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-[10px] md:text-xs font-mono font-bold text-white tracking-wide hover:bg-emerald-800/80 hover:border-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center text-center will-change-transform"
            >
              {modelName}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* BloomSense Ending Tag */}
      <div className="mt-16 flex flex-col items-center justify-center relative">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-emerald-500/50 to-emerald-500/100 block mb-6" />
        <h2 className="font-serif italic text-4xl sm:text-6xl tracking-tighter drop-shadow-2xl">
          <span className="text-white">Bloom</span>
          <span className="text-emerald-400">Sense</span>
        </h2>
        <div className="text-white/30 uppercase tracking-[0.3em] text-[8px] mt-4 font-bold border border-white/10 px-4 py-1 rounded-full bg-white/5">
          Infinite Synthesis Protocol
        </div>
      </div>
    </footer>
  );
}
