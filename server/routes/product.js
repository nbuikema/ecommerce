const express = require('express');
const router = express.Router();

// import controllers
const {
  create,
  list,
  remove,
  read,
  update,
  listWithQuery,
  listCount,
  rateProduct,
  listRelated,
  listAllInCategory,
  listAllInSubcategory,
  searchFilters,
  getProductsByDate,
  getProductsByInventory,
  listCountWithFilters
} = require('../controllers/product');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/product', authCheck, adminCheck, create);

// read
router.get('/product/:slug', read);
router.get('/products/count', listCount);
router.post('/products/count/search/filters', listCountWithFilters);
router.post('/products/query', listWithQuery);
router.get('/products/related/:productId', listRelated);
router.get('/products/category/:categorySlug', listAllInCategory);
router.get('/products/subcategory/:subcategorySlug', listAllInSubcategory);
router.post('/products/search/filters', searchFilters);
router.post('/products/sold', authCheck, adminCheck, getProductsByDate);
router.post(
  '/products/inventory',
  authCheck,
  adminCheck,
  getProductsByInventory
);
router.get('/products/:count', list);

// update
router.put('/product/:slug', authCheck, adminCheck, update);
router.put('/product/rate/:productId', authCheck, rateProduct);

// delete
router.delete('/product/:slug', authCheck, adminCheck, remove);

module.exports = router;
