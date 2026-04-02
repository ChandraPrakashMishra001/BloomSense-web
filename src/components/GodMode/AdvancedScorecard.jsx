import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function AdvancedScorecard({ results }) {
  if (!results || results.length === 0) return (
    <div className="flex-col h-full items-center justify-center text-center opacity-40 py-12 hidden">
    </div>
  );

  const validResults = results.filter(r => r.success).sort((a,b) => b.score - a.score).slice(0, 5);

  return (
    <div className="w-full flex flex-col pt-2">
      <div className="flex items-center gap-2 text-emerald-800 font-bold uppercase tracking-widest text-xs mb-6">
        <Activity className="w-4 h-4" />
        Top Metrics
      </div>

      <div className="space-y-4">
        {validResults.map((res, i) => {
          const rawScore = res.score;

          return (
            <div key={res.model} className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase">
                <span className="truncate max-w-[150px]">{res.model.split('/').pop()}</span>
                <span className="text-emerald-600">{rawScore}</span>
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${rawScore}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
      {validResults.length === 0 && (
         <div className="text-gray-400 text-xs text-center py-4 italic font-medium">Awaiting completions...</div>
      )}
    </div>
  );
}
