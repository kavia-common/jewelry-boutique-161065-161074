const productsRepo = require('../repositories/products');
const categoriesRepo = require('../repositories/categories');

// PUBLIC_INTERFACE
async function listCategories() {
  /** List categories. */
  return categoriesRepo.listCategories();
}

// PUBLIC_INTERFACE
async function listProducts(filters) {
  /** List products with filters. */
  return productsRepo.listProducts(filters);
}

// PUBLIC_INTERFACE
async function getProduct(id) {
  /** Get product detail by id. */
  const product = await productsRepo.getById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return product;
}

module.exports = {
  listCategories,
  listProducts,
  getProduct,
};
