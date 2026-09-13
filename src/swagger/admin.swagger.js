/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin dashboard welcome/access-check endpoint
 *     description: Confirms the requester has a valid admin session and returns the authenticated admin's basic info.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message with the authenticated admin's info
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
 *                   example: Welcome to Admin Dashboard
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Wajahat Ullah
 *                     email:
 *                       type: string
 *                       example: admin@gmail.com
 *                     role:
 *                       type: string
 *                       example: ADMIN
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get store-wide dashboard statistics (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                       example: 240
 *                     totalRevenue:
 *                       type: number
 *                       example: 1850000
 *                     totalCustomers:
 *                       type: integer
 *                       example: 120
 *                     totalProducts:
 *                       type: integer
 *                       example: 48
 *                     pendingOrders:
 *                       type: integer
 *                       example: 6
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
