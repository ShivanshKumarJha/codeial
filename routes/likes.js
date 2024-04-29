const express = require('express');
const router = express.Router();
const env = require('dotenv').config();
const likesController = require('../controllers/likes_controller');

router.post('/toggle', likesController.toggleLike);

module.exports = router;
