const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../utils/validation');
const { requireAuth } = require('../middleware');
const authController = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Registration payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, description: User email }
 *               password: { type: string, minLength: 6, description: User password }
 *               name: { type: string, description: User full name }
 *     responses:
 *       201:
 *         description: User registered
 *       409:
 *         description: Email already registered
 */
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('name').optional().isString(),
  ]),
  authController.register.bind(authController)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Login payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login success with token
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  validate([body('email').isEmail(), body('password').isString()]),
  authController.login.bind(authController)
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Authentication required
 */
router.get('/me', requireAuth, authController.me.bind(authController));

module.exports = router;
