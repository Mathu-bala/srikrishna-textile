import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const FABRICS = [
  {
    name: 'Silk',
    emoji: '🪡',
    tagline: 'The Queen of Fabrics',
    color: '#C0392B',
    ideal: 'Weddings, Festivals, Formal occasions',
    care: 'Dry clean only. Store folded in muslin cloth.',
    origin: 'Produced from silkworm cocoons. India\'s Kanchipuram, Mysore, and Banarasi regions are famous for silk.',
    pros: ['Lustrous, natural sheen', 'Breathable and comfortable', 'Long-lasting and durable', 'Feels luxurious on skin'],
    cons: ['Expensive', 'Needs dry cleaning', 'Sensitive to moisture'],
    varieties: ['Kanchipuram Silk', 'Banarasi Silk', 'Mysore Silk', 'Tussar Silk', 'Muga Silk'],
    seasonal: 'All seasons — cooler in summer, warmer in winter',
  },
  {
    name: 'Cotton',
    emoji: '🌿',
    tagline: 'Breathable & Everyday Comfort',
    color: '#27AE60',
    ideal: 'Daily wear, Summer, Casual, Office',
    care: 'Machine washable. Iron on medium heat.',
    origin: 'Made from the cotton plant. India is one of the world\'s largest cotton producers.',
    pros: ['Very breathable', 'Affordable', 'Easy to maintain', 'Wide variety of prints'],
    cons: ['Wrinkles easily', 'Colors may fade', 'Less drape than silk'],
    varieties: ['Handloom Cotton', 'Cambric', 'Poplin', 'Khadi', 'Voile', 'Lawn'],
    seasonal: 'Best for summer and humid weather',
  },
  {
    name: 'Georgette',
    emoji: '✨',
    tagline: 'Elegant Flowing Drape',
    color: '#8E44AD',
    ideal: 'Parties, Semi-formal events, Evening wear',
    care: 'Hand wash or dry clean. Avoid wringing.',
    origin: 'Named after French dressmaker Georgette de la Plante. Made from twisted yarns for a crinkled texture.',
    pros: ['Flows beautifully', 'Lightweight', 'Versatile and elegant', 'Good for layering'],
    cons: ['Can be slippery to drape', 'Moderate durability', 'May need lining'],
    varieties: ['Chiffon Georgette', 'Satin Georgette', 'Faux Georgette', 'Pure Georgette'],
    seasonal: 'Suitable for all seasons',
  },
  {
    name: 'Chiffon',
    emoji: '🌸',
    tagline: 'Sheer & Feminine',
    color: '#E91E8C',
    ideal: 'Parties, Formal events, Festive sarees',
    care: 'Hand wash gently in cold water. Lay flat to dry.',
    origin: 'Chiffon comes from the French word "chiffe" meaning cloth/rag. Made from silk or synthetic fibres.',
    pros: ['Very lightweight', 'Sheer elegance', 'Layerable', 'Great for pleating'],
    cons: ['Delicate and tears easily', 'Difficult to stitch', 'Transparent'],
    varieties: ['Silk Chiffon', 'Polyester Chiffon', 'Printed Chiffon'],
    seasonal: 'Summer and spring',
  },
  {
    name: 'Linen',
    emoji: '🌾',
    tagline: 'Cool & Sustainable',
    color: '#D4A017',
    ideal: 'Summer casual, Office, Beach wear',
    care: 'Machine washable. Gets softer after each wash.',
    origin: 'Made from the flax plant. One of the oldest fabrics in the world, dating back to ancient Egypt.',
    pros: ['Extremely breathable', 'Eco-friendly', 'Gets better with age', 'Durable'],
    cons: ['Wrinkles a lot', 'Rough texture initially', 'Limited prints available'],
    varieties: ['Pure Linen', 'Linen Blend', 'Washed Linen', 'Embroidered Linen'],
    seasonal: 'Ideal for summer',
  },
  {
    name: 'Velvet',
    emoji: '💜',
    tagline: 'Luxe & Statement',
    color: '#5B2C6F',
    ideal: 'Winter, Evening wear, Special occasions',
    care: 'Dry clean only. Store hanging to avoid crushing pile.',
    origin: 'Velvet has origins in ancient Asia and was historically worn by royalty. It has a distinctive pile weave.',
    pros: ['Very luxurious look', 'Rich texture', 'Great for evening wear', 'Warm'],
    cons: ['Heavy fabric', 'Expensive', 'Difficult to maintain', 'Not suitable for summer'],
    varieties: ['Silk Velvet', 'Crushed Velvet', 'Embossed Velvet', 'Burnout Velvet'],
    seasonal: 'Winter and cooler months',
  },
  {
    name: 'Banarasi',
    emoji: '🏺',
    tagline: 'India\'s Grandest Weave',
    color: '#B7410E',
    ideal: 'Weddings, Festivals, Bridal wear',
    care: 'Dry clean. Store with neem leaves to prevent insects.',
    origin: 'Originating from Varanasi (Banaras), UP. These sarees feature intricate zari work with gold and silver threads.',
    pros: ['Exquisite craftsmanship', 'Rich heritage', 'Durable gold/silver thread work', 'Investment piece'],
    cons: ['Heavy and warm', 'Very expensive', 'Needs professional cleaning'],
    varieties: ['Katan Banarasi', 'Organza Banarasi', 'Georgette Banarasi', 'Shattir'],
    seasonal: 'Cooler months and festive seasons',
  },
];

