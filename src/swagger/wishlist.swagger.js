/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 6
 *         userId:
 *           type: integer
 *           example: 9
 *         productId:
 *           type: integer
 *           example: 12
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags:
 *       - Wishlist
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
 *       201:
 *         description: Product added to wishlist
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
 *                   example: Product added to wishlist
 *                 wishlistItem:
 *                   $ref: '#/components/schemas/WishlistItem'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       409:
 *         description: Product already in wishlist
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags:
 *       - Wishlist
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
 *         description: Product removed from wishlist
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
 *                   example: Product removed from wishlist
 *                 wishlistItem:
 *                   $ref: '#/components/schemas/WishlistItem'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wishlist item not found
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get the logged-in user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 wishlistItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WishlistItem'
 *       401:
 *         description: Unauthorized
 */
