/**
 * PaymentFailed — Payment failure / retry page
 * Route: /payment-failed
 */
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, CreditCard, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason') || 'The payment could not be completed.';
    const isRetry = searchParams.get('retry') === '1';
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const handleRetry = () => {
        // Navigate back to checkout if it's still in session
        const stored = sessionStorage.getItem('buyNowProduct');
        if (stored) {
            navigate('/buy-now-checkout');
        } else {
            navigate('/products');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-background py-16 relative overflow-hidden">
                {/* Dim red background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-600/8 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 right-1/3 w-52 h-52 bg-orange-600/8 rounded-full blur-3xl" />
                </div>

                <div className={`text-center max-w-md mx-auto px-4 relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    {/* Animated X icon */}
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                        <style>{`
                            @keyframes shakeIn {
                                0% { transform: scale(0) rotate(-10deg); opacity: 0; }
                                60% { transform: scale(1.1) rotate(5deg); opacity: 1; }
                                80% { transform: scale(0.97) rotate(-2deg); }
                                100% { transform: scale(1) rotate(0); opacity: 1; }
                            }
                            .animate-shake-in { animation: shakeIn 0.55s cubic-bezier(.22,.61,.36,1) forwards; }
                        `}</style>
                        <div className="w-24 h-24 bg-red-500/15 border-2 border-red-500/40 rounded-full flex items-center justify-center animate-shake-in shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <XCircle className="text-red-400 w-12 h-12" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-display font-bold mb-2">
                        Payment <span className="text-red-400">Failed</span>
                    </h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        {reason}
                        <br />
                        <span className="text-sm">Your money has not been deducted. You can try again safely.</span>
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 mb-8">
                        <Button
                            className="btn-neon w-full h-12 text-base"
                            onClick={handleRetry}
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Retry Payment
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-12 border-border/50 hover:border-secondary/50"
                            onClick={() => {
                                navigate('/buy-now-checkout');
                                // Reset to trigger getPaymentConfig again
                            }}
                        >
                            <CreditCard size={18} className="mr-2" />
                            Change Payment Method
                        </Button>

                        <Link to="/products">
                            <Button variant="ghost" className="w-full h-10 text-muted-foreground hover:text-foreground">
                                <ArrowLeft size={16} className="mr-2" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    {/* Help section */}
                    <div className="glass-card p-4 text-left space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">💡 Common Reasons for Failure</h3>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                            <li>• Incorrect card details or OTP</li>
                            <li>• Insufficient bank balance</li>
                            <li>• Payment timeout (try again)</li>
                            <li>• Bank server temporarily down</li>
                        </ul>
                        <div className="pt-2 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone size={12} />
                            <span>Need help? Contact us at <span className="text-primary">support@srikrishnatextile.com</span></span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentFailed;
