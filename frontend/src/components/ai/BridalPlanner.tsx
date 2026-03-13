import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const events = [
  { id: 'engagement', label: 'Engagement', emoji: '💍', step: 1 },
  { id: 'mehendi', label: 'Mehendi / Haldi', emoji: '🌿', step: 2 },
  { id: 'wedding', label: 'Wedding Day', emoji: '👰', step: 3 },
  { id: 'reception', label: 'Reception', emoji: '🌹', step: 4 },
];

const BRIDAL_DATA: Record<string, {
  outfit: string; fabric: string; color: string; gradient: string;
  accessories: string[]; colorPalette: string[]; tip: string; price: string; category: string;
}> = {
  engagement: {
    outfit: 'Embroidered Silk Lehenga or Designer Saree',
    fabric: 'Georgette / Crepe Silk',
    color: '#FF69B4',
    gradient: 'from-pink-500 to-rose-400',
    accessories: ['Polki Jewellery Set', 'Maang Tikka', 'Embroidered Clutch', 'Block Heels'],
    colorPalette: ['#FF69B4', '#FFB6C1', '#E75480', '#B76E79'],
    tip: 'Go for soft pinks, roses, and blush tones. A lehenga or an organza saree with delicate embroidery works beautifully.',
    price: '₹6,000 – ₹18,000',
    category: 'sarees',
  },
  mehendi: {
    outfit: 'Yellow or Green Sharara / Anarkali Suit',
    fabric: 'Cotton / Georgette',
    color: '#FFD700',
    gradient: 'from-yellow-400 to-green-400',
    accessories: ['Oxidised Silver Jhumkas', 'Flower Jewellery', 'Haath Phool', 'Embroidered Mojari'],
    colorPalette: ['#FFD700', '#90EE90', '#FF8C00', '#32CD32'],
    tip: 'Bright yellows, lemon greens, and floral prints are perfect for Mehendi. Mirror work and folk embroidery add charm!',
    price: '₹2,500 – ₹8,000',
    category: 'kurtis',
  },
  wedding: {
    outfit: 'Kanchipuram or Banarasi Bridal Saree',
    fabric: 'Pure Silk',
    color: '#8B0000',
    gradient: 'from-red-700 to-red-500',
    accessories: ['Full Bridal Gold Jewellery Set', 'Maang Tikka', 'Temple Necklace', 'Bridal Bangles', 'Embroidered Sandals'],
    colorPalette: ['#8B0000', '#DC143C', '#FFD700', '#B8860B'],
    tip: 'Maroon, deep red, and crimson are classic bridal colours. Choose heavy zari work silk for a traditional look.',
    price: '₹12,000 – ₹35,000',
    category: 'sarees',
  },
  reception: {
    outfit: 'Velvet / Sequin Lehenga or French Saree',
    fabric: 'Velvet / Net / Tissue',
    color: '#4B0082',
    gradient: 'from-purple-700 to-indigo-500',
    accessories: ['CZ / Polki Choker Set', 'Drop Earrings', 'Embellished Clutch', 'Block Heel Sandals'],
    colorPalette: ['#4B0082', '#9400D3', '#C0C0C0', '#E0E0E0'],
    tip: 'Reception is more glamorous! Go for jewel tones — deep purple, navy, or emerald. Heavy embellishments add drama.',
    price: '₹8,000 – ₹25,000',
    category: 'sarees',
  },
};

export default function BridalPlanner() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const navigate = useNavigate();

  const markDone = (id: string) => {
    if (!completed.includes(id)) setCompleted(prev => [...prev, id]);
  };

  const data = activeEvent ? BRIDAL_DATA[activeEvent] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 rounded-full px-4 py-1.5 mb-4">
              <Heart size={14} className="text-rose-400" />
              <span className="text-sm font-semibold text-rose-300">Bridal Planner</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Your Complete{' '}
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Wedding Journey</span>
            </h1>
            <p className="text-muted-foreground">Outfit recommendations for every special wedding event</p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center justify-center mb-10 overflow-x-auto">
            <div className="flex items-center gap-0 min-w-max">
              {events.map((ev, i) => {
                const isDone = completed.includes(ev.id);
                const isActive = activeEvent === ev.id;
                return (
                  <div key={ev.id} className="flex items-center">
                    <button
                      onClick={() => setActiveEvent(ev.id)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-center ${isActive
                        ? 'bg-rose-500/20 border border-rose-500/40'
                        : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${isDone
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                          ? 'bg-rose-500 border-rose-500 text-white scale-110'
                          : 'bg-white/10 border-white/20'
                      }`}>
                        {isDone ? '✓' : ev.emoji}
                      </div>
                      <span className={`text-xs font-semibold ${isActive ? 'text-rose-400' : 'text-muted-foreground'}`}>
                        {ev.label}
                      </span>
                    </button>
                    {i < events.length - 1 && (
                      <ChevronRight size={16} className="text-muted-foreground mx-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <AnimatePresence mode="wait">
            {data && activeEvent && (
              <motion.div
                key={activeEvent}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              >
                {/* Banner */}
                <div className={`bg-gradient-to-r ${data.gradient} p-6 sm:p-8`}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-1">
                        {events.find(e => e.id === activeEvent)?.emoji} {events.find(e => e.id === activeEvent)?.label}
                      </p>
                      <h2 className="text-white font-black text-2xl">{data.outfit}</h2>
                      <p className="text-white/80 text-sm mt-1">Fabric: {data.fabric} • Price: {data.price}</p>
                    </div>
                    <div className="flex gap-2">
                      {data.colorPalette.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white/40 shadow-md" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Accessories */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">💎 Recommended Accessories</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.accessories.map((a, i) => (
                        <span key={i} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-rose-200"><span className="font-bold">💡 Stylist Tip: </span>{data.tip}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => { navigate(`/products?category=${data.category}`); }}
                      className={`flex items-center gap-2 bg-gradient-to-r ${data.gradient} text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity`}>
                      <ShoppingBag size={16} /> Shop This Look
                    </button>
                    <button onClick={() => markDone(activeEvent)}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${completed.includes(activeEvent)
                        ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                        : 'border border-border/50 text-muted-foreground hover:border-green-500/40 hover:text-green-400'
                      }`}>
                      {completed.includes(activeEvent) ? '✓ Planned!' : 'Mark as Planned'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {!activeEvent && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4">👆</div>
                <p className="font-medium">Select a wedding event above to see outfit recommendations</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress summary */}
          {completed.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-green-400 font-semibold text-sm">
                ✅ {completed.length}/{events.length} events planned! {completed.length === events.length ? 'Your bridal wardrobe is complete! 🎉' : 'Keep going…'}
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
