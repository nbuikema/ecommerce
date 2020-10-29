const express = require('express');
const router = express.Router();

// import controllers
const { create, read, update, remove, list } = require('../controllers/coupon');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/create', authCheck, adminCheck, create);

// read
router.get('/read/:couponName', read);
router.get('/all', list);

// update
router.put('/update/:couponName', authCheck, adminCheck, update);

// delete
router.delete('/delete/:couponId', authCheck, adminCheck, remove);

module.exports = router;
