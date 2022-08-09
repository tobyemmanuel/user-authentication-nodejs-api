const express = require('express');
const router = express.Router();
const {check} = require("express-validator")
const usersController = require('../controllers/UsersController'); //import user controller
const { auth, checkAdmin, checkManager, checkStaff }= require("../middleware/auth")
require('dotenv').config()
const {MIN_PASSWORD} = process.env //capture constants from dotenv

//router.get('/', controller.index)
router.post('/auth/register', usersController.registerUser)
router.post('/auth/passwordrecovery', usersController.passwordRecovery)
router.post('/auth/passwordreset', usersController.passwordReset)
router.post('/auth/login', [
    check("email", "Please provide your email").isEmail(),
    check("password", "Please provide your password").isLength({ min: MIN_PASSWORD })
], usersController.loginUser)
router.post('/auth/user', auth, usersController.loggedInRoute)
router.post('/auth/staff', auth, checkStaff, usersController.staffRoute)
router.post('/auth/manager', auth, checkManager, usersController.managerRoute)
router.post('/auth/admin', auth, checkAdmin, usersController.adminRoute)

module.exports = router;