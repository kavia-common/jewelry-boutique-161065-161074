const db = require('../db');

// PUBLIC_INTERFACE
async function getCart(userId) {
  /** Get the current cart for a user with product details. */
  const rows = await db.query(
    `
    SELECT ci.id AS cart_item_id, ci.product_id, ci.quantity,
           p.name, p.price_cents, p.currency, p.image_url, p.stock
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    ORDER BY ci.id DESC
    `,
    [userId]
  );
  return rows;
}

// PUBLIC_INTERFACE
async function upsertCartItem(userId, productId, quantity) {
  /** Insert or update a cart item for a user. */
  // If quantity is 0, delete item
  if (quantity <= 0) {
    await db.query(`DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`, [userId, productId]);
    return;
  }
  // Try update first
  const res = await db.query(
    `UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?`,
    [quantity, userId, productId]
  );
  if (res.affectedRows === 0) {
    await db.query(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
      [userId, productId, quantity]
    );
  }
}

// PUBLIC_INTERFACE
async function updateCartItemById(userId, cartItemId, quantity) {
  /** Update an existing cart item by cart_item id for the user. */
  if (quantity <= 0) {
    await db.query(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`, [cartItemId, userId]);
    return;
  }
  await db.query(`UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`, [quantity, cartItemId, userId]);
}

// PUBLIC_INTERFACE
async function removeCartItemById(userId, cartItemId) {
  /** Remove a cart item by id for the user. */
  await db.query(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`, [cartItemId, userId]);
}

// PUBLIC_INTERFACE
async function clearCart(userId) {
  /** Remove all items from user's cart. */
  await db.query(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);
}

module.exports = {
  getCart,
  upsertCartItem,
  updateCartItemById,
  removeCartItemById,
  clearCart,
};
