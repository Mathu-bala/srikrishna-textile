import { useState } from 'react';
import { Clock, SkipBack, SkipForward, ShoppingBag } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Button } from '@/components/ui/button';

const eras = [
    {
        decade: '1970s',
        theme: 'The Self-Expression Era',
        palette: ['#8B0000', '#2F4F4F', '#8B8682'],
        description: "Bold, unapologetic handloom cotton and silk combinations. Block prints from Rajasthan, earthy batik, and mirror-work skirts paired with zari sarees defined the decade. Heavily influenced by the independence movement's romanticization of village crafts.",
        keywords: ['Block Print', 'Batik', 'Kalamkari', 'Natural Dye'],
    },
    {
        decade: '1980s',
        theme: 'Traditional Grandeur',
        palette: ['#8B0000', '#006400', '#DAA520'],
        description: 'Heavy gold borders, vibrant reds and greens, Kanchipuram silks dominated weddings across South India. The 1980s were the golden age of the "grand saree" — maximum ornamentation, silk from head to toe.',
        keywords: ['Kanchipuram Silk', 'Gold Zari', 'Temple Border', 'Silk Blouse'],
    },
    {
        decade: '1990s',
        theme: 'Bollywood Influence',
        palette: ['#FFB6C1', '#C0C0C0', '#87CEEB'],
        description: 'Lighter fabrics took over — chiffon and georgette sarees in floral prints with silver zari became the wedding guest staple. Bollywood stars wore these in iconic films, and India took note. Pastel shades became acceptable in traditionally bold ceremony culture.',
        keywords: ['Chiffon', 'Georgette', 'Floral Print', 'Silver Zari'],
    },
    {
        decade: '2000s',
        theme: 'The Fusion & Glam Era',
        palette: ['#E0115F', '#9B30FF', '#191970'],
        description: 'Sequins, stonework, cut-work borders, and velvet patches arrived on the scene. Net sarees and designer lehengas with heavy embellishments became the new "modern-traditional." Indo-western fusion opened the door to stoles, jacket-sarees, and dhoti drapes.',
        keywords: ['Stonework', 'Net Saree', 'Lehenga', 'Indo-Western'],
    },
    {
        decade: '2010s',
        theme: 'The Handloom Revival',
        palette: ['#F5F0E8', '#708090', '#556B2F'],
        description: 'A powerful backlash against synthetic fabrics sparked the handloom revival movement. Organic cotton sarees, linen blended weaves, and minimal Ikat patterns became fashionable again. Artisan crafts received a premium tag — and rightfully so.',
        keywords: ['Organic Cotton', 'Linen', 'Ikat', 'Minimal Weave'],
    },
];

const TimeTravelPage = () => {
    const [idx, setIdx] = useState(1); // Default to 1980s
    const era = eras[idx];

    return (
        <ToolPageLayout
            title="Time Travel Fashion Mode"
            description="Take a journey through India's textile evolution decade by decade. Explore the aesthetics, fabrics, and cultural mood of each era."
            icon={<Clock size={26} className="text-violet-500" />}
            accentColor="text-foreground"
        >
            <div className="space-y-6">
                {/* Decade Selector */}
                <div className="flex items-center justify-between glass-card p-4 border-border/50">
                    <Button variant="ghost" size="icon" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
                        <SkipBack size={20} />
                    </Button>
                    <div className="text-center">
                        <div className="text-4xl font-black text-violet-500">{era.decade}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{era.theme}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIdx(Math.min(eras.length - 1, idx + 1))} disabled={idx === eras.length - 1}>
                        <SkipForward size={20} />
                    </Button>
                </div>

                {/* Palette */}
                <div className="flex gap-3 animate-fade-in">
                    {era.palette.map((c, i) => (
                        <div key={i} className="flex-1 h-14 rounded-xl shadow-inner border border-white/10" style={{ backgroundColor: c }} />
                    ))}
                </div>

                {/* Description */}
                <div className="glass-card p-6 border-violet-500/20 bg-violet-500/5 animate-fade-in">
                    <p className="text-sm text-foreground/80 leading-relaxed">{era.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 animate-fade-in">
                    {era.keywords.map((k) => (
                        <span key={k} className="px-3 py-1 rounded-full text-[11px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            {k}
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    {idx > 0 && <Button variant="outline" onClick={() => setIdx(idx - 1)} className="flex-1 border-border/50">← {eras[idx - 1].decade}</Button>}
                    <Button className="btn-neon flex-1 gap-2"><ShoppingBag size={14} /> Shop {era.decade} Style</Button>
                    {idx < eras.length - 1 && <Button variant="outline" onClick={() => setIdx(idx + 1)} className="flex-1 border-border/50">{eras[idx + 1].decade} →</Button>}
                </div>
            </div>
        </ToolPageLayout>
    );
};

export default TimeTravelPage;
