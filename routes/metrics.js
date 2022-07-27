const express = require('express');
const { body } = require('express-validator');
const mainController = require('../controllers/main');

const router = express.Router();
// GET /feed/posts

// POST /feed/post
router.post('/send-metrics', mainController.homepage);

module.exports = router;