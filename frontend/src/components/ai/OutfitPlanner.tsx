import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const occasions = [
  { id: 'wedding', label: 'Wedding', emoji: '💍', desc: 'Bride or guest attire' },
  { id: 'engagement', label: 'Engagement', emoji: '💒', desc: 'Celebratory look' },
  { id: 'festival', label: 'Festival', emoji: '🪔', desc: 'Diwali, Pongal, etc.' },
  { id: 'temple', label: 'Temple Visit', emoji: '🛕', desc: 'Traditional & modest' },
  { id: 'party', label: 'Party', emoji: '🥂', desc: 'Evening glam' },
  { id: 'office', label: 'Office Wear', emoji: '💼', desc: 'Professional & neat' },
  { id: 'reception', label: 'Reception', emoji: '🌹', desc: 'Elegant evening look' },
  { id: 'mehendi', label: 'Mehendi', emoji: '🌿', desc: 'Vibrant ethnic look' },
];

interface OutfitPlan {
  saree: { name: string; color: string; price: string };
  blouse: { name: string; color: string };
  jewelry: { name: string; type: string };
  footwear: { name: string; type: string };
  colors: string[];
  tip: string;
  category: string;
}

const OUTFIT_DATA: Record<string, OutfitPlan> = {
  wedding: {
    saree: { name: 'Kanchipuram Silk Saree', color: '#8B0000', price: '₹8,500' },
    blouse: { name: 'Gold Zari Designer Blouse', color: '#FFD700' },
    jewelry: { name: 'Temple Gold Jewellery Set', type: 'Necklace + Earrings + Bangles' },
    footwear: { name: 'Traditional Silk Kolhapuri', type: 'Embroidered Sandals' },
    colors: ['#8B0000', '#FFD700', '#B8860B', '#2C1810'],
    tip: 'Go for deep jewel tones — Maroon, Royal Blue, Bottle Green, or Dark Magenta. Heavy zari and silk work best for weddings.',
    category: 'sarees',
  },
  engagement: {
    saree: { name: 'Pink Organza Silk Saree', color: '#FF69B4', price: '₹5,200' },
    blouse: { name: 'Rose Gold Sequin Blouse', color: '#B76E79' },
    jewelry: { name: 'Polki Diamond Jewellery Set', type: 'Necklace + Maang Tikka + Earrings' },
    footwear: { name: 'Block Heel Embroidered Sandals', type: 'Heeled Sandals' },
    colors: ['#FF69B4', '#B76E79', '#FFC0CB', '#FFB6C1'],
    tip: 'Pinks, Mauves, and Peach shades are perfect for Engagements. Keep the look romantic and feminine.',
    category: 'sarees',
  },
  festival: {
    saree: { name: 'Handloom Cotton Saree', color: '#FF8C00', price: '₹1,800' },
    blouse: { name: 'Contrast Printed Cotton Blouse', color: '#228B22' },
    jewelry: { name: 'Oxidised Silver Jhumkas', type: 'Earrings + Bangles' },
    footwear: { name: 'Kolhapuri Chappal', type: 'Flat Ethnic Sandals' },
    colors: ['#FF8C00', '#228B22', '#FFD700', '#8B0000'],
    tip: 'Festive outfits are best in saffron, green, red, and yellow — the colours of celebration!',
    category: 'sarees',
  },
  temple: {
    saree: { name: 'Pure Cotton Kasavu Saree', color: '#FFFACD', price: '₹1,200' },
    blouse: { name: 'Plain White/Gold Border Blouse', color: '#F5F5DC' },
    jewelry: { name: 'Simple Gold Chain & Studs', type: 'Minimal Gold' },
    footwear: { name: 'Traditional Padukas', type: 'Flat Wooden Sandals' },
    colors: ['#FFFACD', '#FFD700', '#F5F5DC', '#FFFFFF'],
    tip: 'Choose white, cream, yellow, or pastel colours. Prefer natural, modest fabrics like cotton or silk.',
    category: 'sarees',
  },
  party: {
    saree: { name: 'Georgette Designer Saree', color: '#4B0082', price: '₹3,500' },
    blouse: { name: 'Sequin Embellished Blouse', color: '#9400D3' },
    jewelry: { name: 'Kundan & CZ Statement Set', type: 'Bold Earrings + Bracelet' },
    footwear: { name: 'Stiletto Heels', type: 'High Heels' },
    colors: ['#4B0082', '#9400D3', '#C0C0C0', '#000080'],
    tip: 'For parties, bold jewel tones and metallic shades make you stand out. Drape loosely for a flowing effect.',
    category: 'sarees',
  },
  office: {
    saree: { name: 'Linen Printed Saree', color: '#708090', price: '₹1,400' },
    blouse: { name: 'Solid Plain Blouse', color: '#2F4F4F' },
    jewelry: { name: 'Small Gold Studs & Bracelet', type: 'Minimal Office Jewellery' },
    footwear: { name: 'Pointed Flat Shoes', type: 'Formal Flats' },
    colors: ['#708090', '#2F4F4F', '#A9A9A9', '#696969'],
    tip: 'For office, choose muted tones and solid colours. Keep it neat, minimal, and professional.',
    category: 'sarees',
  },
  reception: {
    saree: { name: 'Velvet Embroidered Lehenga Saree', color: '#800020', price: '₹9,800' },
    blouse: { name: 'Heavily Embroidered Designer Blouse', color: '#C0C0C0' },
    jewelry: { name: 'Pearl & Polki Choker Set', type: 'Bridal Jewellery' },
    footwear: { name: 'Embellished Heeled Sandals', type: 'Bridal Footwear' },
    colors: ['#800020', '#C0C0C0', '#FFD700', '#000000'],
    tip: 'Reception outfits should be glamorous and statement-making. Rich fabrics with heavy embroidery work best.',
    category: 'sarees',
  },
  mehendi: {
    saree: { name: 'Yellow Printed Sharara Set', color: '#FFD700', price: '₹2,800' },
    blouse: { name: 'Mirror Work Choli', color: '#FF8C00' },
    jewelry: { name: 'Oxidised Floral Jewellery', type: 'Earrings + Haath Phool' },
    footwear: { name: 'Embroidered Mojari Flats', type: 'Ethnic Flats' },
    colors: ['#FFD700', '#FF8C00', '#90EE90', '#FFA500'],
    tip: 'Mehendi outfits call for vibrant yellows, greens, and oranges. Playful prints and mirror work are perfect!',
    category: 'kurtis',
  },
};

