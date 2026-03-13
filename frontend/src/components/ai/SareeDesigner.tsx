import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scissors, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const FABRICS = ['Silk', 'Cotton', 'Linen', 'Georgette', 'Chiffon', 'Banarasi', 'Velvet'];
const BORDERS = ['Zari Gold', 'Silver Border', 'Contrast Colour', 'Temple Design', 'Floral Vine', 'Simple Thin'];
const PALLUS = ['Heavy Embroidered', 'Plain Solid', 'Printed Pattern', 'Mirror Work', 'Minimal Zari', 'Kasavu'];
const PATTERNS = ['No Pattern', 'Paisley Print', 'Floral', 'Geometric', 'Checks', 'Stripes', 'Animal Print'];

const COLORS = [
  { name: 'Deep Red', bg: '#8B0000' }, { name: 'Royal Blue', bg: '#4169E1' },
  { name: 'Forest Green', bg: '#228B22' }, { name: 'Gold', bg: '#DAA520' },
  { name: 'Rose Pink', bg: '#FF69B4' }, { name: 'Indigo', bg: '#4B0082' },
  { name: 'Teal', bg: '#008080' }, { name: 'Orange', bg: '#FF8C00' },
  { name: 'Ivory', bg: '#FFFFF0', text: '#333' }, { name: 'Maroon', bg: '#800000' },
  { name: 'Sky Blue', bg: '#87CEEB', text: '#333' }, { name: 'Lavender', bg: '#E6E6FA', text: '#333' },
];

interface Design {
  fabric: string; border: string; pallu: string; pattern: string;
  mainColor: { name: string; bg: string; text?: string };
  borderColor: { name: string; bg: string; text?: string };
}

function SareePreview({ design }: { design: Design }) {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 360" className="w-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}>
        {/* Main body */}
        <rect x="10" y="10" width="180" height="300" rx="8" fill={design.mainColor.bg} />

        {/* Pattern overlay */}
        {design.pattern !== 'No Pattern' && (
          <>
            {design.pattern === 'Floral' && Array.from({ length: 12 }).map((_, i) => (
              <circle key={i} cx={30 + (i % 4) * 45} cy={40 + Math.floor(i / 4) * 80} r="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            ))}
            {design.pattern === 'Paisley Print' && Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} cx={35 + (i % 3) * 65} cy={60 + Math.floor(i / 3) * 90} rx="10" ry="14" fill="rgba(255,255,255,0.15)" />
            ))}
            {design.pattern === 'Checks' && Array.from({ length: 16 }).map((_, i) => (
              <rect key={i} x={15 + (i % 4) * 44} y={20 + Math.floor(i / 4) * 70} width="38" height="60" fill="rgba(255,255,255,0.06)" />
            ))}
            {design.pattern === 'Geometric' && Array.from({ length: 6 }).map((_, i) => (
              <polygon key={i} points={`${40 + (i % 3) * 60},${50 + Math.floor(i / 3) * 120} ${60 + (i % 3) * 60},${80 + Math.floor(i / 3) * 120} ${20 + (i % 3) * 60},${80 + Math.floor(i / 3) * 120}`} fill="rgba(255,255,255,0.12)" />
            ))}
            {design.pattern === 'Stripes' && Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={10} y={10 + i * 50} width={180} height={22} fill="rgba(255,255,255,0.07)" />
            ))}
          </>
        )}

        {/* Border */}
        <rect x="10" y="280" width="180" height="30" rx="0" fill={design.borderColor.bg} opacity="0.9" />
        {design.border === 'Zari Gold' && (
          <rect x="10" y="280" width="180" height="30" fill="none" stroke="gold" strokeWidth="2" strokeDasharray="6,3" />
        )}
        {design.border === 'Silver Border' && (
          <rect x="10" y="280" width="180" height="30" fill="none" stroke="silver" strokeWidth="2" strokeDasharray="4,4" />
        )}
        {design.border === 'Temple Design' && Array.from({ length: 8 }).map((_, i) => (
          <polygon key={i} points={`${18 + i * 22},280 ${28 + i * 22},265 ${38 + i * 22},280`} fill={design.borderColor.bg} opacity="0.7" />
        ))}

        {/* Pallu */}
        <rect x="140" y="10" width="50" height="290" rx="0" fill={design.borderColor.bg} opacity="0.5" />
        {design.pallu === 'Heavy Embroidered' && Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={160} cy={40 + i * 32} r="6" fill="none" stroke="rgba(255,215,0,0.7)" strokeWidth="1.5" />
        ))}
        {design.pallu === 'Mirror Work' && Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={145} y={30 + i * 42} width={14} height={14} rx="2" fill="rgba(255,255,255,0.5)" />
        ))}
        {design.pallu === 'Kasavu' && (
          <rect x="140" y="10" width="8" height="290" fill="gold" opacity="0.8" />
        )}

        {/* Labels */}
        <text x="100" y="350" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">{design.fabric} • {design.pattern}</text>
      </svg>
    </div>
  );
}

