import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Layers, Crosshair, Filter, AlertTriangle, 
  ZoomIn, ZoomOut, Maximize2, Minimize2, Compass, Box, Square, MapPin
} from 'lucide-react';

// High-performance direct tile layer styles for MapLibre GL with overscaling protection
const MAP_STYLES = {
  esriStreet: {
    name: '3D Clean Street & Agro',
    dark: false,
    style: {
      version: 8,
      sources: {
        'esri-street-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; Esri &copy; HERE, Garmin, USGS'
        }
      },
      layers: [
        {
          id: 'esri-street-layer',
          type: 'raster',
          source: 'esri-street-tiles',
          minzoom: 0,
          maxzoom: 24
        }
      ]
    }
  },
  satellite: {
    name: '3D Satellite Hybrid',
    dark: true,
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; Esri &copy; Maxar, Earthstar Geographics'
        },
        'esri-labels': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 19
        }
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 24
        },
        {
          id: 'labels-layer',
          type: 'raster',
          source: 'esri-labels',
          minzoom: 0,
          maxzoom: 24
        }
      ]
    }
  },
  esriTopo: {
    name: '3D Topographic Relief',
    dark: false,
    style: {
      version: 8,
      sources: {
        'esri-topo-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; Esri &copy; USGS, FAO, NOAA'
        }
      },
      layers: [
        {
          id: 'esri-topo-layer',
          type: 'raster',
          source: 'esri-topo-tiles',
          minzoom: 0,
          maxzoom: 24
        }
      ]
    }
  },
  osm: {
    name: '3D OpenStreetMap',
    dark: false,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 24
        }
      ]
    }
  }
};

// Actionable agronomic cure protocols
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
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// Generate circular GeoJSON polygon for 5km safety buffer
function createGeoJSONCircle(center, radiusKm, points = 64) {
  const [lng, lat] = center;
  const coords = {
    latitude: lat,
    longitude: lng
  };
  const km = radiusKm;
  const ret = [];
  const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
  const distanceY = km / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret]
    }
  };
}

