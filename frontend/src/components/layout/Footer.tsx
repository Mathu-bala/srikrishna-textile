import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Bell, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50">
      {/* Newsletter Section */}
      <div className="border-b border-border/30">
        <div className="container-custom py-12">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
                <Sparkles size={16} />
                STAY CONNECTED
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                Subscribe to Our <span className="text-gradient-neon">Newsletter</span>
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get exclusive offers, new arrivals & style tips delivered to your inbox.
              </p>

              {subscribed ? (
                <div className="animate-scale-in flex items-center justify-center gap-2 text-neon-green font-medium">
                  <Bell size={20} className="animate-bounce" />
                  Subscribed Successfully! You'll receive our latest updates.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-muted/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary/50"
                    required
                  />
                  <Button type="submit" className="btn-neon whitespace-nowrap">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="SriKrishna Logo"
                  className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 dark:invert"
                />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-gradient-neon leading-tight">SriKrishna</h1>
                <p className="text-xs text-muted-foreground">PREMIUM FASHION</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Bringing the future of fashion to your wardrobe with our premium collection of ethnic and modern wear.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary/50 hover:shadow-neon-cyan transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact Us', 'Help Center', 'Order Support', 'Returns & Refunds', 'Shipping Info'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Contact Us' ? '/contact' : '#'} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {[
                { name: 'Sarees', path: '/products?q=sarees' },
                { name: 'Kurtis', path: '/products?q=kurtis' },
                { name: 'Men\'s Wear', path: '/products?q=mens' },
                { name: 'Kids Wear', path: '/products?q=kids' },
                { name: 'Fabrics', path: '/products?q=fabrics' },
              ].map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Customer Care</h4>
            <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium border border-primary/20 mb-2">24/7 Support Available</span>
              <p className="text-xs text-muted-foreground">Working Hours: Always Open / 24×7</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Fashion Street, Textile District, Mumbai - 400001
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-secondary flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">+91 98765 43210</p>
                  <p className="text-xs text-muted-foreground">Call or WhatsApp</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-secondary flex-shrink-0" />
                <a href="mailto:support@srikrishnatextiles.com" className="text-muted-foreground hover:text-secondary transition-colors">
                  support@srikrishnatextiles.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SriKrishna. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-secondary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-secondary text-sm transition-colors">Terms of Service</a>
            <Link to="/track-order" className="text-muted-foreground hover:text-secondary text-sm transition-colors">Track Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
