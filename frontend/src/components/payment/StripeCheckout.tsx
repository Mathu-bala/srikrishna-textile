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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Card Details
                </label>
                <CardElement options={cardElementOptions} />
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || externalLoading || !stripe}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${isLoading || externalLoading || !stripe
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
            >
                {isLoading ? 'Processing...' : `Pay ₹${paymentData.totalPrice.toFixed(2)}`}
            </button>
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
