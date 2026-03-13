import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Map, Phone, Star, ExternalLink, Navigation, Search, Filter, Calendar, Clock, User, CheckCircle2, MapPin, Scissors, X, RotateCw, ClipboardList, Package, Truck, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

// ── Mock Tailor Data (Expanded to 12+ shops for the region) ─────────────────────
const TAILORS = [
  { id: 1, name: 'Sri Devi Tailoring', city: 'Sivakasi', area: 'NRKR Road', lat: 9.4533, lng: 77.8024, rating: 4.8, reviews: 156, phone: '+91 94431 12345', services: ['Blouse stitching', 'Saree fall & pico', 'Custom stitching'], timing: '9AM–8PM', mapUrl: 'https://maps.google.com/?q=Sri+Devi+Tailoring+Sivakasi' },
  { id: 2, name: 'Lakshmi Boutique', city: 'Virudhunagar', area: 'Kacheri Road', lat: 9.5872, lng: 77.9514, rating: 4.6, reviews: 92, phone: '+91 98421 22334', services: ['Bridal blouse stitching', 'Alterations', 'Embroidery'], timing: '10AM–9PM', mapUrl: 'https://maps.google.com/?q=Lakshmi+Boutique+Virudhunagar' },
  { id: 3, name: 'Meena Designer Tailors', city: 'Srivilliputhur', area: 'Temple Street', lat: 9.5093, lng: 77.6324, rating: 4.7, reviews: 78, phone: '+91 97861 55667', services: ['Designer blouses', 'Saree blouse stitching'], timing: '9AM–7PM', mapUrl: 'https://maps.google.com/?q=Meena+Tailors+Srivilliputhur' },
  { id: 4, name: 'Madurai Fashion Studio', city: 'Madurai', area: 'Anna Nagar', lat: 9.9252, lng: 78.1198, rating: 4.8, reviews: 312, phone: '+91 96543 21098', services: ['Bridal blouse work', 'Custom kurtis'], timing: '10AM–8PM', mapUrl: 'https://maps.google.com/?q=Madurai+Fashion+Studio' },
  { id: 5, name: 'Rajapalayam Royal Stitch', city: 'Rajapalayam', area: 'Tenkasi Road', lat: 9.4533, lng: 77.5611, rating: 4.5, reviews: 110, phone: '+91 99442 88990', services: ['Aari work blouses', 'Chudidar stitching'], timing: '9:30AM–8:30PM', mapUrl: 'https://maps.google.com/?q=Rajapalayam+Tailoring' },
  { id: 6, name: 'Sattur Smart Fit', city: 'Sattur', area: 'Main Bazaar', lat: 9.3564, lng: 77.9261, rating: 4.4, reviews: 56, phone: '+91 93421 00445', services: ['Uniform stitching', 'Basic alterations'], timing: '8:30AM–9PM', mapUrl: 'https://maps.google.com/?q=Sattur+Tailors' },
  { id: 7, name: 'Aruppukottai Artistry', city: 'Aruppukottai', area: 'Gandhi Nagar', lat: 9.5124, lng: 78.0984, rating: 4.6, reviews: 64, phone: '+91 95432 11223', services: ['Custom dress stitching', 'Saree pico'], timing: '9AM–8PM', mapUrl: 'https://maps.google.com/?q=Aruppukottai+Tailors' },
  { id: 8, name: 'Elite Ladies Tailor', city: 'Sivakasi', area: 'Velayutham Road', lat: 9.4580, lng: 77.8050, rating: 4.9, reviews: 203, phone: '+91 94432 55667', services: ['Designer Lehengas', 'Embroidery'], timing: '10AM–7PM', mapUrl: 'https://maps.google.com/?q=Elite+Tailors+Sivakasi' },
  { id: 9, name: 'Modern Stitching Point', city: 'Virudhunagar', area: 'Railway Station Rd', lat: 9.5850, lng: 77.9550, rating: 4.2, reviews: 45, phone: '+91 98422 11223', services: ['Quick Alterations', 'Blouse Stitching'], timing: '9AM–9PM', mapUrl: 'https://maps.google.com/?q=Modern+Stitching+Virudhunagar' },
  { id: 10, name: 'Traditional Blouse Hub', city: 'Srivilliputhur', area: 'Main Junction', lat: 9.5110, lng: 77.6350, rating: 4.6, reviews: 118, phone: '+91 97862 33445', services: ['Authentic Silk Stitching', 'Fall & Pico'], timing: '9AM–8PM', mapUrl: 'https://maps.google.com/?q=Traditional+Hub+Srivilliputhur' },
  { id: 11, name: 'Meenakshi Boutique', city: 'Madurai', area: 'KK Nagar', lat: 9.9200, lng: 78.1350, rating: 4.7, reviews: 189, phone: '+91 96544 55667', services: ['Bridal Special', 'Motif Work'], timing: '10AM–8:30PM', mapUrl: 'https://maps.google.com/?q=Meenakshi+Boutique+Madurai' },
  { id: 12, name: 'Sivakasi Elite Designer', city: 'Sivakasi', area: 'Sattur Road', lat: 9.4600, lng: 77.8100, rating: 4.8, reviews: 142, phone: '+91 94433 77889', services: ['High-end Blouses', 'Custom Saree Borders'], timing: '9:30AM–8:30PM', mapUrl: 'https://maps.google.com/?q=Elite+Designer+Sivakasi' },
];

