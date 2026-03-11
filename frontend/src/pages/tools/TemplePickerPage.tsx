import { useState } from 'react';
import { Landmark, Search, ShoppingBag } from 'lucide-react';
import ToolPageLayout from '@/components/innovative/ToolPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const database = [
    { type: 'Temple', name: 'Madurai Meenakshi', color: 'Red / Yellow', suggestion: 'Sungudi saree with gold border or a Silk Pavadai Davani. Avoid black or white.', do: 'Bright traditional colors', dont: 'Dark or western attire' },
    { type: 'Temple', name: 'Tirupati Balaji', color: 'Green / Yellow', suggestion: 'Simple Pattu saree with contrast border. Light jewellery. Avoid revealing blouses.', do: 'Silk with decent border', dont: 'Short or revealing clothes' },
    { type: 'Temple', name: 'Sabarimala', color: 'Black / Blue', suggestion: 'Black dhoti or blue kurta for men. Only men allowed. Irumudi clothing customs apply.', do: 'Black or blue only', dont: 'Bright colors or casual attire' },
    { type: 'Temple', name: 'Palani Murugan', color: 'Orange / Saffron', suggestion: 'Saffron-colored cotton or silk. Light, comfortable fabrics for the hill climb.', do: 'Saffron / Orange cotton', dont: 'Heavy silk or heels' },
    { type: 'Function', name: 'Wedding Reception', color: 'Wine / Emerald', suggestion: 'Concept saree, designer lehenga, or heavily embellished silk. Evening-appropriate.', do: 'Rich jewel tones with shimmer', dont: 'Plain cottons or very light fabrics' },
    { type: 'Function', name: 'Haldi Ceremony', color: 'Yellow / Mustard', suggestion: 'Old or inexpensive yellow saree/kurti. Cotton preferred — will get turmeric-stained!', do: 'Yellow / Mustard cottons', dont: 'Expensive silk or white' },
    { type: 'Function', name: 'Engagement', 'color': 'Pink / Peach', suggestion: 'Soft silk or organza saree in romantic pastels. Light to medium embellishment works beautifully.', do: 'Pastels and soft pinks', dont: 'Very dark or heavy colors' },
];

const TemplePickerPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof database>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        const lower = query.toLowerCase();
        const r = database.filter(d =>
            d.name.toLowerCase().includes(lower) || d.type.toLowerCase().includes(lower)
        );
        setResults(r.length > 0 ? r : database.slice(0, 2));
        setSearched(true);
    };

    return (
        <ToolPageLayout
            title="Temple Dress Picker"
            description="Enter a temple name or function type for culturally appropriate dress guidance rooted in tradition and etiquette."
            icon={<Landmark size={26} className="text-teal-500" />}
            accentColor="text-foreground"
        >
            <div className="space-y-6">
                {/* Search */}
                <div className="glass-card p-5 border-border/50 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Temple or Function Name</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Tirupati, Wedding, Haldi, Meenakshi..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} size="icon" className="shrink-0"><Search size={18} /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Tirupati', 'Wedding', 'Haldi', 'Engagement'].map((q) => (
                            <button key={q} onClick={() => { setQuery(q); }}
                                className="text-[10px] px-2 py-1 rounded bg-teal-500/10 text-teal-500 border border-teal-500/20 hover:bg-teal-500/20 transition-colors font-bold">
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {searched && (
                    <div className="space-y-4 animate-fade-in">
                        {results.map((r, i) => (
                            <div key={i} className="glass-card p-5 border-teal-500/20 bg-teal-500/5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-teal-500">{r.type}</span>
                                        <h2 className="text-base font-black">{r.name}</h2>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-teal-500/10 text-teal-500">{r.color}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{r.suggestion}</p>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                                    <div className="text-[10px]"><span className="text-green-500 font-bold">✓ DO: </span>{r.do}</div>
                                    <div className="text-[10px]"><span className="text-red-400 font-bold">✗ AVOID: </span>{r.dont}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!searched && (
                    <div className="border-2 border-dashed border-border/50 rounded-2xl py-16 text-center text-muted-foreground">
                        <Landmark size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-xs uppercase font-bold tracking-widest">Search a temple or function above</p>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default TemplePickerPage;
