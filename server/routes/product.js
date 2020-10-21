const express = require('express');
const router = express.Router();

// import controllers
const { create, list } = require('../controllers/product');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/create', authCheck, adminCheck, create);

// read
router.get('/all', list);

// update

// delete

module.exports = router;
