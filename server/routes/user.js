const express = require('express');
const router = express.Router();

const { authCheck } = require('../middleware/auth');

// import controllers
const {
  updateCart,
  updateAddress,
  createOrder
} = require('../controllers/user');

router.post('/create-order', authCheck, createOrder);

router.put('/update-cart', authCheck, updateCart);
router.put('/update-address', authCheck, updateAddress);

module.exports = router;
