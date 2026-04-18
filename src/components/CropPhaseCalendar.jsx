import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Growth phase definitions per crop
const PHASES = {
  Rice: [
    { name: 'Nursery',      months: [3, 4],       color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'Transplanting',months: [5],           color: 'bg-emerald-400',    text: 'text-emerald-900' },
    { name: 'Vegetative',   months: [6, 7],        color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Panicle',      months: [8],           color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Flowering',    months: [9],           color: 'bg-pink-400',       text: 'text-white' },
    { name: 'Harvest',      months: [10],          color: 'bg-amber-400',      text: 'text-amber-900' },
    { name: 'Post-Harvest', months: [11, 12, 1, 2],color: 'bg-stone-300',      text: 'text-stone-800' },
  ],
  Wheat: [
    { name: 'Sowing',       months: [11],          color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'Germination',  months: [12],          color: 'bg-emerald-300',    text: 'text-emerald-900' },
    { name: 'Tillering',    months: [1, 2],        color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Jointing',     months: [3],           color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Heading',      months: [4],           color: 'bg-pink-400',       text: 'text-white' },
    { name: 'Harvest',      months: [5],           color: 'bg-amber-400',      text: 'text-amber-900' },
    { name: 'Fallow',       months: [6, 7, 8, 9, 10], color: 'bg-stone-300',  text: 'text-stone-800' },
  ],
  Tomato: [
    { name: 'Nursery',      months: [10, 11],      color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'Vegetative',   months: [12, 1],       color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Flowering',    months: [2],           color: 'bg-pink-400',       text: 'text-white' },
    { name: 'Fruiting',     months: [3],           color: 'bg-red-400',        text: 'text-white' },
    { name: 'K. Nursery',   months: [4, 5],        color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'K. Growth',    months: [6, 7, 8],     color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'K. Harvest',   months: [9],           color: 'bg-amber-400',      text: 'text-amber-900' },
  ],
  Cotton: [
    { name: 'Pre-Sowing',   months: [3, 4],        color: 'bg-stone-300',      text: 'text-stone-800' },
    { name: 'Sowing',       months: [5],           color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'Seedling',     months: [6],           color: 'bg-emerald-400',    text: 'text-emerald-900' },
    { name: 'Squaring',     months: [7],           color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Boll Setting', months: [8, 9],        color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Picking',      months: [10],          color: 'bg-sky-200',        text: 'text-sky-900' },
    { name: 'Post-Harvest', months: [11, 12, 1, 2],color: 'bg-stone-300',      text: 'text-stone-800' },
  ],
  Maize: [
    { name: 'Rabi Harvest', months: [3],           color: 'bg-amber-400',      text: 'text-amber-900' },
    { name: 'Fallow',       months: [4, 5],        color: 'bg-stone-300',      text: 'text-stone-800' },
    { name: 'K. Sowing',    months: [6],           color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'Vegetative',   months: [7],           color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Tasselling',   months: [8],           color: 'bg-pink-400',       text: 'text-white' },
    { name: 'Harvest',      months: [9, 10],       color: 'bg-amber-400',      text: 'text-amber-900' },
    { name: 'Rabi Sowing',  months: [11],          color: 'bg-lime-400',       text: 'text-lime-900' },
    { name: 'Rabi Growth',  months: [12, 1, 2],    color: 'bg-emerald-600',    text: 'text-white' },
  ],
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_NUMS  = [1,2,3,4,5,6,7,8,9,10,11,12];

export default function CropPhaseCalendar({ crop }) {
  const currentMonth = new Date().getMonth() + 1; // 1-indexed

  const phaseMap = useMemo(() => {
    const map = {};
    const phases = PHASES[crop] || [];
    phases.forEach(phase => {
      phase.months.forEach(m => { map[m] = phase; });
    });
    return map;
  }, [crop]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-1.5">
        {MONTH_NUMS.map((month, idx) => {
          const phase = phaseMap[month];
          const isCurrent = month === currentMonth;
          return (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex flex-col items-center gap-1"
            >
              {/* Month label */}
              <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-emerald-600' : 'text-emerald-800/40'}`}>
                {MONTH_NAMES[idx]}
              </span>

              {/* Phase bar */}
              <div className={`
                w-full h-14 rounded-xl flex items-center justify-center relative overflow-hidden
                ${phase ? phase.color : 'bg-stone-100'}
                ${isCurrent ? 'ring-2 ring-offset-1 ring-emerald-500 shadow-lg shadow-emerald-500/30' : ''}
                transition-all duration-300
              `}>
                {/* Current month pulse */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
                )}
                <span className={`text-[8px] font-black text-center px-1 leading-tight ${phase ? phase.text : 'text-stone-400'}`}>
                  {phase?.name || '—'}
                </span>
              </div>

              {/* Current month dot */}
              {isCurrent && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {(PHASES[crop] || []).map((phase, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${phase.color}`} />
            <span className="text-xs text-emerald-800/60 font-semibold">{phase.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
