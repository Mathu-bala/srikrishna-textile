import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/lib/imageUtils';

const slides = [
  {
    id: 1,
    image: 'kids-girl-dress.jpg',
    title: "Joyful Kids Collection",
    subtitle: "Kids ethnic / comfortable wear",
    cta: "Shop Kids",
    link: "/products?q=kids"
  },
  {
    id: 2,
    image: 'saree-red-silk.jpg',
    title: "Women / Saree collection",
    subtitle: "Elegant traditional wear",
    cta: "Shop Women",
    link: "/products?q=women"
  },
  {
    id: 3,
    image: 'kurta-cream-ethnic.jpg',
    title: "Men's Premium Collection",
    subtitle: "Shirts, pants, ethnic wear",
    cta: "Shop Men",
    link: "/products?q=mens"
  },
  {
    id: 4,
    image: 'fabric-brocade-gold.jpg',
    title: "Designer Fabrics",
    subtitle: "Silk, cotton, brocade fabrics",
    cta: "Shop Fabrics",
    link: "/products?q=fabrics"
  }
];

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 25 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Auto-play even on interaction? User said "Slider must rotate continuously without user interaction".
  // Usually this means it auto-plays *until* interaction, or always. I'll make it auto-play.
  const navigate = useNavigate();

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-background text-foreground overflow-hidden">
      {/* Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex touch-pan-y h-full">
          {slides.map((slide) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-full" key={slide.id}>
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={getImageUrl(slide.image)}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center animate-ken-burns" // Simple scale effect if CSS exists, else just static
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full container-custom flex items-center">
                <div className="max-w-2xl text-white space-y-6 animate-fade-in-up">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl text-gray-200 font-light max-w-lg drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <div className="pt-4">
                    <Button
                      size="lg"
                      onClick={() => navigate(slide.link)}
                      className="text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-gray-100 border-none transition-transform hover:scale-105"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex gap-4">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === selectedIndex ? 'w-8 bg-white' : 'w-4 bg-white/40'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