export default function OutfitPlanner() {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<OutfitPlan | null>(null);
  const navigate = useNavigate();

  const handleOccasion = (id: string) => {
    setSelected(id);
    setTimeout(() => setResult(OUTFIT_DATA[id]), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Back */}
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">AI Outfit Planner</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              What's the{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Occasion?</span>
            </h1>
            <p className="text-muted-foreground">Select your event and get a complete AI-curated outfit</p>
          </div>

          {/* Occasion Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {occasions.map(occ => (
              <motion.button
                key={occ.id}
                onClick={() => handleOccasion(occ.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selected === occ.id
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'border-border/50 hover:border-purple-500/40 bg-white/5'
                }`}
              >
                {selected === occ.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <div className="text-3xl mb-2">{occ.emoji}</div>
                <p className="font-bold text-sm">{occ.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{occ.desc}</p>
              </motion.button>
            ))}
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && selected && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8"
              >
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-2xl">{occasions.find(o => o.id === selected)?.emoji}</span>
                  {occasions.find(o => o.id === selected)?.label} Outfit Suggestion
                </h2>

                {/* Color Palette */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-muted-foreground font-medium">Suggested palette:</span>
                  <div className="flex gap-2">
                    {result.colors.map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white/20 shadow-md" style={{ background: c }} />
                    ))}
                  </div>
                </div>

                {/* Outfit Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: '👗 Saree / Dress', name: result.saree.name, sub: result.saree.price, color: result.saree.color },
                    { label: '👚 Blouse', name: result.blouse.name, sub: result.blouse.color, color: result.blouse.color },
                    { label: '💎 Jewellery', name: result.jewelry.name, sub: result.jewelry.type, color: '#FFD700' },
                    { label: '👡 Footwear', name: result.footwear.name, sub: result.footwear.type, color: '#8B4513' },
                  ].map(item => (
                    <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg mb-3" style={{ background: item.color, opacity: 0.8 }} />
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-bold text-sm leading-snug">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Tip */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-purple-300"><span className="font-bold">💡 Stylist Tip: </span>{result.tip}</p>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/products?category=${result.category}`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag size={16} /> Shop This Look
                  </button>
                  <button
                    onClick={() => { setSelected(null); setResult(null); }}
                    className="px-5 py-2.5 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-purple-500/50 transition-colors font-medium text-sm"
                  >
                    Try Another Occasion
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
