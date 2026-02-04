import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Eye, HelpCircle, Phone, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { getImageUrl } from '@/lib/imageUtils';

interface OrderItem {
    product: {
        name: string;
        image: string;
    };
}

const statusColors: Record<string, string> = {
    'placed': 'bg-blue-100 text-blue-800',
    'processing': 'bg-yellow-100 text-yellow-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'out-for-delivery': 'bg-orange-100 text-orange-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'skipped': 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
    'placed': 'Order Placed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'out-for-delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'skipped': 'Cancelled',
};

const MyOrders = () => {
    const { orders, loading } = useOrders();
    const { isAuthenticated, setReturnUrl } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        setReturnUrl('/my-orders');
        navigate('/login');
        return null;
    }

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

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center bg-background">
                    <div className="text-center">
                        <Package size={64} className="mx-auto text-muted-foreground mb-6" />
                        <h1 className="font-serif text-2xl font-semibold mb-2">No Orders Yet</h1>
                        <p className="text-muted-foreground mb-6">
                            Start shopping to see your orders here.
                        </p>
                        <Link to="/products">
                            <Button className="bg-primary text-primary-foreground">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-background">
                <div className="container-custom py-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <h1 className="font-serif text-3xl font-semibold mb-8">My Orders</h1>

                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-card rounded-xl p-6 shadow-soft"
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{order.id}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {statusLabels[order.status] || order.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    {order.items.slice(0, 4).map((item, index) => (
                                        <div key={index} className="w-16 h-20 rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={getImageUrl(item.product.image)}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="w-16 h-20 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                            +{order.items.length - 4}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t">
                                    <div>
                                        <span className="text-muted-foreground">Total: </span>
                                        <span className="font-semibold">₹{order.total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link to={`/track-order/${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye size={16} className="mr-2" />
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Support Section */}
                                <div className="mt-4 pt-4 border-t border-dashed border-border/50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <HelpCircle size={16} />
                                        <span>Need help with this order?</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <a href="tel:+919876543210">
                                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary">
                                                <Phone size={14} /> <span className="hidden sm:inline">Call Support</span><span className="sm:hidden">Call</span>
                                            </Button>
                                        </a>
                                        <a href={`mailto:support@srikrishnatextiles.com?subject=Help with Order ${order.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary">
                                                <Mail size={14} /> <span className="hidden sm:inline">Email Support</span><span className="sm:hidden">Email</span>
                                            </Button>
                                        </a>
                                        <Link to={`/contact?orderId=${order.id}`}>
                                            <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                                                Raise Support Request
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyOrders;
