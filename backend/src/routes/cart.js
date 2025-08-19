const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../utils/validation');
const { requireAuth } = require('../middleware');
const cartController = require('../controllers/cart');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart operations
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data
 *       401:
 *         description: Authentication required
 */
router.get('/cart', requireAuth, cartController.getCart.bind(cartController));

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add or update a cart item by product id
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Item to add/update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, quantity]
 *             properties:
 *               product_id: { type: integer }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Updated cart
 *       401:
 *         description: Authentication required
 */
router.post(
  '/cart/items',
  requireAuth,
  validate([
    body('product_id').isInt({ gt: 0 }),
    body('quantity').isInt({ gt: 0 }),
  ]),
  cartController.addOrUpdate.bind(cartController)
);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Update a cart item by its id
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       description: New quantity
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 0 }
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.patch(
  '/cart/items/:itemId',
  requireAuth,
  validate([param('itemId').isInt({ gt: 0 }), body('quantity').isInt({ min: 0 })]),
  cartController.updateById.bind(cartController)
);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Remove a cart item by its id
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.delete(
  '/cart/items/:itemId',
  requireAuth,
  validate([param('itemId').isInt({ gt: 0 })]),
  cartController.removeById.bind(cartController)
);

module.exports = router;
