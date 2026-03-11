import { Activity, Landmark, Zap, Coffee, Users } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Progress } from '@/components/ui/progress';

const dresses = [
    {
        name: 'Kanchipuram Bridal Silk',
        metrics: { formal: 98, party: 90, comfort: 50, tradition: 100 },
        summary: 'The pinnacle of traditional grandeur. Best for weddings and temple events.',
    },
    {
        name: 'Chanderi Cotton Silk',
        metrics: { formal: 70, party: 65, comfort: 88, tradition: 75 },
        summary: 'The perfect balance of tradition and daily comfort. Great for festive lunches.',
    },
    {
        name: 'Georgette Printed Saree',
        metrics: { formal: 50, party: 95, comfort: 80, tradition: 40 },
        summary: 'Lightweight and vibrant — ideal for parties, receptions, and modern occasions.',
    },
];

const bars = [
    { key: 'formal', label: 'Formal Level', icon: <Landmark size={14} />, color: 'bg-blue-500' },
    { key: 'party', label: 'Party Level', icon: <Zap size={14} />, color: 'bg-primary' },
    { key: 'comfort', label: 'Comfort Level', icon: <Coffee size={14} />, color: 'bg-green-500' },
    { key: 'tradition', label: 'Tradition Level', icon: <Users size={14} />, color: 'bg-cyan-500' },
];

const EnergyMeterPage = () => (
    <ToolPageLayout
        title="Dress Energy Meter"
        description="Discover the Formal, Party, Comfort, and Tradition ratings for popular dress styles. Find the perfect vibe for every occasion."
        icon={<Activity size={26} className="text-cyan-500" />}
        accentColor="text-foreground"
    >
        <div className="space-y-6">
            {dresses.map((dress, di) => (
                <div key={di} className="glass-card p-6 border-border/50 space-y-5 animate-fade-in" style={{ animationDelay: `${di * 100}ms` }}>
                    <div>
                        <h2 className="font-bold text-base">{dress.name}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{dress.summary}</p>
                    </div>
                    <div className="space-y-3">
                        {bars.map((bar) => {
                            const val = dress.metrics[bar.key as keyof typeof dress.metrics];
                            return (
                                <div key={bar.key} className="space-y-1">
                                    <div className="flex justify-between items-center text-[11px] font-medium">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">{bar.icon} {bar.label}</span>
                                        <span className="font-bold">{val}%</span>
                                    </div>
                                    <Progress value={val} className="h-1.5 bg-muted/50" indicatorClassName={bar.color} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </ToolPageLayout>
);

export default EnergyMeterPage;
