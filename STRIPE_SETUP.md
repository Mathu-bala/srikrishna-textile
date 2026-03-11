# Stripe Payment Gateway Integration Guide

## Prerequisites
- Stripe Account (Create at https://stripe.com)
- Node.js and npm installed

## Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** (pk_test_...)
3. Copy your **Secret Key** (sk_test_...)
4. Go to [Webhooks](https://dashboard.stripe.com/webhooks) and create a webhook endpoint:
   - **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
   - **Events**: Select `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy the **Webhook Secret** (whsec_...)

## Step 2: Install Dependencies

### Backend
```bash
cd backend
npm install stripe
```

### Frontend
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Step 3: Configure Environment Variables

Update `backend/.env`:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

## Step 4: Usage in Frontend

### Option A: Using StripeCheckout Component (Recommended)

```tsx
import StripeCheckout from '@/components/payment/StripeCheckout';

export default function CheckoutPage() {
    const handlePaymentSuccess = (orderId: string) => {
        console.log('Order ID:', orderId);
        // Navigate to success page
    };

    const handlePaymentError = (error: string) => {
        console.error('Payment error:', error);
        // Show error toast
    };

    const paymentData = {
        items: cartItems,
        totalPrice: totalAmount,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+91-9999999999',
        shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'US',
        },
        couponCode: 'SAVE10',
    };

    return (
        <StripeCheckout
            paymentData={paymentData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
        />
    );
}
```

### Option B: Manual Integration

```tsx
import { createPaymentIntent, confirmPaymentOnBackend } from '@/lib/stripe';

// Create payment intent
const { clientSecret, paymentIntentId } = await createPaymentIntent(paymentData);

// Use stripe.js to confirm payment
const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
        card: cardElement,
        billing_details: { name, email },
    },
});

// Confirm payment on backend
if (result.paymentIntent?.status === 'succeeded') {
    const orderResult = await confirmPaymentOnBackend(paymentIntentId);
    console.log('Order created:', orderResult.orderId);
}
```

## Step 5: Testing

### Test Cards (Use in Stripe Test Mode)
- **Successful**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 0002

**Expiry**: Any future date (e.g., 12/25)
**CVC**: Any 3 digits (e.g., 123)

## Step 6: API Endpoints

### Get Publishable Key
```
GET /api/stripe/key
Header: Authorization: Bearer {token}
```

### Create Payment Intent
```
POST /api/stripe/create-intent
Body: {
    items: [...],
    totalPrice: 999.99,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    shippingAddress: {...},
    couponCode?: "SAVE10"
}
```

### Confirm Payment
```
POST /api/stripe/confirm-payment
Body: {
    paymentIntentId: "pi_1234567890"
}
```

### Refund Payment
```
POST /api/stripe/refund
Body: {
    paymentIntentId: "pi_1234567890",
    reason: "requested_by_customer"
}
```

### Webhook
```
POST /api/stripe/webhook
- Stripe sends events to this endpoint
- Handles: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
```

## Step 7: Webhook Configuration (Local Testing)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (Chocolatey)
choco install stripe-cli

# or download from https://stripe.com/docs/stripe-cli
```

Run Stripe CLI:
```bash
stripe login
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Gets webhook signing secret and displays forwarded events.

## Step 8: Deployment

### Move to Live Keys
1. Replace `pk_test_` and `sk_test_` with `pk_live_` and `sk_live_`
2. Get new webhook signing secret for production
3. Update `.env` in production environment

### Security Checklist
- ✅ Never commit `.env` to version control
- ✅ Use environment variables for all sensitive keys
- ✅ Validate webhook signatures on the backend
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on payment endpoints
- ✅ Log all payment events for audit trails

## Troubleshooting

### "Stripe keys not configured"
- Ensure `.env` file has `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
- Restart backend server after updating `.env`

### Payment Intent creation fails
- Check console for error messages
- Verify Stripe keys are correct (test vs. live)
- Ensure items have valid product IDs and stock

### Webhook events not received
- Check if webhook URL is accessible from internet
- Verify webhook secret in `.env` matches Stripe dashboard
- Use Stripe CLI for local testing

### "Payment not completed"
- Card details might be invalid (use test cards)
- Card might be declined (use 4000 0000 0000 0002 to test)
- Client-side validation might have failed

## References
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhook Events](https://stripe.com/docs/api/events)
