import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, MapPin, Plus, Check, Edit, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { getImageUrl } from '@/lib/imageUtils';
import { toast } from 'sonner';

interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
}

const BuyNowCheckout = () => {
    const { isAuthenticated, setReturnUrl, logout, user } = useAuth();
    const { addOrder } = useOrders();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<any>(null);

    // Address State
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    useEffect(() => {
        // Load product from session storage
        const storedProduct = sessionStorage.getItem('buyNowProduct');
        if (!storedProduct) {
            navigate('/');
            return;
        }
        setProduct(JSON.parse(storedProduct));

        // Load addresses (mocking for now since backend doesn't support yet, or using local storage persistence for demo)
        const savedAddresses = localStorage.getItem('user_addresses');
        if (savedAddresses) {
            const parsed = JSON.parse(savedAddresses);
            setAddresses(parsed);
            if (parsed.length > 0) setSelectedAddressId(parsed[0].id);
        } else {
            // Pre-fill a dummy address for logged in user if empty
            if (isAuthenticated && user) {
                const dummy: Address = {
                    id: 'default-1',
                    name: user.name,
                    street: '123 Textile Street',
                    city: 'Fashion City',
                    state: 'TN',
                    pincode: '600001',
                    phone: '9876543210'
                };
                setAddresses([dummy]);
                setSelectedAddressId(dummy.id);
            }
        }
    }, [navigate, isAuthenticated, user]);

    if (!isAuthenticated) {
        setReturnUrl('/buy-now-checkout');
        navigate('/login');
        return null;
    }

    if (!product) return null;

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();

        let updatedAddresses: Address[];
        let newId = selectedAddressId;

        if (editingAddressId) {
            // Update existing address
            updatedAddresses = addresses.map(addr =>
                addr.id === editingAddressId
                    ? { ...newAddress, id: editingAddressId }
                    : addr
            );
            // Keep selection if we edited the selected one
            if (selectedAddressId === editingAddressId) {
                // Selection remains valid
            }
        } else {
            // Add new address
            const address: Address = {
                id: Date.now().toString(),
                ...newAddress
            };
            updatedAddresses = [...addresses, address];
            newId = address.id;
        }

        setAddresses(updatedAddresses);
        if (!editingAddressId) setSelectedAddressId(newId); // Only auto-select newly added, not necessarily edited one unless logic dictates

        localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
        setShowAddAddress(false);
        setEditingAddressId(null);
        setNewAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
        toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully');
    };

    const handleEditAddress = (e: React.MouseEvent, addr: Address) => {
        e.stopPropagation();
        setNewAddress({
            name: addr.name,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            phone: addr.phone
        });
        setEditingAddressId(addr.id);
        setShowAddAddress(true);
    };

    const handleDeleteAddress = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this address?')) {
            const updated = addresses.filter(a => a.id !== id);
            setAddresses(updated);
            localStorage.setItem('user_addresses', JSON.stringify(updated));

            if (selectedAddressId === id) {
                setSelectedAddressId(updated.length > 0 ? updated[0].id : '');
            }
            toast.success('Address deleted successfully');
        }
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            toast.error('Please select a delivery address');
            return;
        }

        setLoading(true);
        try {
            // Calculate totals
            const total = product.price * product.quantity;
            const shipping = total > 300 ? 0 : 99;
            const grandTotal = total + shipping;

            // Create order
            const order = await addOrder(
                [{
                    product: product,
                    quantity: product.quantity,
                    size: product.selectedSize,
                    color: product.selectedColor,
                }],
                grandTotal
            );

            // Clear buy now session
            sessionStorage.removeItem('buyNowProduct');

            // Navigate to success
            navigate(`/order-success?orderId=${order.id}`);
        } catch (error: any) {
            console.error('Checkout failed:', error);
            const message = error.message || 'Payment failed';
            if (message.includes('Not authorized')) {
                logout();
                navigate('/login');
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    const total = product.price * product.quantity;
    const shipping = total > 300 ? 0 : 99;
    const grandTotal = total + shipping;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-background">
                <div className="container-custom py-8">
                    {/* ... existing header content ... */}
                    <Link to={`/product/${product.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
                        <ArrowLeft size={18} /> Cancel & Return
                    </Link>

                    <h1 className="font-display text-3xl font-bold mb-8">Secure <span className="text-gradient-neon">Checkout</span></h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Address */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="text-secondary" />
                                    <h2 className="font-display text-xl font-bold">Delivery Address</h2>
                                </div>

                                {!showAddAddress ? (
                                    <div className="space-y-4">
                                        {addresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative group ${selectedAddressId === addr.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border/50 hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-bold flex items-center gap-2">
                                                            {addr.name}
                                                            {selectedAddressId === addr.id && <Check size={16} className="text-primary" />}
                                                        </div>
                                                        <p className="text-muted-foreground text-sm mt-1">
                                                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                                                        </p>
                                                        <p className="text-muted-foreground text-sm mt-1">Phone: {addr.phone}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {selectedAddressId === addr.id && (
                                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-1">DELIVER HERE</span>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                                onClick={(e) => handleEditAddress(e, addr)}
                                                            >
                                                                <Edit size={16} />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <Button variant="outline" className="w-full mt-4 border-dashed" onClick={() => {
                                            setEditingAddressId(null);
                                            setNewAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
                                            setShowAddAddress(true);
                                        }}>
                                            <Plus size={16} className="mr-2" /> Add New Address
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleAddAddress} className="space-y-4 animate-in fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name</label>
                                                <Input required value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} placeholder="Full Name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Phone</label>
                                                <Input required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} placeholder="10-digit number" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-sm font-medium">Street Address</label>
                                                <Input required value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} placeholder="House No, Building, Street" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">City</label>
                                                <Input required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="City" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">State</label>
                                                <Input required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} placeholder="State" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Pincode</label>
                                                <Input required value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} placeholder="6-digit Pincode" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end mt-4">
                                            <Button type="button" variant="ghost" onClick={() => {
                                                setShowAddAddress(false);
                                                setEditingAddressId(null);
                                            }}>Cancel</Button>
                                            <Button type="submit" className="btn-neon">{editingAddressId ? 'Update Address' : 'Save Address'}</Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass-card p-6 sticky top-24">
                                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                                <div className="flex gap-4 mb-6 pb-6 border-b border-border/50">
                                    <img src={getImageUrl(product.image)} alt={product.name} className="w-16 h-20 object-cover rounded-md" />
                                    <div>
                                        <h3 className="font-medium line-clamp-2">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Size: {product.selectedSize} | Qty: {product.quantity}</p>
                                        <p className="font-bold mt-1">₹{product.price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Price ({product.quantity} item)</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Charges</span>
                                        <span className={shipping === 0 ? 'text-neon-green' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                    </div>
                                    <div className="border-t border-border/30 pt-3 flex justify-between font-display font-bold text-lg">
                                        <span>Total Payable</span>
                                        <span className="text-gradient-neon">₹{grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full btn-neon"
                                    size="lg"
                                    onClick={handlePayment}
                                    disabled={loading || !selectedAddressId}
                                >
                                    {loading ? 'Processing...' : 'Proceed to Payment'}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By placing the order, you agree to SriKrishna Textile's Terms of Use and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BuyNowCheckout;
