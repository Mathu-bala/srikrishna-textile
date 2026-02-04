import { useState, useEffect } from 'react';
import {
    Search, Package, User, Mail, Calendar,
    CreditCard, Truck, CheckCircle,
    Eye, Edit3, ArrowUpDown, Filter, X
} from 'lucide-react';
import { getAdminOrders, updateAdminOrderStatus } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface OrderItem {
    product: {
        name: string;
        image: string;
    };
    quantity: number;
    price?: number;
}

interface OrderData {
    _id: string;
    id: string; // Custom ID
    user: {
        _id: string;
        name: string;
        email: string;
    };
    items: any[];
    shippingAddress: string;
    total: number;
    status: string;
    createdAt: string;
    // Mapped for UI
    paymentMethod: string;
    totalAmount: number;
    customerName: string;
    email: string;
    deliveryAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

const OrdersManagement = () => {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAdminOrders();

            // Map backend data to UI structure
            const mappedOrders = data.map((order: any) => ({
                ...order,
                id: order.id,
                totalAmount: order.total,
                customerName: order.user?.name || 'Unknown',
                email: order.user?.email || 'No Email',
                paymentMethod: 'Cash on Delivery',
                deliveryAddress: {
                    address: order.shippingAddress || 'No Address',
                    city: '',
                    postalCode: '',
                    country: ''
                },
                items: order.items.map((item: any) => ({
                    ...item,
                    productName: item.product?.name || 'Unknown Product',
                    image: item.product?.image || '',
                    price: item.product?.price || 0
                }))
            }));

            // Client-side filtering/sorting
            let filtered = mappedOrders.filter((order: any) => {
                const matchesSearch =
                    (order.id && order.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
                return matchesSearch && matchesStatus;
            });

            filtered.sort((a: any, b: any) => {
                const valA = a[sortBy];
                const valB = b[sortBy];
                if (sortOrder === 'asc') return valA > valB ? 1 : -1;
                return valA < valB ? 1 : -1;
            });

            setOrders(filtered);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [searchQuery, statusFilter, sortBy, sortOrder]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            setIsUpdating(true);
            await updateAdminOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const openOrderDetail = (order: OrderData) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'placed':
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Placed</Badge>;
            case 'processing':
                return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Processing</Badge>;
            case 'shipped':
                return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Shipped</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/20">Delivered</Badge>;
            case 'out-for-delivery':
                return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Out for Delivery</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Order <span className="text-gradient-neon">Management</span></h2>
                    <p className="text-muted-foreground text-sm">Monitor and process customer orders</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            type="text"
                            placeholder="Search by ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted/50 border-border/50"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-40 bg-muted/50 border-border/50">
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-muted-foreground" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="placed">Placed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                        const [field, order] = val.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                    }}>
                        <SelectTrigger className="w-full md:w-48 bg-muted/50 border-border/50">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown size={16} className="text-muted-foreground" />
                                <SelectValue placeholder="Sort By" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt-desc">Newest First</SelectItem>
                            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                            <SelectItem value="totalAmount-desc">Highest Amount</SelectItem>
                            <SelectItem value="totalAmount-asc">Lowest Amount</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                                <th className="text-left p-4 font-medium text-muted-foreground text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground italic">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground italic">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-xs text-primary">#{order.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="p-4">{getStatusBadge(order.status)}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openOrderDetail(order)} className="hover:bg-primary/10 hover:text-primary">
                                                    <Eye size={16} />
                                                </Button>
                                                <Select value={order.status} onValueChange={(val) => handleStatusUpdate(order.id, val)} disabled={isUpdating}>
                                                    <SelectTrigger className="w-9 h-9 p-0 bg-transparent border-none flex items-center justify-center hover:bg-muted/50 rounded-lg">
                                                        <Edit3 size={16} className="text-muted-foreground" />
                                                    </SelectTrigger>
                                                    <SelectContent align="end">
                                                        <SelectItem value="placed">Placed</SelectItem>
                                                        <SelectItem value="processing">Processing</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card border-border/50 backdrop-blur-xl">
                    <DialogHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <DialogTitle className="text-2xl font-display">Order <span className="text-gradient-neon">Details</span></DialogTitle>
                                <DialogDescription className="font-mono text-primary mt-1">ID: #{selectedOrder?.id}</DialogDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {selectedOrder && getStatusBadge(selectedOrder.status)}
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-8 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-4 bg-muted/20">
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2"><User size={14} /> Customer Info</h4>
                                    <div className="space-y-2">
                                        <p className="font-medium text-lg">{selectedOrder.customerName}</p>
                                        <p className="text-sm flex items-center gap-2 text-muted-foreground"><Mail size={14} /> {selectedOrder.email}</p>
                                        <p className="text-sm flex items-center gap-2 text-muted-foreground"><Calendar size={14} /> Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="glass-card p-4 bg-muted/20">
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2"><Truck size={14} /> Shipping Address</h4>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-medium">{selectedOrder.deliveryAddress.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Package size={14} /> Order Items</h4>
                                <div className="border border-border/30 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/30">
                                            <tr>
                                                <th className="text-left p-3 font-medium">Product</th>
                                                <th className="text-center p-3 font-medium">Qty</th>
                                                <th className="text-right p-3 font-medium">Price</th>
                                                <th className="text-right p-3 font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded shadow-sm" />
                                                            <span className="font-medium">{item.productName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">₹{item.price.toLocaleString()}</td>
                                                    <td className="p-3 text-right font-medium">₹{(item.quantity * item.price).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Payment Method</h4>
                                    <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                                        <CreditCard size={18} className="text-primary" />
                                        <span className="font-medium text-sm">{selectedOrder.paymentMethod}</span>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground">Update Status</h4>
                                        <div className="flex gap-2">
                                            <Select value={selectedOrder.status} onValueChange={(val) => handleStatusUpdate(selectedOrder.id, val)} disabled={isUpdating}>
                                                <SelectTrigger className="flex-grow bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="placed">Placed</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {selectedOrder.status === 'delivered' ? (
                                                <Button disabled className="bg-neon-green/20 text-neon-green border border-neon-green/30"><CheckCircle size={18} className="mr-2" /> Completed</Button>
                                            ) : (
                                                <Button onClick={() => {
                                                    const statuses = ['placed', 'processing', 'shipped', 'out-for-delivery', 'delivered'];
                                                    const nextIdx = statuses.indexOf(selectedOrder.status) + 1;
                                                    if (nextIdx < statuses.length) handleStatusUpdate(selectedOrder.id, statuses[nextIdx]);
                                                }} className="btn-neon" disabled={isUpdating}>Next Step</Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/10 rounded-xl p-5 border border-border/30 space-y-3">
                                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{selectedOrder.totalAmount.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-neon-green">Free</span></div>
                                    <div className="border-t border-border/30 pt-3 flex justify-between items-center"><span className="font-bold">Total Amount</span><span className="text-2xl font-display font-bold text-gradient-neon">₹{selectedOrder.totalAmount.toLocaleString()}</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default OrdersManagement;
