import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Comprehensive Growth phase definitions per crop
const PHASES = {
  Rice: [
    { name: 'Nursery Prep',    months: [3, 4],          color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Transplanting',   months: [5],             color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Vegetative Tillering', months: [6, 7],     color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Panicle Initiation', months: [8],          color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Flowering & Milking', months: [9],         color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Harvest & Threshing', months: [10],        color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Post-Harvest & Rest', months: [11, 12, 1, 2], color: 'bg-stone-300',   text: 'text-stone-800' },
  ],
  Wheat: [
    { name: 'Field Prep & Sowing', months: [11],        color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'CRI & Crown Root', months: [12],           color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Active Tillering', months: [1, 2],         color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Jointing & Booting', months: [3],          color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Heading & Grain Fill', months: [4],        color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Harvesting',       months: [5],            color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Summer Fallow',    months: [6, 7, 8, 9, 10], color: 'bg-stone-300',    text: 'text-stone-800' },
  ],
  Tomato: [
    { name: 'Rabi Nursery',     months: [10, 11],       color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Vegetative Growth',months: [12, 1],        color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Flowering & Set',  months: [2],            color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Fruit Picking',    months: [3],            color: 'bg-rose-500',       text: 'text-white' },
    { name: 'Kharif Nursery',   months: [4, 5],         color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Kharif Growth',    months: [6, 7, 8],      color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Kharif Harvest',   months: [9],            color: 'bg-amber-400',      text: 'text-amber-950' },
  ],
  Cotton: [
    { name: 'Summer Ploughing', months: [3, 4],         color: 'bg-stone-300',      text: 'text-stone-800' },
    { name: 'Sowing & Germination', months: [5],        color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Seedling Establishment', months: [6],      color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Squaring Stage',   months: [7],            color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Boll Formation',   months: [8, 9],         color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Boll Burst & Picking', months: [10, 11],   color: 'bg-sky-400',        text: 'text-sky-950' },
    { name: 'Stalk Shredding',  months: [12, 1, 2],     color: 'bg-stone-300',      text: 'text-stone-800' },
  ],
  Maize: [
    { name: 'Spring Harvest',   months: [3],            color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Summer Fallow',    months: [4, 5],         color: 'bg-stone-300',      text: 'text-stone-800' },
    { name: 'Kharif Sowing',    months: [6],            color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Vegetative Growth',months: [7],            color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Tasseling & Silking', months: [8],         color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Cob Maturity & Harvest', months: [9, 10],  color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Rabi Sowing',      months: [11],           color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Rabi Growth',      months: [12, 1, 2],     color: 'bg-emerald-600',    text: 'text-white' },
  ],
  Sugarcane: [
    { name: 'Autumn Planting',  months: [10, 11],       color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Germination Phase',months: [12, 1],        color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Formative & Tillering', months: [2, 3, 4], color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Grand Growth Stage', months: [5, 6, 7, 8], color: 'bg-teal-600',       text: 'text-white' },
    { name: 'Ripening & Maturation', months: [9],       color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Harvesting & Crushing', months: [10, 11, 12], color: 'bg-amber-400',   text: 'text-amber-950' },
  ],
  Potato: [
    { name: 'Cold Store Sprouting', months: [9],        color: 'bg-stone-300',      text: 'text-stone-800' },
    { name: 'Planting & Earthing', months: [10, 11],    color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Vegetative Canopy',months: [12],           color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Tuber Initiation', months: [1],            color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Tuber Bulking',    months: [2],            color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Dehaulming & Harvest', months: [3],        color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Summer Storage',   months: [4, 5, 6, 7, 8],color: 'bg-stone-300',      text: 'text-stone-800' },
  ],
  Soybean: [
    { name: 'Pre-Monsoon Prep', months: [5],            color: 'bg-stone-300',      text: 'text-stone-800' },
    { name: 'Sowing & Germination', months: [6],        color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Vegetative Growth',months: [7],            color: 'bg-emerald-500',    text: 'text-white' },
    { name: 'Flowering & Podding', months: [8],         color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Pod Filling & Mature', months: [9],        color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Harvesting',       months: [10],           color: 'bg-amber-500',      text: 'text-white' },
    { name: 'Rabi Wheat Prep',  months: [11, 12, 1, 2, 3, 4], color: 'bg-stone-300', text: 'text-stone-800' },
  ],
  Banana: [
    { name: 'Land Prep & Sucker Sowing', months: [6, 7],color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Vegetative Stalk Growth', months: [8, 9, 10, 11], color: 'bg-emerald-600', text: 'text-white' },
    { name: 'Inflorescence Shooting', months: [12, 1],  color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Bunch Development', months: [2, 3, 4],     color: 'bg-teal-500',       text: 'text-white' },
    { name: 'Bunch Harvesting', months: [5],            color: 'bg-amber-400',      text: 'text-amber-950' },
  ],
  Mango: [
    { name: 'Winter Dormancy & Spray', months: [11, 12], color: 'bg-stone-300',     text: 'text-stone-800' },
    { name: 'Flowering & Blossom', months: [1, 2],      color: 'bg-pink-400',       text: 'text-pink-950' },
    { name: 'Fruit Set & Pea Stage', months: [3],       color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Fruit Sizing & Bagging', months: [4],      color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Harvest & Marketing', months: [5, 6],      color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Pruning & Nutrition', months: [7, 8, 9, 10], color: 'bg-teal-600',    text: 'text-white' },
  ],
  Onion: [
    { name: 'Nursery Sowing',   months: [10, 11],       color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Transplanting',   months: [12],            color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Vegetative Growth',months: [1, 2],         color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Bulb Initiation & Development', months: [3], color: 'bg-pink-500',     text: 'text-white' },
    { name: 'Neck Fall & Harvesting', months: [4, 5],   color: 'bg-amber-400',      text: 'text-amber-950' },
    { name: 'Curing & Storage', months: [6, 7, 8, 9],   color: 'bg-stone-300',      text: 'text-stone-800' },
  ],
  Chilli: [
    { name: 'Nursery Sowing',   months: [6, 7],         color: 'bg-lime-400',       text: 'text-lime-950' },
    { name: 'Transplanting',   months: [8],             color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Vegetative Growth',months: [9],            color: 'bg-emerald-600',    text: 'text-white' },
    { name: 'Flowering & Fruiting', months: [10, 11],   color: 'bg-pink-500',       text: 'text-white' },
    { name: 'Green Chilli Picking', months: [12, 1],    color: 'bg-emerald-400',    text: 'text-emerald-950' },
    { name: 'Red Ripe Harvest & Drying', months: [2, 3],color: 'bg-rose-500',       text: 'text-white' },
    { name: 'Field Clearing',   months: [4, 5],         color: 'bg-stone-300',      text: 'text-stone-800' },
  ]
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NUMS  = [1,2,3,4,5,6,7,8,9,10,11,12];

export default function CropPhaseCalendar({ crop, selectedMonth, onSelectMonth }) {
  const currentActualMonth = new Date().getMonth() + 1; // 1-indexed

  const phaseMap = useMemo(() => {
    const map = {};
    const phases = PHASES[crop] || PHASES['Rice'];
    phases.forEach(phase => {
      phase.months.forEach(m => { map[m] = phase; });
    });
    return map;
  }, [crop]);

  return (
    <div className="w-full">
      {/* Interactive month timeline selector */}
      <div className="flex overflow-x-auto pb-3 pt-1 snap-x snap-mandatory lg:grid lg:grid-cols-12 gap-2 lg:gap-1.5 no-scrollbar">
        {MONTH_NUMS.map((month, idx) => {
          const phase = phaseMap[month];
          const isCurrentActual = month === currentActualMonth;
          const isSelected = month === selectedMonth;

          return (
            <motion.button
              key={month}
              type="button"
              onClick={() => onSelectMonth && onSelectMonth(month)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`flex-shrink-0 w-[78px] lg:w-auto snap-center flex flex-col items-center gap-1.5 p-1 rounded-2xl transition-all cursor-pointer text-left
                ${isSelected 
                  ? 'bg-emerald-950/10 ring-2 ring-emerald-600 scale-[1.03] shadow-md' 
                  : 'hover:bg-white/60'}`}
              title={`Click to view ${MONTH_FULL[idx]} advisory & schedule`}
            >
              {/* Month label with Live Badge */}
              <div className="flex items-center gap-1">
                <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-emerald-950 font-extrabold' : isCurrentActual ? 'text-emerald-600' : 'text-emerald-800/60'}`}>
                  {MONTH_NAMES[idx]}
                </span>
                {isCurrentActual && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>

              {/* Phase visual pill */}
              <div className={`
                w-full h-16 rounded-xl flex flex-col items-center justify-center p-1 relative overflow-hidden shadow-sm transition-all
                ${phase ? phase.color : 'bg-stone-200'}
                ${isSelected ? 'ring-2 ring-offset-1 ring-emerald-600 shadow-lg' : ''}
              `}>
                {isCurrentActual && (
                  <div className="absolute top-0 right-0 bg-emerald-950 text-[7px] text-white font-extrabold px-1 rounded-bl">
                    NOW
                  </div>
                )}
                <span className={`text-[8px] font-black text-center leading-tight ${phase ? phase.text : 'text-stone-600'}`}>
                  {phase?.name || 'Rest'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Interactive Legend */}
      <div className="mt-4 pt-4 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-3">
          {(PHASES[crop] || PHASES['Rice']).map((phase, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-md shadow-xs ${phase.color}`} />
              <span className="text-[11px] text-emerald-900/80 font-bold">{phase.name}</span>
            </div>
          ))}
        </div>
        <span className="text-[11px] font-extrabold text-emerald-700/80 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          💡 Click any month bar above to explore its schedule
        </span>
      </div>
    </div>
  );
}
