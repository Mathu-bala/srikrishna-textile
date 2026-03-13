import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Search, ShoppingBag, Sparkles, Camera, Image as ImageIcon, Loader2, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';
import { fetchProducts } from '@/services/api';
import { toast } from 'sonner';

export default function AIVisualSearch() {
  const { mode } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      startAnalysis(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async (imgData: string) => {
    setAnalyzing(true);
    setError(null);
    setResults([]);

    // Simulate AI Vision Analysis
    await new Promise(r => setTimeout(r, 2500));

    try {
      // Logic: Extract "category" or "color" or "pattern" from image (simulated)
      // We'll search for random categories to show "results"
      const queries = ['Saree', 'Kurti', 'Silk', 'Designer'];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      const data = await fetchProducts({ q: randomQuery });
      setResults(data.slice(0, 8));
      toast.success('Visual Match Success!');
    } catch (err) {
      setError('Could not process visual search. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetSearch = () => {
    setImage(null);
    setResults([]);
    setError(null);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${mode === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}>
      <Header />
      
      <main className="flex-grow pt-12 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-20">
            <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] ${mode === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
            <div className={`absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${mode === 'dark' ? 'bg-cyan-600' : 'bg-cyan-300'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Link to="/ai-features" className={`inline-flex items-center gap-2 mb-8 transition-colors ${mode === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Back to AI Hub</span>
            </Link>

            <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 shadow-2xl transition-all ${mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-100'}`}>
              <Search size={16} className="text-indigo-500" />
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${mode === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>Neural Image Recognition</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              AI Visual <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent italic">Dress</span> Search
            </h1>
            <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Upload a photo of any saree, kurti, or fabric. Our Neural Engine scans patterns, colors, and weaves to find matches in our collection.
            </p>
          </motion.div>

          {!image ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`max-w-3xl mx-auto min-h-[300px] md:h-[400px] rounded-[2rem] sm:rounded-[3rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-6 sm:p-12 text-center group ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-500/10 scale-105' 
                  : (mode === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-slate-200 bg-white hover:border-indigo-200 shadow-2xl')
              }`}
            >
              <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 sm:mb-8 transition-transform duration-500 group-hover:scale-110 ${dragActive ? 'bg-indigo-500 text-white' : (mode === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-indigo-50 text-indigo-600')}`}>
                 <Camera size={32} className={`sm:w-10 sm:h-10 ${dragActive ? '' : 'animate-pulse'}`} />
              </div>
              <h3 className={`text-xl sm:text-2xl font-black mb-3 sm:mb-4 uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Drop Image or <span className="text-indigo-600">Click to Upload</span>
              </h3>
              <p className="text-slate-500 font-bold mb-8 sm:mb-10 text-xs sm:text-base">Supporting JPG, PNG, WEBP (Max 10MB)</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                 <button onClick={() => fileInputRef.current?.click()} className="w-full sm:px-10 py-4 sm:py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">Select Local File</button>
                 <button className="w-full sm:px-10 py-4 sm:py-5 border rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white/10 border-white/5 text-slate-400 flex items-center justify-center gap-2">
                    <ImageIcon size={16} /> Instagram Match
                 </button>
              </div>
              <input ref={fileInputRef} type="file" onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" accept="image/*" />
            </motion.div>
          ) : (
            <div className="space-y-20">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                 {/* Preview */}
                 <div className="lg:col-span-5">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                       <img src={image} className="w-full h-full object-cover" />
                       <AnimatePresence>
                          {analyzing && (
                            <motion.div 
                               initial={{ top: '0%' }}
                               animate={{ top: '100%' }}
                               transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                               className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-20"
                            />
                          )}
                       </AnimatePresence>
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-10" />
                       <button onClick={resetSearch} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                          <ArrowLeft size={20} />
                       </button>
                    </div>
                 </div>

                 {/* Status */}
                 <div className="lg:col-span-7">
                    <div className={`p-10 rounded-[3rem] border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-2xl'}`}>
                       <div className="flex items-center gap-4 mb-8">
                          {analyzing ? (
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
                               <Loader2 className="text-white animate-spin" size={32} />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center">
                               <Sparkles className="text-white" size={32} />
                            </div>
                          )}
                          <div>
                             <h2 className={`text-3xl font-black uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {analyzing ? 'Vision Processing' : 'Analysis Complete'}
                             </h2>
                             <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${analyzing ? 'text-indigo-400' : 'text-emerald-500'}`}>
                                {analyzing ? 'Scanning fabric density & pattern centroids...' : 'Object classification: 99.4% Match Accuracy'}
                             </p>
                          </div>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                             <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Detected Category</span>
                             <span className="text-sm font-black text-white px-3 py-1 bg-indigo-600 rounded-lg">Premium Silk Saree</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {['Floral Pattern', 'Zari Border', 'Maroon Hue', 'Handwoven textile'].map(tag => (
                                <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/10">{tag}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Results Grid */}
              {!analyzing && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-10">
                     <h3 className={`text-2xl font-black uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        AI-Recommended <span className="text-indigo-500">Matches</span>
                     </h3>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{results.length} Identical items found</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((product, i) => (
                      <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:scale-[1.02] ${
                            mode === 'dark' ? 'bg-[#0c0c0c] border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-100 shadow-xl'
                        }`}
                      >
                         <div className="aspect-[3/4] overflow-hidden relative">
                            <img src={product.image || product.images?.[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                            
                            <div className="absolute bottom-6 left-6 right-6">
                               <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                               <h4 className="text-white font-black text-sm uppercase truncate mb-2">{product.name}</h4>
                               <div className="flex items-center justify-between">
                                  <span className="text-white font-black text-base">₹{product.price}</span>
                                  <button onClick={() => navigate(`/product/${product._id || product.id}`)} className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-white hover:text-indigo-600 transition-all">
                                     <ShoppingBag size={16} />
                                  </button>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
