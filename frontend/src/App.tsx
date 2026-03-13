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
import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/layout/SplashScreen";
import { GoogleOAuthProvider } from "@react-oauth/google";

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

// ── Lazy-loaded AI modules ────────────────────────────────────────────────────
const _AIFeatures       = lazy(() => import("./pages/AIFeatures"));
const _OutfitPlanner    = lazy(() => import("./components/ai/OutfitPlanner"));
const _ColorMatcher     = lazy(() => import("./components/ai/ColorMatcher"));
const _SareeDesigner    = lazy(() => import("./components/ai/SareeDesigner"));
const _BridalMirror     = lazy(() => import("./pages/AIBridalMirror"));
const _BridalPlanner    = lazy(() => import("./pages/AIBridalPlanner"));
const _VisualSearch     = lazy(() => import("./pages/AIVisualSearch"));
const _FashionAdvisor   = lazy(() => import("./components/ai/FashionAdvisor"));

const _FashionMirror    = lazy(() => import("./pages/AIFashionMirror"));
const _SizeDetector     = lazy(() => import("./components/ai/SizeDetector"));
const _FabricKnowledge  = lazy(() => import("./components/ai/FabricKnowledge"));
const _FestivalLooks    = lazy(() => import("./components/ai/FestivalLooks"));
const _Trending         = lazy(() => import("./components/ai/TrendingNearYou"));
const _Tailors          = lazy(() => import("./components/ai/TailorFinder"));
const _AIChatbot        = lazy(() => import("./components/ai/AIChatbot"));

const Spin = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    
                    <AnimatePresence mode="wait">
                      {showSplash ? (
                        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
                      ) : (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                          className="min-h-screen"
                        >
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
                              {/* ── AI Features ── */}
                              <Route path="/ai-features"        element={<Suspense fallback={<Spin />}><_AIFeatures /></Suspense>} />
                              <Route path="/ai/outfit-planner"  element={<Suspense fallback={<Spin />}><_OutfitPlanner /></Suspense>} />
                              <Route path="/ai/color-matcher"   element={<Suspense fallback={<Spin />}><_ColorMatcher /></Suspense>} />
                              <Route path="/ai/saree-designer"  element={<Suspense fallback={<Spin />}><_SareeDesigner /></Suspense>} />
                              <Route path="/ai/bridal-mirror"   element={<Suspense fallback={<Spin />}><_BridalMirror /></Suspense>} />
                              <Route path="/ai/bridal-planner"  element={<Suspense fallback={<Spin />}><_BridalPlanner /></Suspense>} />
                              <Route path="/ai/bridal-planner"  element={<Suspense fallback={<Spin />}><_BridalPlanner /></Suspense>} />
                              <Route path="/ai/visual-search"   element={<Suspense fallback={<Spin />}><_VisualSearch /></Suspense>} />
                              <Route path="/ai/fashion-advisor" element={<Suspense fallback={<Spin />}><_FashionAdvisor /></Suspense>} />
                              <Route path="/ai/try-on"          element={<Suspense fallback={<Spin />}><_FashionMirror /></Suspense>} />
                              <Route path="/ai/size-guide"      element={<Suspense fallback={<Spin />}><_SizeDetector /></Suspense>} />
                              <Route path="/ai/fabric-knowledge" element={<Suspense fallback={<Spin />}><_FabricKnowledge /></Suspense>} />
                              <Route path="/ai/festival-looks"  element={<Suspense fallback={<Spin />}><_FestivalLooks /></Suspense>} />
                              <Route path="/ai/trending"        element={<Suspense fallback={<Spin />}><_Trending /></Suspense>} />
                              <Route path="/ai/tailors"         element={<Suspense fallback={<Spin />}><_Tailors /></Suspense>} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                            {/* Global Support System & AI Chatbot — visible on all pages */}
                            <Suspense fallback={null}><_AIChatbot /></Suspense>
                          </BrowserRouter>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TooltipProvider>
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
