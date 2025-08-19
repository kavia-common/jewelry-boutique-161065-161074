const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../utils/validation');
const { requireAuth } = require('../middleware');
const ordersController = require('../controllers/orders');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Checkout and order management
 */

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Create Stripe PaymentIntent and a pending order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Payment intent created
 *       400:
 *         description: Cart is empty
 *       500:
 *         description: Stripe not configured
 */
router.post('/orders/checkout', requireAuth, ordersController.checkout.bind(ordersController));

/**
 * @swagger
 * /orders/confirm:
 *   post:
 *     summary: Confirm order status after payment
 *     description: Client submits payment status to mark order as paid. Use Stripe Webhooks in production.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Order confirmation payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order_id, status]
 *             properties:
 *               order_id: { type: integer }
 *               payment_intent_id: { type: string }
 *               status: { type: string, enum: [succeeded, pending, failed] }
 *     responses:
 *       200:
 *         description: Order updated
 */
router.post(
  '/orders/confirm',
  requireAuth,
  validate([
    body('order_id').isInt({ gt: 0 }),
    body('status').isIn(['succeeded', 'pending', 'failed']),
    body('payment_intent_id').optional().isString(),
  ]),
  ordersController.confirm.bind(ordersController)
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/orders', requireAuth, ordersController.listMy.bind(ordersController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order detail
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Order detail
 */
router.get(
  '/orders/:id',
  requireAuth,
  validate([param('id').isInt({ gt: 0 })]),
  ordersController.getOne.bind(ordersController)
);

module.exports = router;
