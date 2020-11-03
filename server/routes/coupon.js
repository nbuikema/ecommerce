const express = require('express');
const router = express.Router();

// import controllers
const { create, read, update, remove, list } = require('../controllers/coupon');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/coupon', authCheck, adminCheck, create);

// read
router.get('/coupon/:couponName', read);
router.get('/coupons', list);

// update
router.put('/coupon/:couponName', authCheck, adminCheck, update);

// delete
router.delete('/coupon/:couponId', authCheck, adminCheck, remove);

module.exports = router;
