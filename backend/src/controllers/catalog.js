const catalogService = require('../services/catalog');

class CatalogController {
  // PUBLIC_INTERFACE
  async listCategories(req, res, next) {
    /** List categories. */
    try {
      const categories = await catalogService.listCategories();
      res.status(200).json({ categories });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async listProducts(req, res, next) {
    /** List products with filters. */
    try {
      const { search, category_id, sort, page, page_size } = req.query;
      const products = await catalogService.listProducts({
        search,
        categoryId: category_id,
        sort,
        page,
        pageSize: page_size,
      });
      res.status(200).json({ products });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async getProduct(req, res, next) {
    /** Get product detail. */
    try {
      const product = await catalogService.getProduct(Number(req.params.id));
      res.status(200).json({ product });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CatalogController();
