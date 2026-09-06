function orderConfirmationEmail(order) {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            ${item.product.name}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            ${item.quantity}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            Rs. ${Number(item.price).toFixed(2)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

      <h2>Order Confirmed 🎉</h2>

      <p>Hello ${order.customerName},</p>

      <p>
        Thank you for your order. Your order has been successfully placed.
      </p>

      <h3>Order #${order.id}</h3>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px;">Product</th>
            <th style="text-align: left; padding: 8px;">Quantity</th>
            <th style="text-align: left; padding: 8px;">Price</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <h3>
        Total: Rs. ${Number(order.totalAmount).toFixed(2)}
      </h3>

      <p>
        Payment Method: Cash on Delivery
      </p>

      <p>
        Order Status: ${order.status}
      </p>

      <p>
        Thank you for shopping with us!
      </p>

    </div>
  `;
}

function orderStatusEmail(order) {
  const statusMessages = {
    PROCESSING: {
      subject: `Your Order #${order.id} is Being Processed`,
      title: "Your order is being processed",
      message:
        "We've started processing your order. We'll let you know when it moves to the next stage.",
    },

    SHIPPED: {
      subject: `Your Order #${order.id} Has Been Shipped`,
      title: "Your order has been shipped",
      message:
        "Great news! Your order has been shipped and is on its way to you.",
    },

    IN_TRANSIT: {
      subject: `Your Order #${order.id} is In Transit`,
      title: "Your order is in transit",
      message: "Your order is currently on its way to your delivery address.",
    },

    DELIVERED: {
      subject: `Your Order #${order.id} Has Been Delivered`,
      title: "Your order has been delivered",
      message:
        "Your order has been successfully delivered. Thank you for shopping with us!",
    },

    CANCELLED: {
      subject: `Your Order #${order.id} Has Been Cancelled`,
      title: "Your order has been cancelled",
      message: "Your order has been cancelled successfully.",
    },
  };

  const statusInfo = statusMessages[order.status];

  if (!statusInfo) {
    return null;
  }

  return {
    subject: statusInfo.subject,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2>${statusInfo.title}</h2>

        <p>Hello ${order.customerName},</p>

        <p>${statusInfo.message}</p>

        <h3>Order #${order.id}</h3>

        <p>
          <strong>Order Status:</strong> ${order.status}
        </p>

        <p>
          <strong>Total:</strong>
          Rs. ${Number(order.totalAmount).toFixed(2)}
        </p>

        <p>
          <strong>Payment Method:</strong>
          Cash on Delivery
        </p>

        <p>
          Thank you for shopping with us!
        </p>

      </div>
    `,
  };
}

function passwordResetEmail(resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  return {
    subject: "Reset Your Password",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2>Password Reset Request</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

      </div>
    `,
  };
}

module.exports = {
  orderConfirmationEmail,
  orderStatusEmail,
  passwordResetEmail,
};
