const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const markOrderAsPaid = async (orderId) => {
  logger.info(`Marking order ${orderId} as paid`);
  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.paymentMethod !== "COD") {
    throw new AppError("This order does not use Cash on Delivery", 400);
  }

  if (order.paymentStatus === "PAID") {
    throw new AppError("Order payment is already marked as paid", 400);
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: Number(orderId),
    },
    data: {
      paymentStatus: "PAID",
    },
  });
  logger.info(`Order ${orderId} marked as paid successfully`);
  return updatedOrder;
};

module.exports = {
  markOrderAsPaid,
};
