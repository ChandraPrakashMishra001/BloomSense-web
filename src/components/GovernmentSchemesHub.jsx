import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

const schemes = [
  {
    id: 1,
    nameEn: "Samrudha Krushaka Yojana",
    nameOr: "ସମୃଦ୍ଧ କୃଷକ ଯୋଜନା",
    benefit: "Paddy procurement price raised to ₹3,100/quintal.",
  },
  {
    id: 2,
    nameEn: "CM-KISAN (Odisha)",
    nameOr: "ସିଏମ-କିଷାନ (ଓଡ଼ିଶା)",
    benefit: "₹2,030 Crore allocated for 51 lakh families.",
  },
  {
    id: 3,
    nameEn: "PM-KISAN (Central)",
    nameOr: "ପିଏମ-କିଷାନ (କେନ୍ଦ୍ରୀୟ)",
    benefit: "Annual assistance increased to ₹9,000 (Union Budget 2026).",
  },
  {
    id: 4,
    nameEn: "Shree Anna Abhiyan",
    nameOr: "ଶ୍ରୀ ଅନ୍ନ ଅଭିଯାନ",
    benefit: "₹400 Crore for Millet cultivation in Odisha.",
  }
];

export default function GovernmentSchemesHub() {
  return (
    <section id="support-hub" className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
      <div className="text-center mb-16 relative">
        <span className="text-pink-500 font-bold uppercase tracking-[0.25em] mb-4 block">Information Resource</span>
        <h2 className="font-heading italic text-5xl md:text-6xl tracking-tight text-emerald-950">Sovereign Farmer Support Hub</h2>
      </div>

      <div className="w-full bg-emerald-900 border border-emerald-800 text-emerald-100 py-3 rounded-full overflow-hidden flex items-center shadow-lg shadow-emerald-900/10 mb-12 relative liquid-glass-strong border-emerald-200 shadow-emerald-100/50">
           {/* Dark glass aesthetics for the ticker */}
           <div className="absolute inset-0 bg-emerald-950/90 z-0 border border-emerald-800/30 rounded-full"></div>
           <div className="flex w-max animate-marquee relative z-10 px-4">
             {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="flex items-center mx-4 font-bold tracking-wide">
                   <Zap className="w-4 h-4 text-pink-500 mr-2" />
                   <span className="text-emerald-50">New: ₹3,100 Paddy Price set for 2026</span>
                </span>
             ))}
           </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {schemes.map((scheme, i) => (
          <motion.div 
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="liquid-glass p-8 rounded-3xl border border-emerald-200/50 group hover:-translate-y-2 transition-transform duration-500 flex flex-col items-start relative h-full bg-white/40 shadow-sm"
          >
             <div className="absolute top-6 right-6 flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">    
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Live</span>
             </div>

             <h3 className="text-2xl font-heading italic text-emerald-950 leading-tight mt-6 mb-1 pr-14">{scheme.nameEn}</h3>
             <h4 className="text-sm font-bold text-pink-600 mb-4">{scheme.nameOr}</h4>
             
             <p className="text-emerald-800/80 font-medium text-sm leading-relaxed flex-1">
                {scheme.benefit}
             </p>
             
          </motion.div>
        ))}
      </div>

      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         className="liquid-glass max-w-2xl mx-auto rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 border border-emerald-300 shadow-xl shadow-emerald-900/5 bg-gradient-to-br from-white/80 to-pink-50/50 relative overflow-hidden group"
      >
         <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 via-emerald-300 to-pink-300 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" />
         
         <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-inner flex-shrink-0 relative z-10 mt-1">
            <Sparkles className="w-5 h-5 text-white" />
         </div>
         <div className="text-center sm:text-left relative z-10">
             <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                 <span className="font-heading italic text-xl text-emerald-950">Amania AI Advice</span>
                 <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest border border-pink-200">Personalized</span>
             </div>
             <p className="text-sm font-semibold text-emerald-800/80 leading-relaxed">
                 Based on your recent scans, you might be eligible for the Fasal Bima Yojana (Crop Insurance).
             </p>
         </div>
      </motion.div>
    </section>
  );
}
