import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, Zap, AlertTriangle, Leaf, CheckCircle2, Circle, 
  Info, Volume2, VolumeX, Sparkles, Shield, Wheat, Sprout
} from 'lucide-react';
import { safeSpeak, safeStopSpeech, isSpeechAvailable } from '../utils/speechUtils';

const URGENCY_CONFIG = {
  high:   { border: 'border-rose-300', bg: 'bg-rose-50/90', icon: AlertTriangle, iconColor: 'text-rose-600', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  medium: { border: 'border-amber-300', bg: 'bg-amber-50/90', icon: Zap, iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  low:    { border: 'border-emerald-300', bg: 'bg-emerald-50/90', icon: Sprout, iconColor: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  info:   { border: 'border-sky-300', bg: 'bg-sky-50/90', icon: Info, iconColor: 'text-sky-600', badge: 'bg-sky-100 text-sky-800 border-sky-200' },
};

function getCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('fertil') || lower.includes('urea') || lower.includes('dap') || lower.includes('mop') || lower.includes('npk') || lower.includes('potash')) return 'Nutrient Management';
  if (lower.includes('blast') || lower.includes('blight') || lower.includes('pest') || lower.includes('borer') || lower.includes('hopper') || lower.includes('spray') || lower.includes('neem') || lower.includes('fungi')) return 'Pest & Disease Shield';
  if (lower.includes('water') || lower.includes('irriga') || lower.includes('drain') || lower.includes('moisture')) return 'Irrigation & Drainage';
  if (lower.includes('harvest') || lower.includes('dry') || lower.includes('thresh') || lower.includes('store') || lower.includes('procure')) return 'Harvest & Post-Harvest';
  if (lower.includes('sow') || lower.includes('nursery') || lower.includes('seed') || lower.includes('transplant') || lower.includes('plough')) return 'Sowing & Field Prep';
  return 'Agronomic Advisory';
}

function getUrgency(text) {
  const lower = text.toLowerCase();
  if (lower.includes('blast') || lower.includes('destroy') || lower.includes('outbreak') || lower.includes('fatal') || lower.includes('critical') || lower.includes('immediately')) return 'high';
  if (lower.includes('scout') || lower.includes('monitor') || lower.includes('risk') || lower.includes('apply') || lower.includes('spray') || lower.includes('check')) return 'medium';
  if (lower.includes('price') || lower.includes('msp') || lower.includes('register') || lower.includes('plan') || lower.includes('subsidy')) return 'info';
  return 'low';
}

export default function AdvisoryCard({ 
  week, 
  tip, 
  delay = 0, 
  isAlert = false,
  isCompleted = false,
  onToggleComplete = null,
  onSpeak = null
}) {
  const urgency = isAlert ? 'high' : getUrgency(tip);
  const config = URGENCY_CONFIG[urgency];
  const Icon = config.icon;
  const category = getCategory(tip);

  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (onSpeak) {
      onSpeak(tip);
    } else if (isSpeechAvailable()) {
      if (isSpeakingLocal) {
        safeStopSpeech();
        setIsSpeakingLocal(false);
        return;
      }
      safeStopSpeech();
      safeSpeak(tip, {
        rate: 0.95,
        pitch: 1.1,
        onStart: () => setIsSpeakingLocal(true),
        onEnd: () => setIsSpeakingLocal(false),
        onError: () => setIsSpeakingLocal(false)
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 group relative ${config.border} ${config.bg} ${
        isCompleted ? 'opacity-70 bg-stone-50 border-stone-200' : 'hover:shadow-md hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Interactive Checkbox for Farmer Task Tracking */}
        {onToggleComplete ? (
          <button
            type="button"
            onClick={onToggleComplete}
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-0.5 border cursor-pointer ${
              isCompleted 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                : 'bg-white border-emerald-300 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50'
            }`}
            title={isCompleted ? "Mark as Incomplete" : "Mark as Done in Field"}
          >
            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-40" />}
          </button>
        ) : (
          <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border ${config.border}`}>
            <Icon className={`w-4 h-4 ${config.iconColor}`} />
          </div>
        )}

        {/* Advisory Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badge}`}>
                {isAlert ? '⚠ Critical Alert' : week}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800/70 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-900/10">
                {category}
              </span>
            </div>

            {/* Read Aloud Audio Voice Button */}
            <button
              type="button"
              onClick={handleSpeak}
              className="p-1 rounded-full text-emerald-700 hover:text-emerald-950 hover:bg-white transition-colors"
              title="Listen to this advisory aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className={`text-sm text-emerald-950 font-medium leading-relaxed ${isCompleted ? 'line-through text-emerald-900/50' : ''}`}>
            {tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
