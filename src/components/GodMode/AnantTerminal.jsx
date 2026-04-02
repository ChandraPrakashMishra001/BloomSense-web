import React, { useState, useEffect } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { raceModels, getModelsForTier, classifySector } from '../../lib/godmode/ultraplinian';
import { applyParseltongue } from '../../lib/godmode/parseltongue';

export default function AnantTerminal({ setResults, isRacing, setIsRacing, setTargetModels, setSectorName }) {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [query, setQuery] = useState('');
  const [useAllModels, setUseAllModels] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('openrouter_key');
    if (key) {
      setApiKey(key);
      setHasKey(true);
    }
  }, []);

  const handleSaveKey = (e) => {
    e.preventDefault();
    if(apiKey.trim()) {
      localStorage.setItem('openrouter_key', apiKey.trim());
      setHasKey(true);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openrouter_key');
    setApiKey('');
    setHasKey(false);
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !hasKey) return;

    setIsRacing(true);
    setResults([]);
    
    const { transformedText } = applyParseltongue(query, { enabled: true, technique: 'leetspeak' });
    
    try {
      const sectorData = await classifySector(query, apiKey);
      setSectorName(`SECTOR: ${sectorData.name?.toUpperCase() || 'UNIVERSAL'}`);

      const models = getModelsForTier(useAllModels ? 'ultra' : 'top7'); 
      setTargetModels(models);

      const raceResults = await raceModels(
        models, 
        [{ role: 'user', content: transformedText }], 
        apiKey,
        { temperature: sectorData.temperature, top_p: sectorData.top_p },
        {
          minResults: useAllModels ? 10 : 3,
          gracePeriod: useAllModels ? 10000 : 5000,
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
    <div className={`p-6 rounded-3xl bg-white border transition-colors duration-500 shadow-xl shadow-emerald-900/5 ${isRacing ? 'border-emerald-300' : 'border-emerald-100'}`}>
      {!hasKey ? (
        <form onSubmit={handleSaveKey} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input 
              type="password" 
              placeholder="API Key (sk-or-v1-...)"
              className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-3 pl-10 pr-4 text-emerald-900 placeholder:text-emerald-700/50 outline-none focus:border-emerald-400 focus:bg-white transition-colors text-sm"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-700 transition shadow-sm text-xs border border-emerald-700/50 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" /> Secure Connection
          </button>
        </form>
      ) : (
        <form onSubmit={handleQuery} className="flex flex-col gap-4">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Enter Directive..."
                disabled={isRacing}
                className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl py-4 px-5 text-emerald-950 font-medium text-sm placeholder:text-emerald-700/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-50"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
           </div>
           
           <button disabled={isRacing || !query.trim()} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 text-xs">
             <Sparkles className="w-4 h-4" />
             Execute Consensus
           </button>
           
           <div className="flex justify-between items-center pt-2 border-t border-emerald-50 mt-1">
             <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
               <input 
                 type="checkbox" 
                 checked={useAllModels}
                 onChange={e => setUseAllModels(e.target.checked)}
                 disabled={isRacing}
                 className="accent-emerald-600 h-3 w-3 rounded-sm border-gray-300"
               />
               Use All Models
             </label>
             <button type="button" onClick={handleClearKey} className="text-red-400 text-[10px] hover:text-red-600 transition font-bold uppercase tracking-widest">
               [Clear Key]
             </button>
           </div>
        </form>
      )}
    </div>
  );
}
