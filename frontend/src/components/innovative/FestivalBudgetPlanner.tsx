import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Calculator, Briefcase, Plus, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";

const FestivalBudgetPlanner = () => {
    const [budget, setBudget] = useState(10000);
    const [spent, setSpent] = useState(0);

    const addItem = (amount: number) => {
        if (spent + amount <= budget) {
            setSpent(spent + amount);
        }
    };

    const percentage = Math.min((spent / budget) * 100, 100);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="text-secondary" />
                    Festival Budget Planner
                </CardTitle>
                <CardDescription>Plan your shopping spree without breaking the bank.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Set Total Budget (₹)</label>
                    <Input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="font-bold text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-muted-foreground font-medium">Progress</span>
                        <span className="text-sm font-bold">₹{spent} / ₹{budget}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                        { name: 'Saree', price: 4500 },
                        { name: 'Blouse', price: 1200 },
                        { name: 'Jewelry', price: 3000 },
                        { name: 'Kids', price: 2500 }
                    ].map(item => (
                        <Button
                            key={item.name}
                            variant="outline"
                            size="sm"
                            className="justify-between text-[11px] border-border/50 hover:bg-secondary/10"
                            onClick={() => addItem(item.price)}
                            disabled={spent + item.price > budget}
                        >
                            {item.name}
                            <span className="font-bold text-secondary">₹{item.price}</span>
                        </Button>
                    ))}
                </div>

                <Button variant="ghost" size="sm" className="w-full text-[10px] text-muted-foreground" onClick={() => setSpent(0)}>
                    Reset Planner
                </Button>
            </CardContent>
        </Card>
    );
};

export default FestivalBudgetPlanner;
