import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Infinity as InfinityIcon } from 'lucide-react';
import { raceModels, getModelsForTier, classifySector } from '../lib/godmode/ultraplinian';
import { applyParseltongue } from '../lib/godmode/parseltongue';

import AnantSidebar from '../components/GodMode/AnantSidebar';
import AnantInputBase from '../components/GodMode/AnantInputBase';

export default function Anant() {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [results, setResults] = useState([]);
  
  // Selection Modes: 'single', 'top7', 'all'
  const [runMode, setRunMode] = useState('top7');
  const [selectedSingleModel, setSelectedSingleModel] = useState('anthropic/claude-3-5-sonnet-20241022');

  const isConverging = !isRacing && results.length > 0 && results.some(r => r.success);
  const winner = isConverging ? results.filter(r=>r.success).sort((a,b) => b.score - a.score)[0] : null;

  useEffect(() => {
    const key = localStorage.getItem('openrouter_key');
    if (key) {
      setApiKey(key);
      setHasKey(true);
    }
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
    <div className="min-h-screen w-full bg-[url('/space.jpg')] bg-cover bg-center bg-fixed bg-no-repeat flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 font-body text-white relative">
      {/* Dim Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

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
        <div className="flex-1 bg-black/50 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl p-6 md:p-10 flex flex-col relative overflow-hidden">
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

      {/* Bottom Setup (Input Area outside or inside, user said "at the bottom of the box", placing just beneath it for a clean split) */}
      <div className="relative z-10 w-full max-w-[1400px] mt-6">
        <AnantInputBase 
          executeConsensus={executeConsensus} 
          isRacing={isRacing} 
        />
      </div>

    </div>
  );
}
