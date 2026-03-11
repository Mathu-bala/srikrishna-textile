import { Heart, Droplets, Sparkles, Ruler, Info } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const tips = [
    {
        id: 'wash',
        title: '🧼 How to Wash Silk Sarees',
        content: [
            'Always dry clean expensive Kanchipuram and Banarasi silks.',
            'For lighter silks, use cold water with a mild, pH-neutral detergent.',
            'Never wring or twist — roll in a dry towel to absorb excess water.',
            'Dry in shade, never in direct sunlight which fades the colour.',
        ],
    },
    {
        id: 'colors',
        title: '🎨 How to Match Colors',
        content: [
            'Contrast is key: maroon saree + bottle green blouse = timeless elegance.',
            'Pastels and lighter shades suit morning/daytime events best.',
            'Rich jewel tones (ruby, sapphire, emerald) shine at evening functions.',
            'For gold zari, avoid bright colors — let the zari be the statement.',
        ],
    },
    {
        id: 'draping',
        title: '👗 Perfect Draping Tips',
        content: [
            'Use a large safety pin at the shoulder for the pallu to stay secure.',
            'Use tiny pins from inside for pleats — invisible and sturdy.',
            'For a slimmer look, keep pleats narrow and tuck them precisely.',
            'For a taller look, keep the pallu slightly below knee length.',
        ],
    },
    {
        id: 'storage',
        title: '🧺 Fabric Care & Storage',
        content: [
            'Never store silk with naphthalene balls — acid damages the fibre.',
            'Use cotton muslin or old cotton saree as wrapping cloth.',
            'Re-fold along different lines every 3 months to avoid creases.',
            'Store in a cool, dry, airy space — avoid plastic bags.',
        ],
    },
    {
        id: 'history',
        title: "📜 Grandma's Weekly Rituals",
        content: [
            'Every Monday — air out all silk sarees under a fan for 30 minutes.',
            'After every use — coat zari borders lightly with tissue paper before folding.',
            'Once a year — take to a trusted dry-cleaner, not a laundry.',
            'Never wear the same silk saree twice consecutively without airing.',
        ],
    },
];

const GrandmaAdvicePage = () => (
    <ToolPageLayout
        title="Grandma Advice Tool"
        description="Generation-tested wisdom for caring for your precious textiles. These tips have been passed down through families of weavers and saree connoisseurs for centuries."
        icon={<Heart size={26} className="text-rose-500" />}
        accentColor="text-foreground"
    >
        <div className="space-y-6">
            <div className="glass-card p-5 border-rose-500/20 bg-rose-500/5 flex items-start gap-4">
                <span className="text-4xl">👵</span>
                <p className="text-sm italic leading-relaxed text-foreground/80 mt-1">
                    "Dear child, a saree is not just a dress — it is a painting of our ancestors, a prayer, and a memory all in one. Treat it with the love it deserves, and it will last three generations!"
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {tips.map((tip) => (
                    <AccordionItem key={tip.id} value={tip.id} className="glass-card border-border/50 rounded-xl px-4 overflow-hidden">
                        <AccordionTrigger className="hover:no-underline text-left text-sm font-semibold">
                            {tip.title}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2 pb-2">
                                {tip.content.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                        <Info size={12} className="text-rose-400 shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </ToolPageLayout>
);

export default GrandmaAdvicePage;
