import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, Zap, Filter, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, Product } from '@/data/products';
import { fetchProducts } from '@/services/api';

const popularSearches = [
  'Silk Saree',
  'Cotton Kurti',
  'Formal Shirt',
  'Chinos',
  'Kids Lehenga',
  'Banarasi',
  'Chikankari',
  'Linen',
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search query (State -> URL)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update URL if the state differs from the URL to avoid fighting
      const currentUrlParam = searchParams.get('q') || '';
      if (searchQuery !== currentUrlParam) {
        setDebouncedQuery(searchQuery);
        const params: Record<string, string> = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
        setSearchParams(params);
      } else if (searchQuery !== debouncedQuery) {
        // Also update debounced if they differ (e.g. init)
        setDebouncedQuery(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, setSearchParams, debouncedQuery, searchParams]);

  // Sync URL to State (URL -> State)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || 'all';

    // If URL changes externally (e.g. header search), update local state
    if (urlQ !== searchQuery) {
      setSearchQuery(urlQ);
      setDebouncedQuery(urlQ);
    }
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Handle auto-scroll on mount if requested
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo === 'products') {
      setTimeout(() => {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Fetch products from API with Enhanced Search Logic
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data: Product[] = [];

        // If searching, we fetch ALL products and filter client-side for maximum control
        // matching the "Amazon-style" fuzzy/related logic.
        if (debouncedQuery) {
          const allProducts = await fetchProducts({});
          const rawQuery = debouncedQuery.toLowerCase().trim();
          const terms = rawQuery.split(/\s+/).filter(t => t.length > 0);

          const getSearchableText = (p: Product) => `
            ${p.name || ''} 
            ${p.description || ''} 
            ${p.category || ''} 
            ${p.fabric || ''} 
            ${p.colors?.join(' ') || ''} 
            ${p.searchTags?.join(' ') || ''}
          `.toLowerCase();

          // 1. Exact/Tight Match (AND Logic)
          // All terms must appear in the product
          const exactMatches = allProducts.filter(p => {
            const text = getSearchableText(p);
            return terms.every(term => text.includes(term));
          });

          // 2. Partial Match (OR Logic)
          // Any term appears (useful if exact matches are few)
          let partialMatches: Product[] = [];
          if (exactMatches.length < 50) {
            partialMatches = allProducts.filter(p => {
              if (exactMatches.includes(p)) return false;
              const text = getSearchableText(p);
              // Filter out very short separate words to avoid noise
              return terms.some(term => term.length > 2 && text.includes(term));
            });
          }

          // 3. Related/Category Match
          // If we still don't have enough results, perform smart expansion
          let relatedMatches: Product[] = [];
          const currentCount = exactMatches.length + partialMatches.length;

          if (currentCount < 50) {
            const existingMatches = [...exactMatches, ...partialMatches];
            const matchedCategories = new Set<string>();

            // Infer category from query words
            const knownCategories = ['saree', 'kurti', 'lehenga', 'shirt', 'pant', 'trouser', 'kids', 'women', 'men', 'fabric', 'silk', 'cotton'];
            knownCategories.forEach(c => {
              if (rawQuery.includes(c)) matchedCategories.add(c);
            });

            // Infer category from existing exact matches
            exactMatches.forEach(p => matchedCategories.add(p.category.toLowerCase()));

            relatedMatches = allProducts.filter(p => {
              if (existingMatches.includes(p)) return false;

              // If no specific category inferred, and we are desperate, maybe gender match?
              if (matchedCategories.size === 0) {
                // Very broad fallbacks
                return false;
              }

              // Check if product matches any inferred category
              const pCat = p.category.toLowerCase();
              const pName = p.name.toLowerCase();
              return Array.from(matchedCategories).some(c => pCat.includes(c) || pName.includes(c));
            });
          }

          // Combine results
          data = [...exactMatches, ...partialMatches, ...relatedMatches];

          // Deduplicate just in case
          data = Array.from(new Set(data));

          // Limit to 100 results max
          data = data.slice(0, 100);

        } else {
          // No search query: Standard filtering by category if selected
          const params: Record<string, string | boolean> = {};
          if (selectedCategory && selectedCategory !== 'all') {
            params.category = selectedCategory;
          }
          data = await fetchProducts(params);
        }

        setProductsList(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedQuery, selectedCategory]); // Removed selectedCategory from dependency if query exists? No, keep it.

  const sortedProducts = useMemo(() => {
    let result = [...productsList];

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // For search results, we usually want relevance (which is implicit in our fetch order: exact > partial > related)
        // usage of 'featured' sort might shuffle relevant top results if not careful.
        // But let's keep featured for browse mode.
        if (debouncedQuery) {
          // If searching, keep relevance order unless user explicitly sorts
          if (sortBy === 'featured') {
            // Do nothing, preserve relevance order from loadProducts
          } else {
            result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          }
        } else {
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }
    }

    return result;
  }, [productsList, sortBy, debouncedQuery]);

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setDebouncedQuery(term);
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        {/* Search Hero Section */}
        <div className="relative py-10 md:py-16 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
                <Zap size={16} />
                DISCOVER FASHION
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                Explore Our <span className="text-gradient-neon">Collection</span>
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Search for sarees, kurtis, shirts, pants, kids wear, and more
              </p>

              {/* Search Bar - Global Search Experience */}
              <div className="relative max-w-3xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
                  <Input
                    type="text"
                    placeholder="Search for sarees, kurtis, pants, or kids wear..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setDebouncedQuery(searchQuery)}
                    className="pl-14 pr-14 py-8 text-xl rounded-full border-2 border-border/50 focus:border-primary bg-card/80 backdrop-blur-md shadow-lg w-full transition-all hover:shadow-xl focus:shadow-primary/20"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  Popular:
                </span>
                {popularSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePopularSearch(term)}
                    className={`rounded-full text-sm transition-all ${searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-neon-purple'
                      : 'border-border/50 hover:border-secondary/50 hover:bg-secondary/10 hover:text-secondary'
                      }`}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div id="products-section" className="container-custom py-8">
          {/* Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-muted-foreground">
                {debouncedQuery || (selectedCategory && selectedCategory !== 'all') ? (
                  <>
                    Showing <span className="font-semibold text-foreground">{sortedProducts.length}</span> results
                    {debouncedQuery && (
                      <> for "<span className="font-semibold text-secondary">{debouncedQuery}</span>"</>
                    )}
                  </>
                ) : (
                  <>
                    Showing <span className="font-semibold text-foreground">{sortedProducts.length}</span> products
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 bg-card/50 border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 30, 500)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try searching for "saree", "kurti", "shirt", or "kids wear"{selectedCategory !== 'all' ? ` in ${categories.find(c => c.id === selectedCategory)?.name}` : ''}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.slice(0, 4).map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    onClick={() => handlePopularSearch(term)}
                    className="rounded-full border-border/50 hover:border-secondary/50 hover:bg-secondary/10"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
