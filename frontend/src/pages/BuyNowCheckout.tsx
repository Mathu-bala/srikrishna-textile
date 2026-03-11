/**
 * BuyNowCheckout — Complete Payment System
 * ─────────────────────────────────────────────────────────────────────────
 * Supports: Stripe (Credit/Debit Card) + Cash on Delivery
 * Features: Coupon codes, address management, order summary
 *
 * Flow (Stripe):
 *  1. Select address  2. Pick Stripe  3. Apply coupon (optional)
 *  4. Pay Now → Stripe checkout → backend verifies → /order-success
 *
 * Flow (COD):
 *  1. Select address  2. Pick COD  3. Apply coupon  4. Place Order → /order-success
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Plus, Check, Edit, Trash2,
    CreditCard, Smartphone, Building2, Wallet, Truck,
    Shield, RefreshCw, AlertCircle, Loader2, Tag, X,
    ChevronDown, ChevronUp, Package
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/imageUtils';
import { toast } from 'sonner';
import StripeCheckout from '@/components/payment/StripeCheckout';
import {
    placeCODOrder,
    validateCoupon,
} from '@/services/api';

interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
}

type PaymentMethod = 'stripe' | 'cod';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    { id: 'stripe', label: 'Stripe', icon: CreditCard, color: 'text-blue-400', desc: 'Debit / Credit Card' },
    { id: 'cod', label: 'Cash on Delivery', icon: Truck, color: 'text-yellow-400', desc: 'Pay when delivered' },
];

const BuyNowCheckout = () => {
    const { isAuthenticated, setReturnUrl, user } = useAuth();
    const navigate = useNavigate();

    // Core state
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [isCartCheckout, setIsCartCheckout] = useState(false);
    const { clearCart } = useCart();

    // Address state
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });

    // Payment method
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('stripe');

    // Coupon state
    const [couponInput, setCouponInput] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);

    // ─── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        // Check for cart checkout first, then single product
        const storedCart = sessionStorage.getItem('buyNowCart');
        const storedProduct = sessionStorage.getItem('buyNowProduct');

        if (storedCart) {
            const cartItems = JSON.parse(storedCart);
            setProducts(cartItems);
            setIsCartCheckout(true);
        } else if (storedProduct) {
            setProducts([JSON.parse(storedProduct)]);
            setIsCartCheckout(false);
        } else {
            navigate('/'); return;
        }

        const saved = localStorage.getItem('user_addresses');
        if (saved) {
            const parsed = JSON.parse(saved);
            setAddresses(parsed);
            if (parsed.length > 0) setSelectedAddressId(parsed[0].id);
        } else {
            setShowAddAddress(true);
        }
    }, [navigate]);

    // ─── Auth Guard ────────────────────────────────────────────────────────────
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !redirecting) {
            console.log('[Checkout] User not authenticated, redirecting to login');
            setReturnUrl('/buy-now-checkout');
            setRedirecting(true);
            navigate('/login');
        }
    }, [isAuthenticated, navigate, setReturnUrl, redirecting]);

    if (!isAuthenticated || redirecting) return null;
    if (products.length === 0) return null;

    // ─── Price Calculation ─────────────────────────────────────────────────────
    const itemTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const shipping = itemTotal > 300 ? 0 : 99;
    const subtotal = itemTotal + shipping;
    const grandTotal = Math.max(0, subtotal - couponDiscount);

    // ─── Address Handlers ──────────────────────────────────────────────────────
    const saveAddresses = (updated: Address[]) => {
        setAddresses(updated);
        localStorage.setItem('user_addresses', JSON.stringify(updated));
    };

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: Address[];
        if (editingAddressId) {
            updated = addresses.map(a => a.id === editingAddressId ? { ...newAddress, id: editingAddressId } : a);
        } else {
            const addr: Address = { id: Date.now().toString(), ...newAddress };
            updated = [...addresses, addr];
            setSelectedAddressId(addr.id);
        }
        saveAddresses(updated);
        setShowAddAddress(false);
        setEditingAddressId(null);
        setNewAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
        toast.success(editingAddressId ? 'Address updated!' : 'Address saved!');
    };

    const handleEditAddress = (e: React.MouseEvent, addr: Address) => {
        e.stopPropagation();
        setNewAddress({ name: addr.name, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone });
        setEditingAddressId(addr.id);
        setShowAddAddress(true);
    };

    const handleDeleteAddress = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Delete this address?')) return;
        const updated = addresses.filter(a => a.id !== id);
        saveAddresses(updated);
        if (selectedAddressId === id) setSelectedAddressId(updated[0]?.id || '');
        toast.success('Address deleted');
    };

    // ─── Coupon Handler ────────────────────────────────────────────────────────
    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponMsg('');
        try {
            const result = await validateCoupon(couponInput.trim(), subtotal);
            if (result.valid) {
                setCouponCode(couponInput.trim());
                setCouponDiscount(result.discount);
                setCouponMsg(result.message);
                toast.success(result.message);
            } else {
                setCouponMsg(result.message);
                toast.error(result.message);
            }
        } catch {
            toast.error('Could not validate coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setCouponDiscount(0);
        setCouponInput('');
        setCouponMsg('');
        toast.info('Coupon removed');
    };

    // ─── Get order item payload ────────────────────────────────────────────────
    const getOrderItems = () => products.map(p => ({
        product: p,
        productId: p.id,
        quantity: p.quantity,
        size: p.selectedSize || '',
        color: p.selectedColor || '',
    }));

    const getShippingStr = (addr: Address) =>
        `${addr.name}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode} | Phone: ${addr.phone}`;

    // ─── Payment Handlers ──────────────────────────────────────────────────────
    const handlePaymentSuccess = (orderId: string) => {
        console.log('[Checkout] ✅ Order created:', orderId);
        sessionStorage.removeItem('buyNowProduct');
        sessionStorage.removeItem('buyNowCart');
        if (isCartCheckout) clearCart();
        toast.success('Payment successful! 🎉');
        navigate(`/order-success?orderId=${orderId}&method=stripe`);
    };

    const handlePaymentError = (error: string) => {
        console.error('[Checkout] ❌ Payment Error:', error);
        toast.error(error || 'Payment failed. Please try again.', {
            action: { label: 'Retry', onClick: () => handlePayNow() },
            duration: 5000,
        });
    };

    const handlePayNow = async () => {
        // Validation
        if (!selectedAddressId || addresses.length === 0) {
            toast.error('Please select a delivery address'); return;
        }
        const selectedAddr = addresses.find(a => a.id === selectedAddressId)!;
        if (!selectedAddr.phone || selectedAddr.phone.length < 10) {
            toast.error('Please add a valid 10-digit phone number to your address'); return;
        }
        if (!selectedAddr.name || !selectedAddr.street || !selectedAddr.city || !selectedAddr.pincode) {
            toast.error('Address is incomplete — please fill all fields'); return;
        }

        console.log('[Checkout] Starting order placement...');
        console.log('[Checkout] Payment method:', selectedPayment);
        console.log('[Checkout] Amount:', grandTotal);
        console.log('[Checkout] Address:', getShippingStr(selectedAddr));

        setLoading(true);
        try {
            if (selectedPayment === 'cod') {
                // ── COD Flow ──
                console.log('[Checkout] Placing COD order...');
                const result = await placeCODOrder({
                    items: getOrderItems(),
                    shippingAddress: getShippingStr(selectedAddr),
                    total: grandTotal,
                    couponCode,
                    discount: couponDiscount,
                });
                console.log('[Checkout] ✅ COD Order created:', result.orderId);
                sessionStorage.removeItem('buyNowProduct');
                sessionStorage.removeItem('buyNowCart');
                if (isCartCheckout) clearCart();
                toast.success('Order placed! Pay on delivery 📦');
                navigate(`/order-success?orderId=${result.orderId}&method=cod&delivery=${result.estimatedDelivery}`);
            } else if (selectedPayment === 'stripe') {
                // ── Stripe Flow (will be handled by StripeCheckout component) ──
                setLoading(false);
            }
        } catch (error: any) {
            console.error('[Checkout] ❌ Error:', error?.message || error);
            if (error?.message?.includes('Not authorized') || error?.message?.includes('token')) {
                toast.error('Session expired. Please log in again.', {
                    action: { label: 'Login', onClick: () => navigate('/login') },
                });
            } else {
                toast.error(error?.message || 'Order placement failed. Please try again.', {
                    action: {
                        label: 'Retry',
                        onClick: () => handlePayNow(),
                    },
                    duration: 5000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const availableMethods = PAYMENT_METHODS;

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Header />

            <main className="flex-grow bg-background overflow-x-hidden">
                {/* Responsive container: full-width on mobile, centred on tablet/desktop */}
                <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border">
                    <Link to={isCartCheckout ? '/cart' : `/product/${products[0]?.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft size={18} /> Cancel & Return
                    </Link>

                    <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                        Secure <span className="text-gradient-neon">Checkout</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                        {/* ════════ Left Column ════════ */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                            {/* ── Step 1: Delivery Address ── */}
                            <div className="glass-card p-4 sm:p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                                    <MapPin className="text-secondary" size={18} />
                                    <h2 className="font-display text-xl font-bold">Delivery Address</h2>
                                </div>

                                {!showAddAddress ? (
                                    <div className="space-y-3">
                                        {addresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all group ${selectedAddressId === addr.id
                                                    ? 'border-primary bg-primary/5 shadow-neon-purple'
                                                    : 'border-border/50 hover:border-primary/40'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-3 flex-1">
                                                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary bg-primary' : 'border-border'}`}>
                                                            {selectedAddressId === addr.id && <Check size={10} className="text-white" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{addr.name}</p>
                                                            <p className="text-muted-foreground text-sm mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                                            <p className="text-muted-foreground text-sm">📞 {addr.phone}</p>
                                                            {selectedAddressId === addr.id && (
                                                                <span className="inline-block mt-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">DELIVER HERE</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 ml-2">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary" onClick={(e) => handleEditAddress(e, addr)}>
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={(e) => handleDeleteAddress(e, addr.id)}>
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            className="w-full border-dashed"
                                            onClick={() => { setEditingAddressId(null); setNewAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' }); setShowAddAddress(true); }}
                                        >
                                            <Plus size={16} className="mr-2" /> Add New Address
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleAddAddress} className="space-y-4 animate-in fade-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">Full Name *</label>
                                                <Input required value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} placeholder="Full Name" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">Phone *</label>
                                                <Input required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} placeholder="10-digit mobile" maxLength={10} />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-sm font-medium">Street Address *</label>
                                                <Input required value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} placeholder="House No, Building, Street, Area" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">City *</label>
                                                <Input required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="City" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">State *</label>
                                                <Input required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} placeholder="State" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">Pincode *</label>
                                                <Input required value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} placeholder="6-digit Pincode" maxLength={6} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            {addresses.length > 0 && (
                                                <Button type="button" variant="ghost" onClick={() => { setShowAddAddress(false); setEditingAddressId(null); }}>Cancel</Button>
                                            )}
                                            <Button type="submit" className="btn-neon">{editingAddressId ? 'Update' : 'Save Address'}</Button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* ── Step 2: Payment Method ── */}
                            <div className="glass-card p-4 sm:p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">2</div>
                                    <CreditCard className="text-secondary" size={18} />
                                    <h2 className="font-display text-xl font-bold">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {availableMethods.map(method => {
                                        const Icon = method.icon;
                                        const isSelected = selectedPayment === method.id;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${isSelected
                                                    ? 'border-secondary bg-secondary/10 shadow-neon-cyan'
                                                    : 'border-border/50 hover:border-secondary/40'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-secondary/20' : 'bg-muted/50'}`}>
                                                    <Icon size={20} className={isSelected ? method.color : 'text-muted-foreground'} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-semibold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{method.label}</p>
                                                    <p className="text-[10px] text-muted-foreground leading-tight">{method.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Trust badges */}
                                <div className="mt-5 flex flex-wrap gap-4 pt-4 border-t border-border/30">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Shield size={13} className="text-neon-green" /> 256-bit SSL Secured
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <RefreshCw size={13} className="text-secondary" /> Easy Returns
                                    </div>
                                    {selectedPayment === 'stripe' && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            💳 Powered by Stripe
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Step 3: Coupon Code ── */}
                            <div className="glass-card overflow-hidden">
                                <button
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/10 transition-colors"
                                    onClick={() => setShowCoupon(!showCoupon)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">3</div>
                                        <Tag size={16} className="text-neon-green" />
                                        <span className="font-semibold text-sm">Coupon Code</span>
                                        {couponCode && <span className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">{couponCode} applied</span>}
                                    </div>
                                    {showCoupon ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                                </button>

                                {showCoupon && (
                                    <div className="px-5 pb-5 animate-in fade-in">
                                        {couponCode ? (
                                            <div className="flex items-center justify-between bg-neon-green/10 border border-neon-green/30 rounded-lg px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-bold text-neon-green">{couponCode}</p>
                                                    <p className="text-xs text-muted-foreground">{couponMsg}</p>
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={removeCoupon}>
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Enter coupon code (e.g. KRISHNA10)"
                                                        value={couponInput}
                                                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                                        className="bg-muted/30 uppercase"
                                                    />
                                                    <Button variant="outline" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput}>
                                                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {['KRISHNA10', 'TEXTILE20', 'FLAT50', 'WELCOME'].map(code => (
                                                        <button key={code} onClick={() => { setCouponInput(code); }} className="text-[11px] px-2 py-1 bg-muted/30 rounded border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors font-mono">
                                                            {code}
                                                        </button>
                                                    ))}
                                                </div>
                                                {couponMsg && !couponCode && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle size={12} /> {couponMsg}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ── Stripe Checkout Form ── */}
                            {selectedPayment === 'stripe' && selectedAddressId && (
                                <div className="glass-card p-6 mt-6">
                                    <h3 className="font-semibold mb-4 text-sm">Payment Details</h3>
                                    <StripeCheckout
                                        paymentData={{
                                            items: getOrderItems(),
                                            totalPrice: grandTotal,
                                            firstName: user?.name?.split(' ')[0] || '',
                                            lastName: user?.name?.split(' ').slice(1).join(' ') || '',
                                            email: user?.email || '',
                                            phone: addresses.find(a => a.id === selectedAddressId)?.phone || '',
                                            shippingAddress: {
                                                street: addresses.find(a => a.id === selectedAddressId)?.street || '',
                                                city: addresses.find(a => a.id === selectedAddressId)?.city || '',
                                                state: addresses.find(a => a.id === selectedAddressId)?.state || '',
                                                zip: addresses.find(a => a.id === selectedAddressId)?.pincode || '',
                                                country: 'India',
                                            },
                                            couponCode: couponCode || '',
                                        }}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        isLoading={loading}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ════════ Right Column: Order Summary ════════ */}
                        <div className="lg:col-span-1">
                            <div className="glass-card p-4 sm:p-6 lg:sticky lg:top-24 space-y-5">
                                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                                    <Package size={18} className="text-secondary" /> Order Summary
                                </h2>

                                {/* Product cards */}
                                <div className="space-y-3 pb-4 border-b border-border/40">
                                    {products.map((p, idx) => (
                                        <div key={`${p.id}-${idx}`} className="flex gap-4">
                                            <img
                                                src={getImageUrl(p.image)}
                                                alt={p.name}
                                                className="w-16 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm leading-tight line-clamp-2">{p.name}</h3>
                                                {p.selectedSize && <p className="text-xs text-muted-foreground mt-1">Size: {p.selectedSize}</p>}
                                                {p.selectedColor && <p className="text-xs text-muted-foreground">Color: {p.selectedColor}</p>}
                                                <p className="text-xs text-muted-foreground">Qty: {p.quantity}</p>
                                                <p className="font-bold mt-1">₹{(p.price * p.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price breakdown */}
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Price ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})</span>
                                        <span>₹{itemTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Charges</span>
                                        <span className={shipping === 0 ? 'text-neon-green font-medium' : ''}>
                                            {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                                        </span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-neon-green">
                                            <span className="flex items-center gap-1"><Tag size={12} /> Coupon ({couponCode})</span>
                                            <span>− ₹{couponDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-border/30 pt-3 flex justify-between font-display font-bold text-base">
                                        <span>Total Payable</span>
                                        <span className="text-gradient-neon text-lg">₹{grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Pay Now Button */}
                                <Button
                                    id="btn-pay-now"
                                    className="w-full btn-neon text-base h-12"
                                    onClick={handlePayNow}
                                    disabled={loading || !selectedAddressId || addresses.length === 0}
                                >
                                    {loading ? (
                                        <><Loader2 size={18} className="mr-2 animate-spin" /> Processing…</>
                                    ) : selectedPayment === 'cod' ? (
                                        <>Place Order — ₹{grandTotal.toLocaleString()}</>
                                    ) : (
                                        <>Pay ₹{grandTotal.toLocaleString()} Now</>
                                    )}
                                </Button>

                                <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                                    By placing this order, you agree to our{' '}
                                    <span className="text-primary">Terms of Use</span> &{' '}
                                    <span className="text-primary">Privacy Policy</span>.
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
