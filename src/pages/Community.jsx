import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Leaf, MessageCircle, MapPin, Send, Loader2, ThumbsUp, AlertTriangle, Globe2, ChevronLeft, ShieldAlert, Pin, TrendingUp, Users } from 'lucide-react';

const TRANSLATIONS = {
  en: { feed: "Public Feed", districts: "District Groups", messages: "Messages", post: "Post", name: "Your Name", dist: "District (Optional)", lang: "Language", compose: "Post to Community", write: "Write your message...", check: "Checking message...", error: "Your message could not be sent. Please keep the conversation respectful and farming-focused.", likes: "likes", activeNow: "farmers talking right now across Odisha.", reply: "Message", translate: "Translate", pin: "Pinned Alert", report: "Report", trending: "Trending Topics", verifying: "Verifying...", reportDone: "Reported" },
  or: { feed: "ସାର୍ବଜନୀନ ଫିଡ୍", districts: "ଜିଲ୍ଲା ଗୋଷ୍ଠୀ", messages: "ସନ୍ଦେଶ", post: "ପୋଷ୍ଟ", name: "ଆପଣଙ୍କ ନାମ", dist: "ଜିଲ୍ଲା (ଇଚ୍ଛାଧୀନ)", lang: "ଭାଷା", compose: "ସମ୍ପ୍ରଦାୟରେ ପୋଷ୍ଟ କରନ୍ତୁ", write: "ଆପଣଙ୍କ ସନ୍ଦେଶ ଲେଖନ୍ତୁ...", check: "ସନ୍ଦେଶ ଯାଞ୍ଚ ହେଉଛି...", error: "ଆପଣଙ୍କ ସନ୍ଦେଶ ପଠାଯାଇପାରିଲା ନାହିଁ। ଦୟାକରି କୃଷି ସମ୍ବନ୍ଧୀୟ ଆଲୋଚନା ରଖନ୍ତୁ।", likes: "ଲାଇକ", activeNow: "କୃଷକମାନେ ବର୍ତ୍ତମାନ ଓଡିଶାରେ କଥା ହେଉଛନ୍ତି |", reply: "ସନ୍ଦେଶ", translate: "ଅନୁବାଦ କରନ୍ତୁ", pin: "ପିନ୍ ହୋଇଥିବା ଆଲର୍ଟ", report: "ରିପୋର୍ଟ", trending: "ଟ୍ରେଣ୍ଡିଂ ବିଷୟଗୁଡ଼ିକ", verifying: "ଯାଞ୍ଚ ହେଉଛି...", reportDone: "ରିପୋର୍ଟ ହୋଇଛି" },
  hi: { feed: "पब्लिक फ़ीड", districts: "जिला समूह", messages: "संदेश", post: "पोस्ट", name: "आपका नाम", dist: "जिला (वैकल्पिक)", lang: "भाषा", compose: "समुदाय में पोस्ट करें", write: "अपना संदेश लिखें...", check: "संदेश की जाँच हो रही है...", error: "आपका संदेश नहीं भेजा जा सका। कृपया बातचीत सम्मानजनक रखें।", likes: "पसंद", activeNow: "किसान अभी पूरे ओडिशा में बात कर रहे हैं।", reply: "संदेश", translate: "अनुवाद करें", pin: "पिन किया गया अलर्ट", report: "रिपोर्ट", trending: "ट्रेंडिंग विषय", verifying: "जाँच हो रही है...", reportDone: "रिपोर्ट किया गया" },
  te: { feed: "పబ్లిక్ ఫీడ్", districts: "జిల్లా సమూహాలు", messages: "సందేశాలు", post: "పోస్ట్", name: "మీ పేరు", dist: "జిల్లా (ఐచ్ఛికం)", lang: "భాష", compose: "కమ్యూనిటీకి పోస్ట్ చేయండి", write: "మీ సందేశాన్ని రాయండి...", check: "సందేశాన్ని తనిఖీ చేస్తోంది...", error: "మీ సందేశం పంపబడలేదు. దయచేసి సంభాషణను గౌరవప్రదంగా ఉంచండి.", likes: "ఇష్టాలు", activeNow: "ఒడిషా అంతటా రైతులు మాట్లాడుతున్నారు.", reply: "సందేశం", translate: "అనువదించు", pin: "పిన్ చేయబడిన హెచ్చరిక", report: "నివేదించు", trending: "ట్రెండింగ్ అంశాలు", verifying: "పరిశీలిస్తోంది...", reportDone: "నివేదించబడింది" },
  bn: { feed: "পাবলিক ফিড", districts: "জেলা গ্রুপ", messages: "বার্তা", post: "পোস্ট", name: "আপনার নাম", dist: "জেলা (ঐচ্ছিক)", lang: "ভাষা", compose: "সম্প্রদায়ে পোস্ট করুন", write: "আপনার বার্তা লিখুন...", check: "বার্তা চেক করা হচ্ছে...", error: "আপনার বার্তা পাঠানো যায়নি। অনুগ্রহ করে কথোপকথন সম্মানজনক রাখুন।", likes: "পছন্দ", activeNow: "কৃষকরা এখন ওড়িশা জুড়ে কথা বলছেন।", reply: "বার্তা", translate: "অনুবাদ করুন", pin: "পিন করা সতর্কতা", report: "রিপোর্ট", trending: "ট্রেন্ডিং বিষয়", verifying: "যাচাই করা হচ্ছে...", reportDone: "রিপোর্ট করা হয়েছে" },
  mr: { feed: "सार्वजनिक फीड", districts: "जिल्हा गट", messages: "संदेश", post: "पोस्ट करा", name: "तुमचे नाव", dist: "जिल्हा (पर्यायी)", lang: "भाषा", compose: "समुदायावर पोस्ट करा", write: "तुमचा संदेश लिहा...", check: "संदेश तपासत आहे...", error: "तुमचा संदेश पाठवला जाऊ शकला नाही. कृपया संभाषण आदरपूर्वक ठेवा.", likes: "पसंत", activeNow: "शेतकरी आता संपूर्ण ओडिशात बोलत आहेत.", reply: "संदेश", translate: "भाषांतर करा", pin: "पिन केलेला अलर्ट", report: "नोंदवा", trending: "ट्रेंडिंग विषय", verifying: "तपासत आहे...", reportDone: "नोंदवली" }
};

