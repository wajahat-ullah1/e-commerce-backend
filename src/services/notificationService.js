const { log } = require("winston");
const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError")

const createNotification = async (userId, title, message) => {
  logger.info(
    `Creating notification for user ${userId}: ${title} - ${message}`,
  );
  const notification = await prisma.notification.create({
    data: {
      userId: Number(userId),
      title,
      message,
    },
  });
  logger.info(`Notification created with ID: ${notification.id}`);
  return notification;
};

const getUserNotifications = async (userId) => {
  logger.info(`Fetching notifications for user ${userId}`);
  const notifications = await prisma.notification.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  logger.info(
    `Fetched ${notifications.length} notifications for user ${userId}`,
  );
  return notifications;
};

// helper function to generate notification based on order status
const getOrderNotification = (status, orderId) => {
  switch (status) {
    case "PROCESSING":
      return {
        title: "Order Processing",
        message: `Your order #${orderId} is now being processed.`,
      };

    case "SHIPPED":
      return {
        title: "Order Shipped",
        message: `Your order #${orderId} has been shipped.`,
      };
    
    case "IN_TRANSIT":
      return {
        title: "Order In Transit",
        message: `Your order #${orderId} is currently in transit.`,
      };

    case "DELIVERED":
      return {
        title: "Order Delivered",
        message: `Your order #${orderId} has been delivered.`,
      };

    case "RETURNED":
      return {
        title: "Order Returned",
        message: `Your order #${orderId} has been returned.`,
      };

    case "CANCELLED":
      return {
        title: "Order Cancelled",
        message: `Your order #${orderId} has been cancelled.`,
      };

    default:
      return null;
  }
};

const getUnreadCount = async (userId) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId: Number(userId),
      isRead: false,
    },
  });

  return unreadCount;
};

const markAsRead = async (userId, notificationId) => {
  logger.info(
    `Marking notification ${notificationId} as read for user ${userId}`,
  );
  const notification = await prisma.notification.findFirst({
    where: {
      id: Number(notificationId),
      userId: Number(userId),
    },
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }
  logger.info(
    `Notification ${notificationId} marked as read for user ${userId}`,
  );
  return prisma.notification.update({
    where: {
      id: notification.id,
    },
    data: {
      isRead: true,
    },
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  getOrderNotification,
  getUnreadCount,
  markAsRead,
};
