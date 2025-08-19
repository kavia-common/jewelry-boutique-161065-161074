const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jewelry Boutique API',
      version: '1.0.0',
      description: 'REST API for authentication, catalog, cart, checkout, and store locator',
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'User authentication' },
      { name: 'Catalog', description: 'Products and categories' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Orders', description: 'Checkout and order management' },
      { name: 'Stores', description: 'Store locator' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
