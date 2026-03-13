import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveLeft, MoveRight, Maximize2, RotateCcw, Box } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUtils';

interface Props { product: any }

export default function Product360View({ product }: Props) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative group bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 select-none">
       {/* UI Overlays */}
       <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
             <Box size={14} className="text-cyan-400" />
             <span className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none">360° View Mode</span>
          </div>
          <div className="text-[8px] font-bold text-white/30 uppercase pl-1">Rotate to inspect fabric details</div>
       </div>

       {/* Actions */}
       <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button onClick={() => setZoom(z => z === 1 ? 2 : 1)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"><Maximize2 size={18} /></button>
          <button onClick={() => setRotation(0)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"><RotateCcw size={18} /></button>
       </div>

       {/* Main Image */}
       <motion.div style={{ rotateY: rotation, scale: zoom }} animate={{ rotateY: rotation, scale: zoom }} transition={{ type: 'spring', stiffness: 50, damping: 20 }} className="w-full h-full relative preserve-3d">
          <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
          
          {/* Backside Simulation Overlay (slightly different shade to feel 3D) */}
          <div className="absolute inset-0 bg-black/10 rounded-full blur-[100px] pointer-events-none -z-10" />
       </motion.div>

       {/* Bottom Controls */}
       <div className="absolute bottom-6 inset-x-8 flex items-center justify-between z-20">
          <button onClick={() => setRotation(r => r - 45)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"><MoveLeft size={18} /></button>
          
          <div className="flex gap-1.5">
             {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${rotation === i * 45 ? 'bg-cyan-400 w-4' : 'bg-white/10'}`} />
             ))}
          </div>

          <button onClick={() => setRotation(r => r + 45)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"><MoveRight size={18} /></button>
       </div>

       {/* Drag Instruction */}
       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase flex items-center gap-2">
             <RotateCcw size={12} className="animate-spin-slow" /> Use buttons to rotate
          </div>
       </div>
    </div>
  );
}
