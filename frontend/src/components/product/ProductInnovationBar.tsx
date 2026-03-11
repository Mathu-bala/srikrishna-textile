import React, { useState } from 'react';
import { Sparkles, BookOpen, Activity, Info, Volume2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProductInnovationBar = ({ productName }: { productName: string }) => {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const tabs = [
        { id: 'story', label: 'Dress Story', icon: <BookOpen size={16} /> },
        { id: 'energy', label: 'Vibe Check', icon: <Activity size={16} /> },
        { id: 'eco', label: 'Eco Score', icon: <Leaf size={16} /> },
        { id: 'voice', label: 'Voice of Fabric', icon: <Volume2 size={16} /> },
    ];

    return (
        <div className="mt-12 border-t border-b border-border/50 py-8">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-secondary animate-pulse" />
                <h2 className="text-xl font-bold tracking-tight">Smart Innovation Hub</h2>
                <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold uppercase">Beta Features</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                        className={`gap-2 rounded-full border-border/50 ${activeTab === tab.id ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'hover:bg-secondary/10 hover:text-secondary'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </Button>
                ))}
            </div>

            {activeTab === 'story' && (
                <Card className="glass-card animate-fade-in">
                    <CardContent className="pt-6">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <BookOpen size={18} className="text-secondary" />
                            The Heritage of {productName}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-secondary pl-4">
                            "Every thread in this {productName} tells a story of generations. Hand-woven in the heart of our artisan clusters,
                            it carries the weight of culture and the lightness of modern aspirations."
                        </p>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'energy' && (
                <Card className="glass-card animate-fade-in">
                    <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Formal</div>
                            <Progress value={80} className="h-1" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Party</div>
                            <Progress value={95} className="h-1" indicatorClassName="bg-primary" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Comfort</div>
                            <Progress value={65} className="h-1" indicatorClassName="bg-green-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tradition</div>
                            <Progress value={90} className="h-1" indicatorClassName="bg-secondary" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'eco' && (
                <Card className="glass-card animate-fade-in">
                    <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-full border-4 border-green-500/20 border-t-green-500 flex items-center justify-center font-black text-green-500">A+</div>
                        <p className="text-xs text-muted-foreground flex-1">
                            This fabric choice helps save approximately <strong>420 liters of water</strong> and reduces carbon footprint by <strong>12%</strong> compared to standard industrial textiles.
                        </p>
                        <Button variant="ghost" size="sm" className="text-green-500 text-[10px] uppercase font-bold tracking-widest">Full Report</Button>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'voice' && (
                <Card className="glass-card animate-fade-in">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                <Volume2 size={24} className="text-secondary" />
                            </div>
                            <div>
                                <div className="text-sm font-bold">Audio Description</div>
                                <div className="text-[10px] text-muted-foreground">Narrated by Grandma AI • 45s</div>
                            </div>
                        </div>
                        <Button size="icon" className="rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"><Sparkles size={18} /></Button>
                    </CardContent>
                </Card>
            )}

            {!activeTab && (
                <div className="text-center py-10 bg-muted/20 border-2 border-dashed border-border/50 rounded-2xl">
                    <Info size={24} className="mx-auto mb-3 opacity-20" />
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Select a tool to interact with this textile</p>
                </div>
            )}
        </div>
    );
};

export default ProductInnovationBar;
