const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const { generateInvoicePDF } = require("./invoiceGenerator");

// Transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Base Template Wrapper
 */
const emailTemplate = (content, title, userName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 20px 0 30px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%); padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
              Srikrishna Textiles
              <div style="font-size: 14px; font-weight: normal; margin-top: 10px; opacity: 0.9;">Exquisite Tradition, Modern Style</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #153643; font-size: 24px;">
                    <b>${title}</b>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 30px 0; color: #153643; font-size: 16px; line-height: 24px;">
                    <p>Hello ${userName || 'Customer'},</p>
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #9c27b0; padding: 30px 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 14px; width: 75%;">
                    &copy; ${new Date().getFullYear()} Srikrishna Textiles<br/>
                    123, Textile Market, Sivakasi, Tamil Nadu<br/>
                    <a href="mailto:support@srikrishnatextiles.com" style="color: #ffffff; text-decoration: underline;">support@srikrishnatextiles.com</a>
                  </td>
                  <td align="right" style="width: 25%;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                          <a href="#" style="color: #ffffff;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB" width="24" height="24" style="display: block;" border="0" />
                          </a>
                        </td>
                        <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                        <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                          <a href="#" style="color: #ffffff;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="IG" width="24" height="24" style="display: block;" border="0" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
             <td align="center" style="padding: 10px; font-size: 12px; color: #999;">
                Need help? Call us at +91 98765 43210
             </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * FEATURE 1 & 2: Order Confirmation + Invoice PDF
 */
const sendOrderConfirmationEmails = async (order, user) => {
  const invoiceFileName = `Invoice-${order.id}.pdf`;
  const invoicePath = path.join(__dirname, `../temp/${invoiceFileName}`);
  
  try {
    // Generate PDF
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
    }
    await generateInvoicePDF(order, invoicePath);

    const itemsHtml = `
      <table width="100%" style="border-collapse: collapse; margin: 20px 0; border: 1px solid #eee;">
        <tr style="background-color: #f8f8f8;">
          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">Product</th>
          <th style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">Qty</th>
          <th style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">Price</th>
        </tr>
        ${order.items.map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || 'Product'}</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">₹${(item.product?.price || order.total).toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #9c27b0;">₹${order.total.toLocaleString()}</td>
        </tr>
      </table>
    `;

    const content = `
      <p>Thank you for shopping with Srikrishna Textiles. Your order has been successfully placed and payment has been received.</p>
      
      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #9c27b0;">
        <p style="margin: 5px 0;"><b>Order ID:</b> #${order.id}</p>
        <p style="margin: 5px 0;"><b>Order Date:</b> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="margin: 5px 0;"><b>Payment Method:</b> ${order.paymentMethod || 'Online Payment'}</p>
        <p style="margin: 5px 0;"><b>Payment Status:</b> <span style="color: #4caf50; font-weight: bold;">Paid Successfully</span></p>
      </div>

      <h3 style="color: #9c27b0; margin-top: 30px;">Product Details</h3>
      ${itemsHtml}

      <h3 style="color: #9c27b0; margin-top: 30px;">Delivery Address</h3>
      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.6; color: #666;">
        ${order.shippingAddress}
      </div>

      <p style="margin-top: 30px; font-weight: bold;">Your order is now being processed and will be shipped soon.</p>
    `;

    // Send Customer Mail
    await transporter.sendMail({
      from: `"Srikrishna Textiles" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Order Has Been Successfully Placed – Srikrishna Textiles",
      html: emailTemplate(content, "Order Confirmation", user.name),
      attachments: [
        {
          filename: invoiceFileName,
          path: invoicePath
        }
      ]
    });

    // FEATURE 4: Send Admin Notification
    await sendAdminNotification(order, user);

    // Cleanup
    if (fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);
    console.log(`✅ Order confirmation emails sent for #${order.id}`);

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    if (invoicePath && fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);
  }
};

/**
 * FEATURE 4: Admin Notification Email
 */
const sendAdminNotification = async (order, user) => {
  const adminEmail = "admin@srikrishnatextiles.com"; // User requested this email in the prompt
  const fallbackAdmin = "madhu.matt.matti@gmail.com"; 

  const content = `
    <p>A new order has been received and requires processing.</p>
    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 5px 0;"><b>Order ID:</b> #${order.id}</p>
      <p style="margin: 5px 0;"><b>Customer Name:</b> ${user.name}</p>
      <p style="margin: 5px 0;"><b>Customer Email:</b> ${user.email}</p>
      <p style="margin: 5px 0;"><b>Total Amount:</b> ₹${order.total.toLocaleString()}</p>
    </div>
    <h3 style="color: #9c27b0;">Shipping Address</h3>
    <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; font-size: 14px;">${order.shippingAddress}</p>
    <p>Please log in to the admin dashboard to process the order.</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Store Alert" <${process.env.EMAIL_USER}>`,
      to: `${adminEmail}, ${fallbackAdmin}`,
      subject: `New Order Received – Srikrishna Textiles (#${order.id})`,
      html: emailTemplate(content, "New Order Received", "Admin")
    });
  } catch (err) {
    console.error("❌ Admin Notification Failed:", err.message);
  }
};

/**
 * FEATURE 3: Shipping Update Emails
 */
const sendStatusUpdateEmail = async (order, user) => {
  const status = order.status;
  let subject = "";
  let message = "";

  switch (status) {
    case 'processing':
      subject = "Your Order is Being Processed – Srikrishna Textiles";
      message = "We are currently preparing your items for shipment. You will receive another update once it's on the way.";
      break;
    case 'shipped':
      subject = "Your Order Has Been Shipped – Srikrishna Textiles";
      message = "Great news! Your package has left our facility and is on its way to you.";
      break;
    case 'out-for-delivery':
      subject = "Your Order is Out for Delivery – Srikrishna Textiles";
      message = "Your order will reach you today! Our delivery partner is on the way.";
      break;
    case 'delivered':
      subject = "Your Order Has Been Delivered – Srikrishna Textiles";
      message = "Your order has been successfully delivered. Thank you for choosing Srikrishna Textiles!";
      break;
    default:
      subject = `Order Update: ${status.toUpperCase()}`;
      message = `Your order status has been updated to: ${status}`;
  }

  const content = `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Your order <strong>#${order.id}</strong> status has been updated.</p>
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
       <span style="font-size: 18px; font-weight: bold; color: #9c27b0;">Status: ${status.replace(/-/g, ' ').toUpperCase()}</span>
    </div>
    <p>${message}</p>
    <div style="margin-top: 30px; text-align: center;">
       <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-order/${order.id}" style="background: #9c27b0; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Track Order Status</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Srikrishna Textiles" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: emailTemplate(content, "Shipping Update", user.name)
    });
  } catch (err) {
    console.error("❌ Status Update Email Failed:", err.message);
  }
};

module.exports = {
  sendOrderConfirmationEmails,
  sendStatusUpdateEmail
};
