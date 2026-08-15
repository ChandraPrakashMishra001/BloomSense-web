import React, { useState, useEffect } from 'react';
import { PhoneCall, Wifi, WifiOff, ShieldAlert, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KisanEmergencyBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2 pointer-events-auto select-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="liquid-glass-strong p-5 rounded-3xl shadow-2xl border border-emerald-200/80 bg-white/95 max-w-xs w-72 text-emerald-950 mb-1"
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="font-heading italic text-xl font-bold">Kisan Helpline</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-emerald-800/80 font-medium mb-4 leading-relaxed">
              Official Indian agricultural advisory &amp; emergency pest outbreak reporting.
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:1551"
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>Kisan Call Center (Toll-Free)</span>
                </div>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono">1551</span>
              </a>

              <a
                href="tel:18001801551"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>National Agri Hotline</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono">1800-180-1551</span>
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-900/10 flex items-center justify-between text-[11px] font-semibold text-emerald-800/70">
              <span>Network Status:</span>
              <span className={`inline-flex items-center gap-1 font-bold ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online (Live Sync)
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Offline (PWA Cache Ready)
                  </>
                )}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="liquid-glass px-4 py-2.5 rounded-full shadow-lg border border-emerald-200/80 bg-white/90 flex items-center gap-2.5 text-xs font-bold text-emerald-950 hover:bg-white transition-colors"
        title="Kisan Emergency Support & Network Status"
      >
        <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
        <span className="hidden sm:inline">Kisan 1551 Support</span>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-emerald-600" /> : <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />}
      </motion.button>
    </div>
  );
}
