import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay after 100%
          return 100;
        }
        return prev + 2; // Adjust speed as needed
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-[#fdfcfb]"
      style={{
        background: 'radial-gradient(circle at center, #ffffff 0%, #f7f3f0 100%)',
      }}
    >
      {/* Decorative Silk/Fabric Element (Animated Gradient) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 25%, rgba(212, 175, 55, 0.1) 50%, transparent 75%)',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 12,
              stiffness: 100,
              restDelta: 0.001
            }
          }}
          className="mb-8"
        >
          <img
            src="/logo.png"
            alt="SriKrishna Logo"
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Brand Name Animation */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-4xl md:text-5xl font-serif font-black tracking-[0.15em] text-[#2c1810] uppercase"
          >
            SriKrishna
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-center text-[#8b6d4d] text-xs font-bold tracking-[0.3em] uppercase mt-2"
          >
            Exquisite Textiles
          </motion.p>
        </div>

        {/* Loading Animation (Modern Progress Bar) */}
        <div className="w-48 h-[2px] bg-[#2c1810]/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loading}%` }}
            transition={{ duration: 0.1 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d4af37] to-[#8b6d4d]"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1 h-1 rounded-full bg-[#8b6d4d]"
            />
          ))}
        </motion.div>
      </div>

      {/* Subtle Bottom Aesthetic */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 text-[10px] font-bold text-[#8b6d4d]/40 tracking-widest uppercase"
      >
        Est. 1994 • Quality Guaranteed
      </motion.div>
    </motion.div>
  );
}