const NEARBY_CITIES = ['All', 'Sivakasi', 'Virudhunagar', 'Srivilliputhur', 'Madurai', 'Rajapalayam', 'Sattur'];

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function TailorFinder() {
  const { mode } = useTheme();
  const [cityFilter, setCityFilter] = useState('All');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'denied'>('idle');
  const [bookingTailor, setBookingTailor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<'form' | 'tracking'>('form');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('rating');

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('success');
        setSortBy('distance');
      },
      () => setLocationStatus('denied')
    );
  };

  const processedTailors = useMemo(() => {
    let list = TAILORS.map(t => ({
      ...t,
      distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, t.lat, t.lng) : null
    }));

    list = list.filter(t => cityFilter === 'All' || t.city === cityFilter);

    list.sort((a, b) => {
      if (sortBy === 'distance' && a.distance !== null && b.distance !== null) return a.distance - b.distance;
      return b.rating - a.rating;
    });
    return list;
  }, [cityFilter, userLocation, sortBy]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${mode === 'dark' ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans`}>
      <Header />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <Link to="/ai-features" className={`inline-flex items-center gap-2 ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'} hover:text-cyan-400 transition-colors mb-12 group`}>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to AI Stylist Hub
          </Link>

          {/* Hero Section */}
          <div className="relative mb-16 text-center">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] ${mode === 'dark' ? 'bg-cyan-500/5' : 'bg-cyan-500/10'} rounded-full blur-[150px] pointer-events-none` } />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-5 py-2 mb-8">
                <Scissors size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-300">Expert Regional Network</span>
              </div>
              <h1 className={`text-5xl md:text-7xl font-black mb-8 tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Your Style, <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Perfectly Tailored.</span>
              </h1>
              <p className={`max-w-2xl mx-auto ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-lg leading-relaxed`}>
                Book premium stitching services from the most trusted designers in the Sivakasi & Madurai region. Specialized in sarees, blouses, and ethnic wear.
              </p>
            </motion.div>
          </div>

          {/* Search & Filter Bar */}
          <div className={`${mode === 'dark' ? 'bg-slate-900/60 border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'} backdrop-blur-3xl border rounded-[3rem] p-6 mb-12`}>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar flex-nowrap">
                 <div className={`flex shrink-0 ${mode === 'dark' ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'} p-1 rounded-[1.5rem] border`}>
                    <button onClick={() => setSortBy('distance')} className={`px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${sortBy === 'distance' ? 'bg-cyan-600 text-white shadow-xl rotate-1' : (mode === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>Distance</button>
                    <button onClick={() => setSortBy('rating')} className={`px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${sortBy === 'rating' ? 'bg-cyan-600 text-white shadow-xl -rotate-1' : (mode === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>Top Rated</button>
                 </div>
                 
                 <div className={`h-10 w-px ${mode === 'dark' ? 'bg-white/10' : 'bg-slate-200'} hidden lg:block mx-1 shrink-0`} />
                 
                 {NEARBY_CITIES.map(c => (
                   <button key={c} onClick={() => setCityFilter(c)} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${cityFilter === c ? (mode === 'dark' ? 'bg-white text-black shadow-white/10' : 'bg-slate-900 text-white') : (mode === 'dark' ? 'bg-slate-900 border-white/5 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}`}>{c}</button>
                 ))}
              </div>
            </div>

            {locationStatus === 'success' && (
              <div className="mt-6 flex items-center justify-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Navigation size={12} /> Live tracking: Showing tailors closest to you
              </div>
            )}
            {locationStatus === 'denied' && (
              <div className={`mt-6 text-center text-[10px] font-black uppercase tracking-widest ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Location access denied. Please select city manually for accurate results.
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedTailors.map((tailor, i) => (
              <motion.div key={tailor.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className={`group ${mode === 'dark' ? 'bg-slate-900/40 border-white/5 hover:border-cyan-500/30' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-cyan-200'} border rounded-[3rem] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-cyan-900/10`}
              >
                <div className="p-8 pb-0">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 ${mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl flex items-center justify-center text-cyan-400 border group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-xl`}>
                        <Scissors size={28} />
                      </div>
                      {tailor.distance !== null && (
                         <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                            {tailor.distance.toFixed(1)} km away
                         </div>
                      )}
                   </div>

                   <h3 className={`text-2xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'} mb-2 uppercase tracking-tight group-hover:text-cyan-400 transition-colors truncate`}>{tailor.name}</h3>
                   <p className={`${mode === 'dark' ? 'text-slate-500' : 'text-slate-600'} text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-widest truncate`}>
                      <MapPin size={12} className="text-indigo-500" /> {tailor.area}, {tailor.city}
                   </p>

                   <div className={`flex items-center gap-6 mb-8 ${mode === 'dark' ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'} p-4 rounded-2xl border`}>
                      <div className="flex items-center gap-1.5">
                         <Star size={18} className="text-yellow-400 fill-yellow-400" />
                         <span className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tailor.rating}</span>
                      </div>
                      <div className={`h-6 w-px ${mode === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`} />
                      <div>
                         <p className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>{tailor.reviews} Reviews</p>
                      </div>
                   </div>

                   <div className="space-y-3 mb-8">
                      <p className={`text-[9px] font-black ${mode === 'dark' ? 'text-slate-600' : 'text-slate-400'} uppercase tracking-[0.3em]`}>Services Offered</p>
                      <div className="flex flex-wrap gap-2">
                        {tailor.services.map(s => (
                          <span key={s} className={`px-3 py-1.5 ${mode === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100'} rounded-lg text-[10px] font-bold text-slate-400 transition-colors group-hover:text-cyan-600`}>{s}</span>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="mt-auto p-8 pt-0 space-y-4">
                   <div className={`flex items-center justify-between text-[11px] font-bold pb-4 border-b ${mode === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                      <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={14} /> Open Hours</span>
                      <span className={`${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'} uppercase`}>{tailor.timing}</span>
                   </div>

                   <div className="grid grid-cols-2 gap-3 pt-2">
                      <a href={`tel:${tailor.phone}`} className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
                        <Phone size={14} /> Call
                      </a>
                      <a href={tailor.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-2xl hover:bg-indigo-500 hover:text-white transition-all">
                        <Map size={14} /> Map
                      </a>
                   </div>

                   <button 
                    onClick={() => { setBookingTailor(tailor); setBookingStep('form'); }}
                    className={`w-full py-5 ${mode === 'dark' ? 'bg-white text-black hover:bg-cyan-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-cyan-600'} text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95`}
                   >
                     Book Appointment
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal & Tracking System */}
      <AnimatePresence>
        {bookingTailor && (
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBookingTailor(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className={`relative w-full max-w-xl ${mode === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-2xl'} border rounded-[3.5rem] overflow-hidden`}
            >
              {bookingStep === 'form' ? (
                <div className="flex flex-col max-h-[90vh]">
                  <div className="p-10 pb-0 flex justify-between items-start">
                    <div>
                        <h2 className={`text-4xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tight mb-2`}>Book Expert</h2>
                        <div className="flex items-center gap-3">
                           <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">{bookingTailor.name}</div>
                           <div className={`text-[10px] ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} font-bold uppercase tracking-widest`}>{bookingTailor.city}</div>
                        </div>
                    </div>
                    <button onClick={() => setBookingTailor(null)} className={`p-3 ${mode === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} rounded-2xl transition-all`}><X size={24} className={mode === 'dark' ? 'text-white' : 'text-slate-900'} /></button>
                  </div>

                  <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Full Name</label>
                           <div className="relative">
                              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                              <input placeholder="Enter name" className={`w-full ${mode === 'dark' ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl pl-14 pr-6 py-4.5 text-sm outline-none focus:border-cyan-500/50`} />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Phone Number</label>
                           <div className="relative">
                              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                              <input placeholder="+91" className={`w-full ${mode === 'dark' ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl pl-14 pr-6 py-4.5 text-sm outline-none focus:border-cyan-500/50`} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Type of Service</label>
                        <div className="relative">
                           <Scissors className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                           <select className={`appearance-none w-full ${mode === 'dark' ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl pl-14 pr-10 py-4.5 text-sm outline-none focus:border-cyan-500/50`}>
                              <option>Blouse stitching</option>
                              <option>Saree fall & pico</option>
                              <option>Alterations</option>
                              <option>Bridal blouse design</option>
                              <option>Custom dress stitching</option>
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Preferred Date</label>
                           <div className="relative">
                              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                              <input type="date" className={`w-full ${mode === 'dark' ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl pl-14 pr-6 py-4.5 text-sm outline-none focus:border-cyan-500/50`} />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Preferred Time</label>
                           <div className="relative">
                              <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                              <input type="time" className={`w-full ${mode === 'dark' ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl pl-14 pr-6 py-4.5 text-sm outline-none focus:border-cyan-500/50`} />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 pt-0">
                    <button onClick={() => setBookingStep('tracking')} className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-cyan-900/40 transition-all active:scale-95">
                      Confirm & Track Stitching
                    </button>
                    <p className="text-center text-[9px] text-slate-500 uppercase font-black tracking-widest mt-6">Secure Appointment via SriKrishna Network</p>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  
                  <h2 className={`text-3xl font-black ${mode === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tight mb-4`}>Booking Successful!</h2>
                  <p className={`${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-10 text-sm leading-relaxed`}>
                    Your appointment with <span className={`${mode === 'dark' ? 'text-white' : 'text-slate-900'} font-bold`}>{bookingTailor.name}</span> is confirmed. You can now track your stitching progress in real-time.
                  </p>

                  <div className={`${mode === 'dark' ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] p-8 space-y-8 border mb-10`}>
                     <div className="flex justify-between items-center mb-4">
                        <span className={`text-[10px] font-black ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>Order ID: SK-TL-8829</span>
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" /> Live Progress</span>
                     </div>
                     
                     {/* Track Status Steps */}
                     <div className="relative flex justify-between">
                        <div className={`absolute top-5 left-8 right-8 h-1 ${mode === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`} />
                        <div className="absolute top-5 left-8 w-[25%] h-1 bg-cyan-500" />
                        
                        {[
                          { icon: ClipboardList, label: 'Confirmed', active: true },
                          { icon: Ruler, label: 'Measured', active: false },
                          { icon: Scissors, label: 'Stitching', active: false },
                          { icon: Package, label: 'Ready', active: false },
                        ].map((s, idx) => (
                           <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${s.active ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-900/40' : (mode === 'dark' ? 'bg-slate-900 border-white/10 text-slate-600' : 'bg-white border-slate-200 text-slate-400')}`}>
                                <s.icon size={16} />
                              </div>
                              <span className={`text-[8px] font-black uppercase tracking-widest ${s.active ? (mode === 'dark' ? 'text-white' : 'text-slate-900') : (mode === 'dark' ? 'text-slate-600' : 'text-slate-400')}`}>{s.label}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button onClick={() => setBookingTailor(null)} className={`w-full py-5 ${mode === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'} text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-600 hover:text-white transition-all`}>
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
