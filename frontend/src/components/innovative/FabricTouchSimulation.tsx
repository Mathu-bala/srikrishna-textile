import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FabricTouchSimulation = () => {
    const [active, setActive] = useState(false);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="text-secondary" />
                    Fabric Touch Simulation
                </CardTitle>
                <CardDescription>Visualizing texture movement and lightness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div
                    className="relative h-64 rounded-xl overflow-hidden bg-slate-900 border border-white/10 group cursor-pointer"
                    onMouseEnter={() => setActive(true)}
                    onMouseLeave={() => setActive(false)}
                >
                    {/* Simulated Fabric Fabric using CSS gradients and animation */}
                    <div
                        className={`absolute inset-0 opacity-80 mix-blend-screen transition-all duration-1000 ${active ? 'scale-110' : 'scale-100'}`}
                        style={{
                            background: 'linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
                            backgroundSize: '400% 400%',
                            animation: active ? 'wave 3s infinite linear' : 'none'
                        }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                        {!active && (
                            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-white animate-pulse">
                                <Fingerprint size={16} /> HOVER TO FEEL TEXTURE
                            </div>
                        )}
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mt-32">Mulberry Silk 180 GSM</div>
                    </div>

                    {/* Custom CSS for wave effect inside the component */}
                    <style>{`
            @keyframes wave {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-tighter border-border/50">
                        Increase Stiffness
                    </Button>
                    <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-tighter border-border/50">
                        Change Lighting
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default FabricTouchSimulation;
