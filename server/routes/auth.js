const express = require('express');
const router = express.Router();

// import controllers
const { createOrUpdateUser } = require('../controllers/auth');

// middleware
const { authCheck } = require('../middleware/auth');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);

module.exports = router;
