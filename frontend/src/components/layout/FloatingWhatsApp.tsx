import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingWhatsApp = () => {
  return (
    <motion.a
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      href="https://wa.me/919786632306?text=Hello%20SriKrishna%20Premium%20Fashion%20I%20would%20like%20to%20know%20more%20about%20your%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:shadow-[0_0_20px_rgba(37,211,102,0.8)] transition-all duration-300 hover:scale-110 flex items-center justify-center pointer-events-auto"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="fill-current" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
