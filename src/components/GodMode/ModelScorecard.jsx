import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function ModelScorecard({ results, isRacing }) {
  const [expandedId, setExpandedId] = useState(null);
  
  // Sort by score descending
  const sorted = [...results].sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (!isRacing && sorted.length > 0 && sorted[0].success) {
      setExpandedId(sorted[0].model);
    }
  }, [isRacing, sorted.length > 0 ? sorted[0].model : null]);

  return (
    <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-6 backdrop-blur-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading italic text-2xl text-emerald-100 flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-emerald-400" />
          Consensus Scorecard
        </h3>
        {isRacing && (
          <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Synthesizing
          </span>
        )}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        <AnimatePresence>
          {sorted.map((res, index) => (
            <motion.div
              layout
              key={res.model}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setExpandedId(expandedId === res.model ? null : res.model)}
              className={`relative overflow-hidden rounded-xl p-4 border transition-colors cursor-pointer hover:border-emerald-500/50 ${
                index === 0 && !isRacing && res.success
                  ? 'bg-gradient-to-r from-emerald-900/80 to-emerald-800/40 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]' 
                  : 'bg-emerald-950/60 border-emerald-800/30'
              }`}
            >
              {index === 0 && !isRacing && res.success && (
                <div className="absolute top-0 right-0 bg-amber-400/20 text-amber-300 text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-lg backdrop-blur-sm">
                  Apex Answer
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-emerald-50 truncate max-w-[70%] font-mono text-sm">
                  {res.model.split('/').pop()}
                </span>
                
                {res.success ? (
                  <span className={`text-2xl font-heading italic ${index === 0 && !isRacing ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {res.score > 0 ? res.score : '...'}
                  </span>
                ) : (
                  <span className="text-rose-400 text-[10px] uppercase tracking-wider font-bold bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">Failed</span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium text-emerald-500/80 font-mono">
                <span>{res.duration_ms ? `${(res.duration_ms / 1000).toFixed(1)}s` : '...'}</span>
                {res.success && res.content && (
                  <span>{res.content.split(' ').length} words</span>
                )}
              </div>

              <AnimatePresence>
                {expandedId === res.model && res.content && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-emerald-900/40 text-emerald-100 text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto"
                  >
                    {res.content}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress bar background for "processing" vibe */}
              <div className="absolute bottom-0 left-0 h-1 bg-emerald-900/50 w-full opacity-70">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(res.score, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${index === 0 && !isRacing && res.success ? 'bg-amber-400' : 'bg-emerald-500'}`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {results.length === 0 && (
          <div className="h-full flex items-center justify-center text-emerald-800/50 font-bold text-sm uppercase tracking-widest">
            Awaiting Protocol...
          </div>
        )}
      </div>
    </div>
  );
}
