import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModelGrid({ targetModels, results }) {
  if (targetModels.length === 0) return (
    <div className="absolute inset-0 flex items-center justify-center text-emerald-800/30 text-xs uppercase font-bold tracking-widest">
      No Active Nodes
    </div>
  );

  return (
    <div className="absolute inset-0 p-4 flex flex-wrap justify-center items-center content-center gap-1.5 opacity-90 overflow-hidden">
      {targetModels.map((modelName) => {
        const result = results.find(r => r.model === modelName);
        
        let state = 'processing';
        if (result && !result.success) state = 'fractured';
        else if (result && result.success) state = 'converged';

        return (
          <div key={modelName} className="relative group">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: state === 'fractured' ? 0.3 : state === 'converged' ? 1.2 : 1,
                opacity: state === 'fractured' ? 0.3 : 1,
              }}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 box-border relative rounded-full transition-all duration-300
                ${state === 'processing' ? 'bg-amber-400 border border-amber-300 animate-pulse' : ''}
                ${state === 'fractured' ? 'bg-red-500 border border-red-400' : ''}
                ${state === 'converged' ? 'bg-emerald-500 border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}
              `}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md shadow-xl z-50">
                {modelName.split('/').pop()}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
