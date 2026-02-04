import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanners from '@/components/home/PromoBanners';
import FeaturesSection from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoBanners />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
