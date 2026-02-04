import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

import { getImageUrl } from '@/lib/imageUtils';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, setReturnUrl } = useAuth();
  const navigate = useNavigate();

  // Authentication check removed to allow guest wishlist access

  const handleAddToCart = (product: typeof wishlistItems[0]) => {
    addToCart(product, 1, product.sizes[0], product.colors[0]);
    navigate('/cart');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-background">
          <div className="text-center">
            <Heart size={64} className="mx-auto text-muted-foreground mb-6" />
            <h1 className="font-serif text-2xl font-semibold mb-2">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Start adding your favorite dresses.
            </p>
            <Link to="/products">
              <Button className="bg-primary text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container-custom py-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-3xl font-semibold">My Wishlist ({wishlistItems.length})</h1>
            <button
              onClick={clearWishlist}
              className="text-destructive hover:underline text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-xl overflow-hidden shadow-soft group"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-card rounded-full flex items-center justify-center shadow-soft hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-medium text-foreground hover:text-primary line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-foreground">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-primary text-primary-foreground"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
