import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const branches = [
    { name: 'SriKrishna Main Hub', area: 'Kanchipuram, TN', distance: '0.8 km', status: 'Open Now' },
    { name: 'Craft Studio', area: 'Salem Road, TN', distance: '5.2 km', status: 'Open Now' },
    { name: 'Heritage Outlet', area: 'Anna Salai, Chennai', distance: '72 km', status: 'Closes at 9 PM' }
];

const LocalShopMode = () => {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Store className="text-primary" />
                    Local Shop Mode
                </CardTitle>
                <CardDescription>Find our physical stores for a touch-and-feel experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {branches.map((b, i) => (
                        <div key={i} className="p-3 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-sm font-bold">{b.name}</div>
                                <div className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                                    {b.distance}
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin size={10} /> {b.area}
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-[10px] font-medium text-green-500 flex items-center gap-1">
                                    <Clock size={10} /> {b.status}
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-7 w-7"><Phone size={14} /></Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-primary"><ExternalLink size={14} /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Button className="w-full btn-neon text-xs">
                    Enable Live Location Tracking
                </Button>
            </CardContent>
        </Card>
    );
};

export default LocalShopMode;
