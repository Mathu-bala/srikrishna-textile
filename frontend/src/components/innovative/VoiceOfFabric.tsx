import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Mic, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fabrics = [
    { name: 'Pure Silk', description: 'This fabric is highly breathable and keeps you warm in winter while staying cool in summer. It has a natural shimmer that reflects light beautifully.' },
    { name: 'Organic Cotton', description: 'Grown without pesticides, this cotton is incredibly soft on the skin. It is the most comfortable choice for long day-wear in tropical climates.' },
    { name: 'Khadi', description: 'Hand-spun and hand-woven, Khadi has a unique rugged texture. It represents India\'s spirit of self-reliance and offers amazing durability.' }
];

const VoiceOfFabric = () => {
    const [isPlaying, setIsPlaying] = useState<number | null>(null);

    const speak = (text: string, index: number) => {
        if (isPlaying === index) {
            window.speechSynthesis.cancel();
            setIsPlaying(null);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(null);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(index);
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Volume2 className="text-secondary" />
                    Voice of Fabric
                </CardTitle>
                <CardDescription>Listen to the characteristics of different textures.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {fabrics.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 group">
                        <div className="flex-1">
                            <div className="text-sm font-bold">{f.name}</div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all">
                                {f.description}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`ml-2 shrink-0 ${isPlaying === i ? 'text-secondary animate-pulse' : 'text-muted-foreground'}`}
                            onClick={() => speak(f.description, i)}
                        >
                            {isPlaying === i ? <Pause size={18} /> : <Play size={18} />}
                        </Button>
                    </div>
                ))}
                <div className="text-[10px] text-center text-muted-foreground italic mt-2">
                    Click to hear the fabric's story.
                </div>
            </CardContent>
        </Card>
    );
};

export default VoiceOfFabric;
