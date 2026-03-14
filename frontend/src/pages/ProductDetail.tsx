import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, Star, Truck, RefreshCw, Shield, Loader2, Zap, ChevronLeft, ChevronRight, X, Maximize2, Camera, Box } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Product360View from '@/components/products/Product360View';
import { useTheme } from '@/context/ThemeContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const [product, setProduct] = useState<Product | null>(state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, setReturnUrl } = useAuth();
  const { mode } = useTheme();
  const navigate = useNavigate();

  const inWishlist = product ? isInWishlist(product.id) : false;
  const allImages = useMemo(() => product ? Array.from(new Set([product.image, ...(product.images || [])])) : [], [product]);
  const [imagesByColor, setImagesByColor] = useState<string[]>([]);
  const displayCount = 5;

  useEffect(() => {
    if (product) {
      let imagesToShow = allImages;
      if (selectedColor) {
        const colorLower = selectedColor.toLowerCase();
        const matches = allImages.filter(img => img.toLowerCase().includes(colorLower));
        if (matches.length > 0) imagesToShow = matches;
      }
      setImagesByColor(imagesToShow);
      setActiveImage(0);
      setThumbnailStartIndex(0);
    }
  }, [selectedColor, allImages, product]);

  const loadProductData = async () => {
    if (!id) return;
    setLoading(product ? false : true);
    setError(false);
    try {
      const productData = await fetchProductById(id);
      if (!productData) {
        setError(true);
        return;
      }
      setProduct(productData);
      
      // Initialize selections if not set
      if (!selectedSize && productData.sizes?.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      if (!selectedColor && productData.colors?.length > 0) {
        setSelectedColor(productData.colors[0]);
      }

      const related = await fetchProducts({ category: productData.category });
      setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
    } catch (err) {
      console.error("Error loading product details:", err);
      if (!product) setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadProductData(); 
  }, [id]);

  if (loading) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-grow flex items-center justify-center"><Loader2 className="h-10 w-10 text-primary animate-spin" /></main><Footer /></div>;
  if (error || !product) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-grow flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-semibold mb-4">Product Not Found</h1><p className="text-muted-foreground mb-6">The product you are looking for might have been removed or is temporarily unavailable.</p><Link to="/products"><Button className="btn-neon">Back to Catalog</Button></Link></div></main><Footer /></div>;

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isBridal = product.category?.toLowerCase() === 'bridal' || product.category?.toLowerCase() === 'sarees';

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />
      <main className="flex-grow container-custom py-8 md:py-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery Section */}
          <div className="space-y-6">
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 mb-4">
                <TabsTrigger value="image" className="data-[state=active]:bg-cyan-600 text-[10px] font-black uppercase tracking-widest py-2">Standard View</TabsTrigger>
                <TabsTrigger value="360" className="data-[state=active]:bg-cyan-600 text-[10px] font-black uppercase tracking-widest py-2 flex items-center gap-2 justify-center">
                  <Box size={14} /> AI 360°
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="mt-0">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                  <img src={getImageUrl(imagesByColor[activeImage] || product.image)} alt={product.name} className="w-full h-full object-contain" />
                  
                  {discount > 0 && <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">{discount}% OFF</span>}
                  
                  <button onClick={(e) => { e.stopPropagation(); navigate(isBridal ? '/ai/bridal-mirror' : '/ai/try-on'); }} className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-xl border border-white/20 text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-cyan-600 transition-all">
                    <Camera size={16} className="text-cyan-400" /> {isBridal ? 'Bridal Mirror' : 'Fashion Mirror'}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="360" className="mt-0">
                <Product360View product={product} />
              </TabsContent>
            </Tabs>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {imagesByColor.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === i ? 'border-cyan-500 scale-105 shadow-lg' : 'border-white/5 hover:border-white/20'}`}>
                  <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <p className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-2">{product.category} • {product.fabric}</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground leading-tight mb-4 uppercase tracking-tighter">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30 shadow-sm'} />)}
                </div>
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">({product.reviews} REVIEWS)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-foreground">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="text-lg sm:text-xl text-muted-foreground line-through font-bold">₹{product.originalPrice.toLocaleString()}</span>}
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm font-medium">{product.description}</p>

            {product.stock === 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3 text-destructive">
                <AlertTriangle size={20} />
                <p className="text-sm font-bold uppercase tracking-widest">Out of Stock – This product is currently unavailable.</p>
              </div>
            )}

            {/* Configs */}
            <div className="space-y-6 pt-4">
              {product.colors && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select Color</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(c => (
                      <button key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all shadow-md ${selectedColor === c ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-border hover:scale-105'}`} style={{ backgroundColor: c.toLowerCase() }} />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedSize === s ? 'border-primary bg-primary/10 text-primary shadow-lg' : 'border-border text-muted-foreground hover:border-primary/30'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => { 
                  if (product.stock > 0) {
                    addToCart(product, quantity, selectedSize, selectedColor); 
                    toast.success('Added to cart!'); 
                  }
                }} 
                disabled={product.stock === 0}
                className={`flex-1 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[11px] shadow-xl active:scale-95 ${product.stock === 0 ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' : (mode === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800')}`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                onClick={() => { 
                  if (product.stock > 0) {
                    sessionStorage.setItem('buyNowProduct', JSON.stringify({ 
                      ...product, 
                      quantity, 
                      selectedSize, 
                      selectedColor 
                    }));
                    navigate('/secure-checkout'); 
                  }
                }} 
                disabled={product.stock === 0}
                className={`flex-1 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[11px] shadow-xl flex items-center justify-center gap-2 ${product.stock === 0 ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 text-white hover:scale-[1.02]'}`}
              >
                <Zap size={16} /> Buy Now
              </button>
              <button 
                onClick={() => { if (product && isInWishlist(product.id)) removeFromWishlist(product.id); else if(product) addToWishlist(product); }} 
                className={`p-4 rounded-2xl border-2 transition-all shadow-lg ${product && isInWishlist(product.id) ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-border text-muted-foreground hover:border-rose-500/30'}`}
              >
                <Heart size={22} fill={product && isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} rating={product.rating} reviewsCount={product.reviews} />
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><X size={32} /></button>
            <img src={getImageUrl(imagesByColor[activeImage] || product.image)} className="max-w-full max-h-[90vh] object-contain rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
