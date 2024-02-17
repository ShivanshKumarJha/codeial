const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, postsController.create);
router.get(
  '/destroy/:id',
  passport.checkAuthentication,
  postsController.destroy
);

router.get('/:id',passport.checkAuthentication,postsController.getPosts);

module.exports = router;