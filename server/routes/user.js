const express = require('express');
const router = express.Router();

// import controllers
const { readUser } = require('../controllers/user');

router.get('/read', readUser);

module.exports = router;
