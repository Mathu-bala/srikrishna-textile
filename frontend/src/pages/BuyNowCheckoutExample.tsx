/**
 * Example: BuyNowCheckout with Stripe Integration
 * 
 * This example shows how to integrate Stripe payment gateway into your
 * existing BuyNowCheckout component. You can use this as a reference.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from '../components/payment/StripeCheckout';
import { StripePaymentData } from '../lib/stripe';

interface CheckoutData {
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
    items: any[];
    totalPrice: number;
    couponCode?: string;
}

export default function BuyNowCheckoutExample() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'cod'>('stripe');
    const [checkoutData, setCheckoutData] = useState<CheckoutData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: 'India',
        },
        items: [], // Your cart items
        totalPrice: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, key] = name.split('.');
            setCheckoutData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [key]: value }
            }));
        } else {
            setCheckoutData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePaymentSuccess = (orderId: string) => {
        alert('Payment successful! Order ID: ' + orderId);
        navigate(`/order-success/${orderId}`);
    };

    const handlePaymentError = (error: string) => {
        alert('Payment failed: ' + error);
    };

    const stripePaymentData: StripePaymentData = {
        items: checkoutData.items,
        totalPrice: checkoutData.totalPrice,
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email,
        phone: checkoutData.phone,
        shippingAddress: checkoutData.shippingAddress,
        couponCode: checkoutData.couponCode,
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            {/* Checkout Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Shipping & Personal Info */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={checkoutData.firstName}
                                onChange={handleInputChange}
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={checkoutData.lastName}
                                onChange={handleInputChange}
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={checkoutData.email}
                                onChange={handleInputChange}
                                className="border rounded px-3 py-2 col-span-2"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={checkoutData.phone}
                                onChange={handleInputChange}
                                className="border rounded px-3 py-2 col-span-2"
                            />
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="shippingAddress.street"
                                placeholder="Street Address"
                                value={checkoutData.shippingAddress.street}
                                onChange={handleInputChange}
                                className="border rounded px-3 py-2 w-full"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="shippingAddress.city"
                                    placeholder="City"
                                    value={checkoutData.shippingAddress.city}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2"
                                />
                                <input
                                    type="text"
                                    name="shippingAddress.state"
                                    placeholder="State"
                                    value={checkoutData.shippingAddress.state}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2"
                                />
                                <input
                                    type="text"
                                    name="shippingAddress.zip"
                                    placeholder="ZIP Code"
                                    value={checkoutData.shippingAddress.zip}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2"
                                />
                                <select
                                    name="shippingAddress.country"
                                    value={checkoutData.shippingAddress.country}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="India">India</option>
                                    <option value="US">US</option>
                                    <option value="UK">UK</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Method & Summary */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{checkoutData.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>FREE</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                                <span>Total:</span>
                                <span>₹{checkoutData.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="stripe"
                                    checked={paymentMethod === 'stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                                    className="mr-2"
                                />
                                <span>💳 Stripe (Credit/Debit Card)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="razorpay"
                                    checked={paymentMethod === 'razorpay'}
                                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                                    className="mr-2"
                                />
                                <span>🏦 Razorpay (All Methods)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                                    className="mr-2"
                                />
                                <span>💰 Cash on Delivery</span>
                            </label>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="border-t pt-6">
                        {paymentMethod === 'stripe' && (
                            <StripeCheckout
                                paymentData={stripePaymentData}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                        )}
                        {paymentMethod === 'razorpay' && (
                            <p className="text-gray-600 p-4">Razorpay payment implementation here</p>
                        )}
                        {paymentMethod === 'cod' && (
                            <button className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700">
                                Place Order (Pay on Delivery)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
