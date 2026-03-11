import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * Stripe Integration Utility
 * ─────────────────────────────────────────────────────────────────────────────
 * All API calls use VITE_API_URL so they reach the backend on Render
 * (not the Vercel frontend server which has no /api/stripe routes).
 */

// ── Runtime API base URL ──────────────────────────────────────────────────────
// In production this is the Render backend URL (set in Vercel env vars).
// In local dev it falls back to localhost:5000.
const API_BASE =
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api';

let stripePromise: Promise<Stripe | null>;

/** Helper: extract auth token from localStorage user object */
const getStoredToken = (): string | null => {
    try {
        const saved = localStorage.getItem('user');
        if (saved) {
            const user = JSON.parse(saved);
            return user?.token || null;
        }
    } catch {
        // ignore parse errors
    }
    return null;
};

/** Load Stripe library once */
export const getStripe = async (publishableKey: string) => {
    if (!stripePromise) {
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};

export interface StripePaymentData {
    items: Array<{
        productId: string;
        product?: { id: string };
        quantity: number;
        size?: string;
        color?: string;
    }>;
    totalPrice: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    couponCode?: string;
}

/**
 * Create Payment Intent on backend
 */
export const createPaymentIntent = async (paymentData: StripePaymentData, token?: string) => {
    try {
        const authToken = token || getStoredToken();
        if (!authToken) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE}/stripe/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            throw new Error(error.error || `Failed to create payment intent (HTTP ${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('Create Payment Intent Error:', error);
        throw error;
    }
};

/**
 * Confirm payment after Stripe processes it
 */
export const confirmPaymentOnBackend = async (paymentIntentId: string, token?: string) => {
    try {
        const authToken = token || getStoredToken();
        if (!authToken) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE}/stripe/confirm-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ paymentIntentId }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            throw new Error(error.error || `Failed to confirm payment (HTTP ${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('Confirm Payment Error:', error);
        throw error;
    }
};

/**
 * Get Stripe Publishable Key from backend
 */
export const getPublishableKeyWithToken = async (token: string) => {
    try {
        if (!token) throw new Error('No authentication token provided');

        console.log('[Stripe] Fetching publishable key from backend...');
        const response = await fetch(`${API_BASE}/stripe/key`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[Stripe] Publishable key received ✅');
        return data;
    } catch (error) {
        console.error('[Stripe] Get Publishable Key Error:', error);
        throw error;
    }
};

/**
 * Get Stripe Publishable Key
 */
export const getPublishableKey = async () => {
    const token = getStoredToken();
    if (!token) throw new Error('No authentication token found');
    return getPublishableKeyWithToken(token);
};

/**
 * Refund a payment
 */
export const refundPayment = async (paymentIntentId: string, reason?: string) => {
    try {
        const token = getStoredToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE}/stripe/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ paymentIntentId, reason }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to refund payment');
        }

        return await response.json();
    } catch (error) {
        console.error('Refund Error:', error);
        throw error;
    }
};
