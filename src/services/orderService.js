const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");
const notificationService = require("./notificationService");
const emailService = require("./emailService");
const inventoryService = require("./inventoryService");

//For Customers **********************************************************

// Guest Users
async function createGuestOrder(data) {
  logger.info("Create Guest Order Endpoint Hit..");
  const {
    guestCartId,
    fullName,
    phone,
    email,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  } = data;

  if (!guestCartId) {
    throw new AppError("Guest cart id is required", 400);
  }

  // Get guest cart with products, straight from the DB (not from the request body)
  const guestCart = await prisma.guestCart.findUnique({
    where: {
      id: guestCartId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!guestCart) {
    throw new AppError("Guest cart not found", 404);
  }

  // Make sure cart is not empty
  if (guestCart.items.length === 0) {
    throw new AppError("Your cart is empty", 400);
  }

  let totalAmount = 0;

  // Validate stock and calculate total (price/quantity come from DB, not frontend)
  for (const item of guestCart.items) {
    if (item.quantity > item.product.stock) {
      throw new AppError(
        `${item.product.name} does not have enough stock`,
        400,
      );
    }

    totalAmount += Number(item.product.price) * item.quantity;
  }

  // Create order, reduce stock, and clear guest cart in one transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: null,

        // Guest customer information
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email || null,

        // Shipping address snapshot
        shippingAddressLine1: addressLine1,
        shippingAddressLine2: addressLine2 || null,
        shippingCity: city,
        shippingState: state || null,
        shippingPostalCode: postalCode,
        shippingCountry: country,

        // COD
        paymentMethod: "COD",
        paymentStatus: "PENDING",

        totalAmount,

        items: {
          create: guestCart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Reduce stock
    for (const item of guestCart.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      const previousStock = product.stock;
      const newStock = previousStock - item.quantity;

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: newStock,
        },
      });

      await inventoryService.recordInventoryHistory(tx, {
        productId: item.productId,
        previousStock,
        newStock,
        quantity: -item.quantity,
        action: "SALE",
        reason: `Guest Order #${newOrder.id}`,
      });
    }

    // Clear the guest cart now that the order has been placed
    await tx.guestCartItem.deleteMany({
      where: {
        cartId: guestCartId,
      },
    });

    logger.info("Guest Order Created Successfully..");
    return newOrder;
  });
  await notificationService.createNotification(
    userId,
    "Order Placed",
    `Your order #${order.id} has been placed successfully.`,
  );

  // Send confirmation email after successful order creation
  await emailService.sendOrderConfirmationEmail(order);

  return order;
}

// Logged-in Users
async function createOrder(userId, addressId) {
  logger.info("Create Order Endpoint Hit..");

  // Get user info to snapshot onto the order (customerName/customerPhone are required)
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      name: true,
      phone: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get user's shipping address
  const address = await prisma.address.findFirst({
    where: {
      id: Number(addressId),
      userId: Number(userId),
    },
  });
  if (!address) {
    throw new AppError("Shipping address not found", 404);
  }
  // Get user's cart with products
  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Check cart
  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty", 404);
  }

  // Check stock
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new AppError(
        `${item.product.name} does not have enough stock`,
        404,
      );
    }
  }

  // Calculate total amount
  let totalAmount = 0;

  for (const item of cart.items) {
    totalAmount += Number(item.product.price) * item.quantity;
  }

  // Create order using transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create Order
    const newOrder = await tx.order.create({
      data: {
        userId: Number(userId),

        // Snapshot customer info at the time of order
        customerName: user.name,
        customerPhone: user.phone,
        customerEmail: user.email,

        totalAmount,

        shippingAddressLine1: address.addressLine1,
        shippingAddressLine2: address.addressLine2,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPostalCode: address.postalCode,
        shippingCountry: address.country,

        paymentMethod: "COD",
        paymentStatus: "PENDING",

        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of cart.items) {
      const previousStock = item.product.stock;
      const newStock = previousStock - item.quantity;

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: newStock,
        },
      });

      await inventoryService.recordInventoryHistory(tx, {
        productId: item.productId,
        previousStock,
        newStock,
        quantity: -item.quantity,
        action: "SALE",
        reason: `Order #${newOrder.id}`,
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return newOrder;
  });

  await notificationService.createNotification(
    userId,
    "Order Placed",
    `Your order #${order.id} has been placed successfully.`,
  );

  // Send confirmation email after successful order creation
  await emailService.sendOrderConfirmationEmail(order);

  logger.info("Order Create Successfully..");
  return order;
}

