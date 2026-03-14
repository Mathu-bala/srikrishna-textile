import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ShoppingBag, Truck, Info, UserRound, Minus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const { mode } = useTheme();
  
  const phoneNumber = "918838097506";
  const defaultMessage = "Hello SriKrishna Textiles, I need assistance with your products.";

  const quickActions = [
    { 
      label: 'Browse Sarees', 
      icon: ShoppingBag, 
      text: 'Hello SriKrishna Textiles, I want to see your saree collections.' 
    },
    { 
      label: 'Track Order', 
      icon: Truck, 
      text: 'Hello SriKrishna Textiles, I need help with tracking my order.' 
    },
    { 
      label: 'Ask Fabric Question', 
      icon: Info, 
      text: 'Hello SriKrishna Textiles, I have a question about your saree fabrics.' 
    },
    { 
      label: 'Talk to Support', 
      icon: UserRound, 
      text: 'Hello SriKrishna Textiles, I would like to talk to a support representative.' 
    },
  ];

  const handleSendMessage = (text?: string) => {
    const finalMessage = text || message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setMessage('');
  };

  const handleQuickAction = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[10001] pointer-events-none">
        {/* Floating WhatsApp Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="pointer-events-auto relative group"
            >
              <div className="absolute -top-12 right-0 bg-white dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 dark:border-slate-700">
                Need help? Chat with us!
              </div>
              
              <motion.button
                onClick={() => {
                  setIsOpen(true);
                  setIsMinimized(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: ["0 0 0 0px rgba(37, 211, 102, 0.4)", "0 0 0 15px rgba(37, 211, 102, 0)"]
                }}
                transition={{ 
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                  }
                }}
                className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl transition-transform"
              >
                <MessageCircle size={32} className="text-white fill-white/10" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Chat Popup Window */}
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className={`pointer-events-auto absolute bottom-0 right-0 w-[90vw] sm:w-[380px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col ${mode === 'dark' ? 'bg-[#121212] border border-white/10' : 'bg-white border border-slate-200'}`}
            >
              {/* Header */}
              <div className="bg-[#25D366] p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                      <MessageCircle size={28} className="text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">SriKrishna Support</h3>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <p className="text-[10px] font-medium tracking-wide">We usually reply instantly</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className={`p-5 flex-1 max-h-[400px] overflow-y-auto no-scrollbar space-y-4 ${mode === 'dark' ? 'bg-[#0a0a0a]' : 'bg-slate-50'}`}>
                {/* Welcome Message */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] ${mode === 'dark' ? 'bg-[#1e1e1e] text-slate-200' : 'bg-white text-slate-800'}`}
                >
                  <p className="text-sm leading-relaxed">
                    Hello 👋<br />
                    Welcome to SriKrishna Textiles.<br />
                    How can we help you today?
                  </p>
                </motion.div>

                {/* Quick Actions */}
                <div className="space-y-2 mt-4">
                  <p className={`text-[10px] font-bold uppercase tracking-widest px-1 ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Quick Actions</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickActions.map((action, idx) => (
                      <motion.button
                        key={action.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        onClick={() => handleQuickAction(action.text)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:scale-[1.02] shadow-sm ${
                          mode === 'dark' 
                          ? 'bg-[#1e1e1e] border-white/5 hover:bg-white/5 text-slate-300' 
                          : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                          <action.icon size={16} />
                        </div>
                        <span className="text-xs font-semibold">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer / Input */}
              <div className={`p-4 border-t ${mode === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className={`flex-1 h-11 px-4 rounded-xl text-sm outline-none transition-all ${
                      mode === 'dark'
                      ? 'bg-[#1e1e1e] border-white/10 text-white placeholder:text-slate-600 focus:border-[#25D366]/50'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#25D366]/50'
                    } border`}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim()}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      message.trim()
                      ? 'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-105'
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${mode === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
                    Powered by SriKrishna Support
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Indicator */}
        <AnimatePresence>
          {isOpen && isMinimized && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsMinimized(false)}
              className="pointer-events-auto w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl"
            >
              <div className="relative">
                <MessageCircle size={32} className="text-white fill-white/10" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
