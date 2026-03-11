import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, CheckCircle2, ShoppingBag, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const combinations: Record<string, any> = {
    'Red': { groom: 'Cream / Off-White', accessory: 'Maroon Turban', vibe: 'Traditional Vows' },
    'Green': { groom: 'Golden Yellow', accessory: 'Emerald Brooch', vibe: 'Nature Harmony' },
    'Pink': { groom: 'Grey / Navy Blue', accessory: 'Pink Pocket Square', vibe: 'Modern Romance' },
    'Yellow': { groom: 'White / Pale Blue', accessory: 'Orange Stole', vibe: 'Spring Celebration' }
};

const WeddingHarmonyChecker = () => {
    const [brideColor, setBrideColor] = useState<string | null>(null);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="text-red-500" />
                    Wedding Color Harmony
                </CardTitle>
                <CardDescription>Match the groom's attire with the bride's saree for the perfect photo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {Object.keys(combinations).map(color => (
                        <button
                            key={color}
                            onClick={() => setBrideColor(color)}
                            className={`h-10 rounded-lg border-2 transition-all ${brideColor === color ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent'}`}
                            style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                            title={color}
                        />
                    ))}
                </div>

                {!brideColor ? (
                    <div className="border-2 border-dashed border-border/50 rounded-xl py-10 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/20">
                        <Upload size={24} className="opacity-50" />
                        <div className="text-[10px] uppercase font-bold tracking-widest">Select Bride's Color</div>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-primary flex items-center gap-2">
                                <Sparkles size={14} /> Harmony Suggestion
                            </div>
                            <div className="text-[10px] font-medium bg-primary/10 px-2 py-0.5 rounded-full">{combinations[brideColor].vibe}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Groom Base</div>
                                <div className="text-sm font-bold">{combinations[brideColor].groom}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Accessory</div>
                                <div className="text-sm font-bold">{combinations[brideColor].accessory}</div>
                            </div>
                        </div>

                        <Button className="w-full btn-neon h-8 text-[11px] py-0" onClick={() => window.open('/#products')}>
                            <ShoppingBag size={14} className="mr-2" /> Shop Groom Collection
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WeddingHarmonyChecker;
