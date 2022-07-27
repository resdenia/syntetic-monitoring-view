const express = require('express');
const { body } = require('express-validator');
const videoController = require('../controllers/video');

const router = express.Router();
// GET /feed/posts

// POST /feed/post
router.post('/video-upload', videoController.videoUpload);

module.exports = router;
