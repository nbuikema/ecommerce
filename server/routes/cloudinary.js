const express = require('express');
const router = express.Router();

// import controllers
const { upload, remove } = require('../controllers/cloudinary');

// middleware
const { authCheck, adminCheck } = require('../middleware/auth');

// upload image
router.post('/cloudinary/upload', authCheck, adminCheck, upload);

// remove image
router.post('/cloudinary/remove', authCheck, adminCheck, remove);

module.exports = router;
