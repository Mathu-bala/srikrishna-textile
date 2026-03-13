import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Heart, Calendar, ShoppingBag, Loader2, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchProducts } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const WEDDING_EVENTS = [
  { id: 'engagement', name: 'Engagement', icon: '💍', query: 'Designer Saree', description: 'Elegant and sophisticated styles for your special announcement.' },
  { id: 'mehendi', name: 'Mehendi', icon: '🌿', query: 'Green Saree', description: 'Vibrant and comfortable outfits for the henna ceremony.' },
  { id: 'haldi', name: 'Haldi', icon: '✨', query: 'Yellow Saree', description: 'Bright and joyful yellow ensembles for the auspicious Haldi.' },
  { id: 'wedding', name: 'Wedding Ceremony', icon: '🏛️', query: 'Kanchipuram Silk Saree', description: 'Traditional and grand Kanchipuram silks for the main ceremony.' },
  { id: 'reception', name: 'Reception', icon: '🎊', query: 'Party Wear Lehenga', description: 'Modern and glamorous outfits for your grand celebration.' },
];

export default function AIBridalPlanner() {
  const { mode } = useTheme();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(WEDDING_EVENTS[0]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations(selectedEvent);
  }, [selectedEvent]);

  const loadRecommendations = async (event: typeof WEDDING_EVENTS[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ q: event.query });
      setProducts(data.slice(0, 8)); // Limit to 8 recommendations
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Could not load outfit recommendations. Please try again.');
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${mode === 'dark' ? 'bg-[#0c0c0c]' : 'bg-slate-50'}`}>
      <Header />
      
      <main className="flex-grow pt-12 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Link to="/ai-features" className={`inline-flex items-center gap-2 mb-8 transition-colors ${mode === 'dark' ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'}`}>
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Back to AI Hub</span>
            </Link>

            <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 shadow-2xl transition-all ${mode === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
              <Sparkles size={16} className="text-rose-500" />
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${mode === 'dark' ? 'text-rose-300' : 'text-rose-600'}`}>Premium Concierge</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Elite <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 bg-clip-text text-transparent italic">Bridal</span> Planner
            </h1>
            <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Our AI analyzes your wedding events to curate the most exquisite silk sarees and designer outfits from current SriKrishna collections.
            </p>
          </motion.div>

          {/* Event Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20">
            {WEDDING_EVENTS.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`relative group flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border transition-all duration-500 ${
                  selectedEvent.id === event.id 
                    ? (mode === 'dark' ? 'bg-rose-500/20 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'bg-rose-50 border-rose-200 shadow-xl shadow-rose-100')
                    : (mode === 'dark' ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-slate-100 hover:border-rose-100 shadow-lg shadow-slate-200/50')
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${
                  selectedEvent.id === event.id ? 'bg-rose-500 text-white shadow-lg rotate-3' : (mode === 'dark' ? 'bg-white/5' : 'bg-slate-50')
                }`}>
                  {event.icon}
                </div>
                <div className="text-center">
                  <span className={`block text-[10px] font-black uppercase tracking-widest ${
                    selectedEvent.id === event.id ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400'
                  }`}>
                    {event.name}
                  </span>
                </div>
                {selectedEvent.id === event.id && (
                  <motion.div 
                    layoutId="active-event"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-rose-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Event Content Section */}
          <div className="relative mb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                <div className="lg:col-span-4 lg:pr-12">
                  <div className={`inline-flex items-center gap-2 mb-6 px-4 py-1 rounded-full border ${mode === 'dark' ? 'bg-white/5 border-white/10 text-rose-400' : 'bg-white border-slate-200 text-rose-600'}`}>
                    <Calendar size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Event Strategy</span>
                  </div>
                  <h2 className={`text-4xl font-black mb-6 leading-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Crucial Details for <br/> {selectedEvent.name}
                  </h2>
                  <p className="text-slate-500 font-bold mb-8 leading-relaxed italic">
                    "{selectedEvent.description}"
                  </p>
                  <div className={`p-6 rounded-3xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${mode === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      <Info size={14} /> AI Recommendation Logic
                    </h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                      Our system identifies pieces with high-intensity zari, ceremonial draping qualities, and photographic contrast specifically calibrated for {selectedEvent.name} lighting environments.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {isLoading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                      <Loader2 size={40} className="text-rose-500 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Retrieving Designer Catalog...</p>
                    </div>
                  ) : error ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-red-500/20 rounded-[3rem]">
                      <p className="text-red-500 font-bold mb-4">{error}</p>
                      <button onClick={() => loadRecommendations(selectedEvent)} className="px-6 py-3 bg-red-500 text-white rounded-full text-xs font-black uppercase tracking-widest">Retry</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {products.map((product, i) => (
                        <motion.div
                          key={product._id || product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`group relative rounded-[2rem] overflow-hidden border transition-all duration-500 hover:scale-[1.02] ${
                            mode === 'dark' ? 'bg-[#151515] border-white/5 hover:border-rose-500/30' : 'bg-white border-slate-100 hover:border-rose-200 shadow-xl shadow-slate-200/50'
                          }`}
                        >
                          <div className="aspect-[4/5] overflow-hidden relative">
                            <img 
                              src={product.image || product.images?.[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            
                            <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                               <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-colors">
                                  <Heart size={18} />
                               </button>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                              <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                              <h3 className="text-white font-black text-lg leading-tight mb-2 uppercase tracking-tight">{product.name}</h3>
                              <div className="flex items-center justify-between">
                                <span className="text-white font-black text-xl">₹{product.price}</span>
                                <button 
                                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                                  className="px-5 py-2.5 bg-rose-600 hover:bg-white hover:text-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center gap-2"
                                >
                                  <ShoppingBag size={14} /> View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Section */}
          <section className={`rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden mb-24 ${mode === 'dark' ? 'bg-rose-600/10 border border-rose-500/20 shadow-[0_0_100px_rgba(244,63,94,0.05)]' : 'bg-rose-600 text-white shadow-2xl shadow-rose-200'}`}>
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase italic">Need Custom <br/> Sizing?</h2>
                 <p className={`max-w-xl mx-auto mb-10 text-lg font-bold ${mode === 'dark' ? 'text-rose-300' : 'text-rose-100'}`}>
                   Our AI Tailor Sync helps you get these outfits stitched to your exact measurements with regional master tailors.
                 </p>
                 <button onClick={() => navigate('/ai/tailors')} className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 ${mode === 'dark' ? 'bg-rose-600 text-white shadow-[0_10px_40px_rgba(244,63,94,0.3)]' : 'bg-white text-rose-600 shadow-2xl'}`}>
                    Find Local Tailors
                 </button>
              </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
