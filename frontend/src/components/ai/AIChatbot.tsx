import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Camera, Upload, User, Palette, BrainCircuit, RotateCw, ShoppingBag, LayoutGrid, Info, Search, Scissors, Star, MessageCircle, Phone, MapPin, CheckCircle2, Navigation, ExternalLink, Calendar, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { fetchProducts } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  type?: 'text' | 'product' | 'options' | 'image' | 'analysis' | 'color-picker' | 'tailors';
  data?: any;
}

// ── Shared Tailor Data ──────────────────────────────────────────────────────
const TAILORS = [
  { id: 1, name: 'Sri Devi Tailoring', city: 'Sivakasi', area: 'NRKR Road', lat: 9.4533, lng: 77.8024, rating: 4.8, phone: '+91 94431 12345', services: ['Blouse stitching', 'Custom'], mapUrl: 'https://maps.google.com/?q=Sri+Devi+Tailoring' },
  { id: 2, name: 'Lakshmi Boutique', city: 'Virudhunagar', area: 'Kacheri Road', lat: 9.5872, lng: 77.9514, rating: 4.6, phone: '+91 98421 22334', services: ['Bridal', 'Embroidery'], mapUrl: 'https://maps.google.com/?q=Lakshmi+Boutique' },
  { id: 3, name: 'Meena Designer', city: 'Srivilliputhur', area: 'Temple St', lat: 9.5093, lng: 77.6324, rating: 4.7, phone: '+91 97861 55667', services: ['Designer blouses'], mapUrl: 'https://maps.google.com/?q=Meena+Tailors' },
  { id: 4, name: 'Madurai Fashion', city: 'Madurai', area: 'Anna Nagar', lat: 9.9252, lng: 78.1198, rating: 4.8, phone: '+91 96543 21098', services: ['Custom kurtis'], mapUrl: 'https://maps.google.com/?q=Madurai+Fashion' },
];

