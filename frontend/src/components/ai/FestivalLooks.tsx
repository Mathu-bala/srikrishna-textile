import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const FESTIVALS = [
  { id: 'diwali', name: 'Diwali', emoji: '🪔', season: 'October–November' },
  { id: 'pongal', name: 'Pongal / Sankranti', emoji: '🌾', season: 'January' },
  { id: 'navratri', name: 'Navratri', emoji: '💃', season: 'September–October' },
  { id: 'onam', name: 'Onam', emoji: '🌸', season: 'August–September' },
  { id: 'eid', name: 'Eid', emoji: '🌙', season: 'Varies' },
  { id: 'christmas', name: 'Christmas', emoji: '🎄', season: 'December' },
];

const LOOKS: Record<string, { outfit: string; colors: string[]; palette: string[]; tip: string; accessories: string[]; category: string }> = {
  diwali: {
    outfit: 'Silk Saree or Anarkali Suit with rich embroidery',
    colors: ['#FF8C00', '#FFD700', '#DC143C', '#B8860B'],
    palette: ['Saffron', 'Gold', 'Deep Red', 'Antique Gold'],
    tip: 'Diwali calls for glittering gold, saffron, and red! Choose heavily embroidered ethnic wear. Pair with statement jewellery.',
    accessories: ['Gold Chandelier Earrings', 'Bangles', 'Silk Potli Bag', 'Embroidered Sandals'],
    category: 'sarees',
  },
  pongal: {
    outfit: 'Kasavu Kerala Saree or Traditional Cotton Silk',
    colors: ['#FFFACD', '#DAA520', '#FFFFFF', '#90EE90'],
    palette: ['Cream/White', 'Gold', 'Ivory', 'Soft Green'],
    tip: 'Pongal is celebrated in traditional off-white and gold! The classic kasavu saree is the perfect choice — pure, traditional, and elegant.',
    accessories: ['Simple Gold Chain', 'Gold Bangles', 'Jasmine Flowers', 'Traditional Sandals'],
    category: 'sarees',
  },
  navratri: {
    outfit: 'Chaniya Choli (Ghagra Choli) or Colourful Lehenga',
    colors: ['#FF4500', '#FF8C00', '#FFD700', '#32CD32'],
    palette: ['Day 1: Red', 'Day 2: Blue', 'Day 3: Yellow', 'Day 9: Purple'],
    tip: 'Each Navratri day has a specific colour! Wear bright, festive chaniya choli with mirror work and vibrant prints. Garba-friendly comfortable footwear is a must.',
    accessories: ['Jhumkas', 'Bindi', 'Bangles', 'Ghungroo Anklets', 'Potli'],
    category: 'kurtis',
  },
  onam: {
    outfit: 'Kerala Set Sari (Mundum Neriyathum) or Kasavu Saree',
    colors: ['#FFFFFF', '#DAA520', '#FFFFFF', '#F5F5DC'],
    palette: ['White', 'Gold', 'Off-White', 'Cream'],
    tip: 'Onam is all about the elegant white and gold! The traditional Kerala kasavu set sari is iconic. Pair with fresh jasmine flowers in your hair.',
    accessories: ['Gold Necklace', 'Gold Bangles', 'Jasmine Gajra', 'Flat Sandals'],
    category: 'sarees',
  },
  eid: {
    outfit: 'Sharara Set, Anarkali, or Embroidered Suit',
    colors: ['#2E8B57', '#C0C0C0', '#FFD700', '#FFFFFF'],
    palette: ['Emerald Green', 'Silver', 'Gold', 'White'],
    tip: 'For Eid, choose richly embroidered pastels or jewel tones. Chikan embroidery, Lucknowi work, and pearl jewellery are timeless choices!',
    accessories: ['Pearl Jewellery', 'Attar Perfume', 'Embroidered Clutch', 'Heeled Sandals'],
    category: 'kurtis',
  },
  christmas: {
    outfit: 'Western Gown, Kurti with Leggings, or Fusion Saree',
    colors: ['#DC143C', '#228B22', '#FFFFFF', '#FFD700'],
    palette: ['Red', 'Green', 'White', 'Gold'],
    tip: 'Christmas is festive and fun! Red and green are classic choices. Fusion outfits with indo-western appeal are very trendy.',
    accessories: ['Statement Earrings', 'Bracelet', 'Small Clutch', 'Block Heels'],
    category: 'kurtis',
  },
};

export default function FestivalLooks() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const data = selected ? LOOKS[selected] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-300">Festival Look Generator</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Festival{' '}<span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Look Generator</span>
            </h1>
            <p className="text-muted-foreground">Choose your festival and get the perfect outfit inspiration</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {FESTIVALS.map(f => (
              <motion.button key={f.id} onClick={() => setSelected(f.id)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${selected === f.id
                  ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                  : 'border-border/50 hover:border-yellow-400/40 bg-white/5'
                }`}>
                <div className="text-4xl mb-2">{f.emoji}</div>
                <p className="font-bold">{f.name}</p>
                <p className="text-muted-foreground text-xs mt-1">{f.season}</p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {data && selected && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{FESTIVALS.find(f => f.id === selected)?.emoji}</span>
                  <h2 className="font-black text-2xl">{FESTIVALS.find(f => f.id === selected)?.name} Look</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Recommended Outfit</p>
                    <p className="font-bold text-lg">{data.outfit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Colour Palette</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {data.colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full border border-white/20" style={{ background: c }} />
                          <span className="text-xs text-muted-foreground">{data.palette[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-5">
                  <p className="text-sm text-yellow-200"><span className="font-bold">💡 Stylist Tip: </span>{data.tip}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3">Accessories</p>
                  <div className="flex flex-wrap gap-2">
                    {data.accessories.map((a, i) => (
                      <span key={i} className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm rounded-full">{a}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => navigate(`/products?category=${data.category}`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <ShoppingBag size={16} /> Shop This Look
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="px-5 py-2.5 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
                    Try Another Festival
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
