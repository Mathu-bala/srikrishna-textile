import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

const eras = [
    { decade: '1980s', theme: 'Traditional Grandeur', description: 'Heavy gold borders, bright reds and greens, traditional temple motifs dominated the weddings.' },
    { decade: '1990s', theme: 'Bollywood Influence', description: 'Lightweight fabrics, floral prints, and the rise of pastel georgette sarees with silver zari.' },
    { decade: '2000s', theme: 'The Fusion Era', description: 'Introduction of stonework, sequins, and designer borders. Net and velvet fabrics became experimental.' },
    { decade: '2010s', theme: 'Handloom Revival', description: 'A return to organic cottons, linen sarees, and minimalist elegant weaving patterns.' }
];

const TimeTravelFashion = () => {
    const [currentEra, setCurrentEra] = useState(0);

    const nextEra = () => setCurrentEra((prev) => (prev + 1) % eras.length);
    const prevEra = () => setCurrentEra((prev) => (prev - 1 + eras.length) % eras.length);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="text-accent" />
                    Time Travel Fashion
                </CardTitle>
                <CardDescription>Walk through the decades of textile evolution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <Button variant="ghost" size="icon" onClick={prevEra}><SkipBack size={18} /></Button>
                    <div className="text-center">
                        <div className="text-2xl font-black text-accent">{eras[currentEra].decade}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{eras[currentEra].theme}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextEra}><SkipForward size={18} /></Button>
                </div>

                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 text-xs leading-relaxed text-foreground/80 min-h-[80px]">
                    {eras[currentEra].description}
                </div>

                <Button className="w-full bg-accent hover:bg-accent/80 text-white font-bold" onClick={() => window.open('/#products')}>
                    Shop This Decade
                </Button>
            </CardContent>
        </Card>
    );
};

export default TimeTravelFashion;
