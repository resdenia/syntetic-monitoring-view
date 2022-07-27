const express = require('express');
const { body } = require('express-validator');
const mainController = require('../controllers/main');

const router = express.Router();
// GET /feed/posts

// POST /feed/post
router.get('/tests/new', mainController.homepage);

module.exports = router;