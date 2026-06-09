import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Zap, AlertTriangle, Leaf, CheckCircle, Info } from 'lucide-react';

const URGENCY_CONFIG = {
  high:   { border: 'border-rose-400/60',   bg: 'bg-rose-50',    icon: AlertTriangle, iconColor: 'text-rose-500',   badge: 'bg-rose-100 text-rose-700' },
  medium: { border: 'border-amber-400/60',  bg: 'bg-amber-50',   icon: Zap,           iconColor: 'text-amber-500',  badge: 'bg-amber-100 text-amber-700' },
  low:    { border: 'border-emerald-400/60',bg: 'bg-emerald-50', icon: CheckCircle,   iconColor: 'text-emerald-500',badge: 'bg-emerald-100 text-emerald-700' },
  info:   { border: 'border-sky-400/60',    bg: 'bg-sky-50',     icon: Info,          iconColor: 'text-sky-500',    badge: 'bg-sky-100 text-sky-700' },
};

function getUrgency(text) {
  const lower = text.toLowerCase();
  if (lower.includes('blast') || lower.includes('destroy') || lower.includes('outbreak') || lower.includes('fatal') || lower.includes('critical')) return 'high';
  if (lower.includes('scout') || lower.includes('monitor') || lower.includes('risk') || lower.includes('apply') || lower.includes('spray')) return 'medium';
  if (lower.includes('price') || lower.includes('msp') || lower.includes('register') || lower.includes('plan')) return 'info';
  return 'low';
}

export default function AdvisoryCard({ week, tip, delay = 0, isAlert = false }) {
  const urgency = isAlert ? 'high' : getUrgency(tip);
  const config = URGENCY_CONFIG[urgency];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-4 rounded-2xl border ${config.border} ${config.bg} flex gap-3 items-start`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border ${config.border}`}>
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${config.badge}`}>
            {isAlert ? '⚠ Alert' : week}
          </span>
        </div>
        <p className="text-sm text-emerald-950 font-semibold leading-relaxed">{tip}</p>
      </div>
    </motion.div>
  );
}
