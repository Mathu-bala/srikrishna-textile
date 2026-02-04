import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { getSearchSuggestions } from '@/services/api';

interface ProductSuggestion {
    id: string;
    name: string;
    category: string;
    image: string;
    price: number;
}

interface SearchAutocompleteProps {
    placeholder?: string;
    className?: string;
    onSearch?: () => void;
}

const SearchAutocomplete = ({ placeholder = "Search products...", className, onSearch }: SearchAutocompleteProps) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                try {
                    const results = await getSearchSuggestions(query);
                    setSuggestions(results as unknown as ProductSuggestion[]);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(false);
            navigate(`/products?q=${encodeURIComponent(query.trim())}`);
            if (onSearch) onSearch();
        }
    };

    const handleSuggestionClick = (id: string, name: string) => {
        setShowSuggestions(false);
        setQuery(name); // Optional: keep query in bar
        navigate(`/products?q=${encodeURIComponent(name.trim())}`);
        if (onSearch) onSearch();
    };

    // Highlight matching text
    const highlightMatch = (text: string, highlight: string) => {
        if (!highlight.trim()) return <span>{text}</span>;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="text-secondary font-bold">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <Input
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                    className="w-full pl-10 bg-muted/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary/50 placeholder:text-muted-foreground transition-all duration-300"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Search size={18} />
                    )}
                </div>
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                    {suggestions.length > 0 ? (
                        <ul className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {suggestions.map((product) => (
                                <li key={product.id}>
                                    <button
                                        onClick={() => handleSuggestionClick(product.id, product.name)}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors group text-left"
                                    >
                                        <div className="w-12 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/30 group-hover:border-secondary/50 transition-colors">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-medium text-sm truncate group-hover:text-secondary transition-colors">
                                                {highlightMatch(product.name, query)}
                                            </h4>
                                            <div className="flex justify-between items-center mt-0.5">
                                                <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                                                <span className="text-xs font-semibold text-secondary">₹{product.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                            <li className="p-2 border-t border-border/30 bg-muted/20">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full text-center text-xs text-secondary hover:underline py-1"
                                >
                                    View all results for "{query}"
                                </button>
                            </li>
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-muted-foreground">
                            <p className="text-sm">No products found for "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchAutocomplete;
