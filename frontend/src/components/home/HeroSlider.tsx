
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
        image: 'kurti-navy-silk.jpg',
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

const HeroSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
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
        if (isPaused) return;
        const timer = setInterval(() => {
            if (emblaApi) emblaApi.scrollNext();
        }, 4000);
        return () => clearInterval(timer);
    }, [emblaApi, isPaused]);

    return (
        <div
            className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Glow Effect Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-neon-purple ring-1 ring-white/10 group">

                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y">
                        {slides.map((slide) => (
                            <div className="relative flex-[0_0_100%] min-w-0" key={slide.id}>
                                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
                                    <img
                                        src={getImageUrl(slide.image)}
                                        alt={slide.title}
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                        loading="lazy"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-8 sm:p-12 lg:p-16">
                                        <div className="max-w-xl animate-fade-in space-y-4">
                                            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium backdrop-blur-md border border-secondary/30">
                                                {slide.subtitle}
                                            </span>
                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white drop-shadow-lg">
                                                {slide.title}
                                            </h2>
                                            <div className="pt-4">
                                                <Button
                                                    onClick={() => navigate(slide.link)}
                                                    className="btn-neon text-lg px-8 py-6"
                                                >
                                                    {slide.cta}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-background/80 hover:text-secondary hover:shadow-neon-cyan transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-background/80 hover:text-secondary hover:shadow-neon-cyan transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi && emblaApi.scrollTo(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                ? 'w-8 bg-secondary shadow-neon-cyan'
                                : 'w-2 bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;
