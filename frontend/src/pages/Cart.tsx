import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';

import { fetchProducts } from '@/services/api';
import { Product } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { getImageUrl } from '@/lib/imageUtils';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, setReturnUrl, logout } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();
  const shipping = total > 300 ? 0 : 99;
  const grandTotal = total + shipping;
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Fetch related products based on cart items
  useEffect(() => {
    const loadRelated = async () => {
      if (cartItems.length > 0) {
        // Get category of the first item to show related products
        // In a real app we might show mix, or valid recommendation engine
        const mainCategory = cartItems[0].product.category;
        try {
          const products = await fetchProducts({ category: mainCategory });
          // Filter out products already in cart
          const cartIds = new Set(cartItems.map(item => item.product.id));
          const filtered = products.filter(p => !cartIds.has(p.id)).slice(0, 8);
          setRelatedProducts(filtered);
        } catch (err) {
          console.error('Failed to load related products', err);
        }
      }
    };
    loadRelated();
  }, [cartItems]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setReturnUrl('/cart');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const order = await addOrder(
        cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        grandTotal
      );

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate(`/order-success?orderId=${order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      const message = error instanceof Error ? error.message : 'Checkout failed';
      if (message.includes('Not authorized') || message.includes('token failed')) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-background relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>
          <div className="text-center relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything yet
            </p>
            <Link to="/products">
              <Button className="btn-neon">
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
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

          <h1 className="font-display text-3xl font-bold mb-8">Shopping <span className="text-gradient-neon">Cart</span></h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="glass-card p-4 flex gap-4"
                >
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-medium text-foreground hover:text-secondary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-border/50 rounded-lg flex items-center justify-center hover:bg-muted/50 hover:border-secondary/50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-border/50 rounded-lg flex items-center justify-center hover:bg-muted/50 hover:border-secondary/50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-display font-bold text-lg">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-destructive hover:text-destructive/80 text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>



            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? 'text-neon-green' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-secondary flex items-center gap-1">
                      <Sparkles size={12} />
                      Add ₹{(300 - total).toLocaleString()} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-border/30 pt-3 flex justify-between font-display font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gradient-neon">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-6 btn-neon"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout')}
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Please login to continue with your order
                  </p>
                )}

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout powered by trusted payment gateways
                </p>
              </div>
            </div>

            {/* Related Products Section - Full Width */}
            {relatedProducts.length > 0 && (
              <div className="lg:col-span-3 mt-8 bg-card/30 rounded-xl p-6 backdrop-blur-sm border border-border/30">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-secondary" />
                  <h2 className="font-display text-xl font-bold">You might also like</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div >
      </main >
      <Footer />
    </div >
  );
};

export default Cart;
