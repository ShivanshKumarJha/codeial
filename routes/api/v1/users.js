const express = require('express');
const router = express.Router();

const usersApi = require('../../../controllers/api/v1/users-api');

router.post('/create-session', usersApi.createSession);

module.exports = router;
