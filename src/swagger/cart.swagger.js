/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: integer
 *           example: 2
 *         product:
 *           $ref: '#/components/schemas/Product'
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         userId:
 *           type: integer
 *           example: 9
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *     GuestCart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 8f14e45f-ceea-467e-adde-3f89b3d69df5
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a product to the logged-in user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 12
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart
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
 *                   example: Product added to cart
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the logged-in user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags:
 *       - Cart
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
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully
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
 *                   example: Cart updated successfully
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *   delete:
 *     summary: Remove a product from the cart
 *     tags:
 *       - Cart
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
 *         description: Product removed from cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */

/**
 * @swagger
 * /api/guest-cart:
 *   post:
 *     summary: Create a new guest cart (no authentication required)
 *     tags:
 *       - Guest Cart
 *     responses:
 *       201:
 *         description: Guest cart created
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
 *                   example: Guest cart created
 *                 guestCart:
 *                   $ref: '#/components/schemas/GuestCart'
 */

/**
 * @swagger
 * /api/guest-cart/{guestCartId}:
 *   get:
 *     summary: Get a guest cart by id
 *     tags:
 *       - Guest Cart
 *     parameters:
 *       - in: path
 *         name: guestCartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest cart id
 *     responses:
 *       200:
 *         description: Guest cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 guestCart:
 *                   $ref: '#/components/schemas/GuestCart'
 *       404:
 *         description: Guest cart not found
 *   delete:
 *     summary: Clear all items from a guest cart
 *     tags:
 *       - Guest Cart
 *     parameters:
 *       - in: path
 *         name: guestCartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest cart id
 *     responses:
 *       200:
 *         description: Guest cart cleared successfully
 *       404:
 *         description: Guest cart not found
 */

/**
 * @swagger
 * /api/guest-cart/{guestCartId}/add:
 *   post:
 *     summary: Add a product to a guest cart
 *     tags:
 *       - Guest Cart
 *     parameters:
 *       - in: path
 *         name: guestCartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest cart id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 12
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to guest cart
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
 *                   example: Product added to guest cart
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Guest cart or product not found
 */

/**
 * @swagger
 * /api/guest-cart/{guestCartId}/{productId}:
 *   put:
 *     summary: Update quantity of a product in a guest cart
 *     tags:
 *       - Guest Cart
 *     parameters:
 *       - in: path
 *         name: guestCartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest cart id
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
 *                 example: 3
 *     responses:
 *       200:
 *         description: Guest cart updated successfully
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
 *                   example: Guest cart updated successfully
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Guest cart item not found
 *   delete:
 *     summary: Remove a product from a guest cart
 *     tags:
 *       - Guest Cart
 *     parameters:
 *       - in: path
 *         name: guestCartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest cart id
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product removed from guest cart
 *       404:
 *         description: Guest cart item not found
 */
