import { useState } from 'react';
import { BookOpen, MapPin, History } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const stories = [
    {
        key: 'kanchipuram',
        label: 'Kanchipuram',
        title: 'The Temple City\'s Gold',
        origin: 'Tamil Nadu',
        weaving: 'Three-shuttle weaving',
        era: '4th century CE',
        story: `Every Kanchipuram saree begins its life as threads of pure mulberry silk, sourced from Karnataka and dyed in the colors of Gods. Legend says the master weavers are descendants of Sage Markanda — the divine weaver who created garments for celestial beings. The unique contrast border, the bold zari, and the temple motifs all carry centuries of devotion and artistry.`,
    },
    {
        key: 'banarasi',
        label: 'Banarasi',
        title: 'Elegance Born in Kashi',
        origin: 'Uttar Pradesh',
        weaving: 'Jala & Jacquard',
        era: '13th century Mughal era',
        story: `On the ghats of the sacred Ganga river, weavers in Varanasi have been crafting these masterpieces for over 500 years. Mughal art fused with Hindu temple motifs created the distinctive floral jaal and kalga patterns. A single Banarasi saree can take up to 6 months to complete — each thread placed with meditative precision.`,
    },
    {
        key: 'chanderi',
        label: 'Chanderi',
        title: 'Lighter Than Air',
        origin: 'Madhya Pradesh',
        weaving: 'Handloom Buttis',
        era: '2300 BCE (Vedic era)',
        story: `The ancient town of Chanderi has been weaving since the days of the Vedas. These sarees are so fine that when held up to light, you can see your hand through them. Historically gifted only to queens and noblewomen, the Chanderi's gossamer delicacy is a mark of supreme luxury in Indian textile heritage.`,
    },
];

const DressStoryPage = () => (
    <ToolPageLayout
        title="Dress Story Mode"
        description="Discover the cultural inspiration, weaving traditions, and centuries of heritage woven into every textile."
        icon={<BookOpen size={26} className="text-amber-500" />}
        accentColor="text-foreground"
    >
        <Tabs defaultValue="kanchipuram" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/30">
                {stories.map((s) => <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>)}
            </TabsList>
            {stories.map((s) => (
                <TabsContent key={s.key} value={s.key} className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-black text-amber-500">{s.title}</h2>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Origin', value: s.origin, icon: <MapPin size={14} /> },
                            { label: 'Weaving Style', value: s.weaving, icon: <History size={14} /> },
                            { label: 'Est. Era', value: s.era, icon: <BookOpen size={14} /> },
                        ].map((d) => (
                            <div key={d.label} className="glass-card p-3 text-center border-border/50">
                                <div className="text-amber-500 flex justify-center mb-1">{d.icon}</div>
                                <div className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">{d.label}</div>
                                <div className="text-xs font-bold mt-0.5">{d.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-6 border-l-4 border-amber-500 border-border/50">
                        <p className="text-sm text-foreground/80 leading-relaxed italic">"{s.story}"</p>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    </ToolPageLayout>
);

export default DressStoryPage;
