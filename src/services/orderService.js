const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

// For Customer

async function createOrder(userId, addressId) {
  logger.info("Create Order Endpoint Hit..");
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

    // Reduce product stock
    for (const item of cart.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
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

  logger.info("Order Create Successfully..");
  return order;
  // try {
  // } catch (error) {
  //   logger.error("Creating Order Error:", error.message);
  //   throw error;
  // }
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
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
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

// For Admin

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
  });

  logger.info("Order Status Updated Successfully..");
  return updatedOrder;
  // try {
  // } catch (error) {
  //   logger.error("Udpdating Orders on Admin Side Error:", error.message);
  //   throw error;
  // }
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
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
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
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  returnOrder,
};
