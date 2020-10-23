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
  listRelated
} = require('../controllers/product');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/create', authCheck, adminCheck, create);

// read
router.get('/read/:slug', read);
router.get('/all/:count', list);
router.get('/count', listCount);
router.post('/query', listWithQuery);
router.get('/related/:productId', listRelated);

// update
router.put('/update/:slug', authCheck, adminCheck, update);
router.put('/rate/:productId', authCheck, rateProduct);

// delete
router.delete('/delete/:slug', authCheck, adminCheck, remove);

module.exports = router;
