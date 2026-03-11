import { useState } from 'react';
import { Calendar, Gift } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const festivals = [
    { month: 'Jan', name: 'Pongal / Makar Sankranti', dress: 'Kasavu Saree / Pattu Pavadai', icon: '🌾', color: 'border-yellow-500/40 bg-yellow-500/5' },
    { month: 'Feb', name: 'Maha Shivaratri', dress: 'White Silk / Pure Cotton', icon: '🔱', color: 'border-gray-400/40 bg-gray-400/5' },
    { month: 'Mar', name: 'Holi', dress: 'White Chikan Kurti / Cotton Saree', icon: '🎨', color: 'border-pink-500/40 bg-pink-500/5' },
    { month: 'Apr', name: 'Puthandu / Vishu', dress: 'Yellow Silk / Kasavu with Gold Border', icon: '🌼', color: 'border-amber-500/40 bg-amber-500/5' },
    { month: 'Aug', name: 'Onam', dress: 'Off-White Kerala Kasavu Saree', icon: '🛶', color: 'border-green-500/40 bg-green-500/5' },
    { month: 'Sep', name: 'Navratri', dress: 'Bandhani / Garba Chaniya Choli', icon: '🪔', color: 'border-orange-500/40 bg-orange-500/5' },
    { month: 'Oct', name: 'Durga Puja', dress: 'Red Banarasi / Tant Saree', icon: '🌺', color: 'border-red-500/40 bg-red-500/5' },
    { month: 'Nov', name: 'Diwali', dress: 'Heavy Banarasi / Kanchipuram Silk', icon: '🎆', color: 'border-purple-500/40 bg-purple-500/5' },
    { month: 'Dec', name: 'Christmas / New Year', dress: 'Western Fusion / Embroidered Lehenga', icon: '🎄', color: 'border-teal-500/40 bg-teal-500/5' },
];

const FestivalCalendarPage = () => {
    const [religion, setReligion] = useState<string>('');

    return (
        <ToolPageLayout
            title="Festival Calendar Tool"
            description="Select your religion and region to see a full yearly festival calendar with custom dress recommendations for each occasion."
            icon={<Calendar size={26} className="text-orange-500" />}
            accentColor="text-foreground"
        >
            <div className="space-y-6">
                <div className="glass-card p-5 border-border/50">
                    <div className="grid grid-cols-2 gap-3">
                        <Select onValueChange={setReligion}>
                            <SelectTrigger><SelectValue placeholder="Select Religion" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hindu">Hindu</SelectItem>
                                <SelectItem value="muslim">Muslim</SelectItem>
                                <SelectItem value="christian">Christian</SelectItem>
                                <SelectItem value="all">All Festivals</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tn">Tamil Nadu</SelectItem>
                                <SelectItem value="kl">Kerala</SelectItem>
                                <SelectItem value="ka">Karnataka</SelectItem>
                                <SelectItem value="mh">Maharashtra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    {festivals.map((f, i) => (
                        <div key={i} className={`p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${f.color} animate-fade-in`} style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{f.icon}</div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{f.month}</div>
                                        <div className="text-sm font-bold">{f.name}</div>
                                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Gift size={10} /> {f.dress}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ToolPageLayout>
    );
};

export default FestivalCalendarPage;
