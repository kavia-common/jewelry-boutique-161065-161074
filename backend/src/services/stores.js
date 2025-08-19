const https = require('https');
const storesRepo = require('../repositories/stores');

function hasFetch() {
  return typeof fetch === 'function';
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

async function geocodeAddress(address) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    const err = new Error('GOOGLE_MAPS_API_KEY not configured');
    err.status = 500;
    throw err;
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  if (hasFetch()) {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Geocoding failed: ${resp.status}`);
    }
    const data = await resp.json();
    const loc = data.results?.[0]?.geometry?.location;
    if (!loc) throw new Error('Location not found');
    return { lat: loc.lat, lng: loc.lng };
  }
  const { body, status } = await httpsGet(url);
  if (status < 200 || status >= 300) {
    throw new Error(`Geocoding failed: ${status}`);
  }
  const data = JSON.parse(body);
  const loc = data.results?.[0]?.geometry?.location;
  if (!loc) throw new Error('Location not found');
  return { lat: loc.lat, lng: loc.lng };
}

// PUBLIC_INTERFACE
async function nearby({ lat, lng, radius_km, address }) {
  /** Find nearby stores by lat/lng or address (geocoded). */
  let coords = { lat, lng };
  if ((!lat || !lng) && address) {
    coords = await geocodeAddress(address);
  }
  if (!coords.lat || !coords.lng) {
    // Fallback: return all stores if no coords
    const all = await storesRepo.listStores();
    return { origin: null, stores: all };
  }
  const stores = await storesRepo.findNearby({
    lat: Number(coords.lat),
    lng: Number(coords.lng),
    radiusKm: Number(radius_km) || 50,
  });
  return { origin: coords, stores };
}

// PUBLIC_INTERFACE
async function all() {
  /** List all stores. */
  const stores = await storesRepo.listStores();
  return { stores };
}

module.exports = {
  nearby,
  all,
};
