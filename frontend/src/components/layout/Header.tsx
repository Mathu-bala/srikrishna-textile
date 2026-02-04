import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, Package, LogOut, Sparkles, Bell, ChevronDown, Headphones, TrendingUp, Download } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout, setReturnUrl } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      getNotifications().then(data => {
        setUnreadNotifications(data.filter(n => !n.isRead).length);
      }).catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/', query: '' },
    { name: 'Women\'s Wear', path: '/#products', query: 'women' },
    { name: 'Sarees', path: '/#products', query: 'sarees' },
    { name: 'Kurtis', path: '/#products', query: 'kurtis' },
    { name: 'Men\'s Wear', path: '/#products', query: 'mens' },
    { name: 'Kids Wear', path: '/#products', query: 'kids' },
    { name: 'Fabrics', path: '/#products', query: 'fabrics' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string, query: string) => {
    if (path.includes('#products')) {
      e.preventDefault();

      // Navigate to home if not on home
      if (window.location.pathname !== '/') {
        navigate(`/?q=${query}&scrollTo=products`);
      } else {
        // Just scroll and update search
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
          // We would ideally dispatch an event or use context to update search, 
          // but for now let's just use URL search param update which might trigger re-render if observing
          if (query) {
            navigate(`/?q=${query}`);
          } else {
            navigate('/');
          }
        }
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

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      {/* Top bar */}
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

      {/* Main header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center gap-1 group order-first lg:order-none mr-auto lg:mr-0 text-center min-w-[max-content]">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="SriKrishna Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--glow-primary)] dark:invert"
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="font-display font-bold text-sm md:text-base text-foreground tracking-tight">
                SriKrishna
              </span>
              <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-0.5">
                Textile Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 lg:gap-5 mx-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path, link.query || '')}
                className="text-sm font-medium text-foreground/80 hover:text-secondary transition-all duration-200 hover:drop-shadow-[0_0_8px_hsl(188_94%_53%_/_0.5)] cursor-pointer whitespace-nowrap px-2 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors text-foreground order-first mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Search */}
            <div className="hidden md:block w-64">
              <SearchAutocomplete />
            </div>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={22} />
            </button>


            {/* Cart */}
            <Link to="/cart" className="p-2 hover:bg-muted rounded-lg transition-all duration-200 relative group">
              <ShoppingCart size={22} className="text-foreground group-hover:text-secondary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center font-medium shadow-neon-cyan">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 font-medium text-foreground/70 hover:text-secondary hover:drop-shadow-[0_0_8px_hsl(188_94%_53%_/_0.5)] transition-all px-2 outline-none">
                  More
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
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* User */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/10">
                    <User size={18} />
                    {user?.name?.split(' ')[0]}
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
                  <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="hover:bg-destructive/10 text-destructive">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button size="sm" className="hidden sm:flex gap-2 btn-neon">
                  <User size={18} />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="mt-4 md:hidden">
            <SearchAutocomplete
              onSearch={() => setIsSearchOpen(false)}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/50">
          <div className="container-custom py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path, link.query || '')}
                className="py-2 px-4 text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200 cursor-pointer block"
              >
                {link.name}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-orders"
                  className="py-2 px-4 text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="py-2 px-4 text-left text-foreground/70 hover:text-destructive hover:bg-muted rounded-lg font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-2 px-4 text-foreground/70 hover:text-secondary hover:bg-muted rounded-lg font-medium transition-all duration-200 sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
