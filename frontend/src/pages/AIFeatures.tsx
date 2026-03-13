import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';
import {
  Sparkles, ShoppingBag, Palette, Scissors, Heart, Brain,
  BookOpen, Map, TrendingUp, Camera, Ruler, Shirt, LayoutGrid,
  Search, MessageCircle, Calendar, Star, Wand2
} from 'lucide-react';

const tools = [
  {
    id: 'try-on',
    title: 'AI Virtual Try-On',
    desc: 'Upload a photo or use your camera to see how sarees and kurtis look on you with 360° preview and color changes.',
    icon: Camera,
    color: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
    href: '/ai/try-on',
    badge: 'Preview-360',
  },
  {
    id: 'color-matcher',
    title: 'AI Color Matching Stylist',
    desc: 'Matching expert: Suggests perfect sarees (Gold, Cream, Beige) to pair with your favorite blouse colors.',
    icon: Palette,
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6,182,212,0.3)',
    href: '/ai/color-matcher',
    badge: 'Popular',
  },
  {
    id: 'visual-search',
    title: 'AI Visual Dress Search',
    desc: 'The Amazon-style search for SriKrishna. Upload any dress photo to find similar products in our inventory instantly.',
    icon: Search,
    color: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.3)',
    href: '/ai/visual-search',
  },
  {
    id: 'outfit-planner',
    title: 'AI Occasion Outfit Planner',
    desc: 'Wedding or Party? Select your event and get a full plan from traditional silk sarees to matching accessories.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.3)',
    href: '/ai/outfit-planner',
    badge: 'Trending',
  },
  {
    id: 'fabric-knowledge',
    title: 'AI Fabric Advisor',
    desc: 'Expert guidance on fabrics: "Best for Summer?" (Cotton/Linen) or "Best for Grandeur?" (Pure Silk).',
    icon: BookOpen,
    color: 'from-teal-500 to-cyan-600',
    glow: 'rgba(20,184,166,0.3)',
    href: '/ai/fabric-knowledge',
  },
  {
    id: 'size-detector',
    title: 'AI Body Size Detector',
    desc: 'Advanced neural scanning detects shoulder width, chest, and waist to recommend your perfect Fit (S/M/L/XL).',
    icon: Ruler,
    color: 'from-blue-500 to-indigo-600',
    glow: 'rgba(59,130,246,0.3)',
    href: '/ai/size-guide',
  },
  {
    id: 'tailors',
    title: 'AI Tailor Finder',
    desc: 'Direct link to nearby Sivakasi experts like Sri Devi Tailors and Lakshmi Boutique with Maps integration.',
    icon: Map,
    color: 'from-red-500 to-orange-600',
    glow: 'rgba(239,68,68,0.3)',
    href: '/ai/tailors',
    badge: 'Sivakasi Live',
  },
  {
    id: 'festival-generator',
    title: 'AI festival-looks Selector',
    desc: 'Exclusive traditional picks for Diwali (Silk), Pongal (Cotton), and other major festive milestones.',
    icon: Calendar,
    color: 'from-orange-500 to-red-600',
    glow: 'rgba(249,115,22,0.3)',
    href: '/ai/festival-looks',
  },
  {
    id: 'trend-predictor',
    title: '🧠 AI Trend Predictor',
    desc: 'Deep analytics on customer search and sales data to show you 🔥 Trending Sarees and Popular Styles.',
    icon: TrendingUp,
    color: 'from-indigo-600 to-violet-700',
    glow: 'rgba(79,70,229,0.3)',
    href: '/ai/trending',
    badge: 'BETA',
  },
  {
    id: 'chat-assistant',
    title: 'AI Fashion Chat Assistant',
    desc: 'Your personal 24/7 stylist for real-time help with weddings, bridal sarees, and lehenga selection.',
    icon: MessageCircle,
    color: 'from-violet-500 to-indigo-600',
    glow: 'rgba(139,92,246,0.3)',
    href: '/ai-features',
  },
  {
    id: 'bridal-planner',
    title: 'Elite Bridal Planner',
    desc: 'Exclusive system for bride/groom outfit planning from Engagement to Reception.',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.3)',
    href: '/ai/bridal-planner',
    badge: 'VIP',
  },
  {
    id: 'saree-designer',
    title: 'Custom Fabric Designer',
    desc: 'Design your own custom patterns and fabric styles using our generative AI textile engine.',
    icon: Scissors,
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
    href: '/ai/saree-designer',
    badge: 'NEW',
  },
];

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: (i: any) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function AIFeatures() {
  const { mode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${mode === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}>
      <Header />
      <main className="flex-grow pt-12 pb-32 overflow-hidden">
        
        {/* Background Accents */}
        <div className="fixed inset-0 pointer-events-none">
           <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-20 ${mode === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
           <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-20 ${mode === 'dark' ? 'bg-purple-600' : 'bg-purple-400'}`} />
        </div>

        {/* Hero Section */}
        <section className="relative px-4 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 shadow-2xl transition-all ${mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-100'}`}>
                <Sparkles size={16} className="text-indigo-500" />
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${mode === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>Intelligence Met Textiles</span>
              </div>
              <h1 className={`text-4xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Neural <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent italic">Fashion</span> Hub
              </h1>
              <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl leading-relaxed mb-10">
                Explore a next-generation suite of AI tools designed to personalize your styling, matching, and shopping experience across the SriKrishna ecosystem.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                 {['Neural Matching', 'Visual Search', 'Tailor Sync', 'Fabric Expert'].map(f => (
                   <div key={f} className={`px-6 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest ${mode === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-xl shadow-slate-200/50'}`}>
                      {f}
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              
              return (
                <motion.div
                  key={tool.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                 // variants={cardVariants}
                >
                  <Link to={tool.href} className="group block h-full">
                    <div className={`h-full relative rounded-[2.5rem] border p-8 transition-all duration-500 flex flex-col
                      hover:scale-[1.03] group-hover:shadow-[0_20px_80px_-20px_rgba(79,70,229,0.3)]
                      ${mode === 'dark' ? 'bg-[#0c0c0c] border-white/5 hover:border-white/10' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-2xl shadow-slate-200/50'}`}
                    >
                      {/* Glow Effect (Dark Mode) */}
                      {mode === 'dark' && (
                        <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" 
                             style={{ background: `radial-gradient(circle at center, ${tool.glow}, transparent)` }} />
                      )}

                      {/* Badge */}
                      {tool.badge && (
                        <span className={`absolute top-6 right-6 text-[8px] font-black px-3 py-1 rounded-full bg-gradient-to-r ${tool.color} text-white uppercase tracking-widest shadow-xl`}>
                          {tool.badge}
                        </span>
                      )}

                      {/* Content Header */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-10 shadow-lg group-hover:rotate-[10deg] transition-all duration-500`}>
                        <Icon size={24} className="text-white" />
                      </div>

                      {/* Content */}
                      <h3 className={`font-black text-xl uppercase tracking-tight mb-4 transition-colors leading-none ${mode === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                        {tool.title}
                      </h3>
                      <p className={`text-sm leading-relaxed font-bold transition-colors ${mode === 'dark' ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-600'}`}>
                        {tool.desc}
                      </p>

                      <div className="flex-grow" />

                      {/* Action */}
                      <div className="mt-10 flex flex-col gap-4">
                         <div className="flex items-center gap-3">
                            <div className={`h-[1px] flex-1 ${mode === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${tool.color} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-2`}>
                                Launch App
                            </span>
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Feature Highlights Grid Shortcut (Theme Demo) */}
        <section className="max-w-7xl mx-auto px-4 mt-32">
           <div className={`rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden ${mode === 'dark' ? 'bg-indigo-600/10 border border-white/5' : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200'}`}>
               <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 md:mb-8 leading-tight tracking-tighter">Ready for a smart <br className="hidden sm:block"/> makeover?</h2>
                  <p className={`max-w-xl mx-auto mb-8 md:mb-10 text-base md:text-lg font-bold ${mode === 'dark' ? 'text-indigo-300' : 'text-indigo-100'}`}>
                    Use our AI chatbot to navigate these tools seamlessly via voice or text commands.
                  </p>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all hover:scale-105 active:scale-95 ${mode === 'dark' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-2xl'}`}>
                     Get Started Now
                  </button>
               </div>
               
               {mode === 'light' && (
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
               )}
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
