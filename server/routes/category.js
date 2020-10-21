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
router.post('/create', authCheck, adminCheck, create);

// read
router.get('/read/:slug', read);
router.get('/all', list);
router.get('/:_id/subcategories', getCategorySubcategories);

// update
router.put('/update/:slug', authCheck, adminCheck, update);

// delete
router.delete('/delete/:slug', authCheck, adminCheck, remove);

module.exports = router;