/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         userId:
 *           type: integer
 *           example: 9
 *         addressLine1:
 *           type: string
 *           example: House 12, Street 5
 *         addressLine2:
 *           type: string
 *           nullable: true
 *           example: Near Askari Park
 *         city:
 *           type: string
 *           example: Peshawar
 *         state:
 *           type: string
 *           nullable: true
 *           example: KPK
 *         postalCode:
 *           type: string
 *           example: "25000"
 *         country:
 *           type: string
 *           example: Pakistan
 *         isDefault:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new shipping address for the logged-in user
 *     description: The first address a user adds automatically becomes the default address.
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressLine1
 *               - city
 *               - postalCode
 *               - country
 *             properties:
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
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address added successfully
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
 *                   example: Address added successfully
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: This address already exists
 *   get:
 *     summary: Get all addresses for the logged-in user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address belonging to the logged-in user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Address updated successfully
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
 *                   example: Address updated successfully
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *   delete:
 *     summary: Delete an address belonging to the logged-in user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address id
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /api/addresses/{id}/default:
 *   put:
 *     summary: Set an address as the default shipping address
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address id
 *     responses:
 *       200:
 *         description: Default address updated successfully
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
 *                   example: Default address updated successfully
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
