const db = require('../db');

// PUBLIC_INTERFACE
async function getById(id) {
  /** Fetch product by id including category info if available. */
  const rows = await db.query(
    `
    SELECT p.id, p.name, p.description, p.price_cents, p.currency, p.image_url, p.stock, p.created_at,
           c.id AS category_id, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
    LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function listProducts({ search, categoryId, sort, page, pageSize }) {
  /** List products with optional search, category filter, sort and pagination. */
  const clauses = [];
  const params = [];

  if (search) {
    clauses.push(`(p.name LIKE ? OR p.description LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }
  if (categoryId) {
    clauses.push(`p.category_id = ?`);
    params.push(Number(categoryId));
  }

  let where = '';
  if (clauses.length) {
    where = `WHERE ${clauses.join(' AND ')}`;
  }

  let orderBy = 'ORDER BY p.created_at DESC';
  if (sort === 'price_asc') orderBy = 'ORDER BY p.price_cents ASC';
  if (sort === 'price_desc') orderBy = 'ORDER BY p.price_cents DESC';

  const limit = Math.max(1, Math.min(100, Number(pageSize) || 20));
  const offset = Math.max(0, ((Number(page) || 1) - 1) * limit);

  const rows = await db.query(
    `
    SELECT p.id, p.name, p.description, p.price_cents, p.currency, p.image_url, p.stock, p.created_at,
           c.id AS category_id, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${where}
    ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
    `,
    params
  );

  return rows;
}

module.exports = {
  getById,
  listProducts,
};
