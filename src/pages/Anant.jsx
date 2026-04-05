import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Infinity as InfinityIcon, ArrowLeft } from 'lucide-react';
import { raceModels, getModelsForTier, classifySector } from '../lib/godmode/ultraplinian';
import { applyParseltongue } from '../lib/godmode/parseltongue';

import AnantSidebar from '../components/GodMode/AnantSidebar';
import AnantInputBase from '../components/GodMode/AnantInputBase';
import ConstellationFooter from '../components/GodMode/ConstellationFooter';

export default function Anant() {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [results, setResults] = useState([]);
  
  // Selection Modes: 'single', 'top7', 'all'
  const [runMode, setRunMode] = useState('top7');
  const [selectedSingleModel, setSelectedSingleModel] = useState('anthropic/claude-3.5-sonnet');

  const isConverging = !isRacing && results.length > 0 && results.some(r => r.success);
  const winner = isConverging ? results.filter(r=>r.success).sort((a,b) => b.score - a.score)[0] : null;
  const isFailed = !isRacing && results.length > 0 && !results.some(r => r.success);

  useEffect(() => {
    // Hide Amanai shortcut button and frame on this specific page
    const style = document.createElement('style');
    style.id = 'hide-amanai-widget';
    style.innerHTML = `
      #amanai-widget-btn, #amanai-widget-frame {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const key = localStorage.getItem('openrouter_key');
    if (key) {
      setApiKey(key);
      setHasKey(true);
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const executeConsensus = async (queryText, base64Image) => {
    if (!queryText.trim() && !base64Image) return;
    if (!hasKey) {
       alert("Please authenticate with a secure key first.");
       return;
    }

    setIsRacing(true);
    setResults([]);
    
    const { transformedText } = applyParseltongue(queryText, { enabled: true, technique: 'leetspeak' });
    
    try {
      const sectorData = await classifySector(transformedText, apiKey);
      
      let modelsToRun = [];
      if (runMode === 'single') modelsToRun = [selectedSingleModel];
      else if (runMode === 'top7') modelsToRun = getModelsForTier('top7');
      else if (runMode === 'all') modelsToRun = getModelsForTier('ultra');

      // Construct Payload
      let messages = [];
      if (base64Image) {
        // Multi-modal format
        messages = [{ 
          role: 'user', 
          content: [
            { type: "text", text: transformedText },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }];
      } else {
        messages = [{ role: 'user', content: transformedText }];
      }

      await raceModels(
        modelsToRun, 
        messages, 
        apiKey,
        { temperature: sectorData.temperature, top_p: sectorData.top_p },
        {
          minResults: runMode === 'all' ? 10 : (runMode === 'single' ? 1 : 3),
          gracePeriod: runMode === 'all' ? 10000 : 5000,
          onResult: (res) => {
            setResults(prev => {
              const updated = [...prev];
              const existingIdx = updated.findIndex(u => u.model === res.model);
              if (existingIdx > -1) updated[existingIdx] = res;
              else updated.push(res);
              return updated;
            });
          }
        }
      );

      setIsRacing(false);
    } catch (err) {
      console.error(err);
      setIsRacing(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 font-body text-white relative overflow-x-hidden">
      {/* Hardware accelerated fixed background to prevent mobile scroll jitter */}
      <div className="fixed inset-0 w-full h-full bg-[url('/space.jpg')] bg-cover bg-center bg-no-repeat -z-20 will-change-transform" />
      {/* Top Navigation / Branding */}
      <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 font-mono text-xs sm:text-sm tracking-wide bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Go to main website</span>
          <span className="sm:hidden">Main Site</span>
        </Link>
        <div className="font-serif italic font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-emerald-400 to-white text-transparent bg-clip-text drop-shadow-lg">
          Neural Leaf
        </div>
      </div>

      {/* Enhanced Dim Overlay with subtle emerald radial glow */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-black/40 to-black/80 pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <h1 className="font-serif italic text-6xl md:text-7xl tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          ANANT <span className="text-3xl opacity-70 ml-2 font-sans tracking-normal">(अनंत)</span>
        </h1>
      </div>

      {/* Main Glassmorphic Box */}
      <div className="relative z-10 flex-1 w-full max-w-[1400px] flex gap-6 mt-4 flex-col lg:flex-row">
        
        {/* Left Sidebar */}
        <AnantSidebar 
          hasKey={hasKey}
          setHasKey={setHasKey}
          apiKey={apiKey}
          setApiKey={setApiKey}
          runMode={runMode}
          setRunMode={setRunMode}
          selectedSingleModel={selectedSingleModel}
          setSelectedSingleModel={setSelectedSingleModel}
          isRacing={isRacing}
        />

        {/* Center Canvas */}
        <div className="flex-1 bg-black/50 backdrop-blur-xl border border-emerald-500/20 rounded-[32px] shadow-[0_0_80px_rgba(16,185,129,0.1)] p-6 md:p-10 flex flex-col relative overflow-hidden transition-all">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent z-0" />
          <div className="relative z-10 flex flex-col h-full flex-1">
            <AnimatePresence mode="wait">
            {isRacing ? (
              <motion.div 
                key="racing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center flex-1"
              >
                <div className="w-20 h-20 border-4 border-whtite/10 border-t-emerald-400 rounded-full animate-spin mb-8" />
                <h2 className="font-serif italic text-3xl text-emerald-100 mb-2">Synthesizing Across Cosmos</h2>
                <p className="text-white/50 text-xs font-mono uppercase tracking-widest text-center mt-4">
                   Waiting for Consensus...<br/>Results so far: {results.length}
                </p>
              </motion.div>
            ) : winner ? (
              <motion.div 
                key="winner"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                     <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 uppercase tracking-widest text-xs font-bold px-3 py-1.5 rounded-lg">
                       Apex Answer
                     </span>
                     <h3 className="font-serif text-2xl text-white">
                        {winner.model.split('/').pop()}
                     </h3>
                  </div>
                  <div className="text-emerald-400 font-mono text-sm tracking-wide">
                     Score: {Math.round(winner.score)}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 text-white/80 leading-relaxed sm:text-lg whitespace-pre-wrap">
                  {winner.content}
                </div>
              </motion.div>
            ) : isFailed ? (
              <motion.div 
                key="failed"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center flex-1 text-center"
              >
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
                  <span className="text-red-400 text-3xl">⚠</span>
                </div>
                <h2 className="font-serif italic text-3xl text-red-200 mb-2">Consensus Failed</h2>
                <p className="text-red-400/80 mb-6 max-w-lg">
                  None of the selected models returned a valid response. This is often due to missing API credits or rate limits for specific models.
                </p>
                <div className="bg-red-950/30 text-red-300 text-sm p-4 rounded-xl text-left border border-red-900/50 w-full max-w-lg overflow-y-auto max-h-48 custom-scrollbar">
                  {results.map((r, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                      <span className="font-bold opacity-70">[{r.model.split('/').pop()}]</span>: {r.error || "Unknown error"}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center opacity-30 pointer-events-none"
              >
                <InfinityIcon className="w-32 h-32 text-white/50 mb-6" />
                <h2 className="font-serif italic text-4xl text-white/80 tracking-widest">AWAITING DIRECTIVE</h2>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Bottom Setup (Input Area outside or inside, user said "at the bottom of the box", placing just beneath it for a clean split) */}
      <div className="relative z-10 w-full max-w-[1400px] mt-6">
        <AnantInputBase 
          executeConsensus={executeConsensus} 
          isRacing={isRacing} 
        />
      </div>

      <ConstellationFooter />

    </div>
  );
}