const DISTRICTS = ['All Odisha', 'Sambalpur', 'Cuttack', 'Bhubaneswar', 'Bolangir', 'Koraput', 'Mayurbhanj', 'Ganjam', 'Sundargarh', 'Puri'];
const LANGUAGES = [
  { code: 'en', name: 'English', emoji: '🇬🇧' },
  { code: 'or', name: 'Odia', emoji: '🇮🇳' },
  { code: 'hi', name: 'Hindi', emoji: '🇮🇳' },
  { code: 'te', name: 'Telugu', emoji: '🇮🇳' },
  { code: 'bn', name: 'Bengali', emoji: '🇮🇳' },
  { code: 'mr', name: 'Marathi', emoji: '🇮🇳' }
];

const PROXY_URL = 'http://localhost:7860/v1'; // Assuming G0DM0D3 API is running on localhost:7860. In production this would be absolute path.

const moderateMessage = async (message) => {
  try {
    const res = await fetch(`${PROXY_URL}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error(err);
    // Be lenient if moderation API fails
    return { approved: true, cleaned_message: message, reason: 'Moderation skip due to error' };
  }
};

const translateText = async (text, targetLangCode) => {
  try {
    const langObj = LANGUAGES.find(l => l.code === targetLangCode) || LANGUAGES[0];
    const res = await fetch(`${PROXY_URL}/moderate/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target_language: langObj.name })
    });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.translated_text;
  } catch (err) {
    console.error(err);
    return text; // fallback
  }
};

