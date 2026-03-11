import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, MapPin, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const regions = [
    {
        state: 'Tamil Nadu', districts: [
            { name: 'Kanchipuram', textile: 'Silk Sarees', products: 124 },
            { name: 'Salem', textile: 'White Silk', products: 45 },
            { name: 'Madurai', textile: 'Sungudi', products: 67 }
        ]
    },
    {
        state: 'Uttar Pradesh', districts: [
            { name: 'Varanasi', textile: 'Banarasi Silk', products: 210 },
            { name: 'Lucknow', textile: 'Chikan Work', products: 156 }
        ]
    },
    {
        state: 'West Bengal', districts: [
            { name: 'Hooghly', textile: 'Jamdani', products: 89 },
            { name: 'Murshidabad', textile: 'Silk', products: 34 }
        ]
    },
    {
        state: 'Gujarat', districts: [
            { name: 'Ahmedabad', textile: 'Bandhani', products: 112 },
            { name: 'Patan', textile: 'Patola', products: 23 }
        ]
    }
];

const VillageMap = () => {
    const [selectedState, setSelectedState] = useState<any>(null);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Map className="text-secondary" />
                    Village Map Shopping
                </CardTitle>
                <CardDescription>Discover textiles from the heart of India's weaving clusters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!selectedState ? (
                    <div className="grid grid-cols-2 gap-2 animate-fade-in">
                        {regions.map((region) => (
                            <Button
                                key={region.state}
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-1 border-border/50 hover:border-secondary hover:bg-secondary/10"
                                onClick={() => setSelectedState(region)}
                            >
                                <div className="text-sm font-bold">{region.state}</div>
                                <div className="text-[10px] text-muted-foreground uppercase">{region.districts.length} Hubs</div>
                            </Button>
                        ))}
                        <div className="col-span-2 p-4 text-center border-2 border-dashed border-border/50 rounded-lg opacity-50 text-xs">
                            <MapPin className="mx-auto mb-2 opacity-50" />
                            More states coming soon
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <button
                                onClick={() => setSelectedState(null)}
                                className="text-xs text-secondary hover:underline font-medium"
                            >
                                ← Back to India Map
                            </button>
                            <div className="text-sm font-bold text-secondary">{selectedState.state}</div>
                        </div>
                        {selectedState.districts.map((d: any) => (
                            <div key={d.name} className="p-3 rounded-lg border border-border/50 bg-secondary/5 flex items-center justify-between group cursor-pointer hover:bg-secondary/10 transition-colors">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{d.name}</div>
                                    <div className="text-sm font-bold">{d.textile}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground mb-1">{d.products} Products</div>
                                    <ChevronRight size={14} className="ml-auto group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default VillageMap;
