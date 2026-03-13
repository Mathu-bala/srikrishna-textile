import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Camera, Download, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SAMPLE_OVERLAYS = [
  { name: 'Red Silk Saree', color: 'rgba(139,0,0,0.45)', emoji: '🔴' },
  { name: 'Royal Blue Saree', color: 'rgba(65,105,225,0.45)', emoji: '🔵' },
  { name: 'Gold Silk Saree', color: 'rgba(218,165,32,0.45)', emoji: '🟡' },
  { name: 'Forest Green', color: 'rgba(34,139,34,0.45)', emoji: '🟢' },
  { name: 'Pink Georgette', color: 'rgba(255,105,180,0.45)', emoji: '🩷' },
  { name: 'Purple Banarasi', color: 'rgba(75,0,130,0.45)', emoji: '🟣' },
];

export default function VirtualTryOn() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<typeof SAMPLE_OVERLAYS[0] | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch {
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
    streamRef.current?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  const downloadPreview = () => {
    if (!photo) return;
    const a = document.createElement('a');
    a.href = photo;
    a.download = 'srikrishna-tryon-preview.jpg';
    a.click();
    toast.success('Preview downloaded!');
  };

  const reset = () => {
    setPhoto(null);
    setOverlay(null);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-1.5 mb-4">
              <Camera size={14} className="text-pink-400" />
              <span className="text-sm font-semibold text-pink-300">Virtual Try-On</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Try Before You{' '}
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Buy</span>
            </h1>
            <p className="text-muted-foreground">Upload your photo and preview how outfits look on you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-5">
              {/* Upload / Camera */}
              {!photo && (
                <div className="space-y-3">
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-pink-500/40 rounded-2xl flex flex-col items-center gap-2 hover:border-pink-500/70 hover:bg-pink-500/5 transition-all">
                    <Upload size={24} className="text-pink-400" />
                    <p className="font-semibold text-sm">Upload Your Photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG accepted</p>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

                  <button onClick={startCamera}
                    className="w-full py-4 border-2 border-dashed border-cyan-500/40 rounded-2xl flex flex-col items-center gap-2 hover:border-cyan-500/70 hover:bg-cyan-500/5 transition-all">
                    <Camera size={24} className="text-cyan-400" />
                    <p className="font-semibold text-sm">Use Camera</p>
                    <p className="text-xs text-muted-foreground">Live capture from your device</p>
                  </button>
                </div>
              )}

              {/* Camera view */}
              {showCamera && (
                <div className="space-y-3">
                  <video ref={videoRef} autoPlay className="w-full rounded-2xl border border-white/10" />
                  <button onClick={capturePhoto}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                    📸 Capture Photo
                  </button>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {/* Select outfit */}
              {photo && (
                <>
                  <div>
                    <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Select Outfit Color</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_OVERLAYS.map(o => (
                        <button key={o.name} onClick={() => setOverlay(o)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all ${overlay?.name === o.name
                            ? 'border-pink-400 bg-pink-500/10'
                            : 'border-border/50 hover:border-pink-400/40 bg-white/5'
                          }`}>
                          <span className="text-xl">{o.emoji}</span>
                          <span className="font-medium">{o.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={downloadPreview}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                      <Download size={16} /> Download Preview
                    </button>
                    <button onClick={reset}
                      className="px-4 py-2.5 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-pink-400/40 transition-colors">
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-white/5 rounded-xl p-3 border border-white/10">
                    🔒 Your photo is only used locally in your browser and is never uploaded to our servers.
                  </div>
                </>
              )}
            </div>

            {/* Preview Panel */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="Your photo" className="w-full object-cover" style={{ maxHeight: '500px' }} />
                  {overlay && (
                    <div className="absolute inset-0" style={{ background: overlay.color, mixBlendMode: 'multiply' }} />
                  )}
                  {overlay && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur p-3 text-center">
                      <p className="text-white font-semibold text-sm">{overlay.name} — Virtual Preview</p>
                      <p className="text-white/60 text-xs">This is a colour simulation. Actual drape may vary.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="font-medium mb-2">Your photo will appear here</p>
                  <p className="text-sm">Upload or capture a photo to start the virtual try-on</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🔒', title: 'Privacy First', desc: 'Photos stay in your browser. Nothing is uploaded.' },
              { icon: '⚡', title: 'Instant Preview', desc: 'See colour overlays instantly on your uploaded photo.' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Works with your phone camera for best results.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-sm mb-1">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
