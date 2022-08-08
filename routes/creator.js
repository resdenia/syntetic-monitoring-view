const express = require('express');
const creatorController = require('../controllers/creator');

const router = express.Router();
// GET /feed/posts

// POST /feed/post
// modifyFile
router.post('/api/modify-file', creatorController.modifyFile);
// createZip
router.post('/api/create-zip', creatorController.createZip);
// uploadZipToS3
router.post('/api/uploadZip', creatorController.uploadZipToS3);

router.post('/api/create-lambda', creatorController.createLambda);

router.post('/api/add-cloudbridge', creatorController.addEventBridge);

module.exports = router;