// ... COMPONENT DEFINITION ...

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed'); // feed, district, dm
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  
  const [activeFarmers, setActiveFarmers] = useState(1284);
  const [dmSessionId, setDmSessionId] = useState(null);
  
  // Extract DM from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dm = params.get('dm');
    if (dm) {
      setDmSessionId(dm);
      setActiveTab('dm');
    }
    
    // Simulate active farmers jumping randomly
    const interval = setInterval(() => {
      setActiveFarmers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 text-emerald-950 font-body relative overflow-x-hidden pb-20 leaf-pattern-bg">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-pink-50/50 pointer-events-none -z-10"></div>
      
      {/* Header */}
      <header className="pt-24 pb-8 px-6 lg:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to BloomSense
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center p-2 bg-emerald-100 rounded-full text-emerald-600">
                <Users className="w-6 h-6" />
              </span>
              <h1 className="font-heading italic text-5xl tracking-tight text-emerald-950">
                Krishi <span className="text-emerald-700">Chaupal</span>
              </h1>
            </div>
            <p className="text-emerald-800/80 font-medium flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               {activeFarmers.toLocaleString()} {t.activeNow}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'feed', label: t.feed, icon: Globe2 },
            { id: 'district', label: t.districts, icon: MapPin },
            { id: 'dm', label: t.messages, icon: MessageCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if(tab.id !== 'dm') setDmSessionId(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-white/50 text-emerald-800 hover:bg-white border border-emerald-100'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 lg:px-12 max-w-7xl mx-auto z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && <PublicFeed key="feed" t={t} lang={lang} />}
          {activeTab === 'district' && <DistrictChats key="district" t={t} lang={lang} />}
          {activeTab === 'dm' && <DirectMessaging key="dm" t={t} lang={lang} dmSessionId={dmSessionId} setDmSessionId={setDmSessionId} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// SECTION 1: PUBLIC FEED
// ---------------------------------------------------------
function PublicFeed({ t, lang }) {
  const [posts, setPosts] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');

  // Top trending words mock dynamically updated
  const trendingWords = ["Rain in Mayurbhanj", "Rice Blast Alert", "MSP 2026", "PM Kisan Yojana"];

  useEffect(() => {
    const q = query(collection(db, 'community_posts'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    setIsPosting(true);
    setErr('');
    
    const modResult = await moderateMessage(message);
    
    if (!modResult.approved) {
      setErr(t.error);
      setIsPosting(false);
      return;
    }
    
    const verifiedBadge = auth.currentUser ? true : false;
    
    await addDoc(collection(db, 'community_posts'), {
      username: name.trim(),
      district: district || null,
      language: lang,
      message: modResult.cleaned_message || message.trim(),
      timestamp: Date.now(),
      likes: 0,
      reported_count: 0,
      pinned: false,
      isVerified: verifiedBadge
    });
    
    setMessage('');
    setIsPosting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        
        {/* Compose Box */}
        <form onSubmit={handlePost} className="bg-white/80 liquid-glass rounded-3xl p-6 border border-emerald-900/10 shadow-sm relative overflow-hidden">
          {err && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm font-semibold rounded-xl border border-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" /> {err}
            </div>
          )}
          <div className="flex gap-4 mb-4">
            <input 
              type="text" required placeholder={t.name} value={name} onChange={e => setName(e.target.value)}
              className="flex-1 bg-pink-50/50 rounded-xl px-4 py-3 outline-none focus:bg-white border border-emerald-100 transition-colors"
            />
            <select 
              value={district} onChange={e => setDistrict(e.target.value)}
              className="flex-1 bg-pink-50/50 rounded-xl px-4 py-3 outline-none focus:bg-white border border-emerald-100 text-emerald-900 transition-colors"
            >
              <option value="">{t.dist}</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <textarea 
            required placeholder={t.write} value={message} onChange={e => setMessage(e.target.value)} maxLength={500}
            className="w-full bg-pink-50/50 rounded-xl px-4 py-3 outline-none focus:bg-white border border-emerald-100 transition-colors resize-none min-h-[100px] mb-4"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-800/50">{message.length}/500</span>
            <button 
              disabled={isPosting} 
              type="submit" 
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
            >
              {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isPosting ? t.check : t.compose}
            </button>
          </div>
        </form>

        {/* Feed list */}
        <div className="space-y-4">
          {posts.map(post => <PostCard key={post.id} post={post} t={t} currentLang={lang} />)}
          {posts.length === 0 && <p className="text-center text-emerald-800/50 py-10 font-bold">No posts yet. Start the conversation!</p>}
        </div>
      </div>

      {/* Sidebar - Trending */}
      <div className="hidden lg:block">
        <div className="bg-white/60 p-6 rounded-3xl border border-emerald-900/10 sticky top-28 shadow-sm">
          <h3 className="font-heading italic text-2xl text-emerald-950 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> {t.trending}
          </h3>
          <div className="flex flex-col gap-3">
            {trendingWords.map((word, i) => (
              <div key={i} className="px-4 py-3 bg-white rounded-xl border border-emerald-50 shadow-sm cursor-pointer hover:border-emerald-200 transition-colors">
                <p className="font-bold text-emerald-900 text-sm">#{word.replace(/\s+/g, '')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PostCard({ post, t, currentLang }) {
  const [translatedMsg, setTranslatedMsg] = useState(post.message);
  const [isTranslating, setIsTranslating] = useState(false);
  const [reported, setReported] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

  const langObj = LANGUAGES.find(l => l.code === post.language) || LANGUAGES[0];
  const timeStr = new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleTranslate = async () => {
    setIsTranslating(true);
    const result = await translateText(post.message, currentLang);
    setTranslatedMsg(result);
    setIsTranslating(false);
  };

  const handleLike = async () => {
    if(liked) return;
    setLiked(true);
    setLocalLikes(prev => prev + 1);
    const docRef = doc(db, 'community_posts', post.id);
    await updateDoc(docRef, { likes: increment(1) }).catch(err => {
      setLiked(false);
      setLocalLikes(prev => prev - 1);
    });
  };

  const handleReport = async () => {
    if(reported) return;
    setReported(true);
    await addDoc(collection(db, 'moderation_queue'), {
      message_id: post.id,
      message_content: post.message,
      timestamp: Date.now()
    });
    const docRef = doc(db, 'community_posts', post.id);
    await updateDoc(docRef, { reported_count: increment(1) }).catch(() => setReported(false));
  };

  const startDM = () => {
    const dmCode = Math.random().toString(36).substring(2, 10);
    window.location.href = `/community?dm=${dmCode}`; // Will redirect locally usually handled realistically in router
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border ${post.pinned ? 'border-emerald-400 bg-emerald-50/30' : 'border-emerald-100'} shadow-sm relative group`}>
      {post.pinned && (
        <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-full shadow-lg">
          <Pin className="w-3 h-3" />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer" onClick={startDM}>
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 flex items-center gap-1 cursor-pointer hover:underline" onClick={startDM}>
              {post.username} 
              {post.isVerified && <Leaf className="w-3 h-3 text-emerald-600" />}
              {!post.isVerified && <Leaf className="w-3 h-3 text-emerald-900/20" />}
            </h4>
            <p className="text-xs text-emerald-800/60 font-semibold">
              {post.district && `${post.district} • `}{timeStr} • {langObj.emoji}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-emerald-900 text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">{translatedMsg}</p>
      
      <div className="flex items-center gap-4 text-emerald-800/60 border-t border-emerald-50 pt-3">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs font-bold hover:text-emerald-600 transition-colors ${liked ? 'text-emerald-600' : ''}`}>
          <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {localLikes} {t.likes}
        </button>
        <button onClick={startDM} className="flex items-center gap-1.5 text-xs font-bold hover:text-emerald-600 transition-colors">
          <MessageCircle className="w-4 h-4" /> {t.reply}
        </button>
        
        {post.language !== currentLang && translatedMsg === post.message && (
          <button onClick={handleTranslate} className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 ml-auto transition-colors">
            {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}
            {t.translate}
          </button>
        )}
        
        <button onClick={handleReport} className="flex items-center gap-1text-xs font-bold hover:text-rose-600 transition-colors ml-auto group/rep">
          <AlertTriangle className="w-3.5 h-3.5 group-hover/rep:fill-rose-100" />
          <span className="text-[10px] hidden sm:inline">{reported ? t.reportDone : t.report}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// SECTION 2: DISTRICT GROUP CHATS
// ---------------------------------------------------------
function DistrictChats({ t, lang }) {
  const [activeDistrict, setActiveDistrict] = useState(DISTRICTS[0]);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [err, setErr] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, `district_chats_${activeDistrict}`), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    });
    return () => unsub();
  }, [activeDistrict]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    setIsSending(true);
    setErr('');
    
    const modResult = await moderateMessage(msg);
    if (!modResult.approved) {
      setErr(t.error);
      setIsSending(false);
      return;
    }

    await addDoc(collection(db, `district_chats_${activeDistrict}`), {
      username: name.trim(),
      message: modResult.cleaned_message || msg.trim(),
      language: lang,
      timestamp: Date.now()
    });
    setMsg('');
    setIsSending(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col md:flex-row gap-6 bg-white/40 liquid-glass rounded-[2rem] border border-emerald-900/10 overflow-hidden h-[70vh]">
      
      {/* Sidebar List */}
      <div className="md:w-64 bg-white/50 border-r border-emerald-900/10 overflow-y-auto">
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-900/5 sticky top-0 backdrop-blur-md">
          <h3 className="font-heading italic text-xl text-emerald-950 px-2">{t.districts}</h3>
        </div>
        <div className="p-2 space-y-1">
          {DISTRICTS.map(d => (
            <button 
              key={d} 
              onClick={() => setActiveDistrict(d)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeDistrict === d ? 'bg-emerald-100 text-emerald-900 shadow-sm' : 'text-emerald-800 hover:bg-white/60'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white/40">
        <div className="p-4 border-b border-emerald-900/10 bg-white/60 flex items-center justify-between">
          <h3 className="font-heading italic text-2xl text-emerald-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" /> {activeDistrict}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
          {messages.map(m => (
            <div key={m.id} className="flex flex-col items-start min-w-[50%] max-w-[80%]">
               <span className="text-[10px] font-bold text-emerald-800/50 mb-1 ml-2">{m.username} • {new Date(m.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'})}</span>
               <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-sm border border-emerald-100 shadow-sm text-sm text-emerald-950">
                 {m.message}
               </div>
            </div>
          ))}
          {messages.length === 0 && <div className="h-full flex items-center justify-center text-emerald-800/40 font-bold">{t.write}</div>}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-emerald-900/10">
          {err && <div className="text-xs text-rose-600 font-bold mb-2 ml-2">{err}</div>}
          <div className="flex gap-2 mb-2">
            <input type="text" required placeholder={t.name} value={name} onChange={e => setName(e.target.value)} className="bg-pink-50/50 rounded-xl px-4 py-2 text-sm outline-none w-1/3 border border-emerald-50 focus:border-emerald-200" />
          </div>
          <div className="flex gap-2">
            <input type="text" required placeholder={t.write} value={msg} onChange={e => setMsg(e.target.value)} className="flex-1 bg-pink-50/50 rounded-xl px-4 py-3 outline-none border border-emerald-50 focus:border-emerald-200" />
            <button disabled={isSending} type="submit" className="bg-emerald-600 text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-emerald-700 shadow-sm transition-all active:scale-95 disabled:opacity-50">
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// SECTION 3: DIRECT MESSAGES
// ---------------------------------------------------------
function DirectMessaging({ t, lang, dmSessionId, setDmSessionId }) {
  const [sessionId, setSessionId] = useState(dmSessionId || '');
  const [joinId, setJoinId] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [err, setErr] = useState('');
  const scrollRef = useRef(null);

  const activeSessionId = dmSessionId || sessionId;

  useEffect(() => {
    if (!activeSessionId) return;
    const q = query(collection(db, `direct_messages_${activeSessionId}`), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    });
    return () => unsub();
  }, [activeSessionId]);

  const handleStartSession = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setDmSessionId(id);
    setSessionId(id);
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    if(joinId.trim()) {
      setDmSessionId(joinId.trim());
      setSessionId(joinId.trim());
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim() || !activeSessionId) return;
    setIsSending(true);
    setErr('');
    
    const modResult = await moderateMessage(msg);
    if (!modResult.approved) {
      setErr(t.error);
      setIsSending(false);
      return;
    }

    await addDoc(collection(db, `direct_messages_${activeSessionId}`), {
      username: name.trim(),
      message: modResult.cleaned_message || msg.trim(),
      timestamp: Date.now()
    });
    setMsg('');
    setIsSending(false);
  };

  if (!activeSessionId) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex items-center justify-center py-20">
        <div className="bg-white/80 liquid-glass p-8 rounded-[2rem] border border-emerald-900/10 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="font-heading italic text-3xl text-emerald-950 mb-4 flex items-center justify-center gap-2">Private Connection</h2>
          <p className="text-emerald-800/80 mb-8 font-semibold text-sm leading-relaxed">Start a private peer-to-peer chat session without an account. Share the session ID with another farmer to connect.</p>
          
          <button onClick={handleStartSession} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 shadow-md transition-colors mb-6">
            Start New Conversation
          </button>
          
          <div className="relative border-t border-emerald-900/10 py-6 mb-2">
             <span className="absolute left-1/2 -top-3 transform -translate-x-1/2 bg-white/80 px-2 text-xs font-bold text-emerald-800/50 uppercase tracking-widest">OR</span>
             <form onSubmit={handleJoinSession} className="flex gap-2">
                 <input type="text" required placeholder="Paste Session ID..." value={joinId} onChange={e => setJoinId(e.target.value)} className="flex-1 bg-pink-50/50 rounded-xl px-4 py-3 outline-none focus:bg-white border border-emerald-100 text-sm font-bold" />
                 <button type="submit" className="bg-white border border-emerald-200 text-emerald-800 px-6 rounded-xl hover:bg-emerald-50 font-bold text-sm shadow-sm">Join</button>
             </form>
          </div>
        </div>
      </motion.div>
    );
  }

  const shareLink = `${window.location.origin}/community?dm=${activeSessionId}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/40 liquid-glass rounded-[2rem] border border-emerald-900/10 overflow-hidden h-[70vh] flex flex-col max-w-4xl mx-auto shadow-sm">
        
      {/* Header */}
      <div className="p-4 border-b border-emerald-900/10 bg-white/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={() => setDmSessionId(null)} className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-heading italic text-xl text-emerald-950 flex items-center gap-2">
                Private Chat
              </h3>
              <p className="text-[10px] text-emerald-800/60 font-bold uppercase tracking-widest">ID: {activeSessionId}</p>
            </div>
        </div>
        <button onClick={() => navigator.clipboard.writeText(shareLink)} className="px-4 py-2 bg-pink-50 text-emerald-800 rounded-full text-xs font-bold hover:bg-pink-100 border border-emerald-100 transition-colors">
            Copy Link
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/20" ref={scrollRef}>
        {messages.map(m => {
          const isMe = m.username === name.trim();
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                <span className="text-[10px] font-bold text-emerald-800/50 mb-1 mx-2">{m.username} • {new Date(m.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'})}</span>
                <div className={`${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white text-emerald-950 rounded-tl-sm border border-emerald-100'} px-5 py-3 rounded-2xl shadow-sm text-sm break-words`}>
                  {m.message}
                </div>
            </div>
          )
        })}
        {messages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-emerald-800/40 text-center px-4">
             <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
             <p className="font-bold mb-2">Conversation is empty</p>
             <p className="text-sm">Share the link with someone to start chatting:<br/><span className="text-emerald-600 block mt-2 select-all p-2 bg-emerald-50 rounded-lg border border-emerald-100">{shareLink}</span></p>
        </div>}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-emerald-900/10">
        {err && <div className="text-xs text-rose-600 font-bold mb-2 ml-2">{err}</div>}
        <div className="flex gap-2 mb-2">
          <input type="text" required placeholder={t.name} value={name} onChange={e => setName(e.target.value)} className="bg-pink-50/50 rounded-xl px-4 py-2 text-sm outline-none w-1/3 md:w-1/4 border border-emerald-50 focus:border-emerald-200" />
        </div>
        <div className="flex gap-2">
          <input type="text" required placeholder={t.write} value={msg} onChange={e => setMsg(e.target.value)} className="flex-1 bg-pink-50/50 rounded-xl px-4 py-3 outline-none border border-emerald-50 focus:border-emerald-200" />
          <button disabled={isSending} type="submit" className="bg-emerald-600 text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-emerald-700 shadow-sm transition-all active:scale-95 disabled:opacity-50">
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
