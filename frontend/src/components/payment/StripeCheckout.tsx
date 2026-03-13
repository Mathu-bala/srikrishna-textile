import React, { useState, useEffect } from 'react';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
    createPaymentIntent,
    confirmPaymentOnBackend,
    getPublishableKeyWithToken,
    StripePaymentData,
} from '../../lib/stripe';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Lock, CreditCard, Shield } from 'lucide-react';

interface StripeCheckoutProps {
    paymentData: StripePaymentData;
    onSuccess?: (orderId: string) => void;
    onError?: (error: string) => void;
    isLoading?: boolean;
}

/**
 * Inner Stripe Checkout Component (uses Stripe hooks)
 */
const StripeCheckoutForm: React.FC<StripeCheckoutProps> = ({
    paymentData,
    onSuccess,
    onError,
    isLoading: externalLoading,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe not loaded');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Create payment intent on backend
            const { clientSecret, paymentIntentId } = await createPaymentIntent(paymentData);

            // Step 2: Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name: `${paymentData.firstName} ${paymentData.lastName}`,
                        email: paymentData.email,
                    },
                },
            });

            if (result.error) {
                setError(result.error.message || 'Payment failed');
                onError?.(result.error.message || 'Payment failed');
                setIsLoading(false);
                return;
            }

            if (result.paymentIntent?.status === 'succeeded') {
                // Step 3: Confirm on backend
                const confirmResult = await confirmPaymentOnBackend(paymentIntentId);

                if (confirmResult.success) {
                    onSuccess?.(confirmResult.orderId);
                } else {
                    setError('Payment confirmed but order creation failed');
                    onError?.('Payment confirmed but order creation failed');
                }
            }
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred during payment';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const cardElementOptions = {
        hidePostalCode: true,
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="relative space-y-4">
            {/* Overlay Loader */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg animate-in fade-in duration-200">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-lg font-bold text-gradient-neon animate-pulse">
                        Securing Payment...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please do not refresh or close this window
                    </p>
                </div>
            )}

            <div className={`space-y-4 transition-all duration-300 ${isLoading ? 'opacity-20 pointer-events-none blur-[2px]' : 'opacity-100'}`}>
                <div className="border border-border/50 rounded-xl p-4 bg-muted/20 backdrop-blur-md shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <CreditCard size={16} className="text-primary" />
                            Card Details
                        </label>
                        <Lock size={14} className="text-muted-foreground" />
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2 animate-in slide-in-from-top-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || externalLoading || !stripe}
                    className="w-full btn-neon py-4 text-base h-auto flex items-center justify-center gap-2 group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Payment...
                        </>
                    ) : (
                        <>
                            <Lock size={18} className="group-hover:scale-110 transition-transform" />
                            Pay ₹{paymentData.totalPrice.toLocaleString()} Securely
                        </>
                    )}
                </button>
                
                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
                    <Shield size={10} className="text-neon-green" /> 
                    Your payment info is encrypted & never stored
                </p>
            </div>
        </form>
    );
};

/**
 * Stripe Checkout Wrapper Component
 */
const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
    const [stripePromise, setStripePromise] = useState<any>(null);
    const { user } = useAuth();

    useEffect(() => {
        const loadStripeInstance = async () => {
            try {
                const token = user?.token;
                if (!token) {
                    throw new Error('No authentication token found');
                }

                console.log('Fetching Stripe publishable key...');
                const { publishableKey } = await getPublishableKeyWithToken(token);

                if (!publishableKey) {
                    throw new Error('Publishable key not provided by backend');
                }

                console.log('Loading Stripe with key:', publishableKey.substring(0, 20) + '...');
                const instance = await loadStripe(publishableKey);

                if (!instance) {
                    throw new Error('Failed to load Stripe library');
                }

                setStripePromise(instance);
            } catch (error) {
                console.error('Failed to load Stripe:', error);
                props.onError?.('Failed to load payment gateway: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        };

        loadStripeInstance();
    }, [user?.token]);

    if (!stripePromise) {
        return (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                Loading payment gateway...
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <StripeCheckoutForm {...props} />
        </Elements>
    );
};

export default StripeCheckout;
