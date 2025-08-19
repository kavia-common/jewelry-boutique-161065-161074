const cartRepo = require('../repositories/cart');
const productsRepo = require('../repositories/products');

// PUBLIC_INTERFACE
async function getCart(userId) {
  /** Get user's cart with computed totals. */
  const items = await cartRepo.getCart(userId);
  const subtotal_cents = items.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);
  const currency = items[0]?.currency || 'usd';
  return { items, subtotal_cents, currency };
}

// PUBLIC_INTERFACE
async function addOrUpdateItem(userId, productId, quantity) {
  /** Add or update a cart item ensuring product exists and is in stock. */
  const product = await productsRepo.getById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  if (quantity > product.stock) {
    const err = new Error('Insufficient stock');
    err.status = 400;
    throw err;
  }
  await cartRepo.upsertCartItem(userId, productId, quantity);
  return getCart(userId);
}

// PUBLIC_INTERFACE
async function updateItemById(userId, cartItemId, quantity) {
  /** Update a cart item by its id. */
  await cartRepo.updateCartItemById(userId, cartItemId, quantity);
  return getCart(userId);
}

// PUBLIC_INTERFACE
async function removeItemById(userId, cartItemId) {
  /** Remove an item by its id. */
  await cartRepo.removeCartItemById(userId, cartItemId);
  return getCart(userId);
}

module.exports = {
  getCart,
  addOrUpdateItem,
  updateItemById,
  removeItemById,
};
