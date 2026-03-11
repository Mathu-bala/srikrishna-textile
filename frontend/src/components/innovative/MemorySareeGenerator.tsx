import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Sparkles, ShoppingBag } from 'lucide-react';

const MemorySareeGenerator = () => {
    const [memory, setMemory] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleGenerate = () => {
        // Mock logic for keyword mapping
        const lowercaseMemory = memory.toLowerCase();
        const mockSuggestions = [];

        if (lowercaseMemory.includes('wedding')) {
            mockSuggestions.push({ color: 'Deep Red', fabric: 'Kanchipuram Silk', style: 'Traditional Bridal', icon: '💍' });
            mockSuggestions.push({ color: 'Golden Yellow', fabric: 'Banarasi Silk', style: 'Royal Ethnic', icon: '👑' });
        }
        if (lowercaseMemory.includes('temple')) {
            mockSuggestions.push({ color: 'White with Gold border', fabric: 'Cotton Silk', style: 'Kerala Kasavu Style', icon: '🛕' });
            mockSuggestions.push({ color: 'Sandlewood', fabric: 'Tussar Silk', style: 'Elegant Traditional', icon: '🕯️' });
        }
        if (lowercaseMemory.includes('beach') || lowercaseMemory.includes('vacation')) {
            mockSuggestions.push({ color: 'Sky Blue', fabric: 'Chiffon', style: 'Breezy Casual', icon: '🌊' });
            mockSuggestions.push({ color: 'Coral Pink', fabric: 'Georgette', style: 'Modern Chic', icon: '☀️' });
        }
        if (lowercaseMemory.includes('office') || lowercaseMemory.includes('work')) {
            mockSuggestions.push({ color: 'Steel Grey', fabric: 'Linen', style: 'Professional Minimalist', icon: '💼' });
            mockSuggestions.push({ color: 'Midnight Blue', fabric: 'Tussar Cotton', style: 'Understated Elegance', icon: '🖋️' });
        }

        if (mockSuggestions.length === 0) {
            mockSuggestions.push({ color: 'Emerald Green', fabric: 'Soft Silk', style: 'Versatile Classic', icon: '✨' });
        }

        setSuggestions(mockSuggestions);
    };

    return (
        <Card className="glass-card overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    Memory Saree Generator
                </CardTitle>
                <CardDescription>Type a memory or situation, and we'll find the perfect match.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g., My sister's wedding in Madurai temple..."
                        value={memory}
                        onChange={(e) => setMemory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <Button onClick={handleGenerate} className="btn-neon shrink-0">
                        Generate
                    </Button>
                </div>

                {suggestions.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-fade-in">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-3 rounded-lg border border-border/50 bg-secondary/5 flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl">{s.icon}</span>
                                    <ShoppingBag size={16} className="text-muted-foreground" />
                                </div>
                                <div className="font-semibold text-primary">{s.color}</div>
                                <div className="text-xs text-muted-foreground">{s.fabric} • {s.style}</div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MemorySareeGenerator;