const QUICK_QA = [
  { q: 'Best fabric for summer?', a: 'Cotton and Linen are the best for summer. They are breathable, lightweight, and absorb sweat well.' },
  { q: 'Which fabric for wedding?', a: 'Pure Silk (Kanchipuram or Banarasi) is the classic choice for weddings. They are rich, lustrous, and traditional.' },
  { q: 'Silk vs Cotton difference?', a: 'Silk is a premium natural fibre from silkworm cocoons — lustrous and formal. Cotton is a plant-based fibre — breathable and everyday. Silk is for occasions; cotton is for daily comfort.' },
  { q: 'Most durable fabric?', a: 'Cotton and Linen are very durable. Silk is also long-lasting when cared for properly. Banarasi zari work can last generations.' },
  { q: 'Which fabric is cheapest?', a: 'Cotton is the most affordable. Synthetic fabrics like polyester are cheaper but less comfortable than natural fibres.' },
  { q: 'What is Kanchipuram?', a: 'Kanchipuram silk is India\'s most prized silk saree, woven in Kanchipuram, Tamil Nadu. Known for thick silk, contrasting borders, and intricate temple designs. A true heirloom.' },
];

export default function FabricKnowledge() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const [qaOpen, setQaOpen] = useState<string | null>(null);

  const filtered = FABRICS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.ideal.toLowerCase().includes(search.toLowerCase())
  );

  const activeFabric = FABRICS.find(f => f.name === active);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-1.5 mb-4">
              <BookOpen size={14} className="text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Fabric Knowledge AI</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Know Your{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Fabrics</span>
            </h1>
            <p className="text-muted-foreground">Your complete guide to textile materials, care, and occasions</p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fabric (e.g. silk, cotton, summer)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Quick Q&A */}
          <div className="mb-8">
            <h2 className="font-bold text-base mb-3 text-muted-foreground">💬 Common Questions</h2>
            <div className="space-y-2">
              {QUICK_QA.map(qa => (
                <div key={qa.q} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQaOpen(qaOpen === qa.q ? null : qa.q)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium text-sm">{qa.q}</span>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${qaOpen === qa.q ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {qaOpen === qa.q && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm text-teal-300 leading-relaxed">{qa.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Fabric Grid */}
          <h2 className="font-bold text-base mb-4 text-muted-foreground">📚 Fabric Encyclopedia</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {filtered.map(f => (
              <motion.button
                key={f.name}
                onClick={() => setActive(active === f.name ? null : f.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${active === f.name
                  ? 'border-teal-400 bg-teal-500/10'
                  : 'border-border/50 hover:border-teal-500/40 bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{f.emoji}</div>
                <p className="font-bold text-sm">{f.name}</p>
                <p className="text-muted-foreground text-[11px] mt-1 italic">{f.tagline}</p>
              </motion.button>
            ))}
          </div>

          {/* Fabric Detail */}
          <AnimatePresence>
            {activeFabric && (
              <motion.div
                key={activeFabric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              >
                <div className="p-5 sm:p-8" style={{ borderBottom: `2px solid ${activeFabric.color}30` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: `${activeFabric.color}20`, border: `2px solid ${activeFabric.color}40` }}>
                      {activeFabric.emoji}
                    </div>
                    <div>
                      <h2 className="font-black text-2xl">{activeFabric.name}</h2>
                      <p className="text-muted-foreground italic">{activeFabric.tagline}</p>
                      <p className="text-sm mt-1" style={{ color: activeFabric.color }}>Seasonal: {activeFabric.seasonal}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Origin</h3>
                    <p className="text-sm leading-relaxed mb-4">{activeFabric.origin}</p>
                    <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Best For</h3>
                    <p className="text-sm text-teal-300">{activeFabric.ideal}</p>
                    <h3 className="font-bold mb-2 mt-4 text-sm text-muted-foreground uppercase tracking-wider">Care Instructions</h3>
                    <p className="text-sm">{activeFabric.care}</p>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold mb-2 text-sm text-green-400 uppercase tracking-wider">✅ Pros</h3>
                      <ul className="space-y-1">
                        {activeFabric.pros.map(p => <li key={p} className="text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />{p}</li>)}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold mb-2 text-sm text-red-400 uppercase tracking-wider">❌ Cons</h3>
                      <ul className="space-y-1">
                        {activeFabric.cons.map(c => <li key={c} className="text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />{c}</li>)}
                      </ul>
                    </div>
                    <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Varieties</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeFabric.varieties.map(v => (
                        <span key={v} className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: `${activeFabric.color}50`, color: activeFabric.color, background: `${activeFabric.color}10` }}>{v}</span>
                      ))}
                    </div>
                  </div>
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
