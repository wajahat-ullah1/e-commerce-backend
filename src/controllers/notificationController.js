const notificationService = require("../services/notificationService");
const notificationEmitter = require("../utils/notificationEmitter");
const { verifyToken } = require("../utils/jwt");
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

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: "Notification deleted" });
});

const clearAllNotifications = asyncHandler(async (req, res) => {
  await notificationService.clearAllNotifications(req.user.id);
  res.status(200).json({ success: true, message: "All notifications cleared" });
});

const streamNotifications = async (req, res) => {
  const token = req.query.token;
  let userId;

  try {
    const decoded = verifyToken(token);
    userId = decoded.id;
  } catch {
    return res.status(401).end();
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n");

  const listener = (notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  };

  notificationEmitter.on(`user:${userId}`, listener);

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    notificationEmitter.off(`user:${userId}`, listener);
  });
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
  streamNotifications,
};
