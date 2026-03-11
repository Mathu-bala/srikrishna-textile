import { useState } from 'react';
import { Map, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Button } from '@/components/ui/button';

const regions = [
    {
        state: 'Tamil Nadu', flag: '🌺', districts: [
            { name: 'Kanchipuram', craft: 'Kanchipuram Silk Sarees', products: 124, desc: 'Famous for pure mulberry silk with gold zari borders and temple motifs.' },
            { name: 'Salem', craft: 'White Silk & Cotton', products: 45, desc: 'Specialises in lightweight silk ideal for daily elegant wear.' },
            { name: 'Madurai', craft: 'Sungudi Sarees', products: 67, desc: 'Known for tie-dye Sungudi cotton sarees worn during temple visits.' },
        ]
    },
    {
        state: 'Uttar Pradesh', flag: '🕌', districts: [
            { name: 'Varanasi', craft: 'Banarasi Silk', products: 210, desc: 'The crown jewel of Indian weaving — complex zari, opulent motifs, royal lineage.' },
            { name: 'Lucknow', craft: 'Chikankari Embroidery', products: 156, desc: 'Delicate white-on-white embroidery dating back to Mughal queens.' },
        ]
    },
    {
        state: 'West Bengal', flag: '🐅', districts: [
            { name: 'Hooghly', craft: 'Jamdani Weaves', products: 89, desc: 'UNESCO-heritage weaving of intricate floral muslin patterns.' },
            { name: 'Bishnupur', craft: 'Baluchari Silk', products: 55, desc: 'Silk sarees with storytelling motifs from Hindu epics and mythology.' },
        ]
    },
    {
        state: 'Gujarat', flag: '🦁', districts: [
            { name: 'Ahmedabad', craft: 'Bandhani / Tie-Dye', products: 112, desc: 'Vibrant dot-pattern tie-dye known as Bandhani — worn at every Gujarati celebration.' },
            { name: 'Patan', craft: 'Patola Double Ikat', products: 23, desc: 'One of the rarest and most expensive weaves in India — takes months to complete.' },
        ]
    },
];

const VillageMapPage = () => {
    const [selected, setSelected] = useState<typeof regions[0] | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<typeof regions[0]['districts'][0] | null>(null);

    return (
        <ToolPageLayout
            title="Village Map Shopping"
            description="Discover India's legendary textile clusters. Click a state to explore its weaving districts and find authentic local crafts."
            icon={<Map size={26} className="text-green-500" />}
            accentColor="text-foreground"
        >
            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <button onClick={() => { setSelected(null); setSelectedDistrict(null); }} className={`hover:text-green-500 transition-colors ${!selected ? 'text-green-500' : ''}`}>India</button>
                    {selected && <><ChevronRight size={12} /><button onClick={() => setSelectedDistrict(null)} className={`hover:text-green-500 transition-colors ${!selectedDistrict ? 'text-green-500' : ''}`}>{selected.state}</button></>}
                    {selectedDistrict && <><ChevronRight size={12} /><span className="text-green-500">{selectedDistrict.name}</span></>}
                </div>

                {/* States */}
                {!selected && (
                    <div className="grid grid-cols-2 gap-3 animate-fade-in">
                        {regions.map((r) => (
                            <button key={r.state} onClick={() => setSelected(r)}
                                className="glass-card p-5 text-left border-border/50 hover:border-green-500/50 hover:-translate-y-0.5 transition-all">
                                <div className="text-3xl mb-2">{r.flag}</div>
                                <div className="font-bold text-sm">{r.state}</div>
                                <div className="text-[10px] text-muted-foreground">{r.districts.length} weaving districts</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Districts */}
                {selected && !selectedDistrict && (
                    <div className="space-y-3 animate-fade-in">
                        {selected.districts.map((d) => (
                            <button key={d.name} onClick={() => setSelectedDistrict(d)}
                                className="w-full glass-card p-4 text-left border-border/50 hover:border-green-500/50 flex items-center justify-between group hover:-translate-y-0.5 transition-all">
                                <div>
                                    <div className="font-bold text-sm">{d.name}</div>
                                    <div className="text-xs text-muted-foreground">{d.craft}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-green-500">{d.products} products</div>
                                    <ChevronRight size={14} className="ml-auto text-muted-foreground group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* District Detail */}
                {selectedDistrict && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="glass-card p-6 border-green-500/20 bg-green-500/5 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-widest text-green-500">{selected?.state} › {selectedDistrict.name}</div>
                            <h2 className="text-xl font-black">{selectedDistrict.craft}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedDistrict.desc}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <span className="text-sm font-bold">{selectedDistrict.products} Products Available</span>
                                <Button size="sm" className="btn-neon gap-2">
                                    <ShoppingBag size={14} /> Shop Now
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default VillageMapPage;
