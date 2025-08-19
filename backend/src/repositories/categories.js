const db = require('../db');

// PUBLIC_INTERFACE
async function listCategories() {
  /** List all categories. */
  return db.query(`SELECT id, name, slug, created_at FROM categories ORDER BY name ASC`);
}

module.exports = {
  listCategories,
};
