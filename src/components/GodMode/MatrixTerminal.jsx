import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TerminalSquare, Search, Lock } from 'lucide-react';
import { raceModels, getModelsForTier } from '../../lib/godmode/ultraplinian';
import { applyParseltongue } from '../../lib/godmode/parseltongue';

export default function MatrixTerminal({ setResults, isRacing, setIsRacing, sectorParams }) {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState([]);
  
  const endOfLogsRef = useRef(null);

  useEffect(() => {
    const key = localStorage.getItem('openrouter_key');
    if (key) {
      setApiKey(key);
      setHasKey(true);
      addLog('System initialized. OpenRouter key detected locally.', 'success');
      addLog('Ready for Ultraplinian synthesis.', 'info');
    } else {
      addLog('WARNING: No OpenRouter API key found. God Mode requires a valid key.', 'alert');
    }
  }, []);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), msg, type, time: new Date().toISOString() }]);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    if(apiKey.trim()) {
      localStorage.setItem('openrouter_key', apiKey.trim());
      setHasKey(true);
      addLog('API key securely saved to local storage.', 'success');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openrouter_key');
    setApiKey('');
    setHasKey(false);
    addLog('API key removed from local storage.', 'alert');
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !hasKey) return;

    setIsRacing(true);
    setResults([]);
    
    // Parseltongue preparation
    const { transformedText, triggersFound } = applyParseltongue(query, { enabled: true, technique: 'leetspeak' });
    
    addLog(`Initiating God Mode Protocol...`, 'alert');
    if (triggersFound.length > 0) {
      addLog(`Parseltongue activated. Obfuscated ${triggersFound.length} triggers.`, 'warning');
    }
    
    // Convert temperature and top_p from sector settings for display
    addLog(`Applying limits: Temp ${sectorParams.temperature}, Top P ${sectorParams.top_p}`, 'info');

    // Unleashing the Ultra Tier - full 56-model consensus
    const models = getModelsForTier('ultra'); 
    
    addLog(`Querying ${models.length} models across the Ultraplinian Consortium...`, 'info');

    try {
      const raceResults = await raceModels(
        models, 
        [{ role: 'user', content: transformedText }], 
        apiKey,
        sectorParams,
        {
          minResults: 10,
          gracePeriod: 10000,
          onResult: (res) => {
            setResults(prev => {
              const updated = [...prev];
              const existingIdx = updated.findIndex(u => u.model === res.model);
              if (existingIdx > -1) updated[existingIdx] = res;
              else updated.push(res);
              return updated;
            });
            if(res.success) {
               addLog(`[${res.model.split('/').pop()}] synthesized. Score: ${res.score}`, 'success');
            } else {
               addLog(`[${res.model.split('/').pop()}] failed: ${res.error}`, 'error');
            }
          }
        }
      );

      setIsRacing(false);
      const winner = raceResults[0];
      if (winner && winner.success) {
         addLog(`Consensus achieved. Apex Answer designated to ${winner.model.split('/').pop()} (Score: ${winner.score})`, 'success');
      } else {
         addLog(`Consensus failed. No valid responses.`, 'error');
      }
      
    } catch (err) {
      addLog(`System Error: ${err.message}`, 'error');
      setIsRacing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/90 border border-emerald-900/50 rounded-2xl overflow-hidden font-mono shadow-[0_0_40px_rgba(4,47,46,0.5)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
      
      {/* Terminal Header */}
      <div className="bg-emerald-950/80 border-b border-emerald-900 flex justify-between items-center px-4 py-3 z-10 relative">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold tracking-widest uppercase">
          <TerminalSquare className="w-4 h-4" />
          God Mode Terminal
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
        </div>
      </div>

      {/* Terminal Logs */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 text-sm leading-relaxed z-10 relative">
        {logs.map(log => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={log.id} 
            className={`font-mono ${
              log.type === 'success' ? 'text-emerald-400' :
              log.type === 'error' ? 'text-rose-400' :
              log.type === 'alert' ? 'text-amber-400' :
              log.type === 'warning' ? 'text-pink-400' :
              'text-emerald-600'
            }`}
          >
            <span className="opacity-50 mr-3">
               [{log.time.split('T')[1].substring(0, 8)}]
            </span>
            <span className="opacity-70 mr-2">{'>'}</span>
            {log.msg}
          </motion.div>
        ))}
        {isRacing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="text-emerald-400 animate-pulse font-mono"
          >
           <span className="opacity-70 mr-2">{'>'}</span>_
          </motion.div>
        )}
        <div ref={endOfLogsRef} />
      </div>

      {/* Inputs */}
      <div className="border-t border-emerald-900 bg-emerald-950/50 p-4 z-10 relative backdrop-blur-md">
        {!hasKey ? (
          <form onSubmit={handleSaveKey} className="flex gap-2">
            <div className="flex-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
              <input 
                type="password" 
                placeholder="Enter OpenRouter API Key (sk-or-v1-...)"
                className="w-full bg-black/50 border border-emerald-900/50 rounded-lg py-3 pl-10 pr-4 text-emerald-100 placeholder:text-emerald-800 outline-none focus:border-emerald-500 transition-colors shadow-inner"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-emerald-800 text-emerald-100 px-6 rounded-lg font-bold uppercase tracking-widest hover:bg-emerald-700 transition hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              Secure Local Save
            </button>
          </form>
        ) : (
          <form onSubmit={handleQuery} className="flex flex-col gap-3">
             <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
                  <input 
                    type="text" 
                    placeholder="Enter absolute directive..."
                    disabled={isRacing}
                    className="w-full bg-black/50 border border-emerald-900/50 rounded-lg py-3 pl-10 pr-4 text-emerald-100 placeholder:text-emerald-800 outline-none focus:border-amber-500 transition-colors focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:opacity-50 relative z-10"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
                <button disabled={isRacing || !query.trim()} type="submit" className="bg-amber-600/90 text-black px-8 rounded-lg font-bold uppercase tracking-widest hover:bg-amber-500 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <Sparkles className="w-4 h-4" />
                  Execute
                </button>
             </div>
             <button type="button" onClick={handleClearKey} className="text-emerald-700 text-xs hover:text-rose-500 w-max transition font-bold uppercase tracking-widest">
               [Clear API Key]
             </button>
          </form>
        )}
      </div>
    </div>
  );
}
