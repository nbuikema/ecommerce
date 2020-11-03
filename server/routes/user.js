const express = require('express');
const router = express.Router();

// middleware
const { authCheck } = require('../middleware/auth');

// import controllers
const {
  updateCart,
  updateAddress,
  addToWishlist,
  readWishlist,
  removeFromWishlist
} = require('../controllers/user');

// update user cart / address
router.put('/user/cart', authCheck, updateCart);
router.put('/user/address', authCheck, updateAddress);

// add, read, remove user wishlist
router.post('/user/wishlist', authCheck, addToWishlist);
router.get('/user/wishlist', authCheck, readWishlist);
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist);

module.exports = router;
