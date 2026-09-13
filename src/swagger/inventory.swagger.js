/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryHistoryEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 88
 *         productId:
 *           type: integer
 *           example: 12
 *         previousStock:
 *           type: integer
 *           example: 25
 *         newStock:
 *           type: integer
 *           example: 20
 *         quantity:
 *           type: integer
 *           example: -5
 *         action:
 *           type: string
 *           enum: [SALE, CANCELLATION, RETURN, RESTOCK, ADJUSTMENT]
 *           example: SALE
 *         reason:
 *           type: string
 *           example: Order #101
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/admin/inventory:
 *   get:
 *     summary: Get inventory for all products (Admin only)
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/admin/inventory/stats:
 *   get:
 *     summary: Get overall inventory statistics (Admin only)
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                       example: 48
 *                     totalStockValue:
 *                       type: number
 *                       example: 542000
 *                     lowStockCount:
 *                       type: integer
 *                       example: 3
 *                     outOfStockCount:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/admin/inventory/low-stock:
 *   get:
 *     summary: Get products that are low on stock (Admin only)
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Stock quantity at or below which a product is considered low-stock
 *     responses:
 *       200:
 *         description: Low-stock products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/admin/inventory/{productId}/history:
 *   get:
 *     summary: Get the stock movement history for a product (Admin only)
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     responses:
 *       200:
 *         description: Inventory history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryHistoryEntry'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/admin/inventory/{productId}/stock:
 *   put:
 *     summary: Manually set a product's stock level (Admin only)
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 30
 *               reason:
 *                 type: string
 *                 example: Manual stock correction after audit
 *     responses:
 *       200:
 *         description: Stock updated successfully
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
 *                   example: Stock updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/admin/inventory/{productId}/receive:
 *   post:
 *     summary: Receive new stock for a product (Admin only)
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               reason:
 *                 type: string
 *                 example: New shipment from supplier
 *     responses:
 *       200:
 *         description: Stock received successfully
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
 *                   example: Stock received successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */
