const express = require('express');
const router = express.Router();
const passport = require('passport');
const env = require('dotenv').config();
const usersController = require('..//controllers/users_controller');
const { fail } = require('assert');

router.get(
  '/profile/:id',
  passport.checkAuthentication,
  usersController.profile
);

router.post(
  '/update/:id',
  passport.checkAuthentication,
  usersController.update
);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);

// Use passport as middleware to authenticate
router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/users/sign-in' }),
  usersController.createSession
);

router.get('/sign-out', usersController.destroySession);

// For google authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/sign-in' }),
  usersController.createSession
);

// for password section - forgot password
router.get('/reset-password', usersController.resetPassword);
router.post('/send-reset-pass-mail', usersController.resetPassMail);

router.get('/reset-password/:accessToken', usersController.setPassword);
router.post('/update-password/:accessToken', usersController.updatePassword);

module.exports = router;
