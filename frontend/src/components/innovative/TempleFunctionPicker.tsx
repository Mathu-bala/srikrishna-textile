import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Search, Filter, ShoppingCart, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const settings = [
    { type: 'Temple', name: 'Madurai Meenakshi', suggestion: 'Sungudi Saree or Heavy Silk with decent drape.', color: 'Red/Yellow' },
    { type: 'Temple', name: 'Tirupati', suggestion: 'Simple Pattu with contrast border, gold jewelry.', color: 'Green/Yellow' },
    { type: 'Function', name: 'Reception', suggestion: 'Concept Saree or Designer Lehengas with shimmer.', color: 'Wine/Emerald' },
    { type: 'Function', name: 'Haldi', suggestion: 'Yellow Chiffon or Cotton Silk with light embroidery.', color: 'Sunflower Yellow' },
];

const TempleFunctionPicker = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = () => {
        const r = settings.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.type.toLowerCase().includes(query.toLowerCase())
        );
        setResults(r.length > 0 ? r : [settings[0]]);
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Landmark className="text-primary" />
                    Temple & Function Picker
                </CardTitle>
                <CardDescription>Enter the destination, we suggest the tradition.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search temple or function type..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} size="icon" className="shrink-0"><Search size={18} /></Button>
                </div>

                <div className="space-y-3 mt-4">
                    {results.length > 0 ? results.map((r, i) => (
                        <div key={i} className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{r.type}</span>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10">{r.color}</span>
                            </div>
                            <div className="text-sm font-bold">{r.name}</div>
                            <div className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1">
                                <Info size={12} className="shrink-0 mt-0.5 text-primary" />
                                {r.suggestion}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-muted-foreground text-xs italic">
                            Search for 'Tirupati', 'Haldi', or 'Wedding'
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TempleFunctionPicker;
