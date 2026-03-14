import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Elements, 
    CardElement, 
    useStripe, 
    useElements 
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
    Loader2, 
    ShieldCheck, 
    CreditCard, 
    Globe, 
    Mail, 
    User, 
    Lock,
    HelpCircle,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { 
    createPaymentIntent, 
    confirmPaymentOnBackend, 
    getPublishableKeyWithToken 
} from '@/lib/stripe';

// --- Stripe Elements Configuration ---
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Inter", sans-serif',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
    hidePostalCode: true,
};

// --- Sub-component: Payment Form ---
const StripePaymentForm: React.FC<{ 
    paymentData: any, 
    appTotal: number, 
    products: any[] 
}> = ({ paymentData, appTotal, products }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    // Form states
    const [email, setEmail] = useState(paymentData?.email || '');
    const [name, setName] = useState(`${paymentData?.firstName || ''} ${paymentData?.lastName || ''}`.trim());
    const [country, setCountry] = useState('India');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setCardError(null);

        try {
            // 1. Create intent
            const { clientSecret, paymentIntentId } = await createPaymentIntent({
                ...paymentData,
                email,
                firstName: name.split(' ')[0] || 'Customer',
                lastName: name.split(' ').slice(1).join(' ') || '',
                shippingAddress: {
                    ...paymentData.shippingAddress,
                    country
                }
            });

            // 2. Confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name,
                        email,
                        address: {
                            country: 'IN' // or dynamically set
                        }
                    },
                },
            });

            if (result.error) {
                setCardError(result.error.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (result.paymentIntent?.status === 'succeeded') {
                // 3. Confirm on backend
                const confirmRes = await confirmPaymentOnBackend(paymentIntentId);
                if (confirmRes.success) {
                    toast.success('Payment successful!');
                    sessionStorage.removeItem('buyNowProduct');
                    sessionStorage.removeItem('buyNowCart');
                    clearCart();
                    navigate(`/payment-success?orderId=${confirmRes.orderId}&amount=${appTotal}`);
                } else {
                    throw new Error('Order creation failed after payment');
                }
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setCardError(err.message || 'An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handlePay} className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Pay with card</h2>

            <div className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                {/* Payment Method Display */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Payment method</label>
                    <div className="flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                        <CreditCard className="text-blue-600" size={20} />
                        <span className="font-semibold text-blue-900">Card</span>
                    </div>
                </div>

                {/* Card Information */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Card information</label>
                    <div className="p-4 rounded-lg border border-gray-200 bg-white">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Cardholder name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder="Full name on card"
                        />
                    </div>
                </div>

                {/* Country Selection */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Country or region</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 transition-all outline-none bg-white appearance-none"
                        >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                        </select>
                    </div>
                </div>
            </div>

            {cardError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                    <span className="font-bold">!</span> {cardError}
                </div>
            )}

            <button
                type="submit"
                disabled={isProcessing || !stripe}
                className="w-full bg-[#0055ff] hover:bg-[#0044cc] text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isProcessing ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                ) : (
                    `Pay ₹${appTotal.toLocaleString()}`
                )}
            </button>

            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100 text-[10px] text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Lock size={10} /> Powered by Srikrishna Textiles</span>
                <span className="hover:text-gray-600 cursor-pointer">Terms</span>
                <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            </div>
        </form>
    );
};

// --- Page: SecureCheckout ---
const SecureCheckout: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, setReturnUrl } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [paymentData, setPaymentData] = useState<any>(null);

    // 1. Initial Logic: Products & Auth
    useEffect(() => {
        if (!isAuthenticated) {
            setReturnUrl(window.location.pathname);
            navigate('/login');
            return;
        }

        const storedCart = sessionStorage.getItem('buyNowCart');
        const storedProduct = sessionStorage.getItem('buyNowProduct');

        if (storedCart) {
            setProducts(JSON.parse(storedCart));
        } else if (storedProduct) {
            setProducts([JSON.parse(storedProduct)]);
        } else {
            navigate('/');
        }
    }, [isAuthenticated, navigate, setReturnUrl]);

    // 2. Load Stripe
    useEffect(() => {
        if (!isAuthenticated || !user?.token) return;

        const initStripe = async () => {
            try {
                const { publishableKey } = await getPublishableKeyWithToken(user.token);
                if (publishableKey) {
                    const stripe = await loadStripe(publishableKey);
                    setStripePromise(stripe);
                }
            } catch (err) {
                console.error('Stripe Init Error:', err);
                toast.error('Payment system unavailable');
            }
        };
        initStripe();
    }, [isAuthenticated, user?.token]);

    // 3. Prepare default payment data
    useEffect(() => {
        if (products.length > 0 && user) {
            const itemTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
            const shipping = itemTotal > 300 ? 0 : 99;
            const total = itemTotal + shipping;

            // Load saved addresses for sensible defaults
            const saved = localStorage.getItem('user_addresses');
            const defaultAddress = saved ? JSON.parse(saved)[0] : null;

            setPaymentData({
                items: products.map(p => ({
                    productId: p.id,
                    quantity: p.quantity,
                    size: p.selectedSize || '',
                    color: p.selectedColor || '',
                })),
                totalPrice: total,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                shippingAddress: {
                    street: defaultAddress?.street || 'Test Street 1',
                    city: defaultAddress?.city || 'Sattur',
                    state: defaultAddress?.state || 'Tamil Nadu',
                    zip: defaultAddress?.pincode || '626203',
                    country: 'India'
                }
            });
        }
    }, [products, user]);

    if (!isAuthenticated || !paymentData) return <div className="min-h-screen flex items-center justify-center bg-[#f7f8f9]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const totalAmount = paymentData.totalPrice;

    return (
        <div className="min-h-screen h-full lg:flex bg-white font-sans text-[#1a1f36] relative">
            {/* Close Button Interface */}
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-8 right-8 z-50 p-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm group"
                title="Close and go back"
            >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* --- LEFT SECTION: Order Summary --- */}
            <div className="lg:w-1/2 bg-[#f6f9fc] p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    {/* Header Info */}
                    <div className="flex items-center gap-4 mb-20">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                            <span className="font-bold text-xl">SK</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800">Srikrishna Textiles</span>
                        <div className="bg-[#fde68a] text-[#92400e] text-[10px] font-black px-2 py-0.5 rounded tracking-wider flex items-center gap-1 ml-auto">
                            TEST MODE
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="space-y-12 mb-16">
                        {products.map((p, i) => (
                            <div key={i} className="flex gap-6 animate-in slide-in-from-left-5">
                                <div className="relative group">
                                    <img 
                                        src={getImageUrl(p.image)} 
                                        alt={p.name} 
                                        className="w-24 h-32 object-cover rounded-xl shadow-md border-2 border-white group-hover:scale-105 transition-transform" 
                                    />
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                                        {p.quantity}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">{p.category || 'Apparel'}</p>
                                    <h3 className="text-2xl font-bold leading-tight mb-2">{p.name}</h3>
                                    <p className="text-blue-600 font-bold text-lg">₹{p.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Total */}
                    <div className="space-y-4 border-t border-gray-200 pt-10">
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>Subtotal</span>
                            <span>₹{(totalAmount - (totalAmount > 300 ? 0 : 99)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>Shipping</span>
                            <span>{totalAmount > 349 ? 'Free' : '₹99'}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-4">
                            <span className="text-gray-900 font-bold text-xl">Total due</span>
                            <div className="text-right">
                                <div className="text-5xl font-black text-gray-900 flex items-baseline gap-1">
                                    <span className="text-2xl">₹</span>
                                    {totalAmount.toLocaleString()}
                                </div>
                                <p className="text-gray-400 text-xs mt-1 font-medium italic">All taxes included</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Back Link */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="mt-16 text-gray-400 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors text-sm"
                    >
                        ← Back to Shopping
                    </button>
                </div>
            </div>

            {/* --- RIGHT SECTION: Payment Form --- */}
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center animate-in fade-in duration-500">
                <div className="max-w-md mx-auto w-full">
                    {stripePromise ? (
                        <Elements stripe={stripePromise}>
                            <StripePaymentForm 
                                paymentData={paymentData} 
                                appTotal={totalAmount} 
                                products={products} 
                            />
                        </Elements>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                            <p className="text-gray-500 font-medium">Initializing secure gateway...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecureCheckout;
