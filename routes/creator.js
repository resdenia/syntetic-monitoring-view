const express = require('express');
const creatorController = require('../controllers/creator');

const router = express.Router();
// GET /feed/posts

// POST /feed/post
router.post('/api/', mainController.creatorController);

module.exports = router;
