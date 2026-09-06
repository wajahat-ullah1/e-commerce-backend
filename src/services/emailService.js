const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const {
  orderConfirmationEmail,
  orderStatusEmail,
  passwordResetEmail,
} = require("../templates/emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail({ to, subject, html }) {
  if (!to) {
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    logger.info("Email sent:", info.messageId);

    return info;
  } catch (error) {
    logger.error("Email sending failed:", error.message);

    // Don't break the main application because of email failure
    return null;
  }
}

async function sendOrderConfirmationEmail(order) {
  if (!order.customerEmail) {
    return null;
  }

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation #${order.id}`,
    html: orderConfirmationEmail(order),
  });
}

async function sendOrderStatusEmail(order) {
  if (!order.customerEmail) {
    return null;
  }

  const email = orderStatusEmail(order);

  if (!email) {
    return null;
  }

  return sendEmail({
    to: order.customerEmail,
    subject: email.subject,
    html: email.html,
  });
}

async function sendPasswordResetEmail(email, resetToken) {
  const emailContent = passwordResetEmail(resetToken);

  return sendEmail({
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
  });
}

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendPasswordResetEmail,
};
