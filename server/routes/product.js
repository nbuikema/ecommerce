const express = require('express');
const router = express.Router();

// import controllers
const {
  create,
  list,
  remove,
  read,
  update
} = require('../controllers/product');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/create', authCheck, adminCheck, create);

// read
router.get('/read/:slug', read);
router.get('/all/:count', list);

// update
router.put('/update/:slug', authCheck, adminCheck, update);

// delete
router.delete('/delete/:slug', authCheck, adminCheck, remove);

module.exports = router;
