const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const catalogRoutes = require('./catalog');
const cartRoutes = require('./cart');
const ordersRoutes = require('./orders');
const storesRoutes = require('./stores');

const router = express.Router();

// Global Swagger components
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/', catalogRoutes);
router.use('/', cartRoutes);
router.use('/', ordersRoutes);
router.use('/', storesRoutes);

module.exports = router;
