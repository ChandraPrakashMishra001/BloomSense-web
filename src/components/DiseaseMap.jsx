import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layers, Map as MapIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Premium tile layer options (all free, no API keys needed)
const TILES = {
  // Clean, modern, premium-looking map — great default
  cartoDark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    dark: true,
  },
  cartoVoyager: {
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    dark: false,
  },
  // High-res satellite imagery
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    dark: true,
  },
  // Topographic map — great for agricultural/terrain context
  esriTopo: {
    name: 'Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    dark: false,
  },
};

// Labels overlay for dark/satellite modes
const LABELS_OVERLAY = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
  lightUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
};

const tileKeys = Object.keys(TILES);

// Style selector component (must be inside MapContainer for useMap)
const MapControls = ({ activeKey, setActiveKey }) => {
  const map = useMap();
  const [open, setOpen] = useState(false);

  const handleSwitch = (key) => {
    setActiveKey(key);
    setOpen(false);
    setTimeout(() => map.invalidateSize(), 100);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all duration-300 flex items-center justify-center gap-1.5"
        title="Change Map Style"
      >
        <Layers className="w-5 h-5 text-emerald-700" />
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 pr-1">
          {TILES[activeKey].name}
        </span>
      </button>

      {open && (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {tileKeys.map((key) => (
            <button
              key={key}
              onClick={(e) => { e.stopPropagation(); handleSwitch(key); }}
              className={`w-full px-4 py-2.5 text-left text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2.5
                ${activeKey === key 
                  ? 'bg-emerald-50 text-emerald-900' 
                  : 'text-emerald-800/70 hover:bg-emerald-50/50 hover:text-emerald-900'}`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              {TILES[key].name}
              {activeKey === key && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DiseaseMap = ({ diseasePoints }) => {
  const [activeKey, setActiveKey] = useState('cartoDark');
  const activeTile = TILES[activeKey];
  const needsLabelOverlay = activeKey === 'satellite';

  const getSeverityColor = (severity, isDark) => {
    switch (severity) {
      case 'high': return isDark ? '#ff4d6d' : '#e11d48';
      case 'medium': return isDark ? '#fbbf24' : '#f59e0b';
      case 'low': return isDark ? '#4ade80' : '#22c55e';
      default: return '#fbbf24';
    }
  };

  const getSeverityGlow = (severity) => {
    switch (severity) {
      case 'high': return 'rgba(255, 77, 109, 0.5)';
      case 'medium': return 'rgba(251, 191, 36, 0.4)';
      case 'low': return 'rgba(74, 222, 128, 0.4)';
      default: return 'rgba(251, 191, 36, 0.4)';
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
          key={activeKey}
          url={activeTile.url}
          attribution={activeTile.attribution}
          maxZoom={19}
        />

        {/* Labels overlay on satellite view */}
        {needsLabelOverlay && (
          <TileLayer
            key="labels-overlay"
            url={LABELS_OVERLAY.lightUrl}
            attribution={LABELS_OVERLAY.attribution}
            maxZoom={19}
            pane="overlayPane"
          />
        )}

        <MapControls activeKey={activeKey} setActiveKey={setActiveKey} />

        {/* Disease Zone Overlays */}
        {diseasePoints.map((pt, idx) => {
          const color = getSeverityColor(pt.severity, activeTile.dark);
          const glowColor = getSeverityGlow(pt.severity);
          const radius = pt.radius ? pt.radius / 40 : 25;

          return (
            <React.Fragment key={idx}>
              {/* Outer glow ring */}
              <CircleMarker
                center={[pt.lat, pt.lng]}
                radius={radius + 8}
                pathOptions={{
                  color: 'transparent',
                  fillColor: glowColor,
                  fillOpacity: 0.15,
                  weight: 0,
                }}
                interactive={false}
              />
              {/* Main disease zone */}
              <CircleMarker
                center={[pt.lat, pt.lng]}
                radius={radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.4 + (pt.intensity || 0.2) * 0.3,
                  weight: activeTile.dark ? 1.5 : 1,
                  opacity: 0.7,
                }}
              >
                <Popup className="disease-popup">
                  <div className="min-w-[220px] p-1">
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
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default React.memo(DiseaseMap);
