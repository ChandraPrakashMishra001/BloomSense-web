import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import { 
  Layers, Map as MapIcon, Crosshair, Filter, Activity, AlertTriangle, 
  ShieldCheck, Sparkles, Navigation, Info, ZoomIn, ZoomOut, Maximize2, Minimize2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Premium high-performance tile layers (all free, zero API keys required)
const TILES = {
  cartoDark: {
    name: 'Tactical Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    dark: true,
  },
  cartoVoyager: {
    name: 'Clean Street',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    dark: false,
  },
  satellite: {
    name: 'Satellite Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    dark: true,
  },
  esriTopo: {
    name: 'Agricultural Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    dark: false,
  },
};

const LABELS_OVERLAY = {
  url: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
};

// Actionable agronomic cure protocols for Indian crop pathogens
const DISEASE_TREATMENTS = {
  'Rice Blast': {
    chemical: 'Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.',
    organic: 'Foliar spray of Neem Seed Kernel Extract (NSKE 5%) or Pseudomonas fluorescens @ 5g/L.',
    window: 'Apply within 48 hours to prevent panicle blast.'
  },
  'Bacterial Blight': {
    chemical: 'Spray Streptocycline @ 0.1g/L + Copper Oxychloride 50% WP @ 2.5g/L.',
    organic: 'Spray fresh Cow dung extract (20%) + Asafoetida (Hing) spray.',
    window: 'Drain excess standing water from paddy immediately.'
  },
  'Bacterial Leaf Blight': {
    chemical: 'Spray Plantomycin @ 1g/L + Copper Oxychloride @ 2.5g/L.',
    organic: 'Apply Bacillus subtilis culture @ 10ml/L of water.',
    window: 'Avoid top-dressing Nitrogen fertilizers during outbreak.'
  },
  'Brown Spot': {
    chemical: 'Spray Mancozeb 75% WP @ 2g/L or Propiconazole 25% EC @ 1ml/L.',
    organic: 'Soil application of Trichoderma viride enriched FYM @ 5kg/acre.',
    window: 'Correct Potassium deficiency in soil alongside spraying.'
  },
  'Sheath Blight': {
    chemical: 'Foliar spray of Hexaconazole 5% EC @ 2ml/L or Validamycin 3% L @ 2.5ml/L.',
    organic: 'Apply Pseudomonas fluorescens talc formulation @ 10g/L.',
    window: 'Spray at stem base during tillering & panicle initiation.'
  },
  'Brown Plant Hopper': {
    chemical: 'Apply Pymetrozine 50% WDG @ 0.6g/L or Dinotefuran 20% SG @ 0.4g/L.',
    organic: 'Spray Azadirachtin (Neem oil 1500 ppm) @ 3ml/L targeting base.',
    window: 'Create 30cm alleyways every 2 meters for aeration.'
  },
  'Leaf Folder': {
    chemical: 'Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L or Flubendiamide @ 0.2ml/L.',
    organic: 'Release Trichogramma chilonis egg parasitoids @ 20,000/acre.',
    window: 'Treat when more than 2 damaged leaves per hill are found.'
  },
  'Late Blight': {
    chemical: 'Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L.',
    organic: 'Spray Bordeaux mixture 1% or Trichoderma harzianum.',
    window: 'Critical intervention required before rain/cloudy spells.'
  }
};

// Haversine distance calculator in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// Inner interactive map controller
const MapActionButtons = ({ activeKey, setActiveKey, userLocation, isFullScreen, setIsFullScreen }) => {
  const map = useMap();
  const [styleOpen, setStyleOpen] = useState(false);

  const handleLocateFarm = (e) => {
    e.stopPropagation();
    if (userLocation && userLocation.lat && userLocation.lng) {
      map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.5 });
    } else {
      map.flyTo([20.2961, 85.8245], 10, { duration: 1.2 });
    }
  };

  return (
    <>
      {/* Top Left: Style & Layer Switcher */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); setStyleOpen(!styleOpen); }}
          className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          title="Change Map Style"
        >
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>{TILES[activeKey].name}</span>
        </button>

        {styleOpen && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-48">
            {Object.keys(TILES).map((key) => (
              <button
                key={key}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setActiveKey(key); 
                  setStyleOpen(false); 
                  setTimeout(() => map.invalidateSize(), 100);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-bold tracking-wide transition-all flex items-center justify-between
                  ${activeKey === key 
                    ? 'bg-emerald-50 text-emerald-900' 
                    : 'text-emerald-800/70 hover:bg-emerald-50/50 hover:text-emerald-900'}`}
              >
                <span>{TILES[key].name}</span>
                {activeKey === key && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top Right: Tactical GPS & Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 pointer-events-auto">
        <button
          onClick={handleLocateFarm}
          className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all flex items-center gap-1.5 text-xs font-bold tracking-wide"
          title="Center on My Farm Location"
        >
          <Crosshair className="w-4 h-4 text-emerald-600 animate-spin-slow" />
          <span className="hidden sm:inline">My Farm</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullScreen(!isFullScreen);
            setTimeout(() => map.invalidateSize(), 200);
          }}
          className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all"
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen View"}
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4 text-emerald-700" /> : <Maximize2 className="w-4 h-4 text-emerald-700" />}
        </button>
      </div>

      {/* Bottom Right: Custom Zoom Controls */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
          className="bg-white/90 hover:bg-white backdrop-blur-md w-9 h-9 rounded-full shadow-lg border border-emerald-100 text-emerald-900 flex items-center justify-center transition-all hover:scale-105"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
          className="bg-white/90 hover:bg-white backdrop-blur-md w-9 h-9 rounded-full shadow-lg border border-emerald-100 text-emerald-900 flex items-center justify-center transition-all hover:scale-105"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

const DiseaseMap = ({ diseasePoints = [], userLocation = null }) => {
  const [activeKey, setActiveKey] = useState('cartoDark');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState('all');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const activeTile = TILES[activeKey];
  const needsLabelOverlay = activeKey === 'satellite';

  // Extract unique diseases for filtering
  const uniqueDiseases = useMemo(() => {
    const set = new Set(diseasePoints.map(p => p.disease).filter(Boolean));
    return Array.from(set);
  }, [diseasePoints]);

  // Filter disease points
  const filteredPoints = useMemo(() => {
    return diseasePoints.filter(pt => {
      const matchSeverity = selectedSeverity === 'all' || pt.severity === selectedSeverity;
      const matchDisease = selectedDiseaseFilter === 'all' || pt.disease === selectedDiseaseFilter;
      return matchSeverity && matchDisease;
    });
  }, [diseasePoints, selectedSeverity, selectedDiseaseFilter]);

  // Compute nearest outbreak distance
  const nearestOutbreak = useMemo(() => {
    if (!userLocation || !diseasePoints.length) return null;
    let minDistance = Infinity;
    let nearestPoint = null;

    diseasePoints.forEach(pt => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, pt.lat, pt.lng);
      if (dist !== null && dist < minDistance) {
        minDistance = dist;
        nearestPoint = { ...pt, distance: dist };
      }
    });

    return nearestPoint;
  }, [userLocation, diseasePoints]);

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
      case 'high': return 'rgba(255, 77, 109, 0.45)';
      case 'medium': return 'rgba(251, 191, 36, 0.4)';
      case 'low': return 'rgba(74, 222, 128, 0.35)';
      default: return 'rgba(251, 191, 36, 0.4)';
    }
  };

  return (
    <div className={`w-full ${isFullScreen ? 'fixed inset-0 z-[200] h-screen rounded-none' : 'h-[550px] lg:h-[620px] rounded-[2.5rem]'} overflow-hidden shadow-2xl border border-emerald-900/10 z-0 relative liquid-glass transition-all duration-300 flex flex-col`}>
      
      {/* Top Tactical Command Bar */}
      <div className="p-3.5 sm:px-6 bg-white/80 backdrop-blur-md border-b border-emerald-900/10 z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-emerald-900/60 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter:
          </span>

          <div className="flex items-center gap-1 bg-emerald-50/80 p-1 rounded-full border border-emerald-200/50">
            {['all', 'high', 'medium', 'low'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all
                  ${selectedSeverity === sev 
                    ? (sev === 'high' ? 'bg-rose-500 text-white shadow-sm' : sev === 'medium' ? 'bg-amber-500 text-white shadow-sm' : sev === 'low' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-900 text-white shadow-sm')
                    : 'text-emerald-800/70 hover:text-emerald-950'}`}
              >
                {sev === 'all' ? 'All Risks' : sev}
              </button>
            ))}
          </div>

          {uniqueDiseases.length > 0 && (
            <select
              value={selectedDiseaseFilter}
              onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
              className="bg-emerald-50 text-emerald-900 font-bold text-[11px] px-3 py-1.5 rounded-full border border-emerald-200/60 outline-none cursor-pointer"
            >
              <option value="all">All Pathogens ({diseasePoints.length})</option>
              {uniqueDiseases.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
        </div>

        {/* Live Outbreak Stats Badge */}
        <div className="flex items-center gap-2">
          {nearestOutbreak && (
            <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] tracking-wider uppercase inline-flex items-center gap-1.5 border
              ${nearestOutbreak.distance <= 5 
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <AlertTriangle className="w-3 h-3" />
              Nearest: {nearestOutbreak.disease} ({nearestOutbreak.distance} km)
            </span>
          )}

          <span className="text-emerald-800/60 font-mono font-bold text-[11px] hidden md:inline">
            Active Zones: {filteredPoints.length}
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="flex-1 relative w-full h-full">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [20.2961, 85.8245]}
          zoom={9}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <TileLayer
            key={activeKey}
            url={activeTile.url}
            attribution={activeTile.attribution}
            maxZoom={19}
          />

          {/* High-Contrast Labels overlay on satellite mode */}
          {needsLabelOverlay && (
            <TileLayer
              key="labels-overlay"
              url={LABELS_OVERLAY.url}
              attribution={LABELS_OVERLAY.attribution}
              maxZoom={19}
              pane="overlayPane"
            />
          )}

          <MapActionButtons 
            activeKey={activeKey} 
            setActiveKey={setActiveKey} 
            userLocation={userLocation}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
          />

          {/* User's Farm GPS Beacon */}
          {userLocation && (
            <>
              {/* 5 km Safety Perimeter Ring */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={5000}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.05,
                  weight: 1.5,
                  dashArray: '4, 8'
                }}
              />
              {/* Farm Center Beacon */}
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                radius={9}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: '#059669',
                  fillOpacity: 1,
                  weight: 3,
                }}
              >
                <Popup className="disease-popup">
                  <div className="p-1 text-center min-w-[180px]">
                    <span className="font-heading italic font-bold text-emerald-950 block text-lg mb-1">
                      🌾 Your Farm Location
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider block">
                      5 km Safe Zone Active
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            </>
          )}

          {/* Active Disease Zone Markers & Heatmap Rings */}
          {filteredPoints.map((pt, idx) => {
            const color = getSeverityColor(pt.severity, activeTile.dark);
            const glowColor = getSeverityGlow(pt.severity);
            const radius = pt.radius ? pt.radius / 35 : 28;
            const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, pt.lat, pt.lng) : null;
            const treatment = DISEASE_TREATMENTS[pt.disease] || null;

            return (
              <React.Fragment key={idx}>
                {/* Outer Glow Halo */}
                <CircleMarker
                  center={[pt.lat, pt.lng]}
                  radius={radius + 10}
                  pathOptions={{
                    color: 'transparent',
                    fillColor: glowColor,
                    fillOpacity: 0.22,
                    weight: 0,
                  }}
                  interactive={false}
                />

                {/* Core Outbreak Marker */}
                <CircleMarker
                  center={[pt.lat, pt.lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.45 + (pt.intensity || 0.2) * 0.35,
                    weight: activeTile.dark ? 2 : 1.5,
                    opacity: 0.85,
                  }}
                >
                  <Popup className="disease-popup" maxWidth={320}>
                    <div className="min-w-[260px] p-2 text-emerald-950">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-900/10">
                        <div>
                          <span className="font-heading italic font-bold text-emerald-950 block text-2xl leading-none">
                            {pt.disease}
                          </span>
                          <span className="text-[10px] text-emerald-800/60 font-semibold">
                            Detected: {new Date(pt.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md
                          ${pt.severity === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-200' : pt.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {pt.severity} Risk
                        </span>
                      </div>

                      {/* Distance & Confidence Stats */}
                      <div className="flex gap-2 items-center mb-3 flex-wrap">
                        {distance !== null && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                            ${distance <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-800'}`}>
                            📍 {distance} km from your farm
                          </span>
                        )}
                        {(pt.confidence_score || pt.intensity) && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                            🎯 {pt.confidence_score ? `${pt.confidence_score}%` : `${Math.round(pt.intensity * 100)}%`} AI Confidence
                          </span>
                        )}
                      </div>

                      {/* Agronomic Action Protocol */}
                      {treatment && (
                        <div className="space-y-2 text-xs bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100/80 mb-2">
                          <div>
                            <span className="font-bold text-emerald-900 block text-[11px] mb-0.5">Recommended Chemical Action:</span>
                            <p className="text-emerald-800/90 leading-snug">{treatment.chemical}</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-900 block text-[11px] mb-0.5">Organic Alternative:</span>
                            <p className="text-emerald-800/90 leading-snug">{treatment.organic}</p>
                          </div>
                          {treatment.window && (
                            <p className="text-[10px] font-bold text-rose-600 pt-1 border-t border-emerald-200/50">
                              ⏱️ {treatment.window}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default React.memo(DiseaseMap);