async function getMyOrders(userId) {
  logger.info("Get All Orders Endpoint Hit..");
  const orders = await prisma.order.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  logger.info("Orders Fetched Successfully..");
  return orders;
  // try {
  // } catch (error) {
  //   logger.error("Getting Order Error:", error.message);
  //   throw error;
  // }
}

async function getOrderById(userId, orderId) {
  logger.info("Get Order By Id Endpoint Hit..");
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
      userId: Number(userId),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }
  logger.info("Order Fetched Successfully..");

  return order;
  // try {
  // } catch (error) {
  //   logger.error("Getting Order Error:", error.message);
  //   throw error;
  // }
}

async function cancelOrder(userId, orderId) {
  logger.info("Cancel Order Endpoint Hit..");
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
      userId: Number(userId),
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Only PENDING orders can be cancelled
  if (order.status !== "PENDING") {
    throw new AppError("This order can no longer be cancelled", 400);
  }

  const cancelledOrder = await prisma.$transaction(async (tx) => {
    // Restore stock
    for (const item of order.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      const previousStock = product.stock;
      const newStock = previousStock + item.quantity;

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: newStock,
        },
      });

      await inventoryService.recordInventoryHistory(tx, {
        productId: item.productId,
        previousStock,
        newStock,
        quantity: item.quantity,
        action: "CANCELLATION",
        reason: `Order #${order.id}`,
      });
    }

    // Change order status
    const updatedOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return updatedOrder;
  });
  logger.info("Order Cancelled Successfully..");

  return cancelledOrder;
  // try {
  // } catch (error) {
  //   logger.error("Cancling Order Error:", error.message);
  //   throw error;
  // }
}

// For Admin  *************************************************************

async function getAllOrders() {
  logger.info("Get All Orders Admin Side Endpoint Hit..");
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  logger.info("Orders Fetched Successfully on Admin Side");
  return orders;
  // try {
  // } catch (error) {
  //   logger.error("Getting Orders on Admin Side Error:", error.message);
  //   throw error;
  // }
}

async function updateOrderStatus(orderId, status) {
  logger.info("Updating Order Status Endpoint Hit..");
  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const allowedTransitions = {
    PENDING: ["PROCESSING"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status].includes(status)) {
    throw new AppError(
      `Cannot change order status from ${order.status} to ${status}`,
      400,
    );
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: Number(orderId),
    },
    data: {
      status,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  await emailService.sendOrderStatusEmail(updatedOrder);

  const notification = await notificationService.getOrderNotification(
    status,
    updatedOrder.id,
  );

  if (notification) {
    await notificationService.createNotification(
      updatedOrder.userId,
      notification.title,
      notification.message,
    );
  }

  logger.info("Order Status Updated Successfully..");
  return updatedOrder;
}

const returnOrder = async (orderId) => {
  logger.info("Return Order Endpoint Hit..");
  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status !== "IN_TRANSIT") {
    throw new AppError("Only in-transit orders can be marked as returned", 400);
  }

  if (order.paymentStatus === "PAID") {
    throw new AppError("A paid order cannot be marked as returned", 400);
  }

  const returnedOrder = await prisma.$transaction(async (tx) => {
    // Restore stock
    for (const item of order.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      const previousStock = product.stock;
      const newStock = previousStock + item.quantity;

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: newStock,
        },
      });

      await inventoryService.recordInventoryHistory(tx, {
        productId: item.productId,
        previousStock,
        newStock,
        quantity: item.quantity,
        action: "RETURN",
        reason: `Order #${order.id}`,
      });
    }

    // Mark order as returned
    const updatedOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "RETURNED",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder;
  });
  logger.info("Order Marked as Returned Successfully..");
  return returnedOrder;
};

module.exports = {
  createGuestOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  returnOrder,
};
