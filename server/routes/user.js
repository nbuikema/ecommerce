const express = require('express');
const router = express.Router();

const { authCheck } = require('../middleware/auth');

// import controllers
const {
  updateCart,
  updateAddress,
  createOrder,
  addToWishlist,
  readWishlist,
  removeFromWishlist
} = require('../controllers/user');

router.post('/create-order', authCheck, createOrder);

router.put('/update-cart', authCheck, updateCart);
router.put('/update-address', authCheck, updateAddress);

router.post('/wishlist', authCheck, addToWishlist);
router.get('/wishlist', authCheck, readWishlist);
router.put('/wishlist/:productId', authCheck, removeFromWishlist);

module.exports = router;
