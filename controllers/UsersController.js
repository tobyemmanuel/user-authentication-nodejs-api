const Users = require("../models/UsersModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendEmail } = require('../modules/Mmail');

require('dotenv').config()
const {SALT, MIN_PASSWORD} = process.env //capture constants from dotenv

//function for register user
exports.registerUser = async (req, res) => {
    try {
        const { email, password, passwordConfirm, username, userType } = req.body; //capture the params

            //check for empty fields
        if (!email || !password || !passwordConfirm || !username) {
            return res.status(400).json({ statusCode: 400, message: "Complete all fields" });
          }
    
        // Checking to ensure password length is at least 5 characters
        if (password.length < MIN_PASSWORD) {
          return res
            .status(400)
            .json({ statusCode: 400, message: "The password needs to be at least 5 characters long" });
        }
    
        // Check the password
        if (password !== passwordConfirm) {
          return res
            .status(400)
            .json({ statusCode: 400,message: "Passwords do not match." });
        }

        //check if user exists
        const isExistsUser = await Users.findOne({username: username, email: email})
        if(isExistsUser){
            return res
            .status(400)
            .json({statusCode: 400, message: "Username or Email already exists."})
        }

        const saltGen = await bcrypt.genSalt();  //generate password salt
        const passwordHash = await bcrypt.hash(password, saltGen);  //generate hashed password

        //prepare the submission query
        const newUser = new Users({
            email: email,
            username: username,
            password: passwordHash,
            userType: userType
        });


        const savedUser = await newUser.save(); //save new user
        res.json({
            statusCode: 200,
            message: "User registered successfully",
            user: {
                username: savedUser.username,
                email: savedUser.email,
                userType: savedUser.userType
            }
        })  
          
    } catch (error) {//catch errors in the code
        return  res
                .status(500)
                .json({statusCode: 500, message: "SERVER ERROR"})
    }
}

//function to recover user password and send reset token to email
exports.passwordRecovery = async (req, res) => {
    const { email } = req.body; //load params

    //check for empty fields
    if (!email ) {
        return res.status(400).json({ statusCode: 400, message: "Complete all fields" });
      }

    const tokenGen = await bcrypt.genSalt(); //gen reset token

      //insert reset token to database and send token to email
        Users.findOneAndUpdate({email: email}, {
            resetToken: tokenGen,
        }, {
            new: true
        })
        .then(data => {
            if (!data) {
                return res
                .status(404)
                .json({
                    statusCode: 500, message: "Email not found" //not found error message
                });
            }
            const body = `Please reset your email with this token ${tokenGen}`
            sendEmail(email, 'Reset your account', body) //mail the user

            return res
            .status(200)
            .json({
                statusCode: 200,  message: "Please check your mail for reset details!" //success message
            });
        }).catch(err => {
            res
            .status(500)
            .json({statusCode: 500, message: "SERVER ERROR"})
        });
}

// process password reset after getting the reset token from mail
exports.passwordReset = async (req, res) => {
    const { email, resetToken, password } = req.body; //load params

        //check for empty fields
    if (!email  || !resetToken || !password) {
        return res.status(400).json({ statusCode: 400, message: "Complete all fields" });
      }

        const saltGen = await bcrypt.genSalt(); //salt for new password
        const passwordHash = await bcrypt.hash(password, saltGen); //hash new password

        // check if email exists
        const isExistsEmail = await Users.findOne({email: email}) 
        if(!isExistsEmail && isExistsEmail.resetToken !== resetToken)
        return res
            .status(404)
            .json({statusCode: 404, message: "User does not exist"})

            //update password in database and remove reset token
        Users.findOneAndUpdate({email: email}, {
            resetToken: "",
            password: passwordHash
        }, {
            new: true
        })
        .then(data => {
            if (!data) {
                return res
                .status(404)
                .json({
                    statusCode: 500, message: "Email not found" //not found error message
                });
            }
            return res
            .status(200)
            .json({
                statusCode: 200,  message: "Password recovery successful" //success message
            });
        }).catch(err => {
            res
            .status(500)
            .json({statusCode: 500, message: "SERVER ERROR"})
        });
}