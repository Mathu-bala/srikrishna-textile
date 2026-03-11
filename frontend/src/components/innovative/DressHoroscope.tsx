import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Star, Sun, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const horoscopes: Record<string, any> = {
    aries: { color: 'Red', fabric: 'Raw Silk', trait: 'Confidence & Power' },
    taurus: { color: 'Lotus Pink', fabric: 'Cotton Silk', trait: 'Comfort & Luxury' },
    gemini: { color: 'Golden Yellow', fabric: 'Chiffon', trait: 'Vibrancy & Charm' },
    cancer: { color: 'Silver White', fabric: 'Soft Silk', trait: 'Purity & Calm' },
    leo: { color: 'Deep Gold', fabric: 'Kanchipuram Silk', trait: 'Royalty & Boldness' },
    virgo: { color: 'Emerald Green', fabric: 'Linen', trait: 'Grace & Precision' },
    libra: { color: 'Sky Blue', fabric: 'Georgette', trait: 'Balance & Beauty' },
    scorpio: { color: 'Maroon', fabric: 'Velvet', trait: 'Intensity & Mystery' },
    sagittarius: { color: 'Purple', fabric: 'Banarasi Silk', trait: 'Wisdom & Adventure' },
    capricorn: { color: 'Navy Blue', fabric: 'Tussar Silk', trait: 'Stability & Elegance' },
    aquarius: { color: 'Electric Blue', fabric: 'Organza', trait: 'Uniqueness & Vision' },
    pisces: { color: 'Sea Green', fabric: 'Mulberry Silk', trait: 'Dreaminess & Spirit' },
};

const DressHoroscope = () => {
    const [sign, setSign] = useState('');
    const [result, setResult] = useState<any>(null);

    const getLuck = () => {
        if (sign) setResult(horoscopes[sign]);
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Moon className="text-primary" />
                    Dress Horoscope
                </CardTitle>
                <CardDescription>Align your destiny with your attire.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Select onValueChange={setSign}>
                        <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select your Star / Rasi" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(horoscopes).map(k => (
                                <SelectItem key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={getLuck} className="btn-neon"><Star size={18} /></Button>
                </div>

                {result && (
                    <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 animate-fade-in text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={40} /></div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Lucky Recommendation</div>
                        <div className="text-lg font-bold flex items-center justify-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: result.color.toLowerCase().includes('gold') ? '#FFD700' : result.color.toLowerCase().split(' ')[0] }}></span>
                            {result.color} {result.fabric}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            "This combination enhances your {result.trait} today."
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DressHoroscope;
