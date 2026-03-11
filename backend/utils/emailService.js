const nodemailer = require('nodemailer');

/**
 * Create a Nodemailer transporter using SMTP settings from .env
 * Supports Gmail, Outlook, Mailtrap, or any SMTP provider.
 *
 * .env vars needed:
 *   EMAIL_HOST=smtp.gmail.com
 *   EMAIL_PORT=587
 *   EMAIL_USER=you@gmail.com
 *   EMAIL_PASS=your_app_password
 *   EMAIL_FROM=SriKrishna Textile <noreply@srikrishnatextile.com>
 */
const createTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || '587'),
    secure: parseInt(EMAIL_PORT || '587') === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });
};

/**
 * Send order confirmation email to customer
 */
const sendOrderConfirmationEmail = async ({ to, name, orderId, paymentId, items, total, address, estimatedDelivery }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('ℹ️  Email not configured – skipping order confirmation email.');
    return false;
  }

  const itemRows = items.map(item => `
        <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #2a2a3a;">${item.product?.name || item.productId}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #2a2a3a;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #2a2a3a;text-align:right;">₹${(item.product?.price || 0).toLocaleString()}</td>
        </tr>
    `).join('');

  const deliveryDate = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '5–7 business days';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e2f0;">
  <div style="max-width:600px;margin:0 auto;background:#111122;border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;">🎉 Order Confirmed!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Thank you for shopping with SriKrishna Textile Shop</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 28px;">
      <p style="margin:0 0 20px;color:#a0a0c0;font-size:15px;">Hi <strong style="color:#e2e2f0;">${name}</strong>,</p>
      <p style="margin:0 0 24px;color:#a0a0c0;font-size:15px;">Your order has been placed successfully and payment is confirmed. Here are your order details:</p>

      <!-- Order IDs -->
      <div style="background:#1a1a2e;border-radius:12px;padding:16px 20px;margin-bottom:24px;border:1px solid #2a2a4a;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#7c3aed;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order ID</span>
          <span style="color:#e2e2f0;font-family:monospace;font-weight:700;">#${orderId}</span>
        </div>
        ${paymentId ? `<div style="display:flex;justify-content:space-between;">
          <span style="color:#06b6d4;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Payment ID</span>
          <span style="color:#a0a0c0;font-family:monospace;font-size:12px;">${paymentId}</span>
        </div>` : ''}
      </div>

      <!-- Items Table -->
      <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#7c3aed;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#1a1a2e;">
            <th style="padding:10px 8px;text-align:left;font-size:12px;color:#a0a0c0;text-transform:uppercase;">Product</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;color:#a0a0c0;text-transform:uppercase;">Qty</th>
            <th style="padding:10px 8px;text-align:right;font-size:12px;color:#a0a0c0;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Total -->
      <div style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.15));border:1px solid rgba(124,58,237,0.3);border-radius:10px;padding:16px 20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;color:#e2e2f0;font-size:16px;">Total Paid</span>
        <span style="font-weight:800;font-size:22px;background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">₹${Number(total).toLocaleString()}</span>
      </div>

      <!-- Delivery Address -->
      <h3 style="margin:0 0 10px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#7c3aed;">Delivery Address</h3>
      <div style="background:#1a1a2e;border-radius:10px;padding:14px 18px;margin-bottom:24px;border:1px solid #2a2a4a;">
        <p style="margin:0;color:#a0a0c0;font-size:14px;line-height:1.6;">${address}</p>
      </div>

      <!-- Estimated Delivery -->
      <div style="background:#0f2918;border:1px solid rgba(57,255,20,0.2);border-radius:10px;padding:14px 18px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#a0a0c0;">📦 Estimated Delivery</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#39ff14;">${deliveryDate}</p>
      </div>

      <!-- Footer note -->
      <p style="margin:0;font-size:13px;color:#666688;text-align:center;line-height:1.6;">
        For support, contact us at <a href="mailto:support@srikrishnatextile.com" style="color:#7c3aed;">support@srikrishnatextile.com</a><br/>
        or track your order at <a href="http://localhost:5173/my-orders" style="color:#06b6d4;">My Orders</a>
      </p>
    </div>

    <!-- Footer bar -->
    <div style="background:#1a1a2e;padding:16px;text-align:center;border-top:1px solid #2a2a4a;">
      <p style="margin:0;font-size:12px;color:#44445a;">© 2025 SriKrishna Textile Shop | Powered by Razorpay</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"SriKrishna Textile" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed – #${orderId} | SriKrishna Textile Shop`,
      html,
    });
    console.log(`✅ Order confirmation email sent to: ${to}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    return false;
  }
};

/**
 * Send COD order confirmation email
 */
const sendCODConfirmationEmail = async ({ to, name, orderId, items, total, address, estimatedDelivery }) => {
  return sendOrderConfirmationEmail({
    to, name, orderId, paymentId: null, items, total, address, estimatedDelivery
  });
};

/**
 * Send Admin Order Notification 
 */
const sendAdminOrderNotificationEmail = async ({ customerName, customerEmail, customerPhone, orderId, total, paymentMethod, items, orderDate }) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  const itemRows = items.map(item => `
    <li>${item.product?.name || item.productId} - Qty ${item.quantity} - ₹${(item.product?.price || 0).toLocaleString()}</li>
  `).join('');

  const html = `
    <h3>New Order Received – SriKrishna Premium Fashion</h3>
    <p>Hello Admin,</p>
    <p>A new order has been placed on the SriKrishna Premium Fashion website.</p>
    
    <h4>Order Details:</h4>
    <ul>
      <li><strong>Customer Name:</strong> ${customerName}</li>
      <li><strong>Customer Email:</strong> ${customerEmail}</li>
      <li><strong>Phone Number:</strong> ${customerPhone || 'N/A'}</li>
    </ul>

    <h4>Order Information:</h4>
    <ul>
      <li><strong>Order ID:</strong> ${orderId}</li>
      <li><strong>Order Date:</strong> ${orderDate ? new Date(orderDate).toLocaleString() : new Date().toLocaleString()}</li>
      <li><strong>Total Amount:</strong> ₹${total.toLocaleString()}</li>
      <li><strong>Payment Method:</strong> ${paymentMethod}</li>
    </ul>

    <h4>Products Ordered:</h4>
    <ul>
      ${itemRows}
    </ul>

    <p>Please login to the admin dashboard to process this order.</p>
    <p>Admin Panel: Go to Orders → View Order → Update Status</p>

    <br/>
    <p>Regards,<br/>SriKrishna Premium Fashion Website</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"SriKrishna Admin" <noreply@srikrishnatextiles.com>',
      to: 'madhu.matt.matti@gmail.com',
      subject: `New Order Received – #${orderId}`,
      html,
    });
    console.log('[Admin] ✅ Order notification email sent to madhu.matt.matti@gmail.com');
    return true;
  } catch (err) {
    console.error('[Admin] ❌ Failed to send order notification email:', err.message);
    return false;
  }
};

