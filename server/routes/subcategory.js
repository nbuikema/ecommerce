const express = require('express');
const router = express.Router();

// import controllers
const {
  create,
  read,
  update,
  remove,
  list
} = require('../controllers/subcategory');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/subcategory', authCheck, adminCheck, create);

// read
router.get('/subcategory/:slug', read);
router.get('/subcategories', list);

// update
router.put('/subcategory/:slug', authCheck, adminCheck, update);

// delete
router.delete('/subcategory/:slug', authCheck, adminCheck, remove);

module.exports = router;
