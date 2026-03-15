const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (order, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fillColor('#444444')
            .fontSize(20)
            .text('Srikrishna Textiles', 110, 50)
            .fontSize(10)
            .text('123, Textile Market, Sivakasi', 200, 65, { align: 'right' })
            .text('Tamil Nadu - 626123', 200, 80, { align: 'right' })
            .moveDown();

        // Line
        doc.strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, 100)
            .lineTo(550, 100)
            .stroke();

        // Invoice Title
        doc.fillColor('#9c27b0')
            .fontSize(20)
            .text('INVOICE', 50, 120);

        // Order Info
        doc.fillColor('#444444')
            .fontSize(10)
            .text(`Order ID: ${order.id}`, 50, 150)
            .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 165)
            .text(`Status: ${order.status.toUpperCase()}`, 50, 180);

        // Customer Info
        doc.text(`Customer Name: ${order.user.name}`, 300, 150)
            .text(`Email: ${order.user.email}`, 300, 165);

        // Address
        doc.fontSize(12).text('Shipping Address:', 50, 210);
        doc.fontSize(10).text(order.shippingAddress || 'N/A', 50, 230, { width: 200 });

        // Table Header
        const tableTop = 300;
        doc.fillColor('#9c27b0')
            .fontSize(10)
            .text('Item', 50, tableTop)
            .text('Quantity', 250, tableTop)
            .text('Price', 350, tableTop)
            .text('Total', 450, tableTop, { align: 'right' });

        doc.strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, tableTop + 15)
            .lineTo(550, tableTop + 15)
            .stroke();

        // Table Body
        let i = 0;
        let runningY = tableTop + 30;
        order.items.forEach(item => {
            const productName = item.product.name;
            const quantity = item.quantity;
            const price = item.product.price;
            const total = quantity * price;

            doc.fillColor('#444444')
                .text(productName, 50, runningY)
                .text(quantity.toString(), 250, runningY)
                .text(`₹${price.toLocaleString()}`, 350, runningY)
                .text(`₹${total.toLocaleString()}`, 450, runningY, { align: 'right' });

            runningY += 20;
            i++;
        });

        // Summary
        doc.strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, runningY + 10)
            .lineTo(550, runningY + 10)
            .stroke();

        doc.fillColor('#444444')
            .fontSize(12)
            .text('Total Amount:', 350, runningY + 30)
            .fontSize(14)
            .fillColor('#9c27b0')
            .text(`₹${order.total.toLocaleString()}`, 450, runningY + 30, { align: 'right' });

        // Footer
        doc.fillColor('#888888')
            .fontSize(10)
            .text('Thank you for shopping with Srikrishna Textiles!', 50, 700, { align: 'center', width: 500 });

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

module.exports = { generateInvoicePDF };
