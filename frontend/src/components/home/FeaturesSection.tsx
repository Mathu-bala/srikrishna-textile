import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹300',
    color: 'from-secondary to-neon-green',
    glow: 'shadow-neon-cyan',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions',
    color: 'from-primary to-accent',
    glow: 'shadow-neon-purple',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7-day return policy',
    color: 'from-accent to-primary',
    glow: 'shadow-neon-pink',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer care',
    color: 'from-neon-green to-secondary',
    glow: 'shadow-neon-green',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 bg-card/30 border-y border-border/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 text-center group hover:border-secondary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
