import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Tractor, MapPin, IndianRupee, User, Plus, X, MessageCircle, Loader2 } from 'lucide-react';

const CATEGORIES = ['Tractor', 'Harvester', 'Sprayer', 'Hand Tools', 'Pump', 'Other'];
const DISTRICTS = ['All Odisha', 'Sambalpur', 'Cuttack', 'Bhubaneswar', 'Bolangir', 'Koraput', 'Mayurbhanj', 'Ganjam', 'Sundargarh', 'Puri'];

export default function EquipmentBoard({ t, lang, setDmSessionId, setActiveTab, user }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tractor',
    price: '',
    district: '',
    ownerName: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'equipment_listings'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setEquipmentList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Error fetching equipment:", err);
      setError("Please ensure you have added the 'krishinet_equipment' rule in Firebase!");
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.district || !formData.ownerName) {
      setError("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // Create a unique DM session ID for this listing
    const sessionId = Math.random().toString(36).substring(2, 10);

    try {
      await addDoc(collection(db, 'equipment_listings'), {
        ...formData,
        price: Number(formData.price),
        timestamp: Date.now(),
        language: lang,
        dmSessionId: sessionId
      });
      setShowAddModal(false);
      setFormData({ name: '', category: 'Tractor', price: '', district: '', ownerName: '', description: '' });
    } catch (err) {
      console.error(err);
      setError("Failed to post listing. Check Firebase rules.");
    }
    setIsSubmitting(false);
  };

  const contactOwner = (sessionId) => {
    setDmSessionId(sessionId);
    setActiveTab('dm');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-heading italic text-3xl text-emerald-950 flex items-center gap-3">
            <Tractor className="w-8 h-8 text-emerald-600" /> Krishi-Net Equipment
          </h2>
          <p className="text-emerald-800/80 font-medium mt-1">Rent or borrow heavy machinery from local farmers.</p>
        </div>
        {user && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> List Equipment
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {equipmentList.length === 0 && !error && (
        <div className="bg-white/60 border border-emerald-900/10 rounded-3xl p-12 text-center">
          <Tractor className="w-16 h-16 text-emerald-800/20 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-emerald-950 mb-2">No equipment listed yet</h3>
          <p className="text-emerald-800/60 mb-6">Be the first to list your tractor or tools for rent!</p>
          {user && (
            <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-emerald-100 text-emerald-800 rounded-full font-bold hover:bg-emerald-200 transition-colors">
              List Equipment
            </button>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipmentList.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {item.category}
              </span>
              <span className="flex items-center gap-1 text-emerald-900 font-bold text-lg">
                <IndianRupee className="w-4 h-4" /> {item.price} <span className="text-xs text-emerald-800/50 font-normal">/day</span>
              </span>
            </div>
            
            <h3 className="font-heading italic text-2xl text-emerald-950 mb-2">{item.name}</h3>
            {item.description && <p className="text-sm text-emerald-800/80 mb-6 flex-1">{item.description}</p>}
            {!item.description && <div className="flex-1"></div>}
            
            <div className="border-t border-emerald-50 pt-4 mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800/70">
                  <User className="w-3.5 h-3.5" /> {item.ownerName}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800/70">
                  <MapPin className="w-3.5 h-3.5" /> {item.district}
                </div>
              </div>
              {user ? (
                <button 
                  onClick={() => contactOwner(item.dmSessionId)}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-emerald-200/50"
                >
                  <MessageCircle className="w-4 h-4" /> Contact Owner
                </button>
              ) : (
                <div className="w-full bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-200/50">
                  Login to Contact
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/50">
                <h3 className="font-heading italic text-2xl text-emerald-950">List Equipment</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-100 text-emerald-900/40 hover:text-emerald-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-1.5">Equipment Name</label>
                  <input required type="text" placeholder="e.g. Mahindra 265 DI Tractor" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:bg-white" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-1.5">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:bg-white">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-1.5">Price / Day (₹)</label>
                    <input required type="number" placeholder="500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:bg-white" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-1.5">Your Name</label>
                    <input required type="text" placeholder="Owner Name" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:bg-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-1.5">District</label>
                    <select required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:bg-white">
                      <option value="">Select...</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-1.5">Description (Optional)</label>
                  <textarea placeholder="e.g. Good condition, available from next week." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:bg-white resize-none h-20" />
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 shadow-md transition-colors mt-2 flex justify-center items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post Listing"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
