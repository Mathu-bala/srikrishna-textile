import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, Star, Truck, RefreshCw, Shield, Loader2, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { fetchProductById, fetchProducts } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
import ProductReviews from '@/components/product/ProductReviews';

import { getImageUrl } from '@/lib/imageUtils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, setReturnUrl } = useAuth();
  const navigate = useNavigate();

  // Check if product is in wishlist
  const inWishlist = product ? isInWishlist(product.id) : false;

  const loadProductData = async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const productData = await fetchProductById(id);
      setProduct(productData);
      setSelectedSize(productData.sizes?.[0] || '');
      setSelectedColor(productData.colors?.[0] || '');

      // Fetch related products
      const related = await fetchProducts({ category: productData.category });
      setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const buyNowItem = {
      ...product,
      quantity,
      selectedSize,
      selectedColor
    };
    sessionStorage.setItem('buyNowProduct', JSON.stringify(buyNowItem));
    navigate('/buy-now-checkout');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      setReturnUrl(`/product/${id}`);
      navigate('/login');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount !== 0 && (
                  <span className="absolute top-4 left-4 bg-gold text-charcoal text-sm font-medium px-3 py-1 rounded">
                    {Math.abs(discount)}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded">
                    NEW
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <p className="text-sm text-gold font-medium uppercase tracking-wider mb-2">
                {product.fabric}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-muted'
                      }
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-serif text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block font-medium mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="block font-medium mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${selectedColor === color
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-maroon-dark text-primary-foreground"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || product.stock < 1}
                >
                  {(!product.inStock || product.stock < 1) ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground btn-neon"
                  onClick={handleBuyNow}
                  disabled={!product.inStock || product.stock < 1}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`px-4 border-primary/50 hover:bg-primary/10 transition-colors ${inWishlist ? 'border-accent text-accent' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart size={20} className={inWishlist ? 'fill-accent text-accent' : 'text-foreground'} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="text-primary" size={24} />
                  <span className="text-sm text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RefreshCw className="text-primary" size={24} />
                  <span className="text-sm text-muted-foreground">7 Days Return</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="text-primary" size={24} />
                  <span className="text-sm text-muted-foreground">100% Authentic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {product && (
            <ProductReviews
              productId={product.id}
              rating={product.rating}
              reviewsCount={product.reviews}
            />
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-2xl font-semibold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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

export default ProductDetail;
