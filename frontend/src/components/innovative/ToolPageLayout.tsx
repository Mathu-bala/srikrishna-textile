import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ToolPageLayoutProps {
    title: string;
    description: string;
    icon: ReactNode;
    accentColor?: string;
    children: ReactNode;
}

const ToolPageLayout = ({
    title,
    description,
    icon,
    accentColor = 'text-primary',
    children,
}: ToolPageLayoutProps) => (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow">
            {/* Header */}
            <div className="relative pt-16 pb-10 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="container-custom">
                    <Link
                        to="/smart-tools"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 group transition-colors"
                    >
                        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Smart Tools
                    </Link>
                    <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                            {icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Smart Tool</span>
                            </div>
                            <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-2 ${accentColor}`}>
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tool Content */}
            <div className="container-custom py-12 max-w-3xl">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

export default ToolPageLayout;
