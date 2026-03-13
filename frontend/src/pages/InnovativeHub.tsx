import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Sparkles, ArrowLeft, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Import all 20 features
import MemorySareeGenerator from '@/components/innovative/MemorySareeGenerator';
import DressStory from '@/components/innovative/DressStory';
import FestivalCalendar from '@/components/innovative/FestivalCalendar';
import GrandmaAdvice from '@/components/innovative/GrandmaAdvice';
import DressEnergyMeter from '@/components/innovative/DressEnergyMeter';
import VillageMap from '@/components/innovative/VillageMap';
import FashionPredictor from '@/components/innovative/FashionPredictor';
import TimeTravelFashion from '@/components/innovative/TimeTravelFashion';
import EmotionPriceSlider from '@/components/innovative/EmotionPriceSlider';
import TempleFunctionPicker from '@/components/innovative/TempleFunctionPicker';
import DressHoroscope from '@/components/innovative/DressHoroscope';
import VoiceOfFabric from '@/components/innovative/VoiceOfFabric';
import EcoScore from '@/components/innovative/EcoScore';
import FestivalBudgetPlanner from '@/components/innovative/FestivalBudgetPlanner';
import LocalShopMode from '@/components/innovative/LocalShopMode';
import EmotionDiary from '@/components/innovative/EmotionDiary';
import FabricTouchSimulation from '@/components/innovative/FabricTouchSimulation';
// AIWardrobeOrganizer removed as file is missing
import LanguageDialectMode from '@/components/innovative/LanguageDialectMode';
import WeddingHarmonyChecker from '@/components/innovative/WeddingHarmonyChecker';

const InnovativeHub = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow pb-20">
                {/* Banner Section */}
                <div className="relative bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-12 overflow-hidden">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30 animate-pulse" />

                    <div className="container-custom relative">
                        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6 group">
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Store
                        </Link>

                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 animate-fade-in">
                                Explore <span className="text-gradient-neon">Smart Tools</span> & Innovations
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in [animation-delay:200ms]">
                                Experience the future of textile shopping. From AI-powered matching to cultural stories,
                                our innovative tools bridge the gap between tradition and technology.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="animate-fade-in [animation-delay:300ms]"><MemorySareeGenerator /></div>
                        <div className="animate-fade-in [animation-delay:400ms]"><DressStory /></div>
                        <div className="animate-fade-in [animation-delay:500ms]"><FestivalCalendar /></div>
                        <div className="animate-fade-in [animation-delay:600ms]"><GrandmaAdvice /></div>
                        <div className="animate-fade-in [animation-delay:700ms]"><DressEnergyMeter /></div>
                        <div className="animate-fade-in [animation-delay:800ms]"><VillageMap /></div>
                        <div className="animate-fade-in [animation-delay:900ms]"><FashionPredictor /></div>
                        <div className="animate-fade-in [animation-delay:1000ms]"><TimeTravelFashion /></div>
                        <div className="animate-fade-in [animation-delay:1100ms]"><EmotionPriceSlider /></div>
                        <div className="animate-fade-in [animation-delay:1200ms]"><TempleFunctionPicker /></div>
                        <div className="animate-fade-in [animation-delay:1300ms]"><DressHoroscope /></div>
                        <div className="animate-fade-in [animation-delay:1400ms]"><VoiceOfFabric /></div>
                        <div className="animate-fade-in [animation-delay:1500ms]"><EcoScore /></div>
                        <div className="animate-fade-in [animation-delay:1600ms]"><FestivalBudgetPlanner /></div>
                        <div className="animate-fade-in [animation-delay:1700ms]"><LocalShopMode /></div>
                        <div className="animate-fade-in [animation-delay:1800ms]"><EmotionDiary /></div>
                        <div className="animate-fade-in [animation-delay:1900ms]"><FabricTouchSimulation /></div>
                        {/* AIWardrobeOrganizer removed */}
                        <div className="animate-fade-in [animation-delay:2100ms]"><LanguageDialectMode /></div>
                        <div className="animate-fade-in [animation-delay:2200ms]"><WeddingHarmonyChecker /></div>
                    </div>

                    {/* Information Section */}
                    <div className="mt-20 p-8 rounded-3xl bg-secondary/5 border border-secondary/20 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full transition-all group-hover:bg-secondary/30" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Lightbulb size={40} className="text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Did You Know?</h2>
                                <p className="text-muted-foreground leading-relaxed italic">
                                    All these features are designed to be modular and non-intrusive. We use preset cultural data and local-first AI logic
                                    to ensure your privacy while providing a premium, personalized shopping experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default InnovativeHub;