const DiseaseMap = ({ diseasePoints = [], userLocation = null }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [activeStyleKey, setActiveStyleKey] = useState('esriStreet');
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState('all');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Extract unique disease names for filter dropdown
  const uniqueDiseases = useMemo(() => {
    const set = new Set(diseasePoints.map(p => p.disease).filter(Boolean));
    return Array.from(set);
  }, [diseasePoints]);

  // Filtered disease points
  const filteredPoints = useMemo(() => {
    return diseasePoints.filter(pt => {
      const matchSeverity = selectedSeverity === 'all' || pt.severity === selectedSeverity;
      const matchDisease = selectedDiseaseFilter === 'all' || pt.disease === selectedDiseaseFilter;
      return matchSeverity && matchDisease;
    });
  }, [diseasePoints, selectedSeverity, selectedDiseaseFilter]);

  // Compute nearest outbreak distance from user's farm
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

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = userLocation 
      ? [userLocation.lng, userLocation.lat] 
      : [85.8245, 20.2961];

    const currentStyle = MAP_STYLES[activeStyleKey]?.style || MAP_STYLES.esriStreet.style;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: currentStyle,
      center: initialCenter,
      zoom: 9.5,
      minZoom: 3,
      maxZoom: 18.5,
      pitch: is3DMode ? 48 : 0,
      bearing: is3DMode ? -15 : 0,
      maxPitch: 85,
      attributionControl: false,
    });

    mapRef.current = map;

    // Add minimal attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      renderFarmSafetyZone(map);
      map.resize();
    });

    const resizeTimer = setTimeout(() => {
      if (mapRef.current) mapRef.current.resize();
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map style when activeStyleKey changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(MAP_STYLES[activeStyleKey].style);

    mapRef.current.once('styledata', () => {
      renderFarmSafetyZone(mapRef.current);
    });
  }, [activeStyleKey]);

  // Render 5km Safety Zone GeoJSON Layer
  const renderFarmSafetyZone = (map) => {
    if (!map || !userLocation) return;

    const circleGeoJSON = createGeoJSONCircle([userLocation.lng, userLocation.lat], 5);

    if (map.getSource('farm-safety-zone')) {
      map.getSource('farm-safety-zone').setData(circleGeoJSON);
    } else {
      map.addSource('farm-safety-zone', {
        type: 'geojson',
        data: circleGeoJSON
      });

      map.addLayer({
        id: 'farm-safety-fill',
        type: 'fill',
        source: 'farm-safety-zone',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.08
        }
      });

      map.addLayer({
        id: 'farm-safety-outline',
        type: 'line',
        source: 'farm-safety-zone',
        paint: {
          'line-color': '#10b981',
          'line-width': 2,
          'line-dasharray': [3, 3]
        }
      });
    }
  };

  // Sync markers when filteredPoints or userLocation changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add User Farm Marker if location is available
    if (userLocation) {
      const userEl = document.createElement('div');
      userEl.className = 'farm-beacon-marker';
      userEl.innerHTML = `
        <div class="relative flex items-center justify-center w-10 h-10 cursor-pointer">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500 animate-ping opacity-40"></div>
          <div class="relative w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">🌾</div>
        </div>
      `;
      userEl.onclick = () => {
        map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12, speed: 1.2 });
      };

      const userMarker = new maplibregl.Marker({ element: userEl, anchor: 'center' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);

      markersRef.current.push(userMarker);
    }

    // Add Disease Outbreak Markers
    filteredPoints.forEach((pt) => {
      const isHigh = pt.severity === 'high';
      const isMedium = pt.severity === 'medium';
      const color = isHigh ? '#e11d48' : isMedium ? '#f59e0b' : '#22c55e';
      const size = isHigh ? 38 : isMedium ? 32 : 26;
      const placeLabel = pt.location || `Lat ${pt.lat.toFixed(3)}, Lng ${pt.lng.toFixed(3)}`;

      const el = document.createElement('div');
      el.className = 'disease-pulse-marker group cursor-pointer relative';
      el.innerHTML = `
        <div class="relative flex items-center justify-center" style="width:${size}px; height:${size}px;">
          <div class="absolute inset-0 rounded-full animate-ping opacity-30" style="background-color:${color};"></div>
          <div class="relative rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-white font-extrabold text-[10px]"
               style="width:${size}px; height:${size}px; background-color:${color}; box-shadow: 0 0 20px ${color}80;">
            ${isHigh ? '⚠️' : '●'}
          </div>
          <!-- Hover Place Name Tooltip -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50 whitespace-nowrap">
            <div class="bg-emerald-950/95 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-white/20">
              <span class="text-rose-300 font-extrabold block">${pt.disease}</span>
              <span class="text-emerald-200 text-[9px] font-medium">${placeLabel}</span>
            </div>
            <div class="w-1.5 h-1.5 bg-emerald-950/95 rotate-45 -mt-0.5"></div>
          </div>
        </div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        setSelectedPoint(pt);
        map.flyTo({ center: [pt.lng, pt.lat], zoom: Math.max(map.getZoom(), 11), speed: 1.2 });
      };

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([pt.lng, pt.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

  }, [filteredPoints, userLocation]);

  // Toggle 3D Perspective vs 2D Flat
  const toggle3DMode = () => {
    const map = mapRef.current;
    if (!map) return;
    const newMode = !is3DMode;
    setIs3DMode(newMode);
    map.easeTo({
      pitch: newMode ? 48 : 0,
      bearing: newMode ? -15 : 0,
      duration: 1000
    });
  };

  // Center on Farm
  const handleLocateFarm = () => {
    const map = mapRef.current;
    if (!map) return;
    if (userLocation) {
      map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12, pitch: is3DMode ? 48 : 0, speed: 1.4 });
    } else {
      map.flyTo({ center: [85.8245, 20.2961], zoom: 10, pitch: is3DMode ? 48 : 0, speed: 1.2 });
    }
  };

  // Reset North & Heading
  const handleResetNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ bearing: 0, pitch: is3DMode ? 48 : 0, duration: 800 });
  };

  const treatment = selectedPoint ? (DISEASE_TREATMENTS[selectedPoint.disease] || null) : null;
  const pointDistance = (selectedPoint && userLocation) 
    ? calculateDistance(userLocation.lat, userLocation.lng, selectedPoint.lat, selectedPoint.lng) 
    : null;

  return (
    <div className={`w-full ${isFullScreen ? 'fixed inset-0 z-[200] h-screen rounded-none' : 'h-[550px] lg:h-[620px] rounded-[2.5rem]'} overflow-hidden shadow-2xl border border-emerald-900/10 z-0 relative liquid-glass transition-all duration-300 flex flex-col`}>
      
      {/* Top Tactical Command Bar */}
      <div className="p-3 sm:px-6 bg-white/85 backdrop-blur-md border-b border-emerald-900/10 z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-emerald-900/60 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter:
          </span>

          <div className="flex items-center gap-1 bg-emerald-50/90 p-1 rounded-full border border-emerald-200/50">
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
              Nearest: {nearestOutbreak.disease} ({nearestOutbreak.distance} km{nearestOutbreak.location ? ` • ${nearestOutbreak.location.split('(')[0].trim()}` : ''})
            </span>
          )}

          <span className="text-emerald-800/60 font-mono font-bold text-[11px] hidden md:inline">
            Active: {filteredPoints.length}
          </span>
        </div>
      </div>

      {/* MapLibre WebGL Canvas Container */}
      <div className="flex-1 relative w-full h-full overflow-hidden" style={{ minHeight: '480px' }}>
        <div ref={mapContainerRef} className="w-full h-full" style={{ width: '100%', height: '100%', minHeight: '480px' }} />

        {/* Floating Top-Left Style Switcher */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => setStyleOpen(!styleOpen)}
            className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-full shadow-lg border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>{MAP_STYLES[activeStyleKey]?.name || 'Map Layer'}</span>
          </button>

          {styleOpen && (
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden w-52">
              {Object.keys(MAP_STYLES).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveStyleKey(key);
                    setStyleOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold tracking-wide transition-all flex items-center justify-between
                    ${activeStyleKey === key ? 'bg-emerald-50 text-emerald-900' : 'text-emerald-800/70 hover:bg-emerald-50/50 hover:text-emerald-900'}`}
                >
                  <span>{MAP_STYLES[key].name}</span>
                  {activeStyleKey === key && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Floating Top-Right 3D / GPS / Fullscreen Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          {/* 3D / 2D Perspective Toggle */}
          <button
            onClick={toggle3DMode}
            className={`px-3.5 py-2 rounded-full shadow-lg border text-xs font-bold transition-all flex items-center gap-1.5
              ${is3DMode ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30' : 'bg-white/95 text-emerald-900 border-emerald-100 hover:bg-white'}`}
            title="Toggle 3D Drone Perspective vs 2D Flat View"
          >
            {is3DMode ? <Box className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>{is3DMode ? '3D View' : '2D View'}</span>
          </button>

          {/* Compass Reset */}
          <button
            onClick={handleResetNorth}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all"
            title="Reset Map Heading to North"
          >
            <Compass className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Locate Farm Button */}
          <button
            onClick={handleLocateFarm}
            className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Center on My Farm Location"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">My Farm</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              setIsFullScreen(!isFullScreen);
              setTimeout(() => mapRef.current?.resize(), 250);
            }}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-emerald-100 text-emerald-900 hover:scale-105 hover:bg-white transition-all"
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4 text-emerald-700" /> : <Maximize2 className="w-4 h-4 text-emerald-700" />}
          </button>
        </div>

        {/* Bottom Right Zoom Controls */}
        <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="bg-white/90 hover:bg-white backdrop-blur-md w-9 h-9 rounded-full shadow-lg border border-emerald-100 text-emerald-900 flex items-center justify-center transition-all hover:scale-105"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="bg-white/90 hover:bg-white backdrop-blur-md w-9 h-9 rounded-full shadow-lg border border-emerald-100 text-emerald-900 flex items-center justify-center transition-all hover:scale-105"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Disease Zone Detail Modal / Card */}
        {selectedPoint && (
          <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="liquid-glass-strong p-5 rounded-3xl shadow-2xl border border-emerald-200/80 bg-white/95 text-emerald-950">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/10 mb-3">
                <div>
                  <span className="font-heading italic font-bold text-emerald-950 block text-2xl leading-none">
                    {selectedPoint.disease}
                  </span>
                  {selectedPoint.location && (
                    <span className="text-xs font-bold text-emerald-900/90 flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      {selectedPoint.location}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-800/60 font-semibold block mt-0.5">
                    Detected: {new Date(selectedPoint.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md
                    ${selectedPoint.severity === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-200' : selectedPoint.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {selectedPoint.severity} Risk
                  </span>
                  <button
                    onClick={() => setSelectedPoint(null)}
                    className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors font-bold text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Distance & Confidence Stats */}
              <div className="flex gap-2 items-center mb-3 flex-wrap">
                {pointDistance !== null && (
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full
                    ${pointDistance <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-800'}`}>
                    📍 {pointDistance} km from your farm
                  </span>
                )}
                {(selectedPoint.confidence_score || selectedPoint.intensity) && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                    🎯 {selectedPoint.confidence_score ? `${selectedPoint.confidence_score}%` : `${Math.round(selectedPoint.intensity * 100)}%`} AI Confidence
                  </span>
                )}
              </div>

              {/* Agronomic Action Protocol */}
              {treatment && (
                <div className="space-y-2 text-xs bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/80 mb-2">
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
          </div>
        )}

      </div>
    </div>
  );
};

export default React.memo(DiseaseMap);
