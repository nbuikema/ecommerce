const express = require('express');
const router = express.Router();

const { authCheck } = require('../middleware/auth');

// import controllers
const {
  readUser,
  updateCart,
  readUserCart,
  updateAddress
} = require('../controllers/user');

router.get('/read', readUser);

router.get('/read-cart', authCheck, readUserCart);
router.put('/update-cart', authCheck, updateCart);
router.put('/update-address', authCheck, updateAddress);

module.exports = router;
