const cartService = require('../services/cart');

class CartController {
  // PUBLIC_INTERFACE
  async getCart(req, res, next) {
    /** Get user's cart. */
    try {
      const cart = await cartService.getCart(req.user.id);
      res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async addOrUpdate(req, res, next) {
    /** Add or update cart item. */
    try {
      const { product_id, quantity } = req.body;
      const cart = await cartService.addOrUpdateItem(req.user.id, Number(product_id), Number(quantity));
      res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async updateById(req, res, next) {
    /** Update cart item by cart_item_id. */
    try {
      const { quantity } = req.body;
      const cart = await cartService.updateItemById(req.user.id, Number(req.params.itemId), Number(quantity));
      res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async removeById(req, res, next) {
    /** Remove cart item by id. */
    try {
      const cart = await cartService.removeItemById(req.user.id, Number(req.params.itemId));
      res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CartController();
