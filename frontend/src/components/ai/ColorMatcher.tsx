import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Palette, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ColorSuggestion {
  name: string;
  hex: string;
  sarees: { name: string; hex: string; price: string; category: string }[];
  rule: string;
}

const BLOUSE_COLORS: ColorSuggestion[] = [
  {
    name: 'Maroon / Deep Red',
    hex: '#800000',
    rule: 'Analogous + Complementary: Gold, Beige, Cream, Off-White',
    sarees: [
      { name: 'Gold Kanchipuram Silk Saree', hex: '#FFD700', price: '₹7,500', category: 'sarees' },
      { name: 'Beige Banarasi Saree', hex: '#F5F5DC', price: '₹4,200', category: 'sarees' },
      { name: 'Cream Border Saree', hex: '#FFFDD0', price: '₹2,800', category: 'sarees' },
      { name: 'Ivory Organza Saree', hex: '#FFFFF0', price: '₹3,400', category: 'sarees' },
    ],
  },
  {
    name: 'Royal Blue',
    hex: '#4169E1',
    rule: 'Triadic + Neutral: Gold, White, Silver, Light Pink',
    sarees: [
      { name: 'White Chiffon Saree', hex: '#FFFFFF', price: '₹1,800', category: 'sarees' },
      { name: 'Gold Silk Saree', hex: '#DAA520', price: '₹5,600', category: 'sarees' },
      { name: 'Silver Georgette Saree', hex: '#C0C0C0', price: '₹2,900', category: 'sarees' },
      { name: 'Baby Pink Saree', hex: '#FFB6C1', price: '₹2,100', category: 'sarees' },
    ],
  },
  {
    name: 'Bottle Green',
    hex: '#006400',
    rule: 'Complementary: Red hues, Gold, Pink, Beige',
    sarees: [
      { name: 'Hot Pink Saree', hex: '#FF69B4', price: '₹3,200', category: 'sarees' },
      { name: 'Gold Zari Saree', hex: '#FFD700', price: '₹6,800', category: 'sarees' },
      { name: 'Beige Printed Saree', hex: '#F5F5DC', price: '₹2,200', category: 'sarees' },
      { name: 'Rust Red Saree', hex: '#B7410E', price: '₹3,800', category: 'sarees' },
    ],
  },
  {
    name: 'Pink / Rose',
    hex: '#FF69B4',
    rule: 'Monochromatic + Neutral: Mauve, Deep Pink, Peach, White',
    sarees: [
      { name: 'Peach Georgette Saree', hex: '#FFCBA4', price: '₹2,600', category: 'sarees' },
      { name: 'Mauve Fabric Saree', hex: '#E0B0FF', price: '₹3,100', category: 'sarees' },
      { name: 'White Organza Saree', hex: '#FFFFFF', price: '₹1,900', category: 'sarees' },
      { name: 'Deep Magenta Saree', hex: '#CC00CC', price: '₹4,400', category: 'sarees' },
    ],
  },
  {
    name: 'Yellow / Gold',
    hex: '#FFD700',
    rule: 'Split-Complementary: Green, Orange, Blue, Brown',
    sarees: [
      { name: 'Forest Green Saree', hex: '#228B22', price: '₹3,300', category: 'sarees' },
      { name: 'Orange Silk Saree', hex: '#FF8C00', price: '₹4,700', category: 'sarees' },
      { name: 'Navy Blue Saree', hex: '#000080', price: '₹3,900', category: 'sarees' },
      { name: 'Chocolate Brown Saree', hex: '#7B3F00', price: '₹2,800', category: 'sarees' },
    ],
  },
  {
    name: 'Black',
    hex: '#1a1a1a',
    rule: 'Pop colors work best: Gold, Red, White, Emerald',
    sarees: [
      { name: 'Gold Tissue Saree', hex: '#FFD700', price: '₹5,200', category: 'sarees' },
      { name: 'Red Chiffon Saree', hex: '#DC143C', price: '₹2,900', category: 'sarees' },
      { name: 'White Woven Saree', hex: '#FFFFFF', price: '₹2,100', category: 'sarees' },
      { name: 'Emerald Green Saree', hex: '#50C878', price: '₹3,700', category: 'sarees' },
    ],
  },
  {
    name: 'Orange',
    hex: '#FF8C00',
    rule: 'Analogous: Yellow, Red, Rust + Neutral Cream',
    sarees: [
      { name: 'Yellow Silk Saree', hex: '#FFD700', price: '₹4,500', category: 'sarees' },
      { name: 'Rust Red Saree', hex: '#B7410E', price: '₹3,100', category: 'sarees' },
      { name: 'Cream Embroidered Saree', hex: '#FFF8E7', price: '₹2,600', category: 'sarees' },
      { name: 'Teal Contrast Saree', hex: '#008080', price: '₹3,400', category: 'sarees' },
    ],
  },
  {
    name: 'Purple / Violet',
    hex: '#8B5CF6',
    rule: 'Complementary: Yellow-Green, Cream, Gold, Lilac',
    sarees: [
      { name: 'Cream Woven Saree', hex: '#FFFDD0', price: '₹2,300', category: 'sarees' },
      { name: 'Gold Jacquard Saree', hex: '#DAA520', price: '₹5,800', category: 'sarees' },
      { name: 'Lilac Chiffon Saree', hex: '#C8A2C8', price: '₹2,700', category: 'sarees' },
      { name: 'Grey Silver Saree', hex: '#BEBEBE', price: '₹2,100', category: 'sarees' },
    ],
  },
];

