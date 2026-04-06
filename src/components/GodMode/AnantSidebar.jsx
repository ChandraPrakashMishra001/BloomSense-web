import React from 'react';
import { Lock, Cpu, Star, Layers } from 'lucide-react';

const COMMON_MODELS = [
  { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash (Free)' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder (Free)' },
  { id: 'mistralai/mistral-small-24b-instruct-2501:free', name: 'Mistral Small (Free)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Pro)' },
  { id: 'openai/gpt-4o', name: 'GPT-4 Omni (Pro)' }
];

export default function AnantSidebar({
  hasKey, setHasKey, apiKey, setApiKey,
  runMode, setRunMode,
  selectedSingleModel, setSelectedSingleModel,
  isRacing
}) {
  
  const handleSaveKey = (e) => {
    e.preventDefault();
    if(apiKey.trim()) {
      localStorage.setItem('openrouter_key', apiKey.trim());
      setHasKey(true);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('openrouter_key');
    setApiKey('');
    setHasKey(false);
  };

  return (
    <div className="w-full lg:w-[320px] bg-black/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 lg:p-8 flex flex-col shadow-2xl shrink-0">
      
      {/* Authentication */}
      <h3 className="text-white/40 uppercase tracking-[0.2em] font-bold text-[10px] mb-4">Security</h3>
      {!hasKey ? (
        <form onSubmit={handleSaveKey} className="flex flex-col gap-3 mb-8 border-b border-white/5 pb-8">
           <input 
             type="password"
             placeholder="OpenRouter API Key..."
             className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-white/20"
             value={apiKey}
             onChange={e => setApiKey(e.target.value)}
           />
           <button type="submit" className="w-full bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-widest transition shadow-lg shadow-emerald-900/50">
             Authenticate
           </button>
        </form>
      ) : (
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-8">
           <div className="flex items-center gap-2 text-emerald-400">
             <Lock className="w-4 h-4" />
             <span className="text-xs uppercase font-bold tracking-widest">Authenticated</span>
           </div>
           <button onClick={clearKey} className="text-white/30 hover:text-red-400 transition text-[10px] uppercase tracking-widest font-bold">
             [PURGE]
           </button>
        </div>
      )}

      {/* Model Selection */}
      <h3 className="text-white/40 uppercase tracking-[0.2em] font-bold text-[10px] mb-4">Node Directive</h3>
      
      <div className="flex flex-col gap-3">
        {/* Single Model */}
        <label className={`w-full flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${runMode === 'single' ? 'bg-white/10 border-emerald-400/50' : 'bg-transparent border-white/5 hover:border-white/20'}`}>
           <div className="flex items-center gap-3">
             <input 
               type="radio" 
               name="runMode" 
               value="single" 
               checked={runMode === 'single'} 
               onChange={() => setRunMode('single')}
               className="hidden"
             />
             <Cpu className={`w-5 h-5 ${runMode === 'single' ? 'text-emerald-400' : 'text-white/30'}`} />
             <span className={`text-sm tracking-wide ${runMode === 'single' ? 'text-white' : 'text-white/50'}`}>Single Node</span>
           </div>
           
           {runMode === 'single' && (
             <div className="mt-4">
               <select 
                 disabled={isRacing}
                 value={selectedSingleModel}
                 onChange={e => setSelectedSingleModel(e.target.value)}
                 className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
               >
                 {COMMON_MODELS.map(m => (
                   <option key={m.id} value={m.id}>{m.name}</option>
                 ))}
                 <option value="custom">More models...</option>
               </select>
             </div>
           )}
        </label>

        {/* Top 7 Models */}
        <label className={`w-full flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${runMode === 'top7' ? 'bg-white/10 border-amber-400/50' : 'bg-transparent border-white/5 hover:border-white/20'}`}>
           <div className="flex items-center gap-3">
             <input 
               type="radio" 
               name="runMode" 
               value="top7" 
               checked={runMode === 'top7'} 
               onChange={() => setRunMode('top7')}
               className="hidden"
             />
             <Star className={`w-5 h-5 ${runMode === 'top7' ? 'text-amber-400' : 'text-white/30'}`} />
             <div className="flex flex-col">
               <span className={`text-sm tracking-wide ${runMode === 'top7' ? 'text-white' : 'text-white/50'}`}>Run 7 Best Models</span>
               <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Apex Tier Only</span>
             </div>
           </div>
        </label>

        {/* All 56 Models */}
        <label className={`w-full flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${runMode === 'all' ? 'bg-white/10 border-red-500/50' : 'bg-transparent border-white/5 hover:border-white/20'}`}>
           <div className="flex items-center gap-3">
             <input 
               type="radio" 
               name="runMode" 
               value="all" 
               checked={runMode === 'all'} 
               onChange={() => setRunMode('all')}
               className="hidden"
             />
             <Layers className={`w-5 h-5 ${runMode === 'all' ? 'text-red-400' : 'text-white/30'}`} />
             <div className="flex flex-col">
               <span className={`text-sm tracking-wide ${runMode === 'all' ? 'text-white' : 'text-white/50'}`}>Run All Models</span>
               <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Full 56 Constellation</span>
             </div>
           </div>
        </label>
      </div>
      
    </div>
  );
}
