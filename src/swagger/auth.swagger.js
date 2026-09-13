/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wajahat Ullah
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               phone:
 *                 type: string
 *                 example: "03001234567"
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login customer or admin
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset-token-here
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 */