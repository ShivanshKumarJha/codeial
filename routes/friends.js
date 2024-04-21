const express = require('express');
const router = express.Router();
const passport = require('passport');
const env = require('dotenv').config();

const friendController = require('../controllers/friends_controller');

// Send a friend request
router.all('/friendship/add', passport.checkAuthentication, friendController.addFriend);

// Remove a friend
router.get('/friendship/remove/:id', passport.checkAuthentication, friendController.removeFriend);

// To get the all friends
router.get('/all-friends/:id', passport.checkAuthentication, friendController.getAllFriends);

module.exports = router;