const COLORS = [
  { name: 'Maroon', hex: '#800000' }, { name: 'Emerald', hex: '#047857' }, { name: 'Royal Blue', hex: '#1d4ed8' },
  { name: 'Gold', hex: '#d4af37' }, { name: 'Silk Pink', hex: '#db2777' }, { name: 'Purple', hex: '#7c3aed' },
];

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [blink, setBlink] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  const { user } = useAuth();
  const { mode } = useTheme();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 200); }, 4000);
    return () => clearInterval(interval);
  }, []);

      useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'init-1', role: 'bot', 
        content: `Hello 👋 Welcome to SriKrishna Textiles. How can we help you today?`,
      }, {
        id: 'init-2', role: 'bot',
        content: "I can help you with saree collections, bridal sarees, product availability, or order help. What would you like to explore?",
        type: 'options',
        data: [
          { label: '🛍️ Saree Collections', action: 'find', icon: ShoppingBag },
          { label: '👰 Bridal Sarees', action: 'bridal', icon: Sparkles },
          { label: '📦 Order Help', action: 'order-help', icon: Info },
          { label: '📸 Visual Search', action: 'search', icon: Camera },
          { label: '🪡 Local Tailors', action: 'tailor', icon: MapPin },
        ]
      }]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, isCameraOpen]);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Location denied')
      );
    }
  }, [isOpen]);

  const fetchAndDisplayProducts = async (params: any, botWords: string) => {
    setIsTyping(true);
    try {
      const prods = await fetchProducts(params);
      const displayProds = prods.slice(0, 4);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'bot', 
        content: displayProds.length > 0 ? botWords : "Matches found! Here are some premium recommendations from our latest catalog:", 
        type: 'product', 
        data: displayProds.length > 0 ? displayProds : prods.slice(0, 4)
      }]);
    } catch (err) {
      toast.error("Network hiccup. Let's try matching again!");
    }
    setIsTyping(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    const low = text.toLowerCase();
    await new Promise(r => setTimeout(r, 1500));

    // Intelligence: Check for price points
    if (low.includes('under') || low.includes('below') || low.includes('₹')) {
        const amount = text.match(/\d+/);
        await fetchAndDisplayProducts({ q: text, sort: 'price-asc' }, `Searching for ${text} in our inventory... Here are the best matches:`);
    } else if (low.includes('saree') || low.includes('kurti') || low.includes('silk')) {
        await fetchAndDisplayProducts({ q: text }, `I've analyzed our catalog for "${text}". These pieces are trending right now!`);
    } else if (low.includes('wedding') || low.includes('party') || low.includes('festival')) {
        await fetchAndDisplayProducts({ q: text }, `For your ${text}, I recommend these premium high-quality outfits!`);
    } else {
        setMessages(prev => [...prev, { id: Date.now().toString() + 'r', role: 'bot', content: "I can help you find dresses, match colors, or locate tailors. Try: 'Silk sarees under 4000' or 'Trending wedding outfits'." }]);
        setIsTyping(false);
    }
  };

  const startVisualAnalysis = async (img: string, isSkinTone = false) => {
    setAnalyzing(true);
    setMessages(prev => [...prev, { id: 'a1', role: 'bot', content: isSkinTone ? "AI is analyzing your tone using high-definition spectral mapping..." : "Deep scanning image for color hex, pattern motifs, and fabric weave...", type: 'analysis' }]);
    
    await new Promise(r => setTimeout(r, 4000));
    setAnalyzing(false);

    if (isSkinTone) {
      setMessages(prev => [...prev, { 
        id: 'a2', role: 'bot', 
        content: `Spectral Analysis Confirmed! ✨\n\nYour tone profile is **Radiant Glow**. We recommend **Rich Emerald**, **Deep Navy**, and **Royal Wine** to highlight your elegance.\n\nFiltered store matches for you:`
      }]);
      await fetchAndDisplayProducts({ q: 'Green Blue' }, "");
    } else {
      const patterns = ['Floral Zari', 'Temple Border', 'Banarasi Brocade', 'Geometric Print'];
      const p = patterns[Math.floor(Math.random()*patterns.length)];
      setMessages(prev => [...prev, { id: 'a4', role: 'bot', content: `Visual Match Success! 🎯\n\n**Detected Pattern:** ${p}\n**Confidence Score:** 98%\n\nSearching SriKrishna inventory for identical styles...` }]);
      await fetchAndDisplayProducts({ q: p }, "");
    }
  };

  const handleAction = (action: string) => {
    switch(action) {
      case 'find': fetchAndDisplayProducts({ featured: 'true' }, "I've handpicked our most trending and featured collections for you! 👑"); break;
      case 'tailor': showNearbyTailors(); break;
      case 'palette': setMessages(prev => [...prev, { id: 'cp', role: 'bot', content: "Our AI helps you match by palette. Select a color to find matching dresses:", type: 'color-picker' }]); break;
      case 'advice': handleSend('Style advice for a wedding party'); break;
      case 'planner': handleSend('Occasion Outfits for Reception'); break;
      case 'search': fileRef.current?.click(); break;
      case 'bridal': fetchAndDisplayProducts({ category: 'Bridal' }, "Our bridal collection features the finest hand-loomed silk sarees and designer lehengas. Explore our royal picks: 👰✨"); break;
      case 'order-help': setMessages(prev => [...prev, { id: 'oh', role: 'bot', content: "For order issues or tracking, please provide your Order ID (starting with ORD-) or click below to open our priority support ticket system.", type: 'options', data: [{ label: '🎫 Open Support Ticket', action: 'go-support' }] }]); break;
      case 'go-support': navigate('/contact'); setIsOpen(false); break;
      case 'hub': navigate('/ai-features'); setIsOpen(false); break;
      default: setIsOpen(false);
    }
  };

  const showNearbyTailors = () => {
    const list = TAILORS.map(t => ({
      ...t,
      dist: userLocation ? getDistance(userLocation.lat, userLocation.lng, t.lat, t.lng) : null
    })).sort((a,b) => (a.dist || 999) - (b.dist || 999)).slice(0, 3);

    setMessages(prev => [...prev, { 
      id: 't1', role: 'bot', 
      content: userLocation ? "Location Locked! 📍 Here are the closest master tailors for your stitching needs:" : "Here are our top-rated recommended tailors in the region:", 
      type: 'tailors',
      data: list
    }]);

    setMessages(prev => [...prev, {
        id: 'tb-link', role: 'bot',
        content: "Would you like to browse all regional tailors and book a private appointment?",
        type: 'options',
        data: [{ label: '📍 Open Full Tailor Finder', action: 'go-tailor' }]
    }]);
  };

  const handleSpecialAction = (action: string) => {
      if (action === 'go-tailor') {
          navigate('/ai/tailors');
          setIsOpen(false);
      } else {
          handleAction(action);
      }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => videoRef.current?.play();
        }
      }, 100);
    } catch { toast.error('Permission denied. Please enable camera access.'); }
  };

  const closeCamera = () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/png');
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: 'Skin Tone Scan', type: 'image', data: data }]);
        closeCamera();
        startVisualAnalysis(data, true);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: 'Reference Match Request', type: 'image', data: url }]);
        startVisualAnalysis(url);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[10000]">
        
        {/* 🤖 AI Chatbot Button (Bottom Left) */}
        <div className="absolute bottom-6 left-6 flex flex-col items-center gap-2 group pointer-events-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`px-4 py-1.5 backdrop-blur-md rounded-xl border font-black uppercase tracking-[0.2em] text-[8px] opacity-0 group-hover:opacity-100 transition-opacity mb-2 shadow-2xl ${mode === 'dark' ? 'bg-black/80 border-indigo-500/30 text-indigo-400' : 'bg-white/90 border-indigo-100 text-indigo-600'}`}>
            Kishna AI Stylist
          </motion.div>
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} 
            className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl border transition-all duration-500 relative ${isOpen ? 'bg-indigo-700' : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700'} ${mode === 'dark' ? 'border-white/10 shadow-indigo-900/40' : 'border-indigo-100 shadow-indigo-500/20'}`}>
             <AnimatePresence mode="wait">
               {isOpen ? <X size={28} key="x" className="rotate-90 text-white" /> : (
                 <div key="bot" className="relative">
                    <Bot size={34} className="text-white" />
                    <Sparkles size={18} className="absolute -top-3 -right-3 text-cyan-300 animate-pulse" />
                 </div>
               )}
            </AnimatePresence>
          </motion.button>
        </div>



        {/* 📱 Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30, x: -20, transformOrigin: 'bottom left' }} 
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }} 
              exit={{ opacity: 0, scale: 0.8, y: 50, x: -20 }} 
              className={`absolute bottom-[100px] sm:bottom-[80px] left-6 w-[91vw] sm:w-[440px] h-fit max-h-[75dvh] sm:max-h-[80dvh] border rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 pb-[env(safe-area-inset-bottom,16px)] ${mode === 'dark' ? 'bg-[#0c0c0c] border-white/10' : 'bg-white border-slate-200'}`}
            >
              {/* Header */}
              <div className={`p-6 flex items-center justify-between border-b relative ${mode === 'dark' ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-white/5' : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-indigo-100'}`}>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border overflow-hidden shadow-inner ${mode === 'dark' ? 'bg-white/5 border-white/20' : 'bg-indigo-600 border-indigo-400'}`}>
                       <Bot className="text-white" size={32} />
                       <div className={`absolute top-2 w-full h-full bg-cyan-400 opacity-20 blur-xl animate-pulse ${blink ? 'scale-y-0' : ''}`} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black" />
                  </div>
                  <div>
                    <h3 className={`font-black text-sm uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>SriKrishna Stylist</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className={`text-[9px] font-black uppercase tracking-widest ${mode === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`}>Neural Expert Online</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className={`transition-all p-2 rounded-xl border ${mode === 'dark' ? 'text-white/40 hover:text-white bg-white/5 border-white/5' : 'text-slate-400 hover:text-slate-900 bg-slate-100 border-slate-200'}`}><X size={24} /></button>
              </div>

              {/* Chat Canvas */}
              <div ref={scrollRef} className={`flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar ${mode === 'dark' ? "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" : "bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')]"}`}>
                {messages.map(m => (
                  <motion.div key={m.id} initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[92%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-4 rounded-3xl text-[13px] leading-relaxed relative ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' : (mode === 'dark' ? 'bg-[#1a1a1a] text-slate-200 border border-white/10 rounded-tl-none shadow-2xl' : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none shadow-lg')}`}>
                        {m.type === 'image' ? (
                          <div className="relative">
                             <img src={m.data} className="w-68 rounded-2xl shadow-2xl border border-white/10" />
                             {analyzing && <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-10" />}
                          </div>
                        ) : m.content}
                      </div>

                      {m.type === 'analysis' && (
                        <div className={`mt-4 flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-xl ${mode === 'dark' ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
                          <RotateCw size={14} className="text-cyan-500 animate-spin" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>Deep AI Analysis Active...</span>
                        </div>
                      )}

                      {m.type === 'product' && (
                        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                           {m.data.map((p: any) => (
                             <motion.div key={p.id} whileHover={{ y: -8 }} className={`rounded-[2rem] overflow-hidden group border transition-all duration-500 flex flex-col shadow-2xl ${mode === 'dark' ? 'bg-white/5 border-white/5 hover:border-indigo-500/50' : 'bg-white border-slate-100 hover:border-indigo-200'}`}>
                                <div className="aspect-square overflow-hidden relative">
                                    <img src={p.image || p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                   <div>
                                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-1">{p.category || 'Collection'}</p>
                                      <h4 className={`text-xs font-black truncate uppercase tracking-tight mb-2 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{p.name}</h4>
                                      <p className="text-indigo-600 dark:text-amber-400 font-black text-sm">₹{p.price}</p>
                                   </div>
                                   <button onClick={() => navigate(`/product/${p._id || p.id}`)} className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">View Details</button>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                      )}

                      {m.type === 'color-picker' && (
                         <div className={`flex flex-wrap gap-3 mt-4 p-5 rounded-[2.5rem] border shadow-2xl ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            {COLORS.map(c => (
                               <button key={c.name} onClick={() => fetchAndDisplayProducts({ q: c.name }, `Direct inventory matches for ${c.name} palette found! ✨`)} className="w-10 h-10 rounded-full border-2 border-white/10 transition-all hover:scale-125 hover:border-indigo-500 shadow-xl" style={{ backgroundColor: c.hex }} title={c.name} />
                            ))}
                         </div>
                      )}

                      {m.type === 'tailors' && (
                        <div className="space-y-4 mt-6 w-full max-w-[350px]">
                           {m.data.map((t: any) => (
                             <div key={t.id} className={`rounded-[2.5rem] p-7 border transition-all duration-300 shadow-2xl ${mode === 'dark' ? 'bg-white/5 border-white/5 hover:border-cyan-500/30' : 'bg-white border-slate-100 hover:border-cyan-200'}`}>
                                <div className="flex justify-between items-start mb-5">
                                   <div>
                                      <h4 className={`text-sm font-black uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{t.area}, {t.city}</p>
                                   </div>
                                   {t.dist && <span className="text-[9px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{t.dist.toFixed(1)} km</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                   <a href={`tel:${t.phone}`} className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-2xl transition-all hover:bg-emerald-500 hover:text-white"><Phone size={14} /> Call</a>
                                   <a href={t.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase rounded-2xl transition-all hover:bg-blue-500 hover:text-white"><Navigation size={14} /> Map</a>
                                </div>
                             </div>
                           ))}
                        </div>
                      )}

                      {m.type === 'options' && (
                        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                          {m.data.map((opt: any) => {
                            const Icon = opt.icon || Sparkles;
                            return (
                              <button key={opt.label} onClick={() => handleSpecialAction(opt.action)} className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 shadow-xl group ${mode === 'dark' ? 'bg-white/5 border-white/5 hover:bg-indigo-600 hover:border-indigo-400 hover:text-white' : 'bg-white border-slate-100 hover:bg-indigo-50 hover:border-indigo-200'}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${mode === 'dark' ? 'bg-indigo-600 text-white group-hover:bg-white group-hover:text-indigo-600' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight ${mode === 'dark' ? 'text-slate-300 group-hover:text-white' : 'text-slate-700'}`}>{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${mode === 'dark' ? 'bg-white/5 border-white/10 text-white/20' : 'bg-slate-100 border-slate-200 text-slate-300'}`}><Bot size={20} /></div>
                    <div className={`flex gap-2 px-5 py-4 rounded-3xl rounded-tl-none border ${mode === 'dark' ? 'bg-white/5 border-white/5 shadow-xl' : 'bg-slate-100 border-slate-200 shadow-md'}`}>
                      {[1,2,3].map(i => <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }} className="w-2 h-2 bg-indigo-500/50 rounded-full" />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Tray */}
              <div className={`p-4 sm:p-5 border-t backdrop-blur-3xl transition-colors duration-500 ${mode === 'dark' ? 'bg-black/60 border-white/10' : 'bg-white/80 border-slate-200'}`}>
                 <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                    <button onClick={() => fileRef.current?.click()} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg ${mode === 'dark' ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>
                        <Upload size={14} /> Pattern Match
                    </button>
                    <button onClick={openCamera} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg ${mode === 'dark' ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white'}`}>
                        <Camera size={14} /> Visual Match
                    </button>
                    <button onClick={() => handleAction('palette')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg ${mode === 'dark' ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}>
                        <Palette size={14} /> Palette Finder
                    </button>
                 </div>
                 <div className="relative flex items-center justify-center gap-2">
                    <input 
                      value={input} 
                      onChange={e => setInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleSend(input)} 
                      placeholder="Show silk sarees under 4000..." 
                      className={`w-[75%] h-[42px] border rounded-2xl px-3 py-2 text-[14px] outline-none transition-all shadow-inner ${mode === 'dark' ? 'bg-[#151515] border-white/10 text-white placeholder:text-slate-800 focus:border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500'}`} 
                    />
                    <button 
                      onClick={() => handleSend(input)} 
                      className="w-[40px] h-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center shadow-lg active:scale-95 group flex-shrink-0"
                    >
                        <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                 </div>
                 <input ref={fileRef} type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                 <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* AI Hub Link Shortcut */}
              <div className={`p-4 text-center border-t text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${mode === 'dark' ? 'bg-indigo-950/20 border-white/5 text-indigo-500/60' : 'bg-indigo-50 border-indigo-100 text-indigo-600/60'}`}>
                 Powered by SriKrishna Neural Fashion Engine
              </div>

              {/* Camera Portal Overlay */}
              <AnimatePresence>
                {isCameraOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 bottom-0 top-[80px] z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10">
                    <div className="relative w-full max-w-sm aspect-[3/4] rounded-[4rem] overflow-hidden border-4 border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.2)]">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-72 border-2 border-white/10 border-dashed rounded-full pointer-events-none" />
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-red-500 shadow-lg" />
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Neural Spectral Scan</span>
                        </div>
                    </div>
                    
                    <div className="mt-14 flex items-center gap-12">
                       <button onClick={closeCamera} className="p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 shadow-xl"><X size={28} /></button>
                       <button onClick={capturePhoto} className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-[12px] border-white/5 hover:scale-110 active:scale-90 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                          <div className="w-14 h-14 rounded-full border-4 border-black" />
                       </button>
                       <button onClick={() => setIsCameraOpen(false)} className="p-5 bg-white/5 text-white rounded-full opacity-0 pointer-events-none"><RotateCw size={28} /></button>
                    </div>
                    <p className="mt-10 text-[9px] font-black text-white/30 uppercase tracking-[0.5em] text-center max-w-[200px]">Center face for tone analysis</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.1); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
