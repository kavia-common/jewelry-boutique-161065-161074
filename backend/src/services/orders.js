const Stripe = require('stripe');
const ordersRepo = require('../repositories/orders');
const cartRepo = require('../repositories/cart');

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    const err = new Error('Stripe not configured: STRIPE_SECRET_KEY missing');
    err.status = 500;
    throw err;
  }
  return new Stripe(key);
}

// PUBLIC_INTERFACE
async function checkout(userId) {
  /** Create Stripe PaymentIntent from user's cart and persist order in pending state. */
  const cartItems = await cartRepo.getCart(userId);
  if (!cartItems.length) {
    const err = new Error('Cart is empty');
    err.status = 400;
    throw err;
  }
  const currency = cartItems[0].currency || 'usd';
  const total_cents = cartItems.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total_cents,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { user_id: String(userId) },
  });

  const orderId = await ordersRepo.createOrder({
    userId,
    totalCents: total_cents,
    currency,
    paymentIntentId: paymentIntent.id,
  });

  const itemsForOrder = cartItems.map((it) => ({
    product_id: it.product_id,
    quantity: it.quantity,
    unit_price_cents: it.price_cents,
  }));
  await ordersRepo.insertOrderItems(orderId, itemsForOrder);

  // Optional: clear cart after creating order or after payment confirmation.
  // We'll keep items until payment confirmation to allow retries.

  return {
    order_id: orderId,
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
    amount: total_cents,
    currency,
  };
}

// PUBLIC_INTERFACE
async function confirm(userId, orderId, { payment_intent_id, status }) {
  /** Mark order as paid if payment succeeded. This endpoint trusts client-provided status minimally.
   *  In production, validate via Stripe Webhook. */
  const order = await ordersRepo.getOrderWithItems(orderId, userId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (payment_intent_id && order.payment_intent_id && payment_intent_id !== order.payment_intent_id) {
    const err = new Error('Payment mismatch');
    err.status = 400;
    throw err;
  }
  const newStatus = status === 'succeeded' ? 'paid' : 'pending';
  await ordersRepo.setOrderStatus(orderId, newStatus);
  // If paid, clear cart
  if (newStatus === 'paid') {
    await cartRepo.clearCart(userId);
  }
  return ordersRepo.getOrderWithItems(orderId, userId);
}

// PUBLIC_INTERFACE
async function listMyOrders(userId) {
  /** List current user's orders. */
  return ordersRepo.listOrdersByUser(userId);
}

// PUBLIC_INTERFACE
async function getOrder(userId, orderId) {
  /** Get current user's order with items. */
  const order = await ordersRepo.getOrderWithItems(orderId, userId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  return order;
}

module.exports = {
  checkout,
  confirm,
  listMyOrders,
  getOrder,
};
