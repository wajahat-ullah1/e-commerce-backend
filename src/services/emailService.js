const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const {
  orderConfirmationEmail,
  orderStatusEmail,
  passwordResetEmail,
} = require("../templates/emailTemplates");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true", // false for port 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Very basic HTML -> plain text fallback. Emails with no text/plain part
// score worse with spam filters, and some clients show it as a preview.
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "E-Commerce Store"}" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text: text || stripHtml(html),
    });

    logger.info(`Email sent: ${info.messageId}`);

    return info;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);

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