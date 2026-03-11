import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Gift } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '../ui/button';

const festivals = [
    { month: 'January', name: 'Pongal / Makar Sankranti', dress: 'Kasavu Saree / Pattu Pavadai', icon: '🌾' },
    { month: 'March', name: 'Holi', dress: 'White Chikan Kurti / Cotton Saree', icon: '🎨' },
    { month: 'April', name: 'Puthandu / Vishu', dress: 'Yellow silk / Kasavu', icon: '🌼' },
    { month: 'August', name: 'Onam', dress: 'Off-white Kerala Saree', icon: '🛶' },
    { month: 'October', name: 'Navratri / Durga Puja', dress: 'Bandhani / Garba Special Chaniya Choli', icon: '🪔' },
    { month: 'November', name: 'Diwali', dress: 'Heavy Banarasi / Silk Saree', icon: '🎆' },
];

const FestivalCalendar = () => {
    const [religion, setReligion] = useState('');
    const [location, setLocation] = useState('');

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-accent" />
                    Festival Auto-Shopping
                </CardTitle>
                <CardDescription>Get recommendations based on upcoming local festivals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <Select onValueChange={setReligion}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Religion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hindu">Hindu</SelectItem>
                            <SelectItem value="muslim">Muslim</SelectItem>
                            <SelectItem value="christian">Christian</SelectItem>
                            <SelectItem value="all">Cultural</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setLocation}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tn">Tamil Nadu</SelectItem>
                            <SelectItem value="kl">Kerala</SelectItem>
                            <SelectItem value="ka">Karnataka</SelectItem>
                            <SelectItem value="mh">Maharashtra</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {festivals.map((fest, i) => (
                        <div key={i} className="group p-3 rounded-lg border border-border/50 hover:border-accent/50 transition-all bg-card/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{fest.icon}</span>
                                <div>
                                    <div className="text-xs font-bold text-accent uppercase tracking-tighter">{fest.month}</div>
                                    <div className="text-sm font-semibold">{fest.name}</div>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Gift size={10} /> {fest.dress}
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">
                                Shop Now
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default FestivalCalendar;
