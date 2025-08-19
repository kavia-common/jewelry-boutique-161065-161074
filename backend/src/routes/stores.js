const express = require('express');
const storesController = require('../controllers/stores');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Stores
 *     description: Store locator
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: List all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get('/stores', storesController.all.bind(storesController));

/**
 * @swagger
 * /stores/nearby:
 *   get:
 *     summary: Find nearby stores
 *     description: Provide lat/lng or an address to geocode (requires GOOGLE_MAPS_API_KEY)
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema: { type: number }
 *       - in: query
 *         name: lng
 *         schema: { type: number }
 *       - in: query
 *         name: radius_km
 *         schema: { type: number, default: 50 }
 *       - in: query
 *         name: address
 *         schema: { type: string }
 *         description: Address to geocode if lat/lng not provided
 *     responses:
 *       200:
 *         description: Nearby stores with origin
 *       500:
 *         description: Missing Google Maps API key when geocoding
 */
router.get('/stores/nearby', storesController.nearby.bind(storesController));

module.exports = router;
