import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Repeat, Globe } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const phrases = [
    { standard: 'This saree is very beautiful.', dialect: 'Endha pudavai semmaya irukku!' },
    { standard: 'The price is very reasonable.', dialect: 'Vila romba correct-u dhang.' },
    { standard: 'Pure silk weaving quality.', dialect: 'Nalla asalu pattu neyidhu.' }
];

const LanguageDialectMode = () => {
    const [isDialect, setIsDialect] = useState(false);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Languages className="text-secondary" />
                    Language Dialect Mode
                </CardTitle>
                <CardDescription>Switch between standard and local colloquial styles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                    <div className="space-y-1">
                        <Label htmlFor="dialect-mode" className="text-sm font-bold">Local Dialect (Tamil Style)</Label>
                        <p className="text-[10px] text-muted-foreground">{isDialect ? 'Colloquial mode active' : 'Standard English active'}</p>
                    </div>
                    <Switch
                        id="dialect-mode"
                        checked={isDialect}
                        onCheckedChange={setIsDialect}
                    />
                </div>

                <div className="space-y-4">
                    {phrases.map((p, i) => (
                        <div key={i} className="space-y-1 group">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                <Repeat size={10} /> {isDialect ? 'Traditional Feel' : 'Formal English'}
                            </div>
                            <div className={`text-sm font-medium transition-all duration-300 ${isDialect ? 'text-secondary translate-x-1' : 'text-foreground'}`}>
                                {isDialect ? p.dialect : p.standard}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-2 text-center">
                    <Globe className="mx-auto mb-2 text-muted-foreground opacity-20" size={32} />
                    <p className="text-[9px] text-muted-foreground italic">
                        More dialects like Madurai, Coimbatore, and Chennai Slang coming soon!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default LanguageDialectMode;
