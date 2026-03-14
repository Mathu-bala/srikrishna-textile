import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

import { getImageUrl } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, setReturnUrl } = useAuth();
  const navigate = useNavigate();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return; // Prevent adding out of stock items
    
    addToCart(
      product,
      1,
      product.sizes?.length > 0 ? product.sizes[0] : undefined,
      product.colors?.length > 0 ? product.colors[0] : undefined
    );
    navigate('/cart');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} state={{ product }} className="group block h-full">
      <div className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-[6px] hover:shadow-xl hover:shadow-black/10 hover:border-primary/50 h-full flex flex-col p-[16px]">
        {/* Image */}
        <div className="relative h-[180px] sm:h-[220px] shrink-0 w-full overflow-hidden bg-muted/30 rounded-xl">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover lg:group-hover:scale-110 transition-transform duration-[400ms] ease-out"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {product.isNew && (
              <span className="px-2 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-neon-green to-secondary rounded-full shadow-neon-green animate-badge-pulse">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-full shadow-md animate-badge-pulse">
                {Math.abs(discount)}% OFF
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-1 text-[11px] font-bold text-white bg-rose-600 rounded-full shadow-md animate-pulse">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Quick Actions Right Side */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 translate-x-0 lg:translate-x-12 opacity-100 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 transition-all duration-300 ease-out">
            {/* Wishlist */}
            <button
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm backdrop-blur-sm ${inWishlist
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/90 text-foreground hover:text-rose-500'
                }`}
              onClick={handleWishlistToggle}
            >
              <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
            </button>
            
            {/* Quick View (Desktop Only) */}
            <button
              className="w-9 h-9 rounded-full items-center justify-center transition-transform hover:scale-110 shadow-sm backdrop-blur-sm bg-white/90 text-foreground hover:text-primary hidden lg:flex"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${product.id}`);
              }}
            >
              <Eye size={18} />
            </button>

            {/* Quick Add To Cart (Desktop Only) */}
            <button
              className={`w-9 h-9 rounded-full items-center justify-center transition-transform hover:scale-110 shadow-sm backdrop-blur-sm bg-white/90 text-foreground hover:text-primary hidden lg:flex ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={18} />
            </button>
          </div>

          {/* Removed absolute mobile bottom button per request to move to normal flow */}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-1 line-clamp-1">
            {product.fabric}
          </p>
          <h3 className="font-black text-foreground uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-300" title={product.name}>
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-auto pt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating || 4) ? 'text-[#FACC15] fill-[#FACC15]' : 'text-muted-foreground/30 shadow-sm'}
              />
            ))}
            <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-widest">({product.reviews || Math.floor(Math.random() * 500 + 50)})</span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
            <span className="font-black text-sm sm:text-base md:text-lg text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-[11px] md:text-sm text-muted-foreground line-through font-bold">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile/Tablet Add to Cart */}
          <div className="mt-3 lg:hidden">
            {(!product.inStock || product.stock < 1) ? (
              <button
                className="w-full h-[36px] sm:h-[40px] px-[12px] py-[8px] sm:px-[16px] sm:py-[10px] bg-muted/90 text-muted-foreground rounded-[8px] flex items-center justify-center gap-2 text-[14px] sm:text-[15px] font-medium disabled:opacity-50"
                disabled
              >
                Out of Stock
              </button>
            ) : (
              <button
                className="w-full h-[36px] sm:h-[40px] px-[12px] py-[8px] sm:px-[16px] sm:py-[10px] bg-primary text-white rounded-[8px] flex items-center justify-center gap-2 text-[14px] sm:text-[15px] font-bold shadow-md active:scale-95"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-[16px] h-[16px]" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
