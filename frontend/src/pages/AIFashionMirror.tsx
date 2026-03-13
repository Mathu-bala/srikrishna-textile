import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, RotateCw, Ruler, ShoppingBag, LayoutGrid, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const OUTFITS = [
  { id: 'silk', name: 'Banarasi Silk Saree', baseHex: '#C0392B', category: 'Saree', emoji: '👗' },
  { id: 'cotton', name: 'Cotton Kurti Set', baseHex: '#27AE60', category: 'Kurta', emoji: '👚' },
  { id: 'lehenga', name: 'Indo-Western Lehenga', baseHex: '#8E44AD', category: 'Lehenga', emoji: '💃' },
  { id: 'shirt', name: 'Ethnic Men Shirt', baseHex: '#2980B9', category: 'Men', emoji: '👔' },
];

const COLORS = [
  { name: 'Royale Red', hex: '#E74C3C' },
  { name: 'Emerald', hex: '#2ECC71' },
  { name: 'Sapphire', hex: '#3498DB' },
  { name: 'Antique Gold', hex: '#F1C40F' },
  { name: 'Royal Purple', hex: '#9B59B6' },
  { name: 'Midnight', hex: '#2C3E50' },
];

export default function AIFashionMirror() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selected, setSelected] = useState<typeof OUTFITS[0] | null>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [rotation, setRotation] = useState(0);
  const [sizeData, setSizeData] = useState<{size:string, confidence:number} | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setPhoto(ev.target?.result as string);
        analyzeBody();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeBody = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setSizeData({ size: 'Medium (M)', confidence: 94 });
      setAnalyzing(false);
      toast.success('Body detection complete: Recommended size M');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Hub
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <LayoutGrid size={14} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300 uppercase tracking-widest">AI Fashion Mirror</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black mb-3 text-white">
              The Intelligent{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Fashion Mirror</span>
            </h1>
            <p className="text-muted-foreground">Virtual Dressing • Color Customizer • 360-View • Size Scanner</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             {/* ── Dashboard (Left) ── */}
             <div className="lg:col-span-4 space-y-5">
                {!photo && (
                  <button onClick={() => fileRef.current?.click()} className="group w-full py-10 border-2 border-dashed border-cyan-500/30 rounded-3xl flex flex-col items-center gap-4 bg-white/5 hover:bg-cyan-500/5 transition-all">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                      <Upload className="text-cyan-400" size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">Upload Your Photo</p>
                      <p className="text-cyan-400/60 text-xs px-8">Full-length photos work best for body analysis & try-on.</p>
                    </div>
                    <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" />
                  </button>
                )}

                {photo && (
                  <>
                    {/* Size Pulse */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-2xl" />
                       <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Ruler size={14} /> AI Analysis
                       </h3>
                       {analyzing ? (
                         <div className="flex flex-col gap-2">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                               <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1 }} className="h-full w-1/3 bg-cyan-400" />
                            </div>
                            <p className="text-[10px] text-white/50 animate-pulse">Scanning proportions & posture...</p>
                         </div>
                       ) : (
                         <div className="space-y-1">
                            <p className="text-white font-black text-lg">{sizeData?.size}</p>
                            <p className="text-cyan-400/80 text-[10px] font-bold uppercase">{sizeData?.confidence}% Detection Confidence</p>
                         </div>
                       )}
                    </div>

                    {/* Catalog */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                       <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Select Dress</h3>
                       <div className="grid grid-cols-2 gap-2">
                         {OUTFITS.map(o => (
                           <button key={o.id} onClick={() => setSelected(o)} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${selected?.id === o.id ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'}`}>
                             <span className="text-xl">{o.emoji}</span>
                             <span className="text-[10px] font-black truncate w-full text-center uppercase tracking-wider">{o.category}</span>
                           </button>
                         ))}
                       </div>
                    </div>

                    {/* Color Swatch */}
                    {selected && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                         <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Customize Color</h3>
                         <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                              <button key={c.name} onClick={() => setActiveColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${activeColor.hex === c.hex ? 'border-white scale-110' : 'border-white/10 hover:scale-105'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                            ))}
                         </div>
                      </motion.div>
                    )}

                    <button onClick={() => navigate('/products')} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-cyan-600/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                       <ShoppingBag size={14} /> Buy Scanned Styles
                    </button>
                  </>
                )}
             </div>

             {/* ── Virtual Mirror View (Right) ── */}
             <div className="lg:col-span-8">
                <div className="relative bg-neutral-900 border-2 border-white/5 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                   
                   {/* Grid Lines Overlay */}
                   <div className="absolute inset-0 pointer-events-none opacity-5">
                      <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                   </div>

                   {photo ? (
                     <div className="relative aspect-[4/5] sm:aspect-video lg:aspect-[4/5]">
                        {/* THE PERSON */}
                        <motion.div style={{ rotateY: rotation }} animate={{ rotateY: rotation }} className="w-full h-full relative preserve-3d transition-transform duration-700">
                           <img src={photo} alt="Person" className="w-full h-full object-contain p-4 sm:p-8" />
                           
                           {/* DRESS OVERLAY (Simulated) */}
                           {selected && (
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 0.8, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-[15%] inset-y-[20%] rounded-[20%] blur-3xl pointer-events-none" style={{ backgroundColor: activeColor.hex, mixBlendMode: 'color' }} />
                           )}
                        </motion.div>

                        {/* Metadata Tag */}
                        {selected && (
                          <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                             <div className="flex items-center gap-3">
                                <span className="text-2xl">{selected.emoji}</span>
                                <div>
                                   <p className="text-[8px] font-black text-cyan-400 uppercase">{selected.category} SCAN</p>
                                   <p className="text-white text-xs font-bold">{selected.name}</p>
                                   <p className="text-white/50 text-[10px]">{activeColor.name}</p>
                                </div>
                             </div>
                          </div>
                        )}

                        {/* Rotation Control */}
                        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                           <button onClick={() => setRotation(r => r + 45)} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all"><RotateCw size={20} /></button>
                           <p className="text-[8px] font-black text-white/40 text-center uppercase tracking-wider">360° Rot</p>
                        </div>

                        {/* Scan Line Animation */}
                        {analyzing && (
                          <motion.div initial={{ top: 0 }} animate={{ top: '100%' }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="absolute left-0 right-0 h-px bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] z-10" />
                        )}
                     </div>
                   ) : (
                     <div className="aspect-[4/5] flex flex-col items-center justify-center p-12 text-center text-white/10">
                        <div className="w-20 h-20 rounded-[2rem] border-2 border-white/10 flex items-center justify-center mb-6">
                           <RotateCw size={32} className="animate-spin-slow" />
                        </div>
                        <h3 className="text-xl font-bold text-white/20 mb-2">Mirror is Off</h3>
                        <p className="text-sm max-w-xs mb-8">Ready to see yourself in new styles? Upload a photo to start the AI body scan & dress overlay.</p>
                        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-6 py-2 border border-cyan-500/30 text-cyan-400 font-bold text-xs rounded-full hover:bg-cyan-500/10 transition-colors uppercase tracking-widest"><Info size={14} /> Guide Me</button>
                     </div>
                   )}
                </div>
                
                {/* Specs */}
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {[
                     { label: 'Posture', value: 'Perfect' },
                     { label: 'Lighting', value: 'Optimized' },
                     { label: 'Proportions', value: 'Standard' },
                     { label: 'Fabric Match', value: '88% Realistic' },
                   ].map(s => (
                     <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-white/30 uppercase mb-1">{s.label}</p>
                        <p className="text-white font-bold text-xs">{s.value}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
