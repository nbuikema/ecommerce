const express = require('express');
const router = express.Router();

// import controllers
const { createOrUpdateUser, currentUser } = require('../controllers/auth');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/auth/create-or-update-user', authCheck, createOrUpdateUser);

// read
router.get('/auth/current-user', authCheck, currentUser);
router.get('/auth/current-admin', authCheck, adminCheck, currentUser);

module.exports = router;
