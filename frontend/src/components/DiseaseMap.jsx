import React, { useState } from 'react';
import { Map, Overlay } from 'pigeon-maps';
import { Layers } from 'lucide-react';

// Custom CartoDB Positron Tile Provider for a premium look with no API keys
const lightProvider = (x, y, z, dpr) => {
  return `https://${String.fromCharCode(97 + (x + y + z) % 3)}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`;
};

// High-resolution Satellite Hybrid provider (Satellite + City Labels/Roads), completely free
const satelliteProvider = (x, y, z) => {
  return `https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;
};

const DiseaseMap = ({ diseasePoints }) => {
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isSatellite, setIsSatellite] = useState(false);

    return (
        <div className="w-full h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-xl border border-emerald-900/10 z-0 relative liquid-glass group/map">
            
            {/* Map Theme Toggle Button */}
            <button 
                onClick={() => setIsSatellite(!isSatellite)}
                className="absolute top-4 left-4 z-[100] bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all duration-300 flex items-center justify-center gap-0 group-hover/map:opacity-100"
                title="Toggle Satellite View"
            >
                <Layers className="w-5 h-5 text-emerald-700 mx-1" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 transition-all duration-300 overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[120px] group-hover:px-2 opacity-0 group-hover:opacity-100">
                    {isSatellite ? 'Street View' : 'Satellite'}
                </span>
            </button>

            <Map 
                defaultCenter={[20.2961, 85.8245]} 
                defaultZoom={10} 
                provider={isSatellite ? satelliteProvider : lightProvider}
                mouseEvents={true}
                touchEvents={true}
                animate={true}
            >
                {/* Heatmap Disease Simulation using Overlays */}
                {diseasePoints.map((pt, idx) => {
                    const dynamicWidth = pt.radius ? pt.radius / 15 : 100;

                    return (
                        <Overlay key={idx} anchor={[pt.lat, pt.lng]} offset={[dynamicWidth / 2, dynamicWidth / 2]}>
                            <div 
                                className="rounded-full cursor-pointer hover:scale-[1.15] transition-transform duration-300"
                                style={{ 
                                    width: dynamicWidth, 
                                    height: dynamicWidth, 
                                    backgroundColor: pt.severity === 'high' ? '#e11d48' : '#fbbf24', 
                                    opacity: 0.35 + (pt.intensity || 0.2),
                                    boxShadow: '0 0 40px rgba(225,29,72,0.3)',
                                    // Add a slight white border on satellite to make zones pop out against dark backgrounds
                                    border: isSatellite ? '2px solid rgba(255,255,255,0.2)' : 'none'
                                }}
                                onClick={() => setSelectedPoint(pt)}
                            />
                        </Overlay>
                    );
                })}

                {/* Custom Popups via Overlay */}
                {selectedPoint && (
                    <Overlay anchor={[selectedPoint.lat, selectedPoint.lng]} offset={[90, 130]}>
                        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-emerald-100 min-w-[200px] relative z-50 animate-in fade-in zoom-in duration-200">
                            <button 
                                onClick={() => setSelectedPoint(null)} 
                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-emerald-50 text-emerald-900/40 hover:text-emerald-900 transition-colors font-bold text-lg"
                            >
                                ×
                            </button>
                            <span className="font-heading italic font-bold text-emerald-950 block text-2xl leading-none mb-2 pr-4">{selectedPoint.disease}</span>
                            <div className="flex gap-2 items-center mb-2">
                                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest px-2.5 py-1 bg-rose-50 rounded-md inline-block">
                                    {selectedPoint.severity} Risk Zone
                                </span>
                                {(selectedPoint.confidence_score || selectedPoint.intensity) && (
                                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest px-2.5 py-1 bg-emerald-50 rounded-md inline-block">
                                        {selectedPoint.confidence_score ? `${selectedPoint.confidence_score}% Confidence` : `${Math.round(selectedPoint.intensity * 100)}% Confidence`}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-emerald-800/80 block font-semibold">
                                Detected: {new Date(selectedPoint.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    </Overlay>
                )}
            </Map>
        </div>
    );
};

export default React.memo(DiseaseMap);
