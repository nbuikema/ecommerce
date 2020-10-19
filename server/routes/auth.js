const express = require('express');
const router = express.Router();

// import controllers
const { createOrUpdateUser, currentUser } = require('../controllers/auth');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// create
router.post('/create-or-update-user', authCheck, createOrUpdateUser);

// read
router.get('/current-user', authCheck, currentUser);
router.get('/current-admin', authCheck, adminCheck, currentUser);

// update
// delete

module.exports = router;
