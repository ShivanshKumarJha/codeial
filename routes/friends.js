const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendController = require('../controllers/friends_controller');

// Send a friend request
router.all('/friendship/add', passport.checkAuthentication, friendController.addFriend);

// Remove a friend
router.get('/friendship/remove/:id', passport.checkAuthentication, friendController.removeFriend);

module.exports = router;