/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 21
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 5999
 *         product:
 *           $ref: '#/components/schemas/Product'
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         userId:
 *           type: integer
 *           nullable: true
 *           example: 9
 *         customerName:
 *           type: string
 *           example: Wajahat Ullah
 *         customerPhone:
 *           type: string
 *           example: "03001234567"
 *         customerEmail:
 *           type: string
 *           nullable: true
 *           example: user@gmail.com
 *         shippingAddressLine1:
 *           type: string
 *           example: House 12, Street 5
 *         shippingAddressLine2:
 *           type: string
 *           nullable: true
 *           example: Near Askari Park
 *         shippingCity:
 *           type: string
 *           example: Peshawar
 *         shippingState:
 *           type: string
 *           nullable: true
 *           example: KPK
 *         shippingPostalCode:
 *           type: string
 *           example: "25000"
 *         shippingCountry:
 *           type: string
 *           example: Pakistan
 *         paymentMethod:
 *           type: string
 *           example: COD
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PAID]
 *           example: PENDING
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED, RETURNED]
 *           example: PENDING
 *         totalAmount:
 *           type: number
 *           example: 11998
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders/guest-checkout:
 *   post:
 *     summary: Place an order as a guest (no account required)
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guestCartId
 *               - fullName
 *               - phone
 *               - addressLine1
 *               - city
 *               - postalCode
 *               - country
 *             properties:
 *               guestCartId:
 *                 type: string
 *                 example: 8f14e45f-ceea-467e-adde-3f89b3d69df5
 *               fullName:
 *                 type: string
 *                 example: Wajahat Ullah
 *               phone:
 *                 type: string
 *                 example: "03001234567"
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               addressLine1:
 *                 type: string
 *                 example: House 12, Street 5
 *               addressLine2:
 *                 type: string
 *                 example: Near Askari Park
 *               city:
 *                 type: string
 *                 example: Peshawar
 *               state:
 *                 type: string
 *                 example: KPK
 *               postalCode:
 *                 type: string
 *                 example: "25000"
 *               country:
 *                 type: string
 *                 example: Pakistan
 *     responses:
 *       201:
 *         description: Guest order created successfully
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
 *                   example: Guest order created successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Guest cart is empty, missing id, or insufficient stock
 *       404:
 *         description: Guest cart not found
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout the logged-in user's cart and place an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: Order created successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shipping address or user not found
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get the logged-in user's orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order belonging to the logged-in user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order (only allowed while status is PENDING)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                   example: Order cancelled successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order can no longer be cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     summary: Update an order's status (Admin only)
 *     description: >
 *       Status can only move forward through the allowed sequence:
 *       PENDING → PROCESSING → SHIPPED → IN_TRANSIT → DELIVERED.
 *       DELIVERED and CANCELLED are terminal states via this endpoint.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PROCESSING, SHIPPED, IN_TRANSIT, DELIVERED]
 *                 example: PROCESSING
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   example: Order status updated successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/admin/orders/{id}/return:
 *   put:
 *     summary: Mark an in-transit order as returned (Admin only)
 *     description: Only unpaid orders that are currently IN_TRANSIT can be marked as returned. Stock is restored automatically.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order marked as returned successfully
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
 *                   example: Order marked as returned successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order is not eligible for return (not IN_TRANSIT or already paid)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/payments/{id}/mark-as-paid:
 *   put:
 *     summary: Mark an order's payment as paid (Admin only)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order id
 *     responses:
 *       200:
 *         description: Payment marked as paid successfully
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
 *                   example: Payment marked as paid successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */
