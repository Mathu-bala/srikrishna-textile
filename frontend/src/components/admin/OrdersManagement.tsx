import { useState, useEffect } from 'react';
import {
    Search, Package, User, Mail, Calendar,
    CreditCard, Truck, CheckCircle,
    Eye, Edit3, ArrowUpDown, Filter, X, Download, FileText
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
    paymentId?: string;
    paymentMethod?: string;
    isPaid?: boolean;
    // Mapped for UI
    totalAmount: number;
    customerName: string;
    email: string;
    deliveryAddress: {
        address: string;
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
                paymentMethod: order.paymentMethod || (order.isPaid ? 'Razorpay' : 'COD'),
                isPaid: order.isPaid || false,
                paymentId: order.paymentId || '',
                deliveryAddress: {
                    address: order.shippingAddress || 'No Address',
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

    const formatAddress = (addressString: string) => {
        if (!addressString) return 'No Address provided';
        try {
            const addr = JSON.parse(addressString);
            if (typeof addr === 'object' && addr !== null) {
                const parts = [];
                if (addr.street) parts.push(addr.street);
                if (addr.city) parts.push(addr.city);
                if (addr.state) parts.push(addr.state);
                if (addr.zip || addr.pincode || addr.postal_code) parts.push(addr.zip || addr.pincode || addr.postal_code);
                if (addr.country) parts.push(addr.country);
                return parts.join(', ');
            }
        } catch (e) {
            // Not JSON or parsing failed
        }
        return addressString;
    };

    // ─── Invoice PDF Download ──────────────────────────────────────────────
    const downloadInvoice = (order: OrderData) => {
        const win = window.open('', '_blank');
        if (!win) return;
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const itemRows = order.items.map((item: any) => `
            <tr>
                <td>${item.productName || item.product?.name || 'Product'}</td>
                <td>Qty: ${item.quantity}</td>
                <td style="text-align:right;">₹${(item.price || 0).toLocaleString()}</td>
                <td style="text-align:right;">₹${((item.price || 0) * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #111; padding: 40px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 20px; }
    .brand h1 { font-size: 22px; color: #7c3aed; } .brand p { color: #666; font-size: 11px; }
    .invoice-meta { text-align: right; } .invoice-meta h2 { font-size: 18px; color: #333; }
    .invoice-meta span { font-size: 12px; color: #666; }
    .section { margin: 16px 0; }
    .section h3 { font-size: 12px; text-transform: uppercase; color: #7c3aed; margin-bottom: 6px; letter-spacing: 0.5px; }
    .section p { font-size: 13px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    thead tr { background: #7c3aed; color: white; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
    tfoot tr { background: #f9f9f9; font-weight: bold; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: bold; }
    .paid { background: #d1fae5; color: #065f46; } .unpaid { background: #fef3c7; color: #92400e; }
    .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>SriKrishna Textile Shop</h1>
      <p>Premium Textiles & Sarees</p>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <span>#${order.id}</span><br/>
      <span>Date: ${dateStr}</span>
    </div>
  </div>
  <div class="section">
    <h3>Customer</h3>
    <p><strong>${order.customerName}</strong><br/>${order.email}</p>
  </div>
  <div class="section">
    <h3>Delivery Address</h3>
    <p>${formatAddress(order.deliveryAddress?.address || order.shippingAddress || '')}</p>
  </div>
  <table>
    <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
    <tbody>${itemRows}</tbody>
    <tfoot>
      <tr><td colspan="3">Total</td><td style="text-align:right;">₹${(order.totalAmount || order.total).toLocaleString()}</td></tr>
    </tfoot>
  </table>
  <div class="section" style="margin-top:20px;">
    <h3>Payment</h3>
    <p>
      Method: ${order.paymentMethod || 'N/A'} &nbsp;
      <span class="badge ${order.isPaid ? 'paid' : 'unpaid'}">${order.isPaid ? '✅ Paid' : '⏳ Pending'}</span>
    </p>
    ${order.paymentId ? `<p style="font-size:11px;color:#666;margin-top:4px;">Payment ID: ${order.paymentId}</p>` : ''}
  </div>
  <div class="footer">Thank you for shopping with SriKrishna Textile Shop! For support: support@srikrishnatextile.com</div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

        win.document.write(html);
        win.document.close();
        toast.success('Invoice opened — use Ctrl+P or Print to save as PDF');
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
                                                <Button
                                                    variant="ghost" size="sm"
                                                    className="hover:bg-neon-green/10 hover:text-neon-green"
                                                    onClick={() => downloadInvoice(order)}
                                                    title="Download Invoice"
                                                >
                                                    <Download size={16} />
                                                </Button>
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
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                                    onClick={() => selectedOrder && downloadInvoice(selectedOrder)}
                                >
                                    <Download size={13} className="mr-1" /> Download Invoice
                                </Button>
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
                                        <p className="font-medium">{formatAddress(selectedOrder.deliveryAddress.address)}</p>
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
                                    <div className="glass-card p-4 bg-muted/20">
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2"><CreditCard size={14} /> Payment
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{selectedOrder.paymentMethod || 'N/A'}</span>
                                                {selectedOrder.isPaid ? (
                                                    <span className="text-[10px] font-bold bg-neon-green/20 text-neon-green px-2 py-0.5 rounded-full">✅ PAID</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">⏳ UNPAID</span>
                                                )}
                                            </div>
                                            {selectedOrder.paymentId && (
                                                <p className="text-[11px] text-muted-foreground font-mono break-all">ID: {selectedOrder.paymentId}</p>
                                            )}
                                        </div>
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
