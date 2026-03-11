import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import BuyNowCheckout from "./pages/BuyNowCheckout";
import PaymentFailed from "./pages/PaymentFailed";
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/buy-now-checkout" element={<BuyNowCheckout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/orders/:orderId" element={<TrackOrder />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/checkout" element={<BuyNowCheckout />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <FloatingWhatsApp />
                </BrowserRouter>
              </TooltipProvider>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
