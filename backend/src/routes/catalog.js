const express = require('express');
const catalogController = require('../controllers/catalog');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Catalog
 *     description: Products and categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List categories
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', catalogController.listCategories.bind(catalogController));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search term
 *       - in: query
 *         name: category_id
 *         schema: { type: integer }
 *         description: Filter by category id
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price_asc, price_desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: page_size
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/products', catalogController.listProducts.bind(catalogController));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', catalogController.getProduct.bind(catalogController));

module.exports = router;
