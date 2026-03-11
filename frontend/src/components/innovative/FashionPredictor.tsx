import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Sparkles, Brain } from 'lucide-react';

const trends = [
    { era: 'Next Season', color: 'Peach Fuzz', hex: '#FFBE98', reason: 'Warmth and Comfort' },
    { era: 'Late 2026', color: 'Digital Lavender', hex: '#E6E6FA', reason: 'Calm and optimistic vibe' },
    { era: 'Early 2027', color: 'Galactic Cobalt', hex: '#2E5894', reason: 'Deep spiritual connection' },
];

const FashionPredictor = () => {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="text-primary" />
                    AI Fashion Predictor
                </CardTitle>
                <CardDescription>What will stay in style for the next year?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-xl text-xs flex flex-col items-center text-center gap-2 border border-primary/20">
                    <Sparkles className="text-primary animate-pulse" />
                    <p className="font-medium text-foreground/80">
                        Our AI analysis of global weaving patterns and cultural shifts suggests a return to <strong>Eco-Minimalism</strong> and <strong>Heritage Luxe</strong>.
                    </p>
                </div>

                <div className="space-y-3">
                    {trends.map((t) => (
                        <div key={t.color} className="flex items-center gap-3 p-2 rounded-lg border border-border/50 bg-card/50">
                            <div
                                className="w-12 h-12 rounded-full shadow-inner border border-white/20"
                                style={{ backgroundColor: t.hex }}
                            />
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">{t.era}</div>
                                <div className="text-sm font-bold">{t.color}</div>
                                <div className="text-[11px] text-muted-foreground leading-none mt-0.5">{t.reason}</div>
                            </div>
                            <TrendingUp size={14} className="text-primary opacity-50" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default FashionPredictor;
