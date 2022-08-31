const express = require('express');
const { body } = require('express-validator');
const mainController = require('../controllers/main');

const router = express.Router();

router.get('/', mainController.homepage);
router.get('/steps', mainController.homepageV2);

module.exports = router;
