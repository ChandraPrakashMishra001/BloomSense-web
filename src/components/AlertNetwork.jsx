import React, { useState, useMemo } from 'react';
import { ShieldAlert, MapPin, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertNetwork = ({ alerts }) => {
    const [radius, setRadius] = useState(5);

    const filteredAlerts = useMemo(() => {
        return alerts.filter(a => {
            if (a.distance === '?' || a.distance === 'Unknown') return radius === 50;
            if (a.distance === '<1') return true;
            return parseFloat(a.distance) <= radius;
        });
    }, [alerts, radius]);

    return (
        <div className="flex flex-col h-full bg-white/40 rounded-[2.5rem] border border-emerald-900/10 p-6 md:p-8 liquid-glass">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="font-heading italic text-3xl text-emerald-950 leading-none">Community Alerts</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-emerald-800/80 font-semibold text-sm">Live detections within</p>
                        <select 
                            value={radius} 
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="bg-white/50 border border-emerald-900/10 rounded-md text-xs font-bold text-emerald-900 px-2 py-1 outline-none shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={25}>25 km</option>
                            <option value={50}>Global</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 relative min-h-[400px]">
                <AnimatePresence>
                    {filteredAlerts.map((alert, index) => (
                        <motion.div 
                            key={alert.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border-l-4 border-rose-500 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <ShieldAlert size={12} /> High Risk
                                </span>
                                <span className="text-emerald-900/50 text-xs font-bold flex items-center gap-1">
                                    <Clock size={12} /> {alert.timeAgo}
                                </span>
                            </div>
                            <h4 className="font-heading italic text-xl text-emerald-950 mb-1">{alert.disease} Detected</h4>
                            <div className="flex items-center gap-1 text-emerald-800/80 text-sm font-medium">
                                <MapPin size={14} className="text-emerald-600" />
                                {alert.distance}km away across {alert.farmCount} farms
                            </div>
                        </motion.div>
                    ))}
                    
                    {filteredAlerts.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center text-emerald-800/50 pt-10 font-bold"
                        >
                            <ShieldAlert className="w-12 h-12 mx-auto text-emerald-200 mb-3" />
                            No high-risk diseases detected in this radius.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default React.memo(AlertNetwork);
