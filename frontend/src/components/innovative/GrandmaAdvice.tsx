import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Info, Droplets, Scissors, Ruler, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const tips = [
    {
        id: 'wash',
        title: 'How to wash Silk?',
        icon: <Droplets className="w-4 h-4 text-secondary" />,
        content: 'Always dry clean your expensive silks. For light silks, use cold water and a mild detergent. Never wring or twist. Roll in a towel to remove excess water and dry in shade.'
    },
    {
        id: 'colors',
        title: 'Matching Colors',
        icon: <Sparkles className="w-4 h-4 text-accent" />,
        content: 'Contrast is king! A maroon saree pairs beautifully with a bottle green blouse. Pastels work best for morning functions, while jewel tones (rubies, sapphires) shine at night.'
    },
    {
        id: 'draping',
        title: 'Effortless Draping',
        icon: <Ruler className="w-4 h-4 text-primary" />,
        content: 'The secret is in the pleats. Use a large safety pin for the shoulder and tiny ones for the pleats from inside. For a taller look, keep the pallu length reaching below your knees.'
    },
    {
        id: 'storage',
        title: 'Fabric Care & Storage',
        icon: <Heart className="w-4 h-4 text-red-400" />,
        content: 'Never store silk with naphthalene balls. Use cotton bags or muslin cloth. Re-fold your sarees every 3 months to prevent the gold zari from cracking at the creases.'
    }
];

const GrandmaAdvice = () => {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="text-secondary" />
                    Grandma's Textile Tips
                </CardTitle>
                <CardDescription>Traditional wisdom for modern wardrobes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-4 flex items-start gap-3 italic text-sm">
                    <span className="text-3xl">👵</span>
                    <span>"Dear child, a saree is not just a dress; it is a canvas of memories. Treat it with the love it deserves!"</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {tips.map((tip) => (
                        <AccordionItem key={tip.id} value={tip.id} className="border-border/50">
                            <AccordionTrigger className="hover:no-underline hover:text-secondary group">
                                <div className="flex items-center gap-3 text-left">
                                    {tip.icon}
                                    <span className="text-sm font-medium">{tip.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground leading-relaxed pl-7">
                                {tip.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default GrandmaAdvice;
