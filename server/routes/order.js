const express = require('express');
const router = express.Router();

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// import controllers
const {
  listOrders,
  updateOrder,
  getOrdersByDate,
  listNewOrders,
  createOrder
} = require('../controllers/order');

// create
router.post('/order', authCheck, createOrder);

// read
router.get('/orders', authCheck, adminCheck, listOrders);
router.post('/orders/date', authCheck, adminCheck, getOrdersByDate);
router.post('/orders/new', authCheck, adminCheck, listNewOrders);

// update
router.put('/order/:orderId', authCheck, adminCheck, updateOrder);

module.exports = router;
