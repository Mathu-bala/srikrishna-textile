import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, SlidersHorizontal, Heart, Star, Sparkles, Zap } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';

const moods = [
    { name: 'Simple', color: 'text-blue-400', range: [500, 2000], icon: <Smile size={20} /> },
    { name: 'Casual', color: 'text-green-400', range: [1000, 5000], icon: <Zap size={20} /> },
    { name: 'Royal', color: 'text-amber-400', range: [8000, 35000], icon: <Star size={20} /> },
    { name: 'Grand', color: 'text-primary', range: [35000, 100000], icon: <Sparkles size={20} /> },
];

const EmotionPriceSlider = () => {
    const [moodIndex, setMoodIndex] = useState(0);

    const currentMood = moods[moodIndex];

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="text-red-500" />
                    Emotion Price Slider
                </CardTitle>
                <CardDescription>How are you feeling today? Choose your mood.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    {moods.map((m, i) => (
                        <button
                            key={m.name}
                            onClick={() => setMoodIndex(i)}
                            className={`flex flex-col items-center gap-1 transition-all ${moodIndex === i ? m.color + ' scale-110' : 'text-muted-foreground opacity-50'}`}
                        >
                            {m.icon}
                            <span className="text-[10px] font-bold uppercase">{m.name}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-muted-foreground">Price Intensity</span>
                        <span className={`text-lg font-bold ${currentMood.color}`}>
                            ₹{currentMood.range[0].toLocaleString()} - ₹{currentMood.range[1].toLocaleString()}+
                        </span>
                    </div>
                    <Slider
                        defaultValue={[moodIndex]}
                        max={3}
                        step={1}
                        onValueChange={(val) => setMoodIndex(val[0])}
                        className="cursor-pointer"
                    />
                </div>

                <Button className="w-full btn-neon">
                    See {currentMood.name} Collection
                </Button>
            </CardContent>
        </Card>
    );
};

export default EmotionPriceSlider;
