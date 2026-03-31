import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, CloudRain, AlertTriangle, CloudSun, CheckCircle } from 'lucide-react';

const WeatherIntelligence = ({ userLocation }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Prevent micro-GPS noise (causes lag) by rounding lat/lng to ~1km precision
    const latRounded = userLocation?.lat ? userLocation.lat.toFixed(2) : '20.30';
    const lngRounded = userLocation?.lng ? userLocation.lng.toFixed(2) : '85.82';

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latRounded}&longitude=${lngRounded}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=precipitation_probability_max&timezone=auto`);
                
                if (!res.ok) throw new Error('Failed to fetch weather data');
                const data = await res.json();
                
                setWeather({
                    temp: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m,
                    precip: data.current.precipitation,
                    precipProb: data.daily?.precipitation_probability_max?.[0] || 0,
                    code: data.current.weather_code
                });
            } catch (err) {
                console.error("Weather fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        
        const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30 mins
        return () => clearInterval(interval);
    }, [latRounded, lngRounded]);

    const getRiskAssessment = () => {
        if (!weather) return null;
        const { temp, humidity, precipProb, precip } = weather;

        // 1. Heavy Rain
        if (precipProb > 60 || precip > 5) {
            return {
                level: 'high',
                title: 'Heavy Rain Warning',
                desc: 'High probability of rain. Do not spray pesticides today as they will wash away.',
                icon: CloudRain,
                color: 'text-blue-500',
                colorDark: 'text-blue-700',
                bg: 'bg-blue-50',
                border: 'border-blue-200'
            };
        }
        
        // 2. Rice Blast / Fungal Alert
        if (humidity > 80 && temp >= 20 && temp <= 28) {
            return {
                level: 'high',
                title: 'Rice Blast High Alert',
                desc: 'High humidity and moderate temps are accelerating pathogenic fungal spore germination.',
                icon: AlertTriangle,
                color: 'text-rose-500',
                colorDark: 'text-rose-700',
                bg: 'bg-rose-50',
                border: 'border-rose-200'
            };
        }

        // 3. Spider Mites / Heat Stress
        if (temp > 35 && humidity < 50) {
            return {
                level: 'medium',
                title: 'Spider Mite Outbreak Risk',
                desc: 'Dry heat conditions are optimal for Spider Mite colonies. Increase field monitoring.',
                icon: Thermometer,
                color: 'text-amber-500',
                colorDark: 'text-amber-700',
                bg: 'bg-amber-50',
                border: 'border-amber-200'
            };
        }

        // Default: Safe
        return {
            level: 'low',
            title: 'Optimal Micro-Climate',
            desc: 'Current weather conditions present low immediate risk for major pathogenic outbreaks.',
            icon: CheckCircle,
            color: 'text-emerald-500',
            colorDark: 'text-emerald-700',
            bg: 'bg-emerald-50/50',
            border: 'border-emerald-200/50'
        };
    };

    if (loading) {
        return (
            <div className="w-full h-32 liquid-glass rounded-[2rem] flex items-center justify-center animate-pulse border border-emerald-900/10 mb-8 z-10 relative">
                <div className="flex flex-col items-center gap-2">
                    <CloudSun className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800/50">Syncing Micro-Climate Data...</span>
                </div>
            </div>
        );
    }

    if (error || !weather) return null;

    const risk = getRiskAssessment();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full liquid-glass rounded-[2.5rem] p-6 md:p-8 mb-8 border border-emerald-900/10 shadow-xl relative overflow-hidden z-10`}
        >
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${risk.level === 'high' ? (risk.title.includes('Rain') ? 'bg-blue-500' : 'bg-rose-500') : risk.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />

            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative z-20">
                
                {/* Weather Metrics */}
                <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800/50 block mb-1">Local Micro-Climate</span>
                        <div className="flex items-center gap-3">
                            <CloudSun className="w-10 h-10 text-emerald-600 drop-shadow-sm" />
                            <div className="flex flex-col">
                                <span className="font-heading italic text-4xl text-emerald-950 leading-none">{Math.round(weather.temp)}°C</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700/80 mt-1">{userLocation ? 'GPS Synced' : 'Regional Default'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-12 w-px bg-emerald-900/10 hidden md:block"></div>

                    <div className="flex gap-8">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-emerald-800/60">
                                <Droplets className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Humidity</span>
                            </div>
                            <span className="text-xl font-bold text-emerald-900">{Math.round(weather.humidity)}%</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-emerald-800/60">
                                <CloudRain className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Precip</span>
                            </div>
                            <span className="text-xl font-bold text-emerald-900">{weather.precipProb}%</span>
                        </div>
                    </div>
                </div>

                <div className="w-full xl:w-px h-px xl:h-16 bg-emerald-900/10"></div>

                {/* Risk Assessment Block */}
                <div className={`flex-1 w-full rounded-3xl p-5 border shadow-sm ${risk.bg} ${risk.border} flex items-start gap-4 transition-colors`}>
                    <div className={`mt-1 bg-white p-2.5 rounded-full shadow-sm ${risk.color}`}>
                        <risk.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Predictive Risk Engine</span>
                            {risk.level === 'high' && (
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                            )}
                        </div>
                        <h4 className={`font-heading italic text-xl md:text-2xl mb-1 ${risk.colorDark}`}>
                            {risk.title}
                        </h4>
                        <p className={`text-sm font-semibold text-emerald-950/70 leading-relaxed`}>
                            {risk.desc}
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default React.memo(WeatherIntelligence);