export default function ColorMatcher() {
  const [selected, setSelected] = useState<ColorSuggestion | null>(null);
  const [custom, setCustom] = useState('#4169E1');
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-4">
              <Palette size={14} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">AI Color Matcher</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Match Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Blouse Color</span>
            </h1>
            <p className="text-muted-foreground">Select your blouse color and discover perfectly matching sarees</p>
          </div>

          {/* Mode toggle */}
          <div className="flex justify-center gap-3 mb-8">
            {(['preset', 'custom'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${mode === m
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'border border-border/50 text-muted-foreground hover:border-cyan-500/40'
                }`}>
                {m === 'preset' ? '🎨 Choose Blouse Color' : '🖌️ Custom Color Picker'}
              </button>
            ))}
          </div>

          {mode === 'preset' ? (
            /* Preset colors */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {BLOUSE_COLORS.map(c => (
                <motion.button
                  key={c.name}
                  onClick={() => setSelected(c)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${selected?.name === c.name
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'border-border/50 hover:border-cyan-500/40 bg-white/5'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full mb-3 border-2 border-white/20 shadow-md" style={{ background: c.hex }} />
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-muted-foreground text-[11px] mt-1 leading-tight">{c.rule}</p>
                </motion.button>
              ))}
            </div>
          ) : (
            /* Custom color picker */
            <div className="flex flex-col items-center gap-5 mb-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-xl" style={{ background: custom }} />
                <label className="absolute inset-0 cursor-pointer opacity-0">
                  <input type="color" value={custom} onChange={e => setCustom(e.target.value)} className="w-full h-full" />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-white/20" style={{ background: custom }} />
                <span className="font-mono text-sm text-muted-foreground">{custom.toUpperCase()}</span>
                <button
                  onClick={() => {
                    const nearest = BLOUSE_COLORS.reduce((prev, curr) => {
                      const toRgb = (hex: string) => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
                      const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s,v,i) => s + (v-b[i])**2, 0));
                      return dist(toRgb(custom), toRgb(curr.hex)) < dist(toRgb(custom), toRgb(prev.hex)) ? curr : prev;
                    });
                    setSelected(nearest);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Find Matches →
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Click the circle to open color picker, then click "Find Matches"</p>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full border-2 border-white/20" style={{ background: selected.hex }} />
                  <div>
                    <h2 className="font-bold text-lg">{selected.name} Blouse</h2>
                    <p className="text-cyan-400 text-sm">Color Rule: {selected.rule}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-base mb-4 text-muted-foreground">✨ Recommended Sarees:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {selected.sarees.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all group"
                    >
                      <div className="h-28 w-full" style={{ background: `linear-gradient(135deg, ${s.hex}, ${s.hex}88)` }} />
                      <div className="p-3">
                        <p className="font-bold text-sm leading-snug">{s.name}</p>
                        <p className="text-cyan-400 font-semibold text-sm mt-1">{s.price}</p>
                        <button
                          onClick={() => navigate(`/products?category=${s.category}&color=${s.hex.replace('#','')}}`)}
                          className="mt-2 w-full text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag size={12} /> View Products
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => navigate('/products?category=sarees')}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <ShoppingBag size={16} /> Browse All Sarees
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="px-5 py-2.5 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
                    Reset
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
