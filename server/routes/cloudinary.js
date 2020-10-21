const express = require('express');
const router = express.Router();

// import controllers
const { upload, remove } = require('../controllers/cloudinary');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

router.post('/upload', authCheck, adminCheck, upload);

router.post('/remove', authCheck, adminCheck, remove);

module.exports = router;
