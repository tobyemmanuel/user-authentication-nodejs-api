const express = require('express');
const router = express.Router();
const {check} = require("express-validator")
const usersController = require('../controllers/UsersController'); //import user controller
const { auth, checkAdmin, checkManager, checkStaff }= require("../middleware/auth")
require('dotenv').config()
const {MIN_PASSWORD} = process.env //capture constants from dotenv

/*
IMPLEMENTATION
The register route uses POST METHOD 
{
  "username": "tobyq",
  "email": "tobyemmanuelq@gmail.com",
  "password": "Error",
  "passwordConfirm": "Error",
  "userType": "user"
}

The Password recovery uses the POST Method and sends a reset mail to user
{
  "email": "tobyemmanuels@gmail.com"
}

The Password reset uses the POST Method
{
  "email": "tobyemmanuel@gmail.com",
  "resetToken": "$2a$10$hb7TgGV89cZ5dQJWSKpu4O",
  "password": "Error"
}

The login uses the POST Method
{
  "email": "tobyemmanuelm@gmail.com",
  "password": "Error"
}
*/
router.post('/auth/register', usersController.registerUser)

router.post('/auth/passwordrecovery', usersController.passwordRecovery)
router.post('/auth/passwordreset', usersController.passwordReset)
router.post('/auth/login', [
    check("email", "Please provide your email").isEmail(),
    check("password", "Please provide your password").isLength({ min: MIN_PASSWORD })
], usersController.loginUser)
router.post('/auth/logout', usersController.logOut)
router.post('/auth/user', auth, usersController.loggedInRoute)
router.post('/auth/staff', auth, checkStaff, usersController.staffRoute)
router.post('/auth/manager', auth, checkManager, usersController.managerRoute)
router.post('/auth/admin', auth, checkAdmin, usersController.adminRoute)

module.exports = router;