const express = require('express');
const router = express.Router();
const passport = require('passport');
const env = require('dotenv').config();

const commentsController = require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commentsController.create);
router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);
module.exports = router;
