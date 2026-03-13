import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Bell, Sparkles, Shirt, ShoppingBag, Palette, ArrowRight, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50">
      {/* Fashion Promotion Section (Replacement for Newsletter) */}
      <div className="border-b border-border/30">
        <div className="container-custom pt-0 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-card p-8 md:p-16 text-center relative overflow-hidden group bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10"
          >
            {/* Animated Background Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 animate-pulse" />
            
            {/* Floating Fashion Icons */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 left-[10%] text-primary/20 hidden lg:block"
            >
              <Shirt size={40} />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 left-[15%] text-secondary/20 hidden lg:block"
            >
              <ShoppingBag size={36} />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-20 right-[12%] text-accent/20 hidden lg:block"
            >
              <Palette size={44} />
            </motion.div>

            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6 border border-primary/20"
              >
                <Zap size={14} className="fill-current" />
                Limited Edition
              </motion.div>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tighter uppercase italic">
                Discover Your <span className="text-gradient-neon">Perfect Style</span>
              </h2>
              
              <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                Explore trending sarees, bridal collections, and exclusive fashion picks curated just for you. Elevation of elegance begins here.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/products">
                  <Button size="lg" className="btn-neon text-[11px] font-black uppercase tracking-[0.2em] px-10 h-14 rounded-2xl group">
                    Explore Collection
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/products?newest=true">
                  <Button variant="outline" size="lg" className="text-[11px] font-black uppercase tracking-[0.2em] px-10 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                    View New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
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
                  Thayilpatti, Sivakasi,<br />
                  Virudhunagar District,<br />
                  Tamil Nadu - 626128, India
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Phone size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+919786632306" className="font-medium text-foreground hover:text-secondary transition-colors">
                    +91 97866 32306
                  </a>
                  <a 
                    href="https://wa.me/919786632306?text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20saree%20collections" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-green-400 transition-colors flex items-center gap-1.5"
                  >
                    Call or WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:madhu.matt.matti@gmail.com" className="text-muted-foreground hover:text-secondary transition-colors break-all">
                    madhu.matt.matti@gmail.com
                  </a>
                  <a href="mailto:support@srikrishnatextiles.com" className="text-muted-foreground hover:text-secondary transition-colors break-all">
                    support@srikrishnatextiles.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            © 2024 SriKrishna. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
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
