const ordersService = require('../services/orders');

class OrdersController {
  // PUBLIC_INTERFACE
  async checkout(req, res, next) {
    /** Create Stripe PaymentIntent and order. */
    try {
      const result = await ordersService.checkout(req.user.id);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async confirm(req, res, next) {
    /** Confirm order status post-payment. */
    try {
      const { order_id, payment_intent_id, status } = req.body;
      const order = await ordersService.confirm(req.user.id, Number(order_id), { payment_intent_id, status });
      res.status(200).json({ order });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async listMy(req, res, next) {
    /** List my orders. */
    try {
      const orders = await ordersService.listMyOrders(req.user.id);
      res.status(200).json({ orders });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async getOne(req, res, next) {
    /** Get single order by id. */
    try {
      const order = await ordersService.getOrder(req.user.id, Number(req.params.id));
      res.status(200).json({ order });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrdersController();
