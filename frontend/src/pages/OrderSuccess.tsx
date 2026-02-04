import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const OrderSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-background py-16">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 relative flex items-center justify-center">
                        <style>
                            {`
                                @keyframes scaleIn {
                                    0% { transform: scale(0); opacity: 0; }
                                    60% { transform: scale(1.1); opacity: 1; }
                                    100% { transform: scale(1); opacity: 1; }
                                }
                                @keyframes drawTick {
                                    0% { stroke-dashoffset: 24; }
                                    100% { stroke-dashoffset: 0; }
                                }
                                .animate-circle {
                                    animation: scaleIn 0.5s ease-out forwards;
                                }
                                .animate-tick {
                                    stroke-dasharray: 24;
                                    stroke-dashoffset: 24;
                                    animation: drawTick 0.3s ease-out 0.4s forwards;
                                }
                            `}
                        </style>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600 w-10 h-10"
                            >
                                <polyline points="20 6 9 17 4 12" className="animate-tick" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for your purchase. Your order has been placed and is being processed.
                        You will receive an email confirmation shortly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/my-orders">
                            <Button className="w-full sm:w-auto btn-neon">
                                View My Orders
                            </Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="outline" className="w-full sm:w-auto">
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
