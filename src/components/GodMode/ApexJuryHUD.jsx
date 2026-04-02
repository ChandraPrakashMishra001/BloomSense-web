import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldCheck } from 'lucide-react';

export default function ApexJuryHUD({ winner }) {
  if (!winner) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="absolute top-8 right-8 z-30 w-[350px] sm:w-[450px] bg-black/60 backdrop-blur-xl border border-emerald-500/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)]"
      >
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-900/40 p-3 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold tracking-widest uppercase text-xs">
            <Trophy className="w-4 h-4" />
            Apex Answer Crystallized
          </div>
          <div className="text-amber-200/50 text-[10px] font-mono">Consensus: {winner.score}/100</div>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[500px] custom-scrollbar">
          <h3 className="font-heading text-xl text-emerald-100 mb-2 truncate">
            {winner.model.split('/').pop()}
          </h3>
          <div className="text-emerald-50/80 font-body text-sm leading-relaxed whitespace-pre-wrap">
            {winner.content}
          </div>
        </div>

        <div className="bg-emerald-950/50 p-2 border-t border-emerald-900/50 flex items-center justify-center gap-2 text-emerald-500 text-[10px] uppercase tracking-widest font-bold">
          <ShieldCheck className="w-3 h-3" />
          Verified by Sovereign Jury
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
