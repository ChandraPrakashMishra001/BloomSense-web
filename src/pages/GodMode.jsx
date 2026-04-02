import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Leaf, HeartPulse, ShieldAlert, Cpu } from 'lucide-react';
import MatrixTerminal from '../components/GodMode/MatrixTerminal';
import ModelScorecard from '../components/GodMode/ModelScorecard';
import { Link } from 'react-router-dom';

const SECTORS = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Leaf,
    desc: 'Balanced diagnostics.',
    params: { temperature: 0.7, top_p: 0.9 },
    color: 'from-emerald-400 to-emerald-600'
  },
  {
    id: 'health',
    name: 'Health',
    icon: HeartPulse,
    desc: 'Conservative, strict answers.',
    params: { temperature: 0.4, top_p: 0.8 },
    color: 'from-blue-400 to-indigo-600'
  },
  {
    id: 'security',
    name: 'Security',
    icon: ShieldAlert,
    desc: 'Deterministic & highly precise.',
    params: { temperature: 0.1, top_p: 0.5 },
    color: 'from-rose-400 to-red-600'
  }
];

export default function GodMode() {
  const [activeSector, setActiveSector] = useState(SECTORS[0]);
  const [results, setResults] = useState([]);
  const [isRacing, setIsRacing] = useState(false);

  return (
    <div className="min-h-screen bg-black text-emerald-50 selection:bg-emerald-900 selection:text-emerald-100 font-body relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-emerald-950/20 pointer-events-none" />
      
      {/* Nav Link back to app */}
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="text-emerald-600 hover:text-emerald-400 transition-colors uppercase tracking-widest font-bold text-xs flex items-center gap-2">
           {"< Return to Root"}
        </Link>
      </div>

      <div className="flex-1 w-full max-w-[1600px] mx-auto p-6 pt-20 lg:p-12 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/30 px-4 py-1.5 rounded-full mb-6">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Ultraplinian Protocol Enaged</span>
          </div>
          <h1 className="font-heading italic text-6xl md:text-8xl tracking-tight text-white drop-shadow-[0_0_30px_rgba(52,211,153,0.3)] leading-none mb-4">
            GOD MODE
          </h1>
          <p className="text-emerald-500 font-mono text-sm uppercase tracking-widest border-b border-emerald-900/50 pb-6 inline-block">
            Multi-Model Consensus Engine // v1.0.0
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 w-full max-w-6xl flex-1">
          
          {/* Left Column: Sector Setup & Scorecard */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Sector Selector */}
            <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="font-heading text-xl text-emerald-100 flex items-center gap-2 mb-6 uppercase tracking-widest">
                <Target className="w-5 h-5 text-emerald-400" />
                Sector Selection
              </h3>
              <div className="flex flex-col gap-3">
                {SECTORS.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => !isRacing && setActiveSector(sec)}
                    disabled={isRacing}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      activeSector.id === sec.id 
                        ? 'bg-emerald-900/50 border-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.1)]' 
                        : 'bg-black/40 border-emerald-900/30 hover:border-emerald-700 disabled:opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${sec.color} shadow-lg`}>
                      <sec.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-100 uppercase tracking-wider text-sm">{sec.name}</div>
                      <div className="text-emerald-600 text-[10px] font-mono mt-1">{sec.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scorecard */}
            <div className="flex-1 min-h-[300px]">
              <ModelScorecard results={results} isRacing={isRacing} />
            </div>
          </div>

          {/* Right Column: Terminal */}
          <div className="lg:col-span-8 h-[600px] lg:h-auto">
            <MatrixTerminal 
              setResults={setResults} 
              isRacing={isRacing} 
              setIsRacing={setIsRacing}
              sectorParams={activeSector.params}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
