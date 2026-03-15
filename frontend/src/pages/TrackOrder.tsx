import { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Package, Truck, CheckCircle, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/imageUtils';
import { motion } from 'framer-motion';

const TrackOrder = () => {
    const { orderId } = useParams();
    const { orders, loading } = useOrders();
    const order = orders.find((o: any) => o.id === orderId);

    const formatAddress = (addressString: string) => {
        if (!addressString) return 'Address not available';
        try {
            const addr = JSON.parse(addressString);
            if (typeof addr === 'object' && addr !== null) {
                const parts = [];
                if (addr.street) parts.push(addr.street);
                if (addr.city) parts.push(addr.city);
                if (addr.state) parts.push(addr.state);
                if (addr.zip || addr.pincode) parts.push(addr.zip || addr.pincode);
                if (addr.country) parts.push(addr.country);
                return parts.join(', ');
            }
        } catch (e) {
            // Not JSON, return as is
        }
        return addressString;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center bg-background">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center bg-background">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                        <Link to="/my-orders"><Button>Back to Orders</Button></Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const steps = [
        { status: 'placed', label: 'Order Placed', icon: Clock },
        { status: 'processing', label: 'Processing', icon: Package },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);
    const progressPercentage = Math.max(0, currentStepIndex) / (steps.length - 1) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a1a]">
            <Header />
            <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 overflow-x-hidden">
                <div className="max-w-[1100px] mx-auto w-full px-2 sm:px-4">
                    <Link to="/my-orders" className="inline-flex items-center text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors mb-6 sm:mb-8 font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Back to Orders
                    </Link>

                    {/* Animated Tracker Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 mb-8 overflow-hidden relative w-full"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

                        {/* Header Info */}
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800 gap-6">
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 tracking-tight break-words [overflow-wrap:anywhere]">
                                    Order #{order.id}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2 font-medium text-[14px]">
                                    <Clock size={14} className="text-purple-500" /> 
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </p>
                            </div>
                            <div className="w-full md:w-[150px] h-[90px] text-left md:text-right bg-slate-100/30 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-row md:flex-col justify-between items-center md:items-end shrink-0">
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-0.5">Total Amount</p>
                                    <p className="text-xl font-black text-slate-800 dark:text-white">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Trackers */}
                        <div className="relative z-10 pt-2 pb-10">
                            {/* Horizontal Track (Desktop) */}
                            <div className="hidden sm:block absolute left-8 right-8 top-[29px] h-1 bg-slate-100 dark:bg-slate-800/80 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 origin-left"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                />
                            </div>

                            {/* Vertical Track (Mobile) */}
                            <div className="sm:hidden absolute left-[25px] top-6 bottom-[40px] w-1 bg-slate-100 dark:bg-slate-800/80 z-0 rounded-full overflow-hidden">
                                <motion.div 
                                    className="w-full bg-gradient-to-b from-purple-500 via-indigo-500 to-cyan-400 origin-top"
                                    initial={{ height: '0%' }}
                                    animate={{ height: `${progressPercentage}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                />
                            </div>

                            <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-12 sm:gap-4 h-full">
                                {steps.map((step, index) => {
                                    const isCompleted = index < currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const isPending = index > currentStepIndex;

                                    return (
                                        <div key={step.status} className="flex sm:flex-col items-center relative group w-full sm:basis-0 sm:flex-grow">
                                            {/* Icon Circle */}
                                            <motion.div 
                                                initial={false}
                                                animate={{
                                                    scale: isCurrent ? 1.1 : 1,
                                                    backgroundColor: isCompleted ? '#22c55e' : (isCurrent ? '#8b5cf6' : ''),
                                                }}
                                                className={`relative w-[50px] h-[50px] rounded-full flex items-center justify-center border-[3px] transition-all duration-500 z-10 shrink-0 shadow-sm
                                                    ${isCompleted ? 'text-white border-green-500' : ''}
                                                    ${isCurrent ? 'text-white border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]' : ''}
                                                    ${isPending ? 'bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800/80' : ''}
                                                `}
                                            >
                                                {/* Pulse Effect for Current Step */}
                                                {isCurrent && (
                                                    <motion.div 
                                                        animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                        className="absolute inset-0 rounded-full bg-purple-500 -z-10"
                                                    />
                                                )}
                                                
                                                <div className="relative z-10">
                                                    {isCompleted ? <CheckCircle size={20} strokeWidth={2.5} /> : <step.icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />}
                                                </div>
                                            </motion.div>

                                            {/* Label */}
                                            <div className="ml-5 sm:ml-0 sm:mt-4 sm:absolute sm:top-[55px] sm:left-1/2 sm:-translate-x-1/2 sm:w-28 sm:text-center">
                                                <p className={`font-bold sm:text-[13px] text-base transition-colors duration-300
                                                    ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                                                    ${isCurrent ? 'text-purple-600 dark:text-purple-400' : ''}
                                                    ${isPending ? 'text-slate-400 dark:text-slate-500 font-medium' : ''}
                                                `}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-[10px] text-purple-500/80 dark:text-purple-400/90 mt-0.5 font-bold uppercase tracking-wider"
                                                    >
                                                        Current
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-6">
                        {/* Items Ordered List */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-sm p-4 h-fit"
                        >
                            <h3 className="text-[17px] font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Package size={16} />
                                </div>
                                Items in this Order
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 h-auto sm:h-[110px] border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-4 rounded-[14px] transition-all duration-300">
                                        <div className="w-[70px] h-[70px] shrink-0 rounded-[14px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative">
                                            <img src={getImageUrl(item.product?.image || '')} alt={item.product?.name || 'Unknown'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow w-full min-w-0">
                                            <p className="font-bold text-[14px] text-slate-800 dark:text-white truncate mb-1">{item.product?.name || 'Unknown Product'}</p>
                                            <div className="flex flex-wrap gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                                                <div className="bg-white/50 dark:bg-slate-900/30 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">
                                                    ₹{item.product?.price?.toLocaleString() || item.price?.toLocaleString() || 'N/A'} × {item.quantity}
                                                </div>
                                                {item.size && (
                                                    <div className="bg-white/50 dark:bg-slate-900/30 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">
                                                        Size: {item.size}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right side Wrapper */}
                        <div className="flex flex-col gap-6">
                            {/* Shipping Details */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[14px] shadow-sm p-[18px]"
                            >
                                <h3 className="text-[16px] font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                                    <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                                        <MapPin size={16} />
                                    </div>
                                    Delivery Address
                                </h3>
                                <div className="bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                    <p className="text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed font-medium">
                                        {formatAddress(order.shippingAddress)}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Payment Details */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[14px] shadow-sm p-[18px] h-[120px]"
                            >
                                <h3 className="text-[15px] font-bold mb-3 text-slate-800 dark:text-white">
                                    Payment Info
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500">Method:</span>
                                        <span className="font-bold">{(order as any).paymentMethod || 'COD'}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500">Status:</span>
                                        <span className={`font-bold ${(order as any).isPaid ? 'text-green-500' : 'text-amber-500'}`}>
                                            {(order as any).isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrackOrder;
