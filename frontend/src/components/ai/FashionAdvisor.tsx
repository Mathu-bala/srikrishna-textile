import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, Send, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Msg { role: 'user'|'bot'; text: string; links?: {label:string;href:string}[] }

const TIPS: {q:string; a:string; links?:{label:string;href:string}[]}[] = [
  { q:'Which saree suits short height?', a:'For petite frames, choose sarees with vertical stripes, small all-over prints, and thin borders. Avoid heavy wide borders or large prints. A high bun or side-parted hair elongates the look! Georgette and chiffon drape beautifully on shorter frames.', links:[{label:'Browse Slim Sarees',href:'/products?category=sarees'}] },
  { q:'Best colors for dark skin tone?', a:'Rich jewel tones are your best friend! Royal Blue, Deep Purple, Magenta, Mustard, Forest Green, and Gold look absolutely stunning on darker skin. Avoid pale pastels that can wash you out. Bold colours will make you pop!' },
  { q:'What fabric is good for summer?', a:'Cotton, Linen, Chiffon, and Lawn are perfect for summer. They breathe well, absorb sweat, and keep you cool. Handloom cotton sarees are both stylish and practical for the heat.' },
  { q:'How to choose the right blouse?', a:'Match blouse fabric to your saree — silk saree = silk blouse. Choose contrast colours for drama or matching tones for elegance. Padded blouses give good shape. For heavy sarees, wear a lighter blouse to balance the weight.' },
  { q:'Silk saree care tips?', a:'Always dry clean your silk sarees. Never wring or machine wash. Air dry in shade. Store folded in clean cotton cloth — never plastic. Keep neem leaves or naphthalene balls nearby to avoid insects. Avoid direct sunlight.' },
  { q:'Best saree for office?', a:'Choose solid-coloured sarees in muted tones — navy, grey, teal, or maroon. Cotton and linen work great. Keep it neatly pleated with a simple, professional blouse. Minimal jewellery and a classic hairstyle completes the look.' },
  { q:'How to lose weight in saree?', a:'Dark vertical stripes, narrow borders, and full-length blouses create a slimming silhouette. Avoid horizontal prints or wide borders. A tucked-in pleating style with a small pallu makes you look leaner. Georgette and crepe drape slim beautifully.' },
  { q:'Wedding guest outfit ideas?', a:'A silk or georgette saree in jewel tones works perfectly for a wedding. Also consider a designer kurti with palazzo or a lehenga. Avoid white or red (reserved for brides in many traditions). Opt for subtle heavy jewellery to complement the look.' },
];

function getAnswer(input: string): {text:string; links?:{label:string;href:string}[]} {
  const q = input.toLowerCase();
  for (const tip of TIPS) {
    const words = tip.q.toLowerCase().split(' ');
    if (words.filter(w => w.length > 3).some(w => q.includes(w))) {
      return { text: tip.a, links: tip.links };
    }
  }
  if (q.includes('kurti') || q.includes('kurta')) return { text: 'For kurtis, A-line or Anarkali cuts suit all body types. Printed kurtis look great casual, while embroidered ones suit festival and semi-formal occasions.', links:[{label:'Browse Kurtis',href:'/products?category=kurtis'}] };
  if (q.includes('jewel') || q.includes('accessory')) return { text: 'For silk sarees, choose gold temple jewellery. For georgette, Kundan or Polki works beautifully. Match metal tone with your saree — gold with warm tones, silver with cool or pastel sarees.' };
  if (q.includes('saree')) return { text: 'I can help you choose the right saree! Ask me about fabric, occasion, body type, colour, or care tips.' };
  return { text: 'Great fashion question! Try asking me about:\n• "Which saree suits short height?"\n• "Best colors for dark skin?"\n• "Summer fabric recommendations"\n• "How to care for silk sarees?"' };
}

export default function FashionAdvisor() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: '👗 Hi! I am your AI Fashion Advisor. Ask me anything about sarees, styles, body types, colours, or fabrics — in English or Tamil!' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: 'user', text: input };
    setMsgs(p => [...p, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 600));
    const res = getAnswer(userMsg.text);
    setMsgs(p => [...p, { role: 'bot', text: res.text, links: res.links }]);
    setTyping(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-1.5 mb-4">
              <Brain size={14} className="text-violet-400" />
              <span className="text-sm font-semibold text-violet-300">AI Fashion Advisor</span>
            </div>
            <h1 className="font-display text-3xl font-black mb-2">Your Personal <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Style Expert</span></h1>
            <p className="text-muted-foreground text-sm">Ask anything about sarees, colours, body types, fabrics, and styling</p>
          </div>

          {/* Quick tips */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {TIPS.slice(0,4).map(t => (
              <button key={t.q} onClick={() => setInput(t.q)}
                className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-muted-foreground hover:text-foreground hover:border-violet-500/40 transition-colors">
                {t.q}
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="h-[420px] overflow-y-auto p-4 space-y-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'bot' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mr-2 mt-1 shrink-0"><Bot size={14} className="text-white" /></div>}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${m.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-purple-800 text-white rounded-tr-sm'
                    : 'bg-white/10 border border-white/10 text-white/90 rounded-tl-sm'
                  }`}>
                    {m.text}
                    {m.links && <div className="mt-2 flex flex-wrap gap-1">{m.links.map((l,j) => <Link key={j} to={l.href} className="text-[11px] bg-violet-500/30 text-violet-200 px-2 py-1 rounded-lg hover:bg-violet-500/50 transition-colors">{l.label}</Link>)}</div>}
                  </div>
                </div>
              ))}
              {typing && <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Bot size={14} className="text-white" /></div><div className="px-4 py-3 bg-white/10 rounded-2xl rounded-tl-sm flex gap-1">{[0,1,2].map(i=><motion.div key={i} className="w-2 h-2 bg-violet-400 rounded-full" animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:0.8,delay:i*0.15}} />)}</div></div>}
            </div>
            <div className="flex gap-2 p-4 border-t border-white/10">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder="Ask about styles, colours, fabrics..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-violet-500 transition-colors" />
              <button onClick={send} className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center hover:opacity-90 transition-opacity">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
