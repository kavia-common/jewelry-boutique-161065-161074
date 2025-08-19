const db = require('../db');

// PUBLIC_INTERFACE
async function createOrder({ userId, totalCents, currency, paymentIntentId }) {
  /** Create order header and return id. */
  const res = await db.query(
    `INSERT INTO orders (user_id, status, total_cents, currency, payment_intent_id) VALUES (?, 'pending', ?, ?, ?)`,
    [userId, totalCents, currency, paymentIntentId || null]
  );
  const id = res.insertId || (res[0] && res[0].insertId);
  return id;
}

// PUBLIC_INTERFACE
async function insertOrderItems(orderId, items) {
  /** Bulk insert order items. items: [{product_id, quantity, unit_price_cents}] */
  if (!items.length) return;
  const values = [];
  const params = [];
  items.forEach((it) => {
    values.push('(?, ?, ?, ?)');
    params.push(orderId, it.product_id, it.quantity, it.unit_price_cents);
  });
  const sql = `INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ${values.join(',')}`;
  await db.query(sql, params);
}

// PUBLIC_INTERFACE
async function setOrderStatus(orderId, status) {
  /** Update order status. */
  await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId]);
}

// PUBLIC_INTERFACE
async function listOrdersByUser(userId) {
  /** List orders for a user. */
  return db.query(
    `SELECT id, status, total_cents, currency, payment_intent_id, created_at FROM orders WHERE user_id = ? ORDER BY id DESC`,
    [userId]
  );
}

// PUBLIC_INTERFACE
async function getOrderWithItems(orderId, userId) {
  /** Get order header and items for a user. */
  const headers = await db.query(
    `SELECT id, user_id, status, total_cents, currency, payment_intent_id, created_at FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
    [orderId, userId]
  );
  const header = headers[0];
  if (!header) return null;
  const items = await db.query(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price_cents, p.name, p.image_url
     FROM order_items oi
     INNER JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  header.items = items;
  return header;
}

module.exports = {
  createOrder,
  insertOrderItems,
  setOrderStatus,
  listOrdersByUser,
  getOrderWithItems,
};
