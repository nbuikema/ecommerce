const express = require('express');
const router = express.Router();

const { authCheck, adminCheck } = require('../middleware/auth');

// import controllers
const {
  listOrders,
  updateOrder,
  getOrdersByDate,
  listNewOrders
} = require('../controllers/order');

router.get('/all', authCheck, adminCheck, listOrders);
router.post('/by-date', authCheck, adminCheck, getOrdersByDate);
router.post('/new', authCheck, adminCheck, listNewOrders);

router.put('/update/:orderId', authCheck, adminCheck, updateOrder);

module.exports = router;
