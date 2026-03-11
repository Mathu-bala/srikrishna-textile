import { TrendingUp, Sparkles } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';

const predictions = [
    {
        period: 'March – June 2026',
        theme: 'Eco Minimalism',
        colors: [
            { name: 'Sand Dune', hex: '#C2A688', mood: 'Calm, grounded, timeless' },
            { name: 'Sage Mist', hex: '#9CAF88', mood: 'Nature-forward, serene' },
            { name: 'Linen White', hex: '#F5F0E8', mood: 'Clean, pure, zero-waste conscious' },
        ],
        fabric: 'Organic cotton, undyed khadi, natural linen',
        insight: 'Consumers are returning to earthy basics after years of maximalism. Minimal embellishment, natural dyes, and handspun textures will dominate.',
    },
    {
        period: 'July – Oct 2026',
        theme: 'Heritage Luxe',
        colors: [
            { name: 'Imperial Maroon', hex: '#800020', mood: 'Regal, ceremonial, powerful' },
            { name: 'Deep Teal', hex: '#008080', mood: 'Wisdom, tradition, depth' },
            { name: 'Gold Leaf', hex: '#DAA520', mood: 'Festive, celebratory, divine' },
        ],
        fabric: 'Kanchipuram silk, Banarasi zari, Chanderi silk',
        insight: 'Festival season drives demand for deeply traditional, richly embellished textiles. Heritage weaves with gold borders are set for a massive revival.',
    },
    {
        period: 'Nov 2026 – Jan 2027',
        theme: 'Digital Pastels',
        colors: [
            { name: 'Digital Lavender', hex: '#E6E6FA', mood: 'Tech-inspired, soft, futuristic' },
            { name: 'Powder Blue', hex: '#B0C4DE', mood: 'Airy, creative, modern' },
            { name: 'Blush Peach', hex: '#FFBE98', mood: 'Warm, youthful, optimistic' },
        ],
        fabric: 'Georgette, organza, digital print silks',
        insight: 'The new generation merges digital aesthetics with traditional forms. Expect pastel digital prints on classic silhouettes — fusion at its finest.',
    },
];

const FashionPredictorPage = () => (
    <ToolPageLayout
        title="Future Fashion Predictor"
        description="Explore upcoming color and textile trends based on cultural shifts, global runway data, and traditional festival cycles for 2026–2027."
        icon={<TrendingUp size={26} className="text-blue-500" />}
        accentColor="text-foreground"
    >
        <div className="space-y-8">
            {predictions.map((p, i) => (
                <div key={i} className="space-y-4 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-blue-500" />
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{p.period}</div>
                            <div className="text-lg font-black">{p.theme}</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {p.colors.map((c) => (
                            <div key={c.name} className="flex-1 space-y-2">
                                <div className="h-16 rounded-xl shadow-inner border border-white/10" style={{ backgroundColor: c.hex }} />
                                <div className="text-[10px] font-bold">{c.name}</div>
                                <div className="text-[9px] text-muted-foreground leading-tight">{c.mood}</div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-4 border-border/50 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trending Fabrics</div>
                        <div className="text-xs font-medium">{p.fabric}</div>
                        <div className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/50 pt-2 italic">{p.insight}</div>
                    </div>
                </div>
            ))}
        </div>
    </ToolPageLayout>
);

export default FashionPredictorPage;
