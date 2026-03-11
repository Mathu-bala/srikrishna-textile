/**
 * OrderSuccess — Payment success page with confetti 🎉
 * Route: /order-success?orderId=...&paymentId=...&delivery=...&method=cod
 */
import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Package, CreditCard, Copy, Truck, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

// ─── Simple CSS Confetti ────────────────────────────────────────────────────
// Uses CSS-only animation so no extra npm package needed
const CONFETTI_COLORS = ['#7c3aed', '#06b6d4', '#39ff14', '#f59e0b', '#ec4899', '#ffffff'];
const CONFETTI_COUNT = 60;

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    rotation: number;
    size: number;
    shape: 'rect' | 'circle';
}

const Confetti = ({ active }: { active: boolean }) => {
    const [pieces] = useState<ConfettiPiece[]>(() =>
        Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 2.5,
            duration: 3 + Math.random() * 3,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            rotation: Math.random() * 720 - 360,
            size: 8 + Math.random() * 8,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        }))
    );

    if (!active) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(var(--rot)); opacity: 0; }
                }
            `}</style>
            {pieces.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: '-10px',
                        width: p.shape === 'rect' ? `${p.size}px` : `${p.size * 0.7}px`,
                        height: p.shape === 'rect' ? `${p.size * 0.45}px` : `${p.size * 0.7}px`,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '2px',
                        '--rot': `${p.rotation}deg`,
                        animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
                        opacity: 0,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

// ─── Component ─────────────────────────────────────────────────────────────
const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId') || '';
    const paymentId = searchParams.get('paymentId') || '';
    const deliveryStr = searchParams.get('delivery') || '';
    const isCOD = searchParams.get('method') === 'cod';

    const [visible, setVisible] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setVisible(true), 80);
        const t2 = setTimeout(() => setShowConfetti(true), 200);
        const t3 = setTimeout(() => setShowConfetti(false), 7000); // stop after 7s
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const estimatedDate = deliveryStr
        ? new Date(deliveryStr).toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : '5–7 business days';

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(`${label} copied!`))
            .catch(() => toast.error('Copy failed'));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <Confetti active={showConfetti} />

            <main className="flex-grow flex items-center justify-center bg-background py-16 relative overflow-hidden">
                {/* Background glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-neon-green/8 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-primary/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className={`text-center max-w-lg mx-auto px-4 relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    {/* Animated checkmark */}
                    <div className="w-28 h-28 mx-auto mb-6 relative">
                        <style>{`
                            @keyframes scaleIn {
                                0%   { transform: scale(0); opacity: 0; }
                                60%  { transform: scale(1.15); opacity: 1; }
                                100% { transform: scale(1); opacity: 1; }
                            }
                            @keyframes drawTick {
                                0%   { stroke-dashoffset: 32; }
                                100% { stroke-dashoffset: 0; }
                            }
                            .animate-circle-in { animation: scaleIn 0.55s cubic-bezier(.22,.61,.36,1) forwards; }
                            .animate-tick {
                                stroke-dasharray: 32;
                                stroke-dashoffset: 32;
                                animation: drawTick 0.45s ease-out 0.5s forwards;
                            }
                        `}</style>
                        <div className="w-28 h-28 bg-neon-green/15 border-2 border-neon-green/40 rounded-full flex items-center justify-center animate-circle-in shadow-[0_0_40px_rgba(57,255,20,0.25)]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon-green w-14 h-14">
                                <polyline points="20 6 9 17 4 12" className="animate-tick" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-display font-bold mb-2">
                        {isCOD ? 'Order Placed!' : 'Payment Successful!'}
                        {' '}<span className="text-gradient-neon">🎉</span>
                    </h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        {isCOD
                            ? 'Your order has been placed. Please keep cash ready for delivery.'
                            : 'Payment confirmed! Your order is being processed.'}
                        {' '}You'll receive an email confirmation shortly.
                    </p>

                    {/* Order Details Card */}
                    {(orderId || paymentId) && (
                        <div className="glass-card p-5 mb-6 text-left space-y-3">
                            {orderId && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package size={14} className="text-secondary" />
                                        <span className="text-muted-foreground">Order ID</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-semibold text-primary">#{orderId}</span>
                                        <button onClick={() => copyToClipboard(orderId, 'Order ID')} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy">
                                            <Copy size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {paymentId && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CreditCard size={14} className="text-secondary" />
                                        <span className="text-muted-foreground">Payment ID</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-muted-foreground">{paymentId}</span>
                                        <button onClick={() => copyToClipboard(paymentId, 'Payment ID')} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy">
                                            <Copy size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {isCOD && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck size={14} className="text-yellow-400" />
                                        <span className="text-muted-foreground">Payment</span>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">Cash on Delivery</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between border-t border-border/30 pt-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={14} className="text-neon-green" />
                                    <span className="text-muted-foreground">Est. Delivery</span>
                                </div>
                                <span className="text-sm font-semibold text-neon-green">{estimatedDate}</span>
                            </div>
                        </div>
                    )}

                    {/* Email notice */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
                        <Mail size={13} className="text-secondary" />
                        Confirmation email sent to your registered email address
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to={orderId ? `/orders/${orderId}` : "/my-orders"}>
                            <Button className="w-full sm:w-auto btn-neon">
                                <Package size={16} className="mr-2" />
                                Track My Order
                            </Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="outline" className="w-full sm:w-auto border-border/50 hover:border-secondary/50">
                                Continue Shopping <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
