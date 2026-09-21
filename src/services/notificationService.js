const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

const createNotification = async (userId, title, message, type = null) => {
  logger.info(
    `Creating notification for user ${userId}: ${title} - ${message}`,
  );
  const notification = await prisma.notification.create({
    data: {
      userId: Number(userId),
      title,
      message,
      type,
    },
  });
  logger.info(`Notification created with ID: ${notification.id}`);
  return notification;
};

const getUserNotifications = async (userId) => {
  logger.info(`Fetching notifications for Admin ${userId}`);
  const notifications = await prisma.notification.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  logger.info(
    `Fetched ${notifications.length} notifications for Admin ${userId}`,
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
        type: "order",
      };

    case "SHIPPED":
      return {
        title: "Order Shipped",
        message: `Your order #${orderId} has been shipped.`,
        type: "order",
      };

    case "IN_TRANSIT":
      return {
        title: "Order In Transit",
        message: `Your order #${orderId} is currently in transit.`,
        type: "order",
      };

    case "DELIVERED":
      return {
        title: "Order Delivered",
        message: `Your order #${orderId} has been delivered.`,
        type: "order",
      };

    case "RETURNED":
      return {
        title: "Order Returned",
        message: `Your order #${orderId} has been returned.`,
        type: "order",
      };

    case "CANCELLED":
      return {
        title: "Order Cancelled",
        message: `Your order #${orderId} has been cancelled.`,
        type: "order",
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

const createAdminNotification = async (title, message, type = null) => {
  logger.info(`Creating admin notification: ${title} - ${message}`);

  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
    },
  });

  if (admins.length === 0) {
    logger.warn("No admin users found for notification");
    return [];
  }

  const notifications = await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type,
    })),
  });

  logger.info(`Admin notification created for ${admins.length} admin(s)`);

  return notifications;
};

module.exports = {
  createNotification,
  getUserNotifications,
  getOrderNotification,
  getUnreadCount,
  markAsRead,
  createAdminNotification,
};
