import { useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Package, Truck, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/imageUtils';

const TrackOrder = () => {
    const { orderId } = useParams();
    const { orders } = useOrders();
    // Assuming backend returns custom ID in 'id' field, but verify if useParams works with route
    const order = orders.find(o => o.id === orderId);

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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-background py-8">
                <div className="container-custom max-w-4xl mx-auto">
                    <Link to="/my-orders" className="flex items-center text-muted-foreground hover:text-primary mb-6">
                        <ArrowLeft size={18} className="mr-2" /> Back to Orders
                    </Link>

                    <div className="bg-card rounded-xl shadow-soft p-6 mb-8">
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                                <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold">₹{order.total.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                            </div>
                        </div>

                        {/* Status Steps */}
                        <div className="relative flex justify-between mb-12 mt-8">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                                style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                            ></div>

                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                return (
                                    <div key={step.status} className="flex flex-col items-center bg-background px-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background text-muted-foreground'
                                            }`}>
                                            <step.icon size={18} />
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Items in your Order</h3>
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 py-4 border-b last:border-0">
                                    <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-16 h-16 object-cover rounded-md bg-muted" />
                                    <div className="flex-grow">
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    {/* Assuming price isn't stored in item in this simple version, or is not in context typing, skipping item price display if risky */}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                            <p className="text-muted-foreground text-sm">{order.shippingAddress}</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrackOrder;
