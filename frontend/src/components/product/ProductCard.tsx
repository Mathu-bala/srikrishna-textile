import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
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
    <Link to={`/product/${product.id}`} className="group block">
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-neon-purple hover:border-primary/50">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-neon-green to-secondary rounded-full shadow-neon-green">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-accent to-primary rounded-full shadow-neon-pink">
                {Math.abs(discount)}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${inWishlist
              ? 'bg-accent text-white shadow-neon-pink'
              : 'bg-background/50 text-foreground hover:bg-accent/20 hover:text-accent border border-border/50'
              }`}
            onClick={handleWishlistToggle}
          >
            <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
          </button>

          {/* Quick Add to Cart & Buy Now */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
            {(!product.inStock || product.stock < 1) ? (
              <button
                className="w-full bg-muted/90 backdrop-blur-sm text-muted-foreground py-2 rounded-full flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Out of Stock
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Add to Cart - Primary to Purple Gradient */}
                <button
                  className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 active:scale-95 group/btn border border-white/10"
                  onClick={handleAddToCart}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover/btn:animate-shimmer" />
                  <ShoppingCart size={16} className="fill-current text-white" />
                  Add to Cart
                </button>

                {/* Buy Now - Accent to Emerald Gradient */}
                <button
                  className="w-full relative overflow-hidden bg-gradient-to-r from-accent to-emerald-500 text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 active:scale-95 group/btn border border-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const buyNowItem = {
                      ...product,
                      quantity: 1,
                      selectedSize: product.sizes?.[0],
                      selectedColor: product.colors?.[0]
                    };
                    sessionStorage.setItem('buyNowProduct', JSON.stringify(buyNowItem));
                    window.location.href = '/buy-now-checkout';
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent translate-x-[-100%] group-hover/btn:animate-shimmer" />
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">
            {product.fabric}
          </p>
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-secondary fill-secondary' : 'text-muted-foreground'}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-display font-bold text-lg text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