export default function SareeDesigner() {
  const [design, setDesign] = useState<Design>({
    fabric: 'Silk',
    border: 'Zari Gold',
    pallu: 'Heavy Embroidered',
    pattern: 'No Pattern',
    mainColor: COLORS[0],
    borderColor: COLORS[3],
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof Design, value: any) => setDesign(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    const summary = `Custom Saree: ${design.fabric}, ${design.mainColor.name}, ${design.border} border, ${design.pallu} pallu, ${design.pattern} pattern`;
    sessionStorage.setItem('customSareeOrder', JSON.stringify({ ...design, summary }));
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-4">
              <Scissors size={14} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">Custom Saree Designer</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Design Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Dream Saree</span>
            </h1>
            <p className="text-muted-foreground">Customise fabric, border, pallu, pattern and colors — see live preview!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              {/* Main Color */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Saree Color</h3>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map(c => (
                    <button key={c.name} onClick={() => update('mainColor', c)} title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${design.mainColor.name === c.name ? 'border-white scale-110 shadow-lg' : 'border-white/20 hover:scale-105'}`}
                      style={{ background: c.bg }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Selected: {design.mainColor.name}</p>
              </div>

              {/* Border Color */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Border Color</h3>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map(c => (
                    <button key={c.name} onClick={() => update('borderColor', c)} title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${design.borderColor.name === c.name ? 'border-white scale-110 shadow-lg' : 'border-white/20 hover:scale-105'}`}
                      style={{ background: c.bg }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Selected: {design.borderColor.name}</p>
              </div>

              {/* Dropdowns */}
              {([
                { label: 'Fabric Type', key: 'fabric', options: FABRICS },
                { label: 'Border Style', key: 'border', options: BORDERS },
                { label: 'Pallu Design', key: 'pallu', options: PALLUS },
                { label: 'Pattern', key: 'pattern', options: PATTERNS },
              ] as const).map(({ label, key, options }) => (
                <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-muted-foreground">{label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {options.map(opt => (
                      <button key={opt} onClick={() => update(key, opt)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${design[key] === opt
                          ? 'bg-emerald-500/30 border border-emerald-500/60 text-emerald-300'
                          : 'bg-white/5 border border-white/10 text-muted-foreground hover:border-emerald-500/40 hover:text-foreground'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Save */}
              <button onClick={handleSave}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                {saved ? '✅ Design Saved! Contact us to order.' : <><Download size={18} /> Save Design & Place Custom Order</>}
              </button>
            </div>

            {/* Preview */}
            <div className="sticky top-24">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
                <h3 className="font-bold text-center mb-4 text-muted-foreground">Live Preview</h3>
                <motion.div key={JSON.stringify(design)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <SareePreview design={design} />
                </motion.div>
                <div className="mt-4 text-center space-y-1">
                  <p className="font-bold">{design.mainColor.name} {design.fabric} Saree</p>
                  <p className="text-muted-foreground text-sm">{design.border} • {design.pallu} Pallu • {design.pattern}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
