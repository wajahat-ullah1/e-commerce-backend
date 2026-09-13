/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 44
 *         invoiceNumber:
 *           type: string
 *           example: INV-2026-000101
 *         orderId:
 *           type: integer
 *           example: 101
 *         totalAmount:
 *           type: number
 *           example: 11998
 *         order:
 *           $ref: '#/components/schemas/Order'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get an invoice belonging to the logged-in user
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice id
 *     responses:
 *       200:
 *         description: Invoice fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invoice not found
 */

/**
 * @swagger
 * /api/invoices/{id}/pdf:
 *   get:
 *     summary: Download the PDF for an invoice belonging to the logged-in user
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice id
 *     responses:
 *       200:
 *         description: PDF file stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invoice not found
 */

/**
 * @swagger
 * /api/invoices/admin:
 *   get:
 *     summary: Get all invoices (Admin only)
 *     tags:
 *       - Admin Invoices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoices fetched successfully
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
 *                     $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/invoices/admin/{id}:
 *   get:
 *     summary: Get any invoice by id (Admin only)
 *     tags:
 *       - Admin Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice id
 *     responses:
 *       200:
 *         description: Invoice fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Invoice not found
 */

/**
 * @swagger
 * /api/admin/invoices/admin/{id}/pdf:
 *   get:
 *     summary: Download the PDF for any invoice (Admin only)
 *     tags:
 *       - Admin Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice id
 *     responses:
 *       200:
 *         description: PDF file stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Invoice not found
 */
