import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanners = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <div className="glass-card p-8 md:p-10 relative overflow-hidden group hover:shadow-neon-purple transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-neon-purple">
                <Sparkles className="text-white" size={24} />
              </div>
              <span className="text-secondary text-sm font-medium uppercase tracking-wider">Special Offer</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2 mb-3">
                Get <span className="text-gradient-neon">30% OFF</span> on Silk Sarees
              </h3>
              <p className="text-muted-foreground mb-6">
                Exclusive collection of handwoven silk sarees with intricate designs.
              </p>
              <Link to="/products?q=silk saree">
                <Button className="btn-neon group/btn">
                  Shop Now
                  <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="glass-card p-8 md:p-10 relative overflow-hidden group hover:shadow-neon-cyan transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/30 to-neon-green/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-neon-green flex items-center justify-center mb-6 shadow-neon-cyan">
                <Zap className="text-background" size={24} />
              </div>
              <span className="text-secondary text-sm font-medium uppercase tracking-wider">New Arrivals</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2 mb-3">
                Designer <span className="text-gradient-cyan">Kurtis</span> Collection
              </h3>
              <p className="text-muted-foreground mb-6">
                Latest trendy kurtis with modern designs and comfortable fabrics.
              </p>
              <Link to="/products?q=kurti">
                <Button className="btn-neon-cyan group/btn">
                  Explore
                  <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Full width banner */}
        <div className="mt-6 glass-card p-8 md:p-12 relative overflow-hidden group hover:shadow-neon-green transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 via-secondary/10 to-primary/10" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green to-secondary flex items-center justify-center shadow-neon-green">
                <Gift className="text-background" size={32} />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  Free Shipping on Orders Above ₹300
                </h3>
                <p className="text-muted-foreground">Use code: <span className="text-secondary font-semibold">NEON2024</span></p>
              </div>
            </div>
            <Link to="/products">
              <Button size="lg" className="btn-neon-green whitespace-nowrap">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
