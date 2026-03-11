import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/919786632306?text=Hello%20SriKrishna%20Premium%20Fashion%20I%20would%20like%20to%20know%20more%20about%20your%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-[#25D366] text-white p-3 lg:p-4 rounded-full font-bold no-underline shadow-[0_4px_10px_rgba(37,211,102,0.4)] hover:shadow-[0_0_20px_rgba(37,211,102,0.8)] transition-all duration-300 z-[999] hover:scale-110 flex items-center justify-center gap-2 group"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out md:hidden lg:inline-flex">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
