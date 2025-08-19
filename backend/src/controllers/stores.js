const storesService = require('../services/stores');

class StoresController {
  // PUBLIC_INTERFACE
  async nearby(req, res, next) {
    /** Find nearby stores using lat/lng or address. */
    try {
      const { lat, lng, radius_km, address } = req.query;
      const result = await storesService.nearby({
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        radius_km: radius_km ? Number(radius_km) : undefined,
        address,
      });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async all(req, res, next) {
    /** List all stores without distance filtering. */
    try {
      const result = await storesService.all();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StoresController();
