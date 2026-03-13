import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/data/products';
import { fetchProducts } from '@/services/api';

const FeaturedProducts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const scrollTo = searchParams.get('scrollTo');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle auto-scroll
  useEffect(() => {
    if (scrollTo === 'products') {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById('products-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [scrollTo]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data: Product[] = [];

        if (query) {
          // Client-side filtering for robust matching (e.g. "Sarees" matching "Saree")
          const allProducts = await fetchProducts({});
          const lowerQuery = query.toLowerCase();

          // Singularize common terms for better matching
          const searchTerms = lowerQuery.split(' ').map(term => {
            if (term.endsWith('s') && term.length > 3) return term.slice(0, -1);
            return term;
          });

          data = allProducts.filter(p => {
            const searchString = `${p.name} ${p.category} ${p.description} ${p.fabric} ${p.searchTags.join(' ')}`.toLowerCase();
            // Check if original query OR the singularized terms match
            return searchString.includes(lowerQuery) || searchTerms.some(t => searchString.includes(t));
          });

          // Sort by price (low to high) - Budget friendly first
          data.sort((a, b) => a.price - b.price);

          // Limit to 100 products
          if (data.length > 100) {
            data = data.slice(0, 100);
          }
        } else {
          // Default to budget friendly products for home page (400-600) NO MORE - User wants up to 100 products
          // Fetch all products, filter by budget if desired BUT user asked for "Home page must display up to 100 products".
          // The budget requirement was from previous turn, this turn "Display up to 100 products."
          // But let's respect the "budget friendly" TITLE of the section ("Budget Friendly Picks").
          // So we should probably keep budget filter but increase limit?
          // Or user said "Home page must display up to 100 products" implies show MORE.
          // Let's broaden the budget range or just show 100 sorted by price low-high to fit "Budget Friendly".

          const allProducts = await fetchProducts({});
          // Filter valid products and sort by price low -> high
          data = allProducts.sort((a, b) => a.price - b.price);

          // Deduplicate just in case backend sends dupes (though it shouldn't)
          data = Array.from(new Map(data.map(item => [item.id, item])).values());

          // Limit to 100
          if (data.length > 100) {
            data = data.slice(0, 100);
          }
        }

        if (data && data.length > 0) {
          // Ensure unique IDs for rendering
          const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
          setFeaturedProducts(uniqueData);
        } else {
          if (query) {
            // Last resort fallback so user sees SOMETHING
            const allProducts = await fetchProducts({});
            // Still sort by price
            allProducts.sort((a, b) => a.price - b.price);
            setFeaturedProducts(allProducts.slice(0, 20));
          } else {
            const budgetFallback = FALLBACK_FEATURED.filter(p => p.price >= 400 && p.price <= 600);
            setFeaturedProducts(budgetFallback);
          }
        }
      } catch (error) {
        console.error('Failed to load products, using fallback:', error);
        setFeaturedProducts(FALLBACK_FEATURED);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [query]);

  const FALLBACK_FEATURED: Product[] = [
    {
      id: 'f1',
      name: "Red Kanchipuram Silk Saree",
      category: "sarees",
      price: 11012,
      originalPrice: 13765,
      rating: 4.8,
      reviews: 120,
      isNew: true,
      isFeatured: true,
      inStock: true,
      stock: 50,
      image: "saree1.jpg",
      description: "Elegant Red Kanchipuram Silk Saree perfect for weddings and festive occasions.",
      fabric: "Silk",
      sizes: ["Free Size"],
      colors: ["Red", "Gold"],
      searchTags: ["red", "kanchipuram", "silk"],
      images: ["saree1.jpg"]
    },
    {
      id: 'f2',
      name: "Blue Banarasi Cotton Saree",
      category: "sarees",
      price: 18581,
      originalPrice: 23226,
      rating: 4.1,
      reviews: 85,
      isNew: true,
      isFeatured: true,
      inStock: true,
      stock: 30,
      image: "saree2.jpg",
      description: "Traditional Blue Banarasi Cotton Saree for a sophisticated look.",
      fabric: "Cotton",
      sizes: ["Free Size"],
      colors: ["Blue", "Silver"],
      searchTags: ["blue", "banarasi", "cotton"],
      images: ["saree2.jpg"]
    },
    {
      id: 'f3',
      name: "Pink Patola Chiffon Saree",
      category: "sarees",
      price: 10691,
      originalPrice: 13363,
      rating: 4.1,
      reviews: 92,
      isNew: true,
      isFeatured: true,
      inStock: true,
      stock: 45,
      image: "kurti1.jpg",
      description: "Lightweight and stylish Pink Patola Chiffon Saree.",
      fabric: "Chiffon",
      sizes: ["Free Size"],
      colors: ["Pink"],
      searchTags: ["pink", "patola", "chiffon"],
      images: ["kurti1.jpg"]
    },
    {
      id: 'f4',
      name: "Green Chanderi Georgette Saree",
      category: "sarees",
      price: 14717,
      rating: 4.3,
      reviews: 64,
      isNew: true,
      isFeatured: true,
      inStock: true,
      stock: 25,
      image: "fabric1.jpg",
      description: "Beautiful Green Chanderi Georgette Saree.",
      fabric: "Georgette",
      sizes: ["Free Size"],
      colors: ["Green"],
      searchTags: ["green", "chanderi"],
      images: ["fabric1.jpg"]
    }
  ];

  return (
    <section id="products-section" className="py-16 bg-card/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              {query ? 'Search Results' : 'Trending Now'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1 capitalize">
              {query ? (
                <>
                  {query} <span className="text-gradient-neon">Collection</span>
                </>
              ) : (
                <>
                  Budget <span className="text-gradient-neon">Friendly Picks</span>
                </>
              )}
            </h2>
          </div>
          <Link to="/products">
            <Button variant="outline" className="border-border/50 hover:border-secondary/50 hover:bg-secondary/10 hover:text-secondary group">
              View All Products
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
