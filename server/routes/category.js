const express = require('express');
const router = express.Router();

// import controllers
const {
  create,
  read,
  update,
  remove,
  list,
  getCategorySubcategories
} = require('../controllers/category');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/category', authCheck, adminCheck, create);

// read
router.get('/category/:slug', read);
router.get('/categories', list);
router.get('/category/:_id/subcategories', getCategorySubcategories);

// update
router.put('/category/:slug', authCheck, adminCheck, update);

// delete
router.delete('/category/:slug', authCheck, adminCheck, remove);

module.exports = router;
