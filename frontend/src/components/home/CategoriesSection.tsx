import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { getImageUrl } from '@/lib/imageUtils';

const categoryImages: Record<string, string> = {
  sarees: 'saree-red-silk.jpg',
  kurtis: 'kurti-teal-cotton.jpg',
  mens: 'kurta-cream-ethnic.jpg',
  kids: 'kids-girl-dress.jpg',
  fabrics: 'fabric-linen-beige.jpg',
};

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium uppercase tracking-wider mb-2">
            Explore
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Shop by <span className="text-primary">Category</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?q=${category.id}`} // Search-based navigation
              className="group flex flex-col items-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow bg-muted">
                <img
                  src={getImageUrl(categoryImages[category.id])}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors text-center">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">{category.count}+ Products</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
