const prisma = require("../config/prisma");
const logger = require("../utils/logger");

async function createOrder(userId) {
  try {
    logger.info("Create Order Endpoint Hit..");
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
      throw new Error("Your cart is empty");
    }

    // Check stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new Error(`${item.product.name} does not have enough stock`);
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
  } catch (error) {
    logger.error("Creating Order Error:", error.message);
    throw error;
  }
}

async function getMyOrders(userId) {
  try {
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
  } catch (error) {
    logger.error("Getting Order Error:", error.message);
    throw error;
  }
}

async function getOrderById(userId, orderId) {
  try {
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
      throw new Error("Order not found");
    }
    logger.info("Order Fetched Successfully..");

    return order;
  } catch (error) {
    logger.error("Getting Order Error:", error.message);
    throw error;
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
