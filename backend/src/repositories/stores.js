const db = require('../db');

// PUBLIC_INTERFACE
async function listStores() {
  /** Return all stores with coordinates. */
  return db.query(`SELECT id, name, address, lat, lng FROM stores ORDER BY name ASC`);
}

// PUBLIC_INTERFACE
async function findNearby({ lat, lng, radiusKm = 50 }) {
  /** Haversine formula to find stores within radius in kilometers. */
  // Approx calculation using SQL (assuming lat/lng stored in degrees)
  const sql = `
    SELECT id, name, address, lat, lng,
      (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(lat)) *
        COS(RADIANS(lng) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(lat))
      )) AS distance_km
    FROM stores
    HAVING distance_km <= ?
    ORDER BY distance_km ASC
    LIMIT 50
  `;
  return db.query(sql, [lat, lng, lat, radiusKm]);
}

module.exports = {
  listStores,
  findNearby,
};
