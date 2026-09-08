const PDFDocument = require("pdfkit");

// Table column layout, defined once so header and rows always line up
const COLUMNS = {
  product: { x: 50, width: 220 },
  qty: { x: 280, width: 50 },
  price: { x: 340, width: 80 },
  total: { x: 430, width: 80 },
};

const ROW_GAP = 8; // space below each row
const MIN_ROW_HEIGHT = 14; // single-line height at fontSize 10

function generateInvoicePdf(invoice, res) {
  const doc = new PDFDocument({
    margin: 50,
  });

  // Tell browser/Postman this is a PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${invoice.invoiceNumber}.pdf"`,
  );

  // Send PDF directly to response
  doc.pipe(res);

  // =========================
  // Header
  // =========================

  doc.fontSize(24).font("Helvetica-Bold").text("E-COMMERCE STORE", {
    align: "center",
  });

  doc.fontSize(20).text("INVOICE", {
    align: "center",
  });

  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Invoice Number: ${invoice.invoiceNumber}`)
    .text(`Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`);

  doc.moveDown();

  // =========================
  // Customer Information
  // =========================

  doc.fontSize(13).font("Helvetica-Bold").text("Customer Information");

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Name: ${invoice.order.customerName}`)
    .text(`Phone: ${invoice.order.customerPhone}`)
    .text(`Email: ${invoice.order.customerEmail || "N/A"}`);

  doc.moveDown();

  // =========================
  // Shipping Address
  // =========================

  doc.fontSize(13).font("Helvetica-Bold").text("Shipping Address");

  doc.fontSize(10).font("Helvetica").text(invoice.order.shippingAddressLine1);

  if (invoice.order.shippingAddressLine2) {
    doc.text(invoice.order.shippingAddressLine2);
  }

  doc.text(
    `${invoice.order.shippingCity}, ${invoice.order.shippingState || ""}`,
  );

  doc.text(
    `${invoice.order.shippingPostalCode}, ${invoice.order.shippingCountry}`,
  );

  doc.moveDown();

  // =========================
  // Products
  // =========================

  doc.fontSize(13).font("Helvetica-Bold").text("Order Items");

  doc.moveDown(0.5);

  // Table header - captured y ONCE, reused for every column so they align
  doc.fontSize(10).font("Helvetica-Bold");
  const headerY = doc.y;

  doc.text("Product", COLUMNS.product.x, headerY, {
    width: COLUMNS.product.width,
  });
  doc.text("Qty", COLUMNS.qty.x, headerY, { width: COLUMNS.qty.width });
  doc.text("Price", COLUMNS.price.x, headerY, { width: COLUMNS.price.width });
  doc.text("Total", COLUMNS.total.x, headerY, { width: COLUMNS.total.width });

  doc.y = headerY + MIN_ROW_HEIGHT + 4;

  // Underline below the header row
  doc.moveTo(50, doc.y).lineTo(510, doc.y).strokeColor("#cccccc").stroke();

  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(10);

  for (const item of invoice.order.items) {
    const price = Number(item.price);
    const subtotal = price * item.quantity;

    // Row height depends on the product name, which may wrap onto multiple lines
    const productHeight = doc.heightOfString(item.product.name, {
      width: COLUMNS.product.width,
    });
    const rowHeight = Math.max(productHeight, MIN_ROW_HEIGHT);

    // Page-break guard: start a fresh page if this row won't fit
    if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }

    // Captured ONCE per row - every column in this row shares the same y
    const rowY = doc.y;

    doc.text(item.product.name, COLUMNS.product.x, rowY, {
      width: COLUMNS.product.width,
    });
    doc.text(String(item.quantity), COLUMNS.qty.x, rowY, {
      width: COLUMNS.qty.width,
    });
    doc.text(`Rs. ${price.toFixed(2)}`, COLUMNS.price.x, rowY, {
      width: COLUMNS.price.width,
    });
    doc.text(`Rs. ${subtotal.toFixed(2)}`, COLUMNS.total.x, rowY, {
      width: COLUMNS.total.width,
    });

    doc.y = rowY + rowHeight + ROW_GAP;
  }

  // =========================
  // Total
  // =========================

  doc.moveDown();

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(`Total Amount: Rs. ${Number(invoice.totalAmount).toFixed(2)}`, {
      align: "right",
    });

  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Payment Method: ${invoice.order.paymentMethod}`)
    .text(`Payment Status: ${invoice.order.paymentStatus}`);

  doc.moveDown(2);

  doc.fontSize(10).text("Thank you for shopping with us!", {
    align: "center",
  });

  doc.end();
}

function generateInvoicePdfBuffer(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    // =========================
    // Header
    // =========================

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("E-COMMERCE STORE", { align: "center" });

    doc.fontSize(20).text("INVOICE", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Invoice Number: ${invoice.invoiceNumber}`)
      .text(`Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`);

    doc.moveDown();

    // =========================
    // Customer Information
    // =========================

    doc.fontSize(13).font("Helvetica-Bold").text("Customer Information");

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Name: ${invoice.order.customerName}`)
      .text(`Phone: ${invoice.order.customerPhone}`)
      .text(`Email: ${invoice.order.customerEmail || "N/A"}`);

    doc.moveDown();

    // =========================
    // Shipping Address
    // =========================

    doc.fontSize(13).font("Helvetica-Bold").text("Shipping Address");

    doc.fontSize(10).font("Helvetica").text(invoice.order.shippingAddressLine1);

    if (invoice.order.shippingAddressLine2) {
      doc.text(invoice.order.shippingAddressLine2);
    }

    doc.text(
      `${invoice.order.shippingCity}, ${invoice.order.shippingState || ""}`,
    );

    doc.text(
      `${invoice.order.shippingPostalCode}, ${invoice.order.shippingCountry}`,
    );

    doc.moveDown();

    // =========================
    // Products
    // =========================

    doc.fontSize(13).font("Helvetica-Bold").text("Order Items");

    doc.moveDown(0.5);

    // Table header - captured y ONCE, reused for every column so they align
    doc.fontSize(10).font("Helvetica-Bold");
    const headerY = doc.y;

    doc.text("Product", COLUMNS.product.x, headerY, {
      width: COLUMNS.product.width,
    });
    doc.text("Qty", COLUMNS.qty.x, headerY, { width: COLUMNS.qty.width });
    doc.text("Price", COLUMNS.price.x, headerY, {
      width: COLUMNS.price.width,
    });
    doc.text("Total", COLUMNS.total.x, headerY, {
      width: COLUMNS.total.width,
    });

    doc.y = headerY + MIN_ROW_HEIGHT + 4;

    // Underline below the header row
    doc.moveTo(50, doc.y).lineTo(510, doc.y).strokeColor("#cccccc").stroke();

    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);

    for (const item of invoice.order.items) {
      const price = Number(item.price);
      const subtotal = price * item.quantity;

      // Row height depends on the product name, which may wrap onto multiple lines
      const productHeight = doc.heightOfString(item.product.name, {
        width: COLUMNS.product.width,
      });
      const rowHeight = Math.max(productHeight, MIN_ROW_HEIGHT);

      // Page-break guard: start a fresh page if this row won't fit
      if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }

      // Captured ONCE per row - every column in this row shares the same y
      const rowY = doc.y;

      doc.text(item.product.name, COLUMNS.product.x, rowY, {
        width: COLUMNS.product.width,
      });
      doc.text(String(item.quantity), COLUMNS.qty.x, rowY, {
        width: COLUMNS.qty.width,
      });
      doc.text(`Rs. ${price.toFixed(2)}`, COLUMNS.price.x, rowY, {
        width: COLUMNS.price.width,
      });
      doc.text(`Rs. ${subtotal.toFixed(2)}`, COLUMNS.total.x, rowY, {
        width: COLUMNS.total.width,
      });

      doc.y = rowY + rowHeight + ROW_GAP;
    }

    // =========================
    // Total
    // =========================

    doc.moveDown();

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Total Amount: Rs. ${Number(invoice.totalAmount).toFixed(2)}`, {
        align: "right",
      });

    doc.moveDown();

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Payment Method: ${invoice.order.paymentMethod}`)
      .text(`Payment Status: ${invoice.order.paymentStatus}`);

    doc.moveDown(2);

    doc.fontSize(10).text("Thank you for shopping with us!", {
      align: "center",
    });

    doc.end();
  });
}

module.exports = {
  generateInvoicePdf,
  generateInvoicePdfBuffer,
};
