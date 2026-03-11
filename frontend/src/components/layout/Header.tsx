import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, Package, LogOut, Sparkles, Bell, ChevronDown, Headphones, Download } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SearchAutocomplete from '@/components/ui/SearchAutocomplete';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { getNotifications } from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

// ── Category data with subcategories ──────────────────────────────────────
const categories = [
  {
    name: "Women's Wear",
    query: 'women',
    subcategories: [
      { name: 'Silk Sarees',        query: 'silk-sarees' },
      { name: 'Cotton Sarees',      query: 'cotton-sarees' },
      { name: 'Designer Sarees',    query: 'designer-sarees' },
      { name: 'Party Wear Sarees',  query: 'party-wear-sarees' },
      { name: 'Casual Sarees',      query: 'casual-sarees' },
    ],
  },
  {
    name: 'Sarees',
    query: 'sarees',
    subcategories: [
      { name: 'Silk Sarees',     query: 'silk-sarees' },
      { name: 'Cotton Sarees',   query: 'cotton-sarees' },
      { name: 'Designer Sarees', query: 'designer-sarees' },
      { name: 'Banarasi Sarees', query: 'banarasi-sarees' },
      { name: 'Printed Sarees',  query: 'printed-sarees' },
    ],
  },
  {
    name: 'Kurtis',
    query: 'kurtis',
    subcategories: [
      { name: 'Casual Kurtis',   query: 'casual-kurtis' },
      { name: 'Designer Kurtis', query: 'designer-kurtis' },
      { name: 'Anarkali Kurtis', query: 'anarkali-kurtis' },
      { name: 'Straight Kurtis', query: 'straight-kurtis' },
    ],
  },
  {
    name: "Men's Wear",
    query: 'mens',
    subcategories: [
      { name: 'Shirts',      query: 'shirts' },
      { name: 'T-Shirts',    query: 't-shirts' },
      { name: 'Kurtas',      query: 'kurtas' },
      { name: 'Ethnic Wear', query: 'ethnic-wear' },
      { name: 'Casual Wear', query: 'casual-wear' },
    ],
  },
  {
    name: 'Kids Wear',
    query: 'kids',
    subcategories: [
      { name: 'Kids Dresses',     query: 'kids-dresses' },
      { name: 'Kids Ethnic Wear', query: 'kids-ethnic-wear' },
      { name: 'Kids Shirts',      query: 'kids-shirts' },
      { name: 'Kids Frocks',      query: 'kids-frocks' },
    ],
  },
  {
    name: 'Fabrics',
    query: 'fabrics',
    subcategories: [
      { name: 'Cotton Fabric',   query: 'cotton-fabric' },
      { name: 'Silk Fabric',     query: 'silk-fabric' },
      { name: 'Linen Fabric',    query: 'linen-fabric' },
      { name: 'Designer Fabric', query: 'designer-fabric' },
    ],
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isSearchOpen, setIsSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [openMobileCat, setOpenMobileCat] = useState<string | null>(null);

  const { cartItems }  = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout, setReturnUrl } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      getNotifications()
        .then(data => setUnreadNotifications(data.filter((n: any) => !n.isRead).length))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (e: React.MouseEvent, path: string, query: string) => {
    if (path.includes('#products')) {
      e.preventDefault();
      if (window.location.pathname !== '/') {
        navigate(`/?q=${query}&scrollTo=products`);
      } else {
        const sec = document.getElementById('products-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        navigate(query ? `/?q=${query}` : '/');
      }
      setIsMenuOpen(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const goToCategory = (query: string) => {
    navigate(`/products?category=${query}`);
    setIsMenuOpen(false);
    setOpenMobileCat(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">

      {/* ── Top promo bar ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 text-foreground text-xs md:text-sm py-2">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sparkles size={14} className="text-secondary" />
              <span className="hidden sm:inline">Free Shipping on Orders Above ₹300</span>
            </span>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <span className="flex items-center gap-1 font-medium">
              <span className="text-secondary">24/7 Support:</span> +91 98765 43210
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:support@srikrishnatextiles.com" className="hover:text-secondary transition-colors">
              support@srikrishnatextiles.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Main header row ─────────────────────────────────────────────────── */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-[72px] gap-2 lg:gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative shrink-0 flex justify-center">
              <img
                src="/logo.png"
                alt="SriKrishna Logo"
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--glow-primary)] dark:invert"
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-display font-bold text-sm md:text-base text-foreground tracking-tight whitespace-nowrap">
                SriKrishna
              </span>
              <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-0.5 whitespace-nowrap hidden md:block">
                Textile Shop
              </span>
            </div>
          </Link>

          {/* Search Bar (center, desktop) */}
          <div className="hidden lg:flex items-center justify-center w-full max-w-[500px] mx-4">
            <div className="w-full relative">
              <SearchAutocomplete />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0 justify-end">

            {/* Mobile search toggle */}
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
            </button>

            {/* Home link (desktop) */}
            <Link
              to="/"
              className="hidden lg:flex items-center p-2 hover:bg-muted rounded-lg transition-all duration-200 text-foreground font-medium hover:text-secondary"
            >
              Home
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 hover:bg-muted rounded-lg transition-all duration-200 relative group">
              <ShoppingCart className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px] text-foreground group-hover:text-secondary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-secondary text-secondary-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium shadow-neon-cyan">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-1 font-medium text-foreground/70 hover:text-secondary transition-all p-1 outline-none">
                  <span>More</span>
                  <ChevronDown size={14} className="stroke-[3]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/50">
                <DropdownMenuItem onClick={() => navigate('/notifications')} className="hover:bg-primary/10 cursor-pointer">
                  <Bell size={16} className="mr-2 text-primary" />
                  Notification Preferences
                  {unreadNotifications > 0 && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contact')} className="hover:bg-primary/10 cursor-pointer">
                  <Headphones size={16} className="mr-2 text-secondary" />
                  24x7 Customer Care
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer">
                  <Download size={16} className="mr-2 text-foreground" />
                  Download App
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User / Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex border-border/50 hover:bg-primary/10 text-foreground w-auto h-auto p-2">
                    <User className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/50">
                  <DropdownMenuItem onClick={() => navigate('/my-orders')} className="hover:bg-primary/10">
                    <Package size={16} className="mr-2 text-secondary" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')} className="hover:bg-primary/10">
                    <Heart size={16} className="mr-2 text-foreground" />
                    Wishlist
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-primary/10">
                      <Package size={16} className="mr-2 text-neon-green" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => navigate(user?.isAdmin ? '/admin/profile' : '/profile')} className="hover:bg-primary/10">
                    <User size={16} className="mr-2 text-foreground" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="hover:bg-destructive/10 text-destructive">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button size="sm" className="btn-neon px-4">Login</Button>
              </Link>
            )}

            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Mobile hamburger */}
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen
                ? <X className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
                : <Menu className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />}
            </button>
          </div>
        </div>

        {/* ── Desktop category nav — hover dropdowns ────────────────────────── */}
        <nav className="hidden lg:flex items-center justify-center gap-1 py-2 border-t border-border/50 mt-2">
          {categories.map((cat) => (
            <div key={cat.name} className="relative group">
              {/* Category trigger */}
              <button
                onClick={() => goToCategory(cat.query)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-secondary transition-all duration-200 hover:drop-shadow-[0_0_8px_hsl(188_94%_53%_/_0.5)] rounded-lg hover:bg-muted/50 whitespace-nowrap"
              >
                {cat.name}
                <ChevronDown
                  size={13}
                  className="stroke-[2.5] transition-transform duration-200 group-hover:rotate-180"
                />
              </button>

              {/* Dropdown panel (CSS hover, no JS needed on desktop) */}
              <div className="absolute top-full left-0 mt-1 w-52 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                <div className="py-2 px-1">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.query}
                      onClick={() => goToCategory(sub.query)}
                      className="w-full text-left px-3 py-2.5 text-sm text-foreground/80 hover:text-secondary hover:bg-primary/10 rounded-lg transition-all duration-150"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Mobile search bar (toggle) */}
        {isSearchOpen && (
          <div className="mt-4 md:hidden">
            <SearchAutocomplete onSearch={() => setIsSearchOpen(false)} className="w-full" />
          </div>
        )}
      </div>

      {/* ── Mobile navigation panel ──────────────────────────────────────────── */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 h-[100vh] overflow-y-auto pb-32">
          <div className="container-custom py-4 flex flex-col gap-2">

            {/* User account links */}
            <a
              href="/"
              className="py-[14px] px-[16px] text-[18px] text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200 block"
            >
              Home
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-orders"
                  className="py-[14px] px-[16px] text-[18px] block text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="py-[14px] px-[16px] text-[18px] block text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to={user?.isAdmin ? '/admin/profile' : '/profile'}
                  className="py-[14px] px-[16px] text-[18px] block text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="py-[14px] px-[16px] text-[18px] block text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); navigate('/login'); }}
                  className="w-full py-[14px] px-[16px] text-[18px] text-left text-foreground/70 hover:text-destructive hover:bg-muted rounded-lg font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-[14px] px-[16px] text-[18px] block text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200 sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}

            {/* Divider */}
            <div className="h-px bg-border/50 my-2" />

            {/* Category accordion */}
            {categories.map((cat) => (
              <div key={cat.name}>
                {/* Category row — click to expand */}
                <button
                  onClick={() => setOpenMobileCat(openMobileCat === cat.name ? null : cat.name)}
                  className="w-full flex items-center justify-between py-[14px] px-[16px] text-[18px] text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200"
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${openMobileCat === cat.name ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Subcategory list */}
                {openMobileCat === cat.name && (
                  <div className="ml-4 flex flex-col gap-1 mt-1 mb-2">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.query}
                        onClick={() => goToCategory(sub.query)}
                        className="text-left py-[10px] px-[16px] text-[16px] text-foreground/60 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-150"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
