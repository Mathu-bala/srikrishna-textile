import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, RefreshCw, ShoppingBag, Sparkles, Loader2, User, UserCheck, Baby, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as faceapi from '@vladmandic/face-api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

type DetectedCategory = 'Male' | 'Female' | 'Child' | null;

export default function VisualScan() {
  const { mode } = useTheme();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<DetectedCategory>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState(0);

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Failed to load AI models. Please check your internet connection.");
      }
    };
    loadModels();
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    setDetectedCategory(null);
    setDetectionConfidence(0);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please ensure you have granted permission.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const handleDetection = async () => {
    if (!videoRef.current || !isModelLoaded || !isScanning || isAnalyzing) return;

    const video = videoRef.current;
    
    // Check if video is playing
    if (video.paused || video.ended) return;

    try {
      const detections = await faceapi.detectSingleFace(
        video, 
        new faceapi.TinyFaceDetectorOptions()
      ).withAgeAndGender();

      if (detections) {
        const { age, gender, genderProbability } = detections;
        
        let category: DetectedCategory = null;
        
        // Logic: Age < 14 is Child, else use gender
        if (age < 14) {
          category = 'Child';
        } else if (gender === 'male') {
          category = 'Male';
        } else if (gender === 'female') {
          category = 'Female';
        }

        if (category) {
          // Require high confidence or multiple frames? 
          // For UX, if probability > 0.7, we start "analyzing" to lock it in
          if (genderProbability > 0.7 || category === 'Child') {
            setDetectionConfidence(prev => Math.min(prev + 25, 100));
            
            if (detectionConfidence >= 75) {
              setIsAnalyzing(true);
              setDetectedCategory(category);
              stopCamera();
              
              toast.success(`AI Detect: ${category}! Redirecting to recommendations...`);
              
              // Map to category redirect
              setTimeout(() => {
                const categoryMap: Record<string, string> = {
                  'Male': 'mens',
                  'Female': 'all',
                  'Child': 'kids'
                };
                
                const queryMap: Record<string, string> = {
                  'Male': 'q=shirt t-shirt dhoti kurta fabric',
                  'Female': 'q=saree kurti salwar fabric designer',
                  'Child': 'q=dress pavadai shirt traditional kids'
                };

                navigate(`/products?category=${categoryMap[category]}&${queryMap[category]}`);
              }, 3000);
            }
          }
        }
      } else {
        // If no face found, slowly decrease confidence
        setDetectionConfidence(prev => Math.max(prev - 10, 0));
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  };

  // Run detection loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && !isAnalyzing) {
      interval = setInterval(() => {
        handleDetection();
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isScanning, isAnalyzing, detectionConfidence]);

  const getCategoryIcon = (cat: DetectedCategory) => {
    switch (cat) {
      case 'Male': return <User size={40} className="text-blue-400" />;
      case 'Female': return <UserCheck size={40} className="text-pink-400" />;
      case 'Child': return <Baby size={40} className="text-yellow-400" />;
      default: return <Users size={40} className="text-slate-400" />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${mode === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}>
      <Header />
      
      <main className="flex-grow pt-12 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-20">
            <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] ${mode === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
            <div className={`absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${mode === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link to="/ai-features" className={`inline-flex items-center gap-2 mb-8 transition-colors ${mode === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Back to AI Hub</span>
            </Link>

            <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 shadow-2xl transition-all ${mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-100'}`}>
              <Camera size={16} className="text-indigo-500" />
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${mode === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>Neural Face Recognition</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              AI Camera <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent italic">Visual</span> Scan
            </h1>
            <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Scan your face to instantly discover the best collections for you. Our AI detects gender and age to personalize your shopping.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-center">
                 <h3 className="text-red-400 font-black uppercase tracking-tight text-xl mb-4">Detection Error</h3>
                 <p className="text-slate-400 font-bold mb-8">{error}</p>
                 <button onClick={startCamera} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Try Again</button>
              </motion.div>
            ) : !isScanning && !isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-12 sm:p-20 rounded-[3rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center text-center ${mode === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-slate-200 bg-white hover:border-indigo-200 shadow-2xl'}`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-10 bg-indigo-500/10 text-indigo-400 animate-pulse`}>
                   <Camera size={40} />
                </div>
                <h3 className={`text-2xl font-black mb-6 uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                   Ready for <span className="text-indigo-600">Smart Recognition?</span>
                </h3>
                <p className="text-slate-500 font-bold mb-10 max-w-sm">Place yourself in front of the camera. Lighting should be clear for better accuracy.</p>
                <button 
                  onClick={startCamera}
                  disabled={!isModelLoaded}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {!isModelLoaded && <Loader2 size={16} className="animate-spin" />}
                  {isModelLoaded ? 'Start AI Scan' : 'Loading Models...'}
                </button>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Camera Feed */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-video sm:aspect-square md:aspect-video rounded-[3rem] overflow-hidden border-8 border-white dark:border-white/10 shadow-2xl bg-black">
                     <video 
                       ref={videoRef} 
                       autoPlay 
                       muted 
                       playsInline 
                       className={`w-full h-full object-cover ${isAnalyzing ? 'opacity-50 grayscale' : ''}`}
                     />
                     <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
                     
                     <AnimatePresence>
                        {isScanning && !isAnalyzing && (
                          <motion.div 
                             initial={{ top: '0%' }}
                             animate={{ top: '100%' }}
                             transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                             className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-20"
                          />
                        )}
                     </AnimatePresence>

                     {isAnalyzing && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/40 backdrop-blur-md">
                          <div className="w-20 h-20 rounded-full border-4 border-white border-t-transparent animate-spin mb-6" />
                          <h4 className="text-white font-black uppercase tracking-[0.3em] text-sm animate-pulse">Analyzing Persona...</h4>
                       </div>
                     )}

                     {!isAnalyzing && (
                       <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                          <div className={`px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 bg-black/40 text-white text-[10px] font-black uppercase tracking-widest`}>
                             Live Recognition Active
                          </div>
                          <button onClick={stopCamera} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                             <RefreshCw size={16} />
                          </button>
                       </div>
                     )}
                  </div>

                  {/* Recognition Bar */}
                  {isScanning && !isAnalyzing && (
                    <div className="mt-6 flex flex-col gap-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Scanning Probability</span>
                          <span>{detectionConfidence}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${detectionConfidence}%` }}
                            className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                          />
                       </div>
                    </div>
                  )}
                </div>

                {/* Status Card */}
                <div className="lg:col-span-5">
                   <div className={`p-10 rounded-[3rem] border h-full flex flex-col ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-2xl'}`}>
                      <div className="flex items-center gap-4 mb-10">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isAnalyzing ? 'bg-indigo-600 rotate-12' : (mode === 'dark' ? 'bg-white/5' : 'bg-slate-50')}`}>
                            {getCategoryIcon(detectedCategory)}
                         </div>
                         <div>
                            <h3 className={`text-2xl font-black uppercase tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                               {isAnalyzing ? 'Subject Filtered' : 'Waiting...'}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                               Neural Classification
                            </p>
                         </div>
                      </div>

                      <div className="space-y-6 flex-grow">
                         {isAnalyzing ? (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">AI Detection Result</label>
                                 <div className="flex items-center justify-between">
                                    <span className={`text-2xl font-black ${detectedCategory === 'Male' ? 'text-blue-400' : detectedCategory === 'Female' ? 'text-pink-400' : 'text-yellow-400'}`}>
                                       {detectedCategory}
                                    </span>
                                    <Sparkles size={24} className="text-indigo-500 animate-pulse" />
                                 </div>
                              </div>
                              <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                AI detected: <span className="text-white">{detectedCategory}</span> — Showing recommended products tailored specifically for you.
                              </p>
                              
                              <div className="pt-4">
                                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    Redirecting in 3 seconds...
                                 </div>
                                 <button 
                                   onClick={() => {
                                      const categoryMap: Record<string, string> = { 'Male': 'mens', 'Female': 'kurtis', 'Child': 'kids' };
                                      navigate(`/products?category=${categoryMap[detectedCategory!]}`);
                                   }}
                                   className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                 >
                                    View Products Now
                                 </button>
                              </div>
                           </motion.div>
                         ) : (
                           <div className="space-y-8 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Ensure face is centered and clearly visible for analysis.</p>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mapping Categories</h4>
                                 <div className="grid grid-cols-1 gap-3">
                                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                                       <span className="text-[10px] font-black text-slate-400 uppercase">Men's Apparel</span>
                                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Male Detect</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                                       <span className="text-[10px] font-black text-slate-400 uppercase">Ethnic Women's</span>
                                       <span className="text-[10px] font-black text-pink-400 uppercase tracking-tighter">Female Detect</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                                       <span className="text-[10px] font-black text-slate-400 uppercase">Kids Collection</span>
                                       <span className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter">Child Detect</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                         )}
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5">
                         <button onClick={() => { stopCamera(); navigate('/ai-features'); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                            <ArrowLeft size={14} /> Abandon Scan
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
