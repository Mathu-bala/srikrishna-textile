import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    CheckCircle2, 
    ArrowRight, 
    Home, 
    ShoppingBag, 
    Package, 
    Calendar, 
    CreditCard,
    ArrowLeft,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId') || '#SRK10234';
    const amount = searchParams.get('amount') || '0';
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);
    const dateStr = estimatedDate.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pt-12">
            <main className="flex-grow flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-md w-full text-center space-y-12"
                >
                    {/* Success Icon */}
                    <div className="relative inline-block">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                delay: 0.2, 
                                type: "spring", 
                                stiffness: 200, 
                                damping: 15 
                            }}
                            className="bg-green-50 p-6 rounded-full inline-block shadow-lg shadow-green-100/50"
                        >
                            <CheckCircle2 className="text-green-500 w-24 h-24" strokeWidth={1.5} />
                        </motion.div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-gray-900">
                            Thanks for your order!
                        </h1>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Your payment was successfully processed.<br />
                            Your order has been placed and is now being prepared.
                        </p>
                    </div>

                    {/* Order Information Card */}
                    <div className="bg-gray-50 rounded-2xl p-8 space-y-5 text-left border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order Details</span>
                            <span className="text-green-600 font-black text-[10px] tracking-widest uppercase flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Payment Successful
                            </span>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-200">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Package size={18} className="text-blue-500" />
                                    <span className="text-gray-500 font-medium">Order ID</span>
                                </div>
                                <span className="font-bold text-gray-900">#{orderId}</span>
                            </div>

                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-purple-500" />
                                    <span className="text-gray-500 font-medium">Payment Method</span>
                                </div>
                                <span className="font-bold text-gray-900">Card</span>
                            </div>

                             <div className="flex justify-between items-center pb-4">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-orange-500" />
                                    <span className="text-gray-500 font-medium">Est. Delivery</span>
                                </div>
                                <span className="font-bold text-gray-900">{dateStr}</span>
                            </div>

                            <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                                <span className="text-2xl font-black text-blue-600">₹{parseFloat(amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notification Alert */}
                    <div className="flex items-center justify-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 animate-pulse">
                        <Mail className="text-blue-600" size={18} />
                        <p className="text-xs text-blue-800 font-bold tracking-tight">
                            Confirmation email sent to your registered email
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <Button 
                            variant="default" 
                            className="bg-gray-900 hover:bg-black text-white py-6 h-auto rounded-xl font-bold shadow-xl shadow-gray-200 transition-all group w-full"
                            onClick={() => navigate('/products')}
                        >
                            <ShoppingBag className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                            Continue Shopping
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-gray-200 hover:bg-gray-50 py-6 h-auto rounded-xl font-bold transition-all w-full flex items-center justify-center gap-2"
                            onClick={() => navigate('/my-orders')}
                        >
                            View Order Details
                        </Button>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="p-12 text-center text-gray-400 font-medium text-[10px] tracking-tight border-t border-gray-50 mt-12">
                <div className="max-w-md mx-auto space-y-4">
                    <p className="flex items-center justify-center gap-2">
                         <span className="font-bold">SriKrishna Textiles</span>
                         <span className="text-gray-200">|</span>
                         <span>Safe & Secure Payments</span>
                    </p>
                    <div className="flex justify-center gap-4 uppercase text-[9px] tracking-widest text-gray-300">
                        <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms of Usage</span>
                        <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-blue-500 cursor-pointer transition-colors">Contact Support</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PaymentSuccess;