/**
 * Send customer confirmation email with specific required exact text template.
 */
const sendCustomerOrderEmail = async ({ customerEmail, customerName, orderId, orderDate, totalAmount, paymentMethod, products }) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  const productList = products.map(p => `- ${p.product?.name || p.productId} (x${p.quantity})`).join('\n');
  const formattedDate = orderDate ? new Date(orderDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

  const text = `Hello ${customerName},

Thank you for shopping with SriKrishna Premium Fashion.

Your order has been successfully placed.

Order Details:

Order ID: ${orderId}
Order Date: ${formattedDate}
Total Amount: ₹${totalAmount}
Payment Method: ${paymentMethod}

Products Ordered:
${productList}

Order Status:
Pending

We will notify you once your order is packed and shipped.

Support:
WhatsApp: +91 9786632306

Regards  
SriKrishna Premium Fashion`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Order Confirmation – SriKrishna Premium Fashion',
      text
    });
    console.log(`✅ Order confirmation email sent to: ${customerEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send customer email:', err.message);
    return false;
  }
};

/**
 * Send Admin Order email with specific required exact text template.
 */
const sendAdminOrderEmail = async ({ customerName, customerEmail, orderId, totalAmount, products }) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  const productList = products.map(p => `- ${p.product?.name || p.productId} (x${p.quantity})`).join('\n');

  const text = `Hello Admin,

A new order has been placed on the website.

Customer Name: ${customerName}
Customer Email: ${customerEmail}

Order ID: ${orderId}
Total Amount: ₹${totalAmount}

Products Ordered:
${productList}

Please login to the admin dashboard to process the order.`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'madhu.matt.matti@gmail.com',
      subject: 'New Order Received – SriKrishna Premium Fashion',
      text
    });
    console.log(`[Admin] ✅ Order notification email sent to madhu.matt.matti@gmail.com`);
    return true;
  } catch (err) {
    console.error('[Admin] ❌ Failed to send admin email:', err.message);
    return false;
  }
};

module.exports = { 
  sendOrderConfirmationEmail, 
  sendCODConfirmationEmail, 
  sendAdminOrderNotificationEmail,
  sendCustomerOrderEmail,
  sendAdminOrderEmail
};
