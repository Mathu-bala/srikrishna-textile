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
                <div className="max-w-5xl mx-auto w-full overflow-x-hidden">
                    <Link to="/my-orders" className="inline-flex items-center text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors mb-6 sm:mb-8 font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Back to Orders
                    </Link>

                    {/* Animated Tracker Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 sm:p-10 mb-8 overflow-hidden relative"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

                        {/* Header Info */}
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-slate-200/60 dark:border-slate-800 gap-6">
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 tracking-tight break-words [overflow-wrap:anywhere]">
                                    Order #{order.id}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 font-medium">
                                    <Clock size={16} className="text-purple-500" /> 
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </p>
                            </div>
                            <div className="w-full md:w-auto text-left md:text-right bg-slate-100/50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-row md:flex-col justify-between items-center md:items-end shrink-0 min-w-0">
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1">Total Amount</p>
                                    <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white break-words [overflow-wrap:anywhere]">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block mt-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Trackers */}
                        <div className="relative z-10 pt-4 pb-16 sm:pb-12">
                            {/* Horizontal Track (Desktop) */}
                            <div className="hidden sm:block absolute left-8 right-8 top-12 h-1.5 bg-slate-100 dark:bg-slate-800/80 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 origin-left"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                />
                            </div>

                            {/* Vertical Track (Mobile) */}
                            <div className="sm:hidden absolute left-[29px] top-12 bottom-[70px] w-1.5 bg-slate-100 dark:bg-slate-800/80 z-0 rounded-full overflow-hidden">
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
                                        <div key={step.status} className="flex sm:flex-col items-center relative group w-full sm:w-auto">
                                            {/* Icon Circle */}
                                            <motion.div 
                                                initial={false}
                                                animate={{
                                                    scale: isCurrent ? 1.15 : 1,
                                                    backgroundColor: isCompleted ? '#22c55e' : (isCurrent ? '#8b5cf6' : ''),
                                                }}
                                                className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 shrink-0 shadow-sm
                                                    ${isCompleted ? 'text-white border-green-500' : ''}
                                                    ${isCurrent ? 'text-white border-purple-500 shadow-[0_0_25px_rgba(139,92,246,0.6)]' : ''}
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
                                                    {isCompleted ? <CheckCircle size={24} strokeWidth={2.5} /> : <step.icon size={24} strokeWidth={isCurrent ? 2.5 : 2} />}
                                                </div>
                                            </motion.div>

                                            {/* Label */}
                                            <div className="ml-6 sm:ml-0 sm:mt-6 sm:absolute sm:top-[75px] sm:-left-8 sm:w-32 sm:text-center">
                                                <p className={`font-bold sm:text-[15px] text-lg transition-colors duration-300
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
                                                        className="text-[13px] text-purple-500/80 dark:text-purple-400/90 mt-1 font-semibold uppercase tracking-wider"
                                                    >
                                                        Current Status
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Order Details Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items Ordered List */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-sm p-6 sm:p-8"
                        >
                            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Package size={20} />
                                </div>
                                Items in this Order
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 py-5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 p-4 rounded-2xl transition-all duration-300">
                                        <div className="w-24 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                            <img src={getImageUrl(item.product?.image || '')} alt={item.product?.name || 'Unknown'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow w-full">
                                            <p className="font-bold text-lg text-slate-800 dark:text-white leading-tight mb-2">{item.product?.name || 'Unknown Product'}</p>
                                            <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                                    Price: <span className="font-bold text-slate-800 dark:text-white">₹{item.product?.price?.toLocaleString() || item.price?.toLocaleString() || 'N/A'}</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                                    Quantity: <span className="font-bold text-purple-600 dark:text-purple-400">{item.quantity}</span>
                                                </div>
                                                {item.size && (
                                                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                                        Size: <span className="font-bold text-slate-800 dark:text-white">{item.size}</span>
                                                    </div>
                                                )}
                                                {item.color && (
                                                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                                                        Color: <span className="font-bold text-slate-800 dark:text-white">{item.color}</span>
                                                        <div className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: item.color.toLowerCase() }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Shipping & Payment Details */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-sm p-6 sm:p-8 h-fit flex flex-col gap-6"
                        >
                            {/* Shipping Box */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                                        <Truck size={20} />
                                    </div>
                                    Delivery Address
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-inner">
                                    <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed relative">
                                        <MapPin className="absolute top-1 -left-1 text-slate-300 dark:text-slate-600 opacity-50 w-5 h-5 hidden sm:block" />
                                        <span className="sm:pl-6 block">{order.shippingAddress}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Payment Box */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
                                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                                    Payment Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
                                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Method</span>
                                        <span className="font-bold text-slate-800 dark:text-white">{(order as any).paymentMethod || 'Cash on Delivery'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
                                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`relative flex h-3 w-3`}>
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${(order as any).isPaid ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-3 w-3 ${(order as any).isPaid ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-white">{(order as any).isPaid ? 'Paid Successfully' : 'Pending Payment'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrackOrder;
