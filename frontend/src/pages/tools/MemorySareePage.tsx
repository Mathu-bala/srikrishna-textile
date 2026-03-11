import { useState } from 'react';
import { Brain, Sparkles, ShoppingBag } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const suggestions: Record<string, { color: string; fabric: string; style: string; emoji: string }[]> = {
    wedding: [
        { color: 'Deep Red', fabric: 'Kanchipuram Silk', style: 'Traditional Bridal', emoji: '💍' },
        { color: 'Golden Yellow', fabric: 'Banarasi Silk', style: 'Royal Ethnic', emoji: '👑' },
    ],
    temple: [
        { color: 'White with Gold Border', fabric: 'Cotton Silk', style: 'Kerala Kasavu', emoji: '🛕' },
        { color: 'Sandalwood', fabric: 'Tussar Silk', style: 'Elegant Traditional', emoji: '🕯️' },
    ],
    beach: [
        { color: 'Sky Blue', fabric: 'Chiffon', style: 'Breezy Casual', emoji: '🌊' },
        { color: 'Coral Pink', fabric: 'Georgette', style: 'Modern Chic', emoji: '☀️' },
    ],
    office: [
        { color: 'Steel Grey', fabric: 'Linen', style: 'Professional Minimalist', emoji: '💼' },
        { color: 'Midnight Blue', fabric: 'Tussar Cotton', style: 'Understated Elegance', emoji: '🖋️' },
    ],
};

const getMatch = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('wedding') || lower.includes('bride') || lower.includes('marriage')) return suggestions.wedding;
    if (lower.includes('temple') || lower.includes('pooja') || lower.includes('puja')) return suggestions.temple;
    if (lower.includes('beach') || lower.includes('vacation') || lower.includes('travel')) return suggestions.beach;
    if (lower.includes('office') || lower.includes('work') || lower.includes('meeting')) return suggestions.office;
    return [
        { color: 'Emerald Green', fabric: 'Soft Silk', style: 'Versatile Classic', emoji: '✨' },
        { color: 'Rose Pink', fabric: 'Georgette', style: 'Feminine Grace', emoji: '🌸' },
    ];
};

const MemorySareePage = () => {
    const [memory, setMemory] = useState('');
    const [results, setResults] = useState<typeof suggestions.wedding | null>(null);

    return (
        <ToolPageLayout
            title="Memory Saree Generator"
            description="Type a memory, event, or situation and our system will suggest matching dress colors, fabrics, and styles inspired by your story."
            icon={<Brain size={26} className="text-purple-500" />}
            accentColor="text-foreground"
        >
            <div className="space-y-8">
                {/* Input */}
                <div className="glass-card p-6 space-y-4">
                    <label className="text-sm font-bold text-foreground/80">Describe your memory or occasion</label>
                    <Input
                        placeholder="e.g. My sister's wedding at Madurai Meenakshi temple..."
                        value={memory}
                        onChange={(e) => setMemory(e.target.value)}
                        className="text-sm"
                    />
                    <Button
                        className="btn-neon w-full"
                        onClick={() => setResults(getMatch(memory))}
                        disabled={!memory.trim()}
                    >
                        <Sparkles size={16} className="mr-2" /> Generate Suggestions
                    </Button>
                </div>

                {/* Results */}
                {results && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">✨ Suggested Matches</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {results.map((r, i) => (
                                <div key={i} className="glass-card p-5 flex flex-col gap-3 border-border/50 hover:border-purple-500/40 transition-all">
                                    <div className="text-3xl">{r.emoji}</div>
                                    <div>
                                        <div className="font-bold text-purple-400">{r.color}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{r.fabric}</div>
                                        <div className="text-xs font-medium text-foreground/70 mt-1">{r.style}</div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-xs self-start gap-1 text-purple-400 hover:text-purple-300 px-0">
                                        <ShoppingBag size={12} /> Shop This Style
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-purple-400">Try keywords like:</span> wedding, temple, beach vacation, office meeting, anniversary, graduation, birthday, festival...
                </div>
            </div>
        </ToolPageLayout>
    );
};

export default MemorySareePage;
