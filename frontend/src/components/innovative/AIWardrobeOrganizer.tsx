import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const suggestions = [
    { item: 'Teal Silk Saree', matches: ['Silver Jhumkas', 'Beige Blouse', 'Pearl Necklace'] },
    { item: 'Cotton Kurti', matches: ['White Leggings', 'Denim Jacket', 'Afghan Earrings'] }
];

const AIWardrobeOrganizer = () => {
    const [items, setItems] = useState(['Red Banarasi', 'Yellow Chiffon']);
    const [newItem, setNewItem] = useState('');

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LayoutGrid className="text-primary" />
                    AI Wardrobe Organizer
                </CardTitle>
                <CardDescription>Manage your collection and get matching suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                        <Badge key={item} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                            {item}
                        </Badge>
                    ))}
                    <Badge variant="outline" className="border-dashed cursor-pointer hover:bg-muted" onClick={() => setItems([...items, 'New Item ' + (items.length + 1)])}>
                        <Plus size={12} className="mr-1" /> Add
                    </Badge>
                </div>

                <div className="pt-2 border-t border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={12} className="text-primary" /> Smart Matching Suggestions
                    </div>

                    <div className="space-y-3">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-3 rounded-lg bg-card/50 border border-border/50">
                                <div className="text-xs font-bold mb-2 flex items-center justify-between">
                                    {s.item}
                                    <CheckCircle2 size={12} className="text-green-500" />
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {s.matches.map(m => (
                                        <span key={m} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                            + {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIWardrobeOrganizer;
