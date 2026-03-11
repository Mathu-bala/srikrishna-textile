import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, Star, Truck, RefreshCw, Shield, Loader2, Zap, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
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

  const allImages = useMemo(() => product ? Array.from(new Set([product.image, ...(product.images || [])])) : [], [product]);
  const [imagesByColor, setImagesByColor] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const displayCount = 5;

  useEffect(() => {
    if (product) {
      let imagesToShow = allImages;
      if (selectedColor) {
        const colorLower = selectedColor.toLowerCase();
        const matches = allImages.filter(img => img.toLowerCase().includes(colorLower));
        if (matches.length > 0) {
          imagesToShow = matches;
        }
      }
      setImagesByColor(imagesToShow);
      setActiveImage(0);
      setThumbnailStartIndex(0);
    }
  }, [selectedColor, allImages, product]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImage((prev) => (prev === 0 ? imagesByColor.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImage((prev) => (prev === imagesByColor.length - 1 ? 0 : prev + 1));
  };
  
  const handleThumbnailPrev = () => {
    setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleThumbnailNext = () => {
    setThumbnailStartIndex((prev) => Math.min(imagesByColor.length - displayCount, prev + 1));
  };

  const loadProductData = async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const productData = await fetchProductById(id);
      setProduct(productData);
      setSelectedSize(productData.sizes?.[0] || '');
      setSelectedColor(productData.colors?.[0] || '');
      
      setActiveImage(0);
      setThumbnailStartIndex(0);

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
        <div className="container-custom py-12">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image Section */}
            <div className="space-y-6">
              <div 
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted cursor-pointer group shadow-lg"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  key={imagesByColor[activeImage] || product.image}
                  src={getImageUrl(imagesByColor[activeImage] || product.image)}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-in fade-in duration-500"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <Maximize2 size={36} className="text-neon-cyan drop-shadow-md glow" />
                </div>
                
                {discount !== 0 && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-primary text-white text-sm font-medium px-3 py-1 rounded shadow-neon-pink z-10">
                    {Math.abs(discount)}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-neon-green to-secondary text-white text-sm font-medium px-3 py-1 rounded shadow-neon-green z-10">
                    NEW
                  </span>
                )}
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="text-sm text-neon-cyan hover:text-white transition-colors duration-300 underline underline-offset-4 decoration-neon-cyan/50 hover:decoration-white"
                >
                  Click to see full view
                </button>
              </div>

              {/* Thumbnails Row */}
              {imagesByColor.length > 1 && (
                <div className="relative flex items-center justify-center gap-2 max-w-full px-6">
                  {imagesByColor.length > displayCount && (
                    <button 
                      onClick={handleThumbnailPrev} 
                      disabled={thumbnailStartIndex === 0}
                      className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-background/60 backdrop-blur-md rounded-full border border-border shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 snap-x flex-nowrap w-full">
                    {imagesByColor.slice(thumbnailStartIndex, thumbnailStartIndex + displayCount).map((img, index) => {
                       const actualIndex = thumbnailStartIndex + index;
                       const isActive = activeImage === actualIndex;
                       return (
                         <div 
                           key={actualIndex}
                           onClick={() => setActiveImage(actualIndex)}
                           className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 snap-center glass-card
                             ${isActive 
                               ? 'ring-2 ring-neon-cyan border-none scale-105 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                               : 'border border-border/50 hover:border-neon-cyan/80 hover:scale-105 opacity-70 hover:opacity-100'}
                           `}
                         >
                           <img 
                             src={getImageUrl(img)} 
                             alt={`${product.name} thumbnail ${actualIndex + 1}`}
                             loading="lazy"
                             className="w-full h-full object-cover"
                           />
                         </div>
                       );
                    })}
                  </div>

                  {imagesByColor.length > displayCount && (
                    <button 
                      onClick={handleThumbnailNext}
                      disabled={thumbnailStartIndex >= imagesByColor.length - displayCount}
                      className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-background/60 backdrop-blur-md rounded-full border border-border shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              )}
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

              {/* Color Selection - Moving Up per prompt */}
              {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block font-medium mb-3">Color:</label>
                <div className="flex flex-wrap gap-4 items-center">
                  {product.colors.map((color) => {
                    const isActive = selectedColor === color;
                    
                    // Basic heuristic color map for CSS circular dots
                    const cssColorMap: Record<string, string> = {
                      'red': '#ef4444',
                      'blue': '#3b82f6',
                      'black': '#000000',
                      'green': '#22c55e',
                      'pink': '#ec4899',
                      'white': '#ffffff',
                      'purple': '#a855f7',
                      'yellow': '#eab308',
                      'cyan': '#22d3ee'
                    };
                    const mappedColor = cssColorMap[color.toLowerCase()] || color.toLowerCase();

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex items-center gap-2 transition-all duration-300 rounded-full pr-3 pb-1 pt-1 ${
                          isActive 
                            ? 'scale-105' 
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div 
                           className={`w-6 h-6 rounded-full border border-border/50 shadow-sm transition-all duration-300
                            ${isActive ? 'ring-2 ring-neon-cyan ring-offset-2 ring-offset-background shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'group-hover:ring-1 group-hover:ring-border group-hover:ring-offset-1 group-hover:ring-offset-background'}
                           `}
                           style={{ backgroundColor: mappedColor }}
                           title={color}
                        />
                        <span className={`text-sm ${isActive ? 'text-neon-cyan font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] glow' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

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

              {/* Original Color Selection removed -> Moved Above */}

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
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <Button
                    className="h-[36px] px-[12px] py-[8px] text-[14px] rounded-[8px] sm:h-[40px] sm:px-[16px] sm:py-[10px] sm:text-[15px] lg:h-auto lg:min-h-[44px] lg:px-8 lg:py-6 lg:text-lg lg:rounded-md flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.stock < 1}
                  >
                    {(!product.inStock || product.stock < 1) ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    className="h-[36px] px-[12px] py-[8px] text-[14px] rounded-[8px] sm:h-[40px] sm:px-[16px] sm:py-[10px] sm:text-[15px] lg:h-auto lg:min-h-[44px] lg:px-8 lg:py-6 lg:text-lg lg:rounded-md flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground btn-neon transition-all"
                    onClick={handleBuyNow}
                    disabled={!product.inStock || product.stock < 1}
                  >
                    <Zap className="mr-1 sm:mr-2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" />
                    Buy Now
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className={`h-[36px] px-[12px] py-[8px] text-[14px] rounded-[8px] sm:h-[40px] sm:px-[16px] sm:py-[10px] sm:text-[15px] lg:h-auto lg:min-h-[44px] lg:px-8 lg:text-lg lg:rounded-md border-primary/50 hover:bg-primary/10 transition-colors w-full sm:w-auto ${inWishlist ? 'border-accent text-accent' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] ${inWishlist ? 'fill-accent text-accent' : 'text-foreground'}`} />
                  <span className="ml-2 sm:hidden">Wishlist</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsLightboxOpen(false)}>
          {/* Close Button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-neon-cyan bg-muted/40 hover:bg-muted/80 rounded-full transition-all duration-300 z-50 backdrop-blur-sm shadow-lg"
          >
            <X size={24} />
          </button>
          
          {/* Image Counter */}
          <div className="absolute top-6 left-6 px-4 py-2 text-foreground bg-muted/40 rounded-full text-sm font-medium tracking-wider backdrop-blur-sm border border-border/50 shadow-lg">
            {activeImage + 1} / {imagesByColor.length}
          </div>

          {/* Previous Arrow */}
          {imagesByColor.length > 1 && (
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 md:left-12 p-3 text-muted-foreground hover:text-neon-cyan bg-muted/40 hover:bg-muted/80 rounded-full transition-all duration-300 z-50 backdrop-blur-sm group shadow-lg"
            >
              <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          )}

          {/* Main Lightbox Image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={getImageUrl(imagesByColor[activeImage] || product.image)} 
              alt={`${product.name} full view`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 border border-border/20"
            />
          </div>

          {/* Next Arrow */}
          {imagesByColor.length > 1 && (
            <button 
              onClick={handleNextImage}
              className="absolute right-4 md:right-12 p-3 text-muted-foreground hover:text-neon-cyan bg-muted/40 hover:bg-muted/80 rounded-full transition-all duration-300 z-50 backdrop-blur-sm group shadow-lg"
            >
              <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
