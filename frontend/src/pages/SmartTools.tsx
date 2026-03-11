import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
    Sparkles, Brain, BookOpen, Calendar, Heart, Activity,
    Map, TrendingUp, Clock, Smile, Landmark, ArrowRight
} from 'lucide-react';

const tools = [
    {
        id: 'memory-saree',
        title: 'Memory Saree Generator',
        description: 'Type a memory or situation and get matching dress colors, fabrics, and styles.',
        icon: Brain,
        color: 'from-purple-500/20 to-purple-600/10',
        border: 'hover:border-purple-500/50',
        iconColor: 'text-purple-500',
        route: '/smart-tools/memory-saree',
    },
    {
        id: 'dress-story',
        title: 'Dress Story Mode',
        description: 'Discover the cultural inspiration, weaving tradition, and heritage behind each textile.',
        icon: BookOpen,
        color: 'from-amber-500/20 to-amber-600/10',
        border: 'hover:border-amber-500/50',
        iconColor: 'text-amber-500',
        route: '/smart-tools/dress-story',
    },
    {
        id: 'festival-calendar',
        title: 'Festival Calendar Tool',
        description: 'Select your religion and region to get a yearly festival shopping calendar.',
        icon: Calendar,
        color: 'from-orange-500/20 to-orange-600/10',
        border: 'hover:border-orange-500/50',
        iconColor: 'text-orange-500',
        route: '/smart-tools/festival-calendar',
    },
    {
        id: 'grandma-advice',
        title: 'Grandma Advice Tool',
        description: 'Traditional tips on washing silk, matching colors, draping, and fabric care.',
        icon: Heart,
        color: 'from-rose-500/20 to-rose-600/10',
        border: 'hover:border-rose-500/50',
        iconColor: 'text-rose-500',
        route: '/smart-tools/grandma-advice',
    },
    {
        id: 'energy-meter',
        title: 'Dress Energy Meter',
        description: 'Visualize the Formal, Party, Comfort, and Tradition level of any dress.',
        icon: Activity,
        color: 'from-cyan-500/20 to-cyan-600/10',
        border: 'hover:border-cyan-500/50',
        iconColor: 'text-cyan-500',
        route: '/smart-tools/energy-meter',
    },
    {
        id: 'village-map',
        title: 'Village Map Shopping',
        description: 'Explore India\'s famous weaving clusters by state, district, and textile type.',
        icon: Map,
        color: 'from-green-500/20 to-green-600/10',
        border: 'hover:border-green-500/50',
        iconColor: 'text-green-500',
        route: '/smart-tools/village-map',
    },
    {
        id: 'fashion-predictor',
        title: 'Future Fashion Predictor',
        description: 'Discover upcoming color and fabric trends based on cultural and global data.',
        icon: TrendingUp,
        color: 'from-blue-500/20 to-blue-600/10',
        border: 'hover:border-blue-500/50',
        iconColor: 'text-blue-500',
        route: '/smart-tools/fashion-predictor',
    },
    {
        id: 'time-travel',
        title: 'Time Travel Fashion Mode',
        description: 'Explore dress styles and aesthetics from the 1980s to the 2010s.',
        icon: Clock,
        color: 'from-violet-500/20 to-violet-600/10',
        border: 'hover:border-violet-500/50',
        iconColor: 'text-violet-500',
        route: '/smart-tools/time-travel',
    },
    {
        id: 'emotion-price',
        title: 'Emotion Price Slider',
        description: 'Choose your mood — Simple, Casual, Royal, or Grand — and filter by price range.',
        icon: Smile,
        color: 'from-pink-500/20 to-pink-600/10',
        border: 'hover:border-pink-500/50',
        iconColor: 'text-pink-500',
        route: '/smart-tools/emotion-price',
    },
    {
        id: 'temple-picker',
        title: 'Temple Dress Picker',
        description: 'Enter a temple name or function type and get culturally appropriate suggestions.',
        icon: Landmark,
        color: 'from-teal-500/20 to-teal-600/10',
        border: 'hover:border-teal-500/50',
        iconColor: 'text-teal-500',
        route: '/smart-tools/temple-picker',
    },
];

const SmartTools = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
                {/* Hero */}
                <section className="relative pt-20 pb-14 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/15 blur-[100px] rounded-full" />
                    </div>
                    <div className="container-custom text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                            <Sparkles size={12} className="animate-pulse" />
                            Exclusive Features
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4">
                            Smart <span className="text-gradient-neon">Tools</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            Innovative textile tools powered by culture, tradition, and smart technology — enhancing your shopping experience.
                        </p>
                    </div>
                </section>

                {/* Tools Grid */}
                <section className="container-custom pb-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {tools.map((tool, i) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.id}
                                    to={tool.route}
                                    className={`group glass-card p-6 flex flex-col gap-4 border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${tool.border} animate-fade-in`}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                        <Icon size={22} className={tool.iconColor} />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <h2 className="font-bold text-base mb-1 text-foreground group-hover:text-primary transition-colors">
                                            {tool.title}
                                        </h2>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {tool.description}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${tool.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        Open Tool <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SmartTools;
