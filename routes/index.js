const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');

// For homepage we will require the homeController controllers i.e. itself
router.get('/', homeController.home);
// This means that whenever /profile is opened,it will open the another controller named users
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friends'));

router.use('/api', require('./api'));

module.exports = router;
