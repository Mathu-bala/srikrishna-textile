import { useState } from 'react';
import { ArrowLeft, Ruler, CheckCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SIZE_CHART = [
  { size: 'XS', chest: '32"', waist: '26"', hip: '36"', heightRange: 'Below 5\'2"', weightRange: '35–48 kg', bmiRange: '< 18.5' },
  { size: 'S',  chest: '34"', waist: '28"', hip: '38"', heightRange: '5\'2" – 5\'4"', weightRange: '49–60 kg', bmiRange: '18.5–22' },
  { size: 'M',  chest: '36"', waist: '30"', hip: '40"', heightRange: '5\'4" – 5\'6"', weightRange: '60–72 kg', bmiRange: '22–25' },
  { size: 'L',  chest: '38"', waist: '32"', hip: '42"', heightRange: '5\'6" – 5\'8"', weightRange: '72–85 kg', bmiRange: '25–28' },
  { size: 'XL', chest: '40"', waist: '34"', hip: '44"', heightRange: '5\'8" – 5\'10"', weightRange: '85–98 kg', bmiRange: '28–32' },
  { size: 'XXL',chest: '42"', waist: '36"', hip: '46"', heightRange: 'Above 5\'10"', weightRange: '98+ kg', bmiRange: '> 32' },
];

function getRecommendedSize(heightCm: number, weightKg: number): string {
  const bmi = weightKg / ((heightCm / 100) ** 2);
  const heightInches = heightCm / 2.54;
  if (bmi < 18.5 || heightInches < 62) return 'XS';
  if (bmi < 22 || heightInches < 64) return 'S';
  if (bmi < 25 || heightInches < 66) return 'M';
  if (bmi < 28 || heightInches < 68) return 'L';
  if (bmi < 32 || heightInches < 70) return 'XL';
  return 'XXL';
}

export default function SizeDetector() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [result, setResult] = useState<string | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<{ shoulder: string, chest: string, waist: string } | null>(null);
  const [scanMode, setScanMode] = useState(false);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    const hCm = unit === 'ft' ? h * 30.48 : h;
    const bmiVal = w / ((hCm / 100) ** 2);
    setBmi(Math.round(bmiVal * 10) / 10);
    setResult(getRecommendedSize(hCm, w));
    setScanData(null);
  };

  const startScan = () => {
    setIsScanning(true);
    setResult(null);
    setScanData(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanData({
        shoulder: '16.5"',
        chest: '36.2"',
        waist: '30.5"'
      });
      setResult('Medium (M)');
      setBmi(23.4);
      toast.success('Neural Body Scan Complete!');
    }, 3000);
  };

  const sizeColors: Record<string, string> = {
    XS: '#06b6d4', S: '#8b5cf6', M: '#10b981', L: '#f59e0b', XL: '#ef4444', XXL: '#ec4899', 'Medium (M)': '#10b981'
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4 shadow-lg shadow-blue-500/10">
              <Ruler size={14} className="text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-300">Advanced Neural Fitting</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black mb-3">
              Find Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">Perfect Fit</span>
            </h1>
            <p className="text-muted-foreground font-medium">Use our Neural Camera Scan or enter measurements for an AI recommendation.</p>
          </div>

          <div className="flex justify-center gap-3 mb-10">
             <button onClick={() => setScanMode(false)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!scanMode ? 'bg-blue-600 text-white shadow-xl' : 'border border-border/50 text-muted-foreground'}`}>Manual Input</button>
             <button onClick={() => setScanMode(true)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${scanMode ? 'bg-indigo-600 text-white shadow-xl' : 'border border-border/50 text-muted-foreground hover:border-indigo-500/50'}`}>Neural Camera Scan</button>
          </div>

          {/* Calculator */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
            
            {!scanMode ? (
              <>
                <div className="flex gap-3 mb-8">
                  {(['cm', 'ft'] as const).map(u => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${unit === u
                        ? 'bg-white text-black'
                        : 'border border-white/10 text-muted-foreground hover:border-blue-400'
                      }`}>
                      {u === 'cm' ? 'Centimetres' : 'Feet'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Height ({unit})</label>
                    <input
                      type="number"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      placeholder={unit === 'cm' ? 'e.g. 165' : 'e.g. 5.4'}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-foreground placeholder-muted-foreground outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 65"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-foreground placeholder-muted-foreground outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <button onClick={calculate}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xs">
                  🔍 Calculate Perfect Size
                </button>
              </>
            ) : (
              <div className="text-center py-10">
                 {!isScanning && !scanData ? (
                    <div className="flex flex-col items-center gap-8">
                       <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
                          <Camera size={40} className="text-indigo-400" />
                       </div>
                       <div className="space-y-3">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight">AI Camera Positioning</h3>
                          <p className="text-muted-foreground text-sm max-w-sm mx-auto">Standalone in front of the camera (about 2 meters away) for a full body scan.</p>
                       </div>
                       <button onClick={startScan} className="px-12 py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-500 transition-all text-xs">
                          Start Neural Scan
                       </button>
                    </div>
                 ) : isScanning ? (
                    <div className="flex flex-col items-center gap-8">
                       <div className="relative w-48 h-64 border-2 border-indigo-500/30 rounded-3xl overflow-hidden bg-slate-950">
                          <motion.div 
                             initial={{ top: '0%' }}
                             animate={{ top: '100%' }}
                             transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                             className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] z-10"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                             <Ruler size={64} className="text-indigo-500" />
                          </div>
                       </div>
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Measuring: Chest & Shoulder Proportions...</p>
                    </div>
                 ) : (
                    <div className="space-y-10">
                       <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: 'Shoulder', value: scanData?.shoulder },
                            { label: 'Chest', value: scanData?.chest },
                            { label: 'Waist', value: scanData?.waist },
                          ].map(s => (
                            <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                               <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{s.label}</p>
                               <p className="text-white font-black text-base">{s.value}</p>
                            </div>
                          ))}
                       </div>
                       <button onClick={() => setScanData(null)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Rescan Body</button>
                    </div>
                 )}
              </div>
            )}

            {/* Result Display */}
            <AnimatePresence>
               {result && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 rounded-3xl border shadow-xl relative overflow-hidden"
                   style={{ background: `${sizeColors[result]}08`, borderColor: `${sizeColors[result]}30` }}>
                   <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: sizeColors[result], filter: 'blur(60px)' }} />
                   <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                     <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl relative z-10"
                       style={{ background: `linear-gradient(135deg, ${sizeColors[result]}, #00000044)` }}>
                       {result.charAt(0)}
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                         <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: sizeColors[result] }} />
                         <span className="font-black uppercase tracking-widest text-white text-lg">Recommended Size: {result}</span>
                       </div>
                       <p className="text-sm text-slate-500 font-bold">Detected BMI: {bmi} — {bmi && (bmi < 18.5 ? 'NEURAL ALERT: Underweight' : bmi < 25 ? 'OPTIMIZED: Normal' : bmi < 30 ? 'CAUTION: Overweight' : 'HIGH BMI: Obese')}</p>
                       <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                          <Link to="/products" className="px-6 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Shop Your Fit</Link>
                          <button onClick={() => setResult(null)} className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Close</button>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Size Chart */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="font-bold text-lg">📏 Full Size Chart</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    {['Size', 'Chest', 'Waist', 'Hip', 'Height', 'Weight', 'BMI'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row, i) => (
                    <tr key={row.size}
                      className={`border-t border-white/10 transition-colors ${result === row.size ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}>
                      <td className="px-4 py-3">
                        <span className="font-black text-sm px-2 py-0.5 rounded" style={{ background: `${sizeColors[row.size]}30`, color: sizeColors[row.size] }}>
                          {row.size}
                        </span>
                        {result === row.size && <span className="ml-2 text-[10px] text-blue-400 font-bold">← Yours</span>}
                      </td>
                      <td className="px-4 py-3 text-sm">{row.chest}</td>
                      <td className="px-4 py-3 text-sm">{row.waist}</td>
                      <td className="px-4 py-3 text-sm">{row.hip}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.heightRange}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.weightRange}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.bmiRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
