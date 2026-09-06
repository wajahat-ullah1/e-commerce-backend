const notificationService = require("../services/notificationService");
const asyncHandler = require("../utils/asyncHandler");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(
    req.user.id,
  );

  res.status(200).json({
    success: true,
    notifications,
  });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await notificationService.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    unreadCount,
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await notificationService.markAsRead(req.user.id, id);

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
};
