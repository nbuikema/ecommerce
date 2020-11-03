const express = require('express');
const router = express.Router();

// import controllers
const { createPaymentIntent } = require('../controllers/stripe');

// middleware
const { authCheck } = require('../middleware/auth');

// create stripe payment intent
router.post('/stripe/create-payment-intent', authCheck, createPaymentIntent);

module.exports = router;
