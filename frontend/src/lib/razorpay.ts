/**
 * Razorpay Integration Utility
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamically loads the Razorpay checkout.js script and exposes a helper
 * to open the payment popup.
 *
 * Usage:
 *   const result = await openRazorpayCheckout({ ... });
 *   if (result.success) { // verify on backend }
 */

declare global {
    interface Window {
        Razorpay: any;
    }
}

/** Load Razorpay checkout.js once */
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export interface RazorpayCheckoutOptions {
    keyId: string;
    amount: number;          // in paise (₹1 = 100 paise)
    currency?: string;
    orderId: string;         // Razorpay order_id from backend
    name?: string;
    description?: string;
    image?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    method?: {              // pre-select payment method
        upi?: boolean;
        card?: boolean;
        netbanking?: boolean;
        wallet?: boolean;
    };
}

export interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

/**
 * Open Razorpay checkout popup.
 * Resolves with payment details on success, or throws on failure/cancel.
 */
export const openRazorpayCheckout = (options: RazorpayCheckoutOptions): Promise<RazorpaySuccessResponse> => {
    return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
            key: options.keyId,
            amount: options.amount,
            currency: options.currency || 'INR',
            order_id: options.orderId,
            name: options.name || 'SriKrishna Textile Shop',
            description: options.description || 'Premium Textile Purchase',
            image: options.image || '/logo.png',
            prefill: options.prefill || {},
            theme: options.theme || { color: '#7C3AED' },
            config: {
                display: {
                    blocks: {
                        banks: { name: 'Pay via UPI/Netbanking', instruments: [{ method: 'upi' }, { method: 'netbanking' }] },
                        cards: { name: 'Pay via Card', instruments: [{ method: 'card' }] },
                        wallets: { name: 'Pay via Wallet', instruments: [{ method: 'wallet' }] },
                    },
                    sequence: ['block.banks', 'block.cards', 'block.wallets'],
                    preferences: { show_default_blocks: true },
                },
            },
            handler: (response: RazorpaySuccessResponse) => {
                resolve(response);
            },
            modal: {
                ondismiss: () => {
                    reject(new Error('Payment cancelled by user'));
                },
            },
        });
        rzp.open();
    });
};
