const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UsersController'); //import user controller

//router.get('/', controller.index)
router.post('/auth/register', usersController.registerUser)

module.exports = router;