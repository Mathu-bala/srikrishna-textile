import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplet, Wind, ShieldCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const EcoScore = () => {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Leaf className="text-green-500" />
                    Dress Pollution Score
                </CardTitle>
                <CardDescription>Track the environmental footprint of your choice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin-slow"></div>
                        <div className="text-3xl font-black text-green-500 italic">A+</div>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-green-500 mt-2">Eco-Friendliness Rating</div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium">
                            <span className="flex items-center gap-1"><Droplet size={12} className="text-blue-400" /> Water Savvy</span>
                            <span>85%</span>
                        </div>
                        <Progress value={85} className="h-1 bg-blue-100" indicatorClassName="bg-blue-400" />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium">
                            <span className="flex items-center gap-1"><Wind size={12} className="text-teal-400" /> Carbon Offset</span>
                            <span>72%</span>
                        </div>
                        <Progress value={72} className="h-1 bg-teal-100" indicatorClassName="bg-teal-400" />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium">
                            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-400" /> Biodegradability</span>
                            <span>98%</span>
                        </div>
                        <Progress value={98} className="h-1 bg-green-100" indicatorClassName="bg-green-400" />
                    </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-[10px] text-green-700 leading-relaxed italic">
                    "Your choice of natural mulberry silk saves 300 liters of water compared to synthetic alternatives."
                </div>
            </CardContent>
        </Card>
    );
};

export default EcoScore;
