import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, Sparkles, ShoppingBag, Download, Heart, Wand2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const BRIDAL_OUTFITS = [
  { id: 'kanchi', name: 'Kanchipuram Silk', color: 'rgba(139,0,0,0.5)', emoji: '🏮' },
  { id: 'lehenga', name: 'Reception Lehenga', color: 'rgba(128,0,128,0.4)', emoji: '💃' },
  { id: 'designer', name: 'Designer Bridal Saree', color: 'rgba(218,165,32,0.4)', emoji: '✨' },
];

const JEWELRY = [
  { id: 'necklace', name: 'Necklace', pos: 'top-[45%]' },
  { id: 'earrings', name: 'Earrings', pos: 'top-[40%]' },
  { id: 'tikka', name: 'Maang Tikka', pos: 'top-[25%]' },
  { id: 'bangles', name: 'Bangles', pos: 'top-[70%]' },
];

const MAKEUP = [
  { name: 'Classic Red', lips: '#B22222', bindi: '#8B0000' },
  { name: 'Rose Gold', lips: '#E9967A', bindi: '#FF69B4' },
  { name: 'Nude Bridal', lips: '#BC8F8F', bindi: '#CD853F' },
  { name: 'Deep Maroon', lips: '#800000', bindi: '#4B0082' },
];

export default function AIBridalMirror() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<typeof BRIDAL_OUTFITS[0] | null>(null);
  const [activeJewelry, setActiveJewelry] = useState<string[]>([]);
  const [makeup, setMakeup] = useState<typeof MAKEUP[0] | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch {
      toast.error('Camera access denied');
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      canvasRef.current.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setPhoto(canvasRef.current.toDataURL());
      setShowCamera(false);
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-rose-400 transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Hub
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-rose-400" />
              <span className="text-sm font-semibold text-rose-300">AI Bridal Mirror</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black mb-3 text-white">
              The Virtual{' '}
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Bridal Mirror</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Try on wedding sarees, jewelry, and makeup in real-time. Find your perfect bridal look with AI.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Controls (Left) ── */}
            <div className="lg:col-span-4 space-y-6">
              {!photo && (
                <div className="space-y-3">
                  <button onClick={() => fileRef.current?.click()} className="w-full py-6 border-2 border-dashed border-rose-500/40 rounded-2xl flex flex-col items-center gap-2 hover:bg-rose-500/5 transition-all text-rose-200">
                    <Upload size={24} />
                    <p className="font-bold">Upload Bridal Photo</p>
                  </button>
                  <button onClick={startCamera} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white font-semibold">
                    <Camera size={20} /> Use Live Mirror
                  </button>
                  <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" />
                </div>
              )}

              {showCamera && (
                <div className="space-y-3">
                  <video ref={videoRef} autoPlay className="w-full rounded-2xl border border-rose-500/30" />
                  <button onClick={capture} className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all">Capture Bridal Look</button>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {photo && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Outfit Selection */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">1. Select Outfit</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {BRIDAL_OUTFITS.map(o => (
                        <button key={o.id} onClick={() => setOutfit(o)} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${outfit?.id === o.id ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 hover:border-white/20 bg-white/5'}`}>
                          <span className="text-xl">{o.emoji}</span>
                          <span className="text-sm font-semibold">{o.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jewelry Overlay */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">2. Add Jewelry</h3>
                    <div className="flex flex-wrap gap-2">
                      {JEWELRY.map(j => (
                        <button key={j.id} onClick={() => setActiveJewelry(prev => prev.includes(j.id) ? prev.filter(x => x !== j.id) : [...prev, j.id])} 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeJewelry.includes(j.id) ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                          {j.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Makeup */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">3. Bridal Makeup</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {MAKEUP.map(m => (
                        <button key={m.name} onClick={() => setMakeup(m)} className={`p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${makeup?.name === m.name ? 'border-rose-400 bg-rose-400/10' : 'border-white/5 bg-white/5'}`}>
                          <div className="w-4 h-4 rounded-full" style={{ background: m.lips }} />
                          <span className="text-[10px] font-bold truncate">{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button onClick={() => { setPhoto(null); setOutfit(null); setActiveJewelry([]); setMakeup(null); }} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"><ArrowLeft size={18} /></button>
                    <button onClick={() => toast.success('Look saved to your wardrobe!')} className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"><Heart size={18} /> Save Bridal Look</button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Mirror Preview (Center/Right) ── */}
            <div className="lg:col-span-8">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-900 rounded-[2rem] overflow-hidden border-8 border-neutral-800 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                {photo ? (
                  <div className="relative w-full h-full">
                    <img src={photo} alt="Try-on" className="w-full h-full object-cover" />
                    
                    {/* Outfit Overlay */}
                    {outfit && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0" style={{ background: outfit.color, mixBlendMode: 'multiply' }} />
                    )}

                    {/* Jewelry Simulators (SVG) */}
                    {activeJewelry.map(jId => (
                      <motion.div key={jId} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`absolute left-1/2 -translate-x-1/2 ${JEWELRY.find(j=>j.id===jId)?.pos}`}>
                        <div className="w-32 h-12 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-full blur-[2px] opacity-60 border-2 border-yellow-600" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[8px] font-black text-amber-900">✨ BRIDAL {jId.toUpperCase()}</div>
                      </motion.div>
                    ))}

                    {/* Makeup Overlay */}
                    {makeup && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-[35%] left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none">
                         {/* Lipstick */}
                         <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-6 h-2 rounded-full blur-[1px] opacity-80" style={{ backgroundColor: makeup.lips }} />
                         {/* Bindi */}
                         <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ backgroundColor: makeup.bindi }} />
                      </motion.div>
                    )}

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20">
                      <div className="text-center shrink-0">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest">Bridal Status</p>
                        <p className="text-rose-400 text-sm font-black italic">Radiant</p>
                      </div>
                      <div className="w-px h-8 bg-white/20" />
                      <button onClick={downloadPreview} className="text-white hover:text-rose-400 transition-colors"><Download size={20} /></button>
                      <button onClick={() => navigate('/products?category=bridal')} className="bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Shop Look</button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-rose-200/40 p-12 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-rose-200/20 flex items-center justify-center mb-6">
                       <Wand2 size={40} className="animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-rose-200/60">Unlock Your Bridal Glow</h3>
                    <p className="text-sm max-w-xs">Upload your photo to start your virtual transformation from our curated bridal collection.</p>
                  </div>
                )}
                
                {/* Frame ornaments */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-rose-500/30 rounded-tl-3xl" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-rose-500/30 rounded-br-3xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  function downloadPreview() {
    toast.success('Downloading your bridal look...');
  }
}
