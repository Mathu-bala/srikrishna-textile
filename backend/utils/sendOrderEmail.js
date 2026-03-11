const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderEmails = async (order) => {

  const customerMail = {
    from: process.env.EMAIL_USER,
    to: order.customerEmail,
    subject: "Order Confirmation – SriKrishna Premium Fashion",
    html: `
      <h2>Your Order is Confirmed</h2>
      <p>Hello ${order.customerName}</p>
      <p>Your order has been placed successfully.</p>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Total Amount:</b> ₹${order.totalAmount}</p>
      <p><b>Payment Method:</b> ${order.paymentMethod}</p>
    `
  };

  const adminMail = {
    from: process.env.EMAIL_USER,
    to: "madhu.matt.matti@gmail.com",
    subject: "New Order Received",
    html: `
      <h2>New Order Received</h2>
      <p>Customer: ${order.customerName}</p>
      <p>Email: ${order.customerEmail}</p>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: ₹${order.totalAmount}</p>
    `
  };

  try {
    await transporter.sendMail(customerMail);
    await transporter.sendMail(adminMail);
    console.log("✅ Order confirmation emails sent successfully (Customer & Admin).");
  } catch (error) {
    console.error("❌ Failed to send order emails:", error.message);
  }
};

module.exports = sendOrderEmails;
