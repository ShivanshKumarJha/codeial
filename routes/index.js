const express = require('express');
const router = express.Router();
const homeController = require('..//controllers/home_controller')

console.log('router loaded');

// For homepage we will require the homeController controllers i.e. itself
router.get('/', homeController.home);
// This means that whenever /profile is opened,it will open the another controller named users
router.use('/users', require('./users'));

// for any further routes,access from here 
// router.use('/router_Name',require('./routerfile'));

module.exports = router;
