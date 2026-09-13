/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 30
 *         userId:
 *           type: integer
 *           example: 9
 *         title:
 *           type: string
 *           example: Order Placed
 *         message:
 *           type: string
 *           example: Your order #101 has been placed successfully.
 *         isRead:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get the count of unread notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 unreadCount:
 *                   type: integer
 *                   example: 4
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification id
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification marked as read
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
