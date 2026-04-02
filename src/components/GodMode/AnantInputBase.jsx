import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, X, Loader2 } from 'lucide-react';

export default function AnantInputBase({ executeConsensus, isRacing }) {
  const [query, setQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!query.trim() && !base64Image) || isRacing) return;
    executeConsensus(query, base64Image);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (jpg, png).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setBase64Image(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      
      {/* Image Preview Area */}
      {imagePreview && (
        <div className="mb-4 relative inline-block">
          <div className="relative rounded-xl overflow-hidden border border-white/20">
             <img src={imagePreview} alt="upload preview" className="h-24 w-auto object-cover opacity-80" />
             <button 
               type="button"
               onClick={clearImage}
               className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white/50 hover:text-white hover:bg-red-500/80 transition"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        
        {/* Left Actions */}
        <div className="flex gap-2 pb-2">
           <button 
             type="button" 
             disabled={isRacing}
             onClick={() => fileInputRef.current?.click()}
             className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
             title="Upload Picture"
           >
             <ImageIcon className="w-5 h-5" />
           </button>
           <input 
             type="file" 
             accept="image/*" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
           />
           
           <button 
             type="button"
             disabled={isRacing}
             onClick={() => alert('Webcam module initializing... (Requires deeper hardware linking)')}
             className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
             title="Take Photo"
           >
             <Camera className="w-5 h-5" />
           </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
           <textarea 
             rows={1}
             placeholder="State your directive..."
             value={query}
             onChange={e => setQuery(e.target.value)}
             disabled={isRacing}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleSubmit(e);
               }
             }}
             className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-emerald-500 transition-colors resize-none overflow-hidden placeholder:text-white/20 min-h-[56px]"
             style={{ minHeight: '56px' }}
           />
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={isRacing || (!query.trim() && !base64Image)}
          className="h-[56px] px-8 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-emerald-900/50 shrink-0"
        >
          {isRacing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Execute
        </button>

      </form>
    </div>
  );
}
