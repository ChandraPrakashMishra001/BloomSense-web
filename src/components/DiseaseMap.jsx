import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Tile layer URLs (no API keys needed)
const TILES = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  // Labels overlay for satellite mode so city/place names are visible
  labels: {
    url: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
};

// Inner component to toggle tile layers (useMap must be inside MapContainer)
const LayerToggle = ({ isSatellite, setIsSatellite }) => {
  const map = useMap();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsSatellite(!isSatellite);
        // Invalidate size after tile switch to avoid rendering glitches
        setTimeout(() => map.invalidateSize(), 100);
      }}
      className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all duration-300 flex items-center justify-center gap-0 group/btn"
      title="Toggle Satellite View"
    >
      <Layers className="w-5 h-5 text-emerald-700 mx-1" />
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 transition-all duration-300 overflow-hidden whitespace-nowrap max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:px-2 opacity-0 group-hover/btn:opacity-100">
        {isSatellite ? 'Street View' : 'Satellite'}
      </span>
    </button>
  );
};

const DiseaseMap = ({ diseasePoints }) => {
  const [isSatellite, setIsSatellite] = useState(false);
  const activeTile = isSatellite ? TILES.satellite : TILES.street;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#e11d48';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#fbbf24';
    }
  };

  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-xl border border-emerald-900/10 z-0 relative liquid-glass">
      <MapContainer
        center={[20.2961, 85.8245]}
        zoom={10}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ borderRadius: 'inherit' }}
        zoomControl={false}
      >
        <TileLayer
          key={isSatellite ? 'satellite' : 'street'}
          url={activeTile.url}
          attribution={activeTile.attribution}
          maxZoom={19}
        />

        {/* Labels overlay on satellite view so city/road names are visible */}
        {isSatellite && (
          <TileLayer
            key="labels-overlay"
            url={TILES.labels.url}
            attribution={TILES.labels.attribution}
            maxZoom={19}
            pane="overlayPane"
          />
        )}

        <LayerToggle isSatellite={isSatellite} setIsSatellite={setIsSatellite} />

        {/* Heatmap-style Disease Overlays */}
        {diseasePoints.map((pt, idx) => {
          const color = getSeverityColor(pt.severity);
          const radius = pt.radius ? pt.radius / 40 : 25;

          return (
            <CircleMarker
              key={idx}
              center={[pt.lat, pt.lng]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.35 + (pt.intensity || 0.2),
                weight: isSatellite ? 1.5 : 1,
                opacity: 0.6,
              }}
            >
              <Popup className="disease-popup">
                <div className="min-w-[200px] p-1">
                  <span className="font-heading italic font-bold text-emerald-950 block text-xl leading-none mb-2">
                    {pt.disease}
                  </span>
                  <div className="flex gap-2 items-center mb-2 flex-wrap">
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest px-2.5 py-1 bg-rose-50 rounded-md inline-block">
                      {pt.severity} Risk Zone
                    </span>
                    {(pt.confidence_score || pt.intensity) && (
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest px-2.5 py-1 bg-emerald-50 rounded-md inline-block">
                        {pt.confidence_score
                          ? `${pt.confidence_score}% Confidence`
                          : `${Math.round(pt.intensity * 100)}% Confidence`}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-800/80 block font-semibold">
                    Detected: {new Date(pt.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default React.memo(DiseaseMap);
