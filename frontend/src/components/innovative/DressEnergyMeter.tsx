import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Activity, Users, Coffee, Landmark } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const metrics = [
    { label: 'Formal Level', value: 85, icon: <Landmark size={14} />, color: 'bg-blue-500' },
    { label: 'Party Level', value: 95, icon: <Zap size={14} />, color: 'bg-primary' },
    { label: 'Comfort Level', value: 60, icon: <Coffee size={14} />, color: 'bg-green-500' },
    { label: 'Tradition Level', value: 100, icon: <Users size={14} />, color: 'bg-secondary' },
];

const DressEnergyMeter = () => {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="text-secondary" />
                    Dress Energy Meter
                </CardTitle>
                <CardDescription>Visualizing the vibe of our premium collections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center py-2">
                    <div className="text-4xl font-bold text-gradient-neon mb-1">92%</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Overall Glam Score</div>
                </div>

                <div className="space-y-4">
                    {metrics.map((m) => (
                        <div key={m.label} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2 text-foreground/80">
                                    {m.icon}
                                    {m.label}
                                </div>
                                <span className="font-bold">{m.value}%</span>
                            </div>
                            <Progress value={m.value} className="h-1.5" indicatorClassName={m.color} />
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground italic text-center">
                    * Based on weight, weave density, and occasion suitability.
                </div>
            </CardContent>
        </Card>
    );
};

export default DressEnergyMeter;
