import { useState } from 'react';
import { Smile, ShoppingBag, Sparkles, Zap, Star } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const moods = [
    {
        name: 'Simple',
        emoji: '😊',
        range: '₹500 – ₹2,000',
        color: 'border-blue-500 bg-blue-500/10 text-blue-500',
        inactiveColor: 'border-border/50 bg-transparent text-muted-foreground',
        description: 'Everyday cottons and light fabrics for simple, comfortable wear.',
        tags: ['Cotton Saree', 'Daily Wear Kurti', 'Simple Churidar'],
    },
    {
        name: 'Casual',
        emoji: '😎',
        range: '₹1,000 – ₹5,000',
        color: 'border-green-500 bg-green-500/10 text-green-500',
        inactiveColor: 'border-border/50 bg-transparent text-muted-foreground',
        description: 'Casual occasion wear — perfect for outings, casual functions, and day parties.',
        tags: ['Georgette Kurti', 'Printed Saree', 'Casual Lehenga'],
    },
    {
        name: 'Royal',
        emoji: '👑',
        range: '₹8,000 – ₹35,000',
        color: 'border-amber-500 bg-amber-500/10 text-amber-500',
        inactiveColor: 'border-border/50 bg-transparent text-muted-foreground',
        description: 'Premium silks and designer pieces for weddings and high-end gatherings.',
        tags: ['Kanchipuram Silk', 'Banarasi Silk', 'Designer Lehenga'],
    },
    {
        name: 'Grand',
        emoji: '✨',
        range: '₹35,000+',
        color: 'border-primary bg-primary/10 text-primary',
        inactiveColor: 'border-border/50 bg-transparent text-muted-foreground',
        description: 'Bridal-level opulence. The rarest silks, heaviest zari, and finest craftsmanship.',
        tags: ['Bridal Silk', 'Royal Patola', 'Couture Lehenga'],
    },
];

const EmotionPricePage = () => {
    const [selected, setSelected] = useState(0);
    const mood = moods[selected];

    return (
        <ToolPageLayout
            title="Emotion Price Slider"
            description="How are you feeling today? Choose your mood and we'll filter the perfect collection within the matching price range."
            icon={<Smile size={26} className="text-pink-500" />}
            accentColor="text-foreground"
        >
            <div className="space-y-6">
                {/* Mood Selector */}
                <div className="grid grid-cols-4 gap-2">
                    {moods.map((m, i) => (
                        <button
                            key={m.name}
                            onClick={() => setSelected(i)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${i === selected ? m.color : m.inactiveColor} hover:scale-105`}
                        >
                            <span className="text-2xl">{m.emoji}</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{m.name}</span>
                        </button>
                    ))}
                </div>

                {/* Slider */}
                <div className="glass-card p-5 border-border/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price Intensity</span>
                        <span className="text-sm font-black text-primary">{mood.range}</span>
                    </div>
                    <Slider defaultValue={[selected]} max={3} step={1} onValueChange={(v) => setSelected(v[0])} />
                </div>

                {/* Mood Detail */}
                <div className="glass-card p-6 space-y-4 border-border/50 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{mood.emoji}</span>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Your Vibe</div>
                            <div className="text-lg font-black">{mood.name} Mode</div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{mood.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {mood.tags.map((t) => (
                            <span key={t} className="text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                                {t}
                            </span>
                        ))}
                    </div>
                    <Button className="btn-neon w-full gap-2">
                        <ShoppingBag size={16} /> Browse {mood.name} Collection
                    </Button>
                </div>
            </div>
        </ToolPageLayout>
    );
};

export default EmotionPricePage;
