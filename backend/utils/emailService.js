const { sendOrderConfirmationEmails, sendStatusUpdateEmail } = require('./sendOrderEmail');
const User = require('../models/User');
const Order = require('../models/Order');

/**
 * Compatibility wrapper for legacy code calling sendOrderConfirmationEmail (singular)
 */
const sendOrderConfirmationEmail = async ({ to, name, orderId, paymentId, items, total, address, estimatedDelivery }) => {
    try {
        // Reconstruct order-like object or fetch it
        const order = await Order.findOne({ id: orderId }).populate('items.product');
        const user = await User.findOne({ email: to });
        
        if (order && user) {
            return await sendOrderConfirmationEmails(order, user);
        } else {
            console.log('Order or User not found for email, falling back to basic data');
            const mockOrder = {
                id: orderId,
                items: items || [],
                total: total,
                shippingAddress: address,
                paymentMethod: paymentId ? 'Online Payment' : 'COD',
                createdAt: new Date()
            };
            const mockUser = { name, email: to };
            return await sendOrderConfirmationEmails(mockOrder, mockUser);
        }
    } catch (error) {
        console.error('Email compatibility wrapper failed:', error.message);
        return false;
    }
};

const sendCODConfirmationEmail = async (params) => {
    return sendOrderConfirmationEmail({ ...params, paymentId: null });
};

const sendAdminOrderNotificationEmail = async () => {
    // Already handled inside sendOrderConfirmationEmails in the new logic
    return true;
};

// Dummy exports for other things that might be in emailService
const sendCustomerOrderEmail = sendOrderConfirmationEmail;
const sendAdminOrderEmail = sendAdminOrderNotificationEmail;

module.exports = {
    sendOrderConfirmationEmail,
    sendCODConfirmationEmail,
    sendAdminOrderNotificationEmail,
    sendCustomerOrderEmail,
    sendAdminOrderEmail,
    sendStatusUpdateEmail // Exporting this too if needed
};
