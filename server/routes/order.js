const express = require('express');
const router = express.Router();

const { authCheck, adminCheck } = require('../middleware/auth');

// import controllers
const { listOrders, updateOrder } = require('../controllers/order');

router.get('/all', authCheck, adminCheck, listOrders);

router.put('/update/:orderId', authCheck, adminCheck, updateOrder);

module.exports = router;
