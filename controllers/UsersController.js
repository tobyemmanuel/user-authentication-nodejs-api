const Users = require("../models/UsersModel") // user schema
const InvTokens = require("../models/InvTokens") // model for invalidated tokens to ensure total logout
const bcrypt = require("bcryptjs") //load bcrypt
const jwt = require("jsonwebtoken") //load JWT
const {validationResult} = require("express-validator") // load for validating params
const { sendEmail } = require('../modules/Mmail'); //module to send mails for password recovery

require('dotenv').config()
const {SALT, SECRET, MIN_PASSWORD} = process.env //capture constants from dotenv

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

// function for user log in
exports.loginUser = async (req, res) => {
    const {email, password} = req.body //load params
    const errors = validationResult(req) //check params

    //return issues with params
    if(!errors.isEmpty())
    return res
    .status(400)
    .json({
        statusCode:400,
        message: errors.array()
    });

    try {
        //check if user exists
        let user = await Users.findOne({email})
        if(!user) 
        return res
        .status(400)
        .json({ 
            statusCode:400,
            message: "User not found"
        });

        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
        return res
        .status(400)
        .json({ 
            statusCode:400,
            message: "User not found"
        });

        //prepare JWT payload
        const authPayload = {
            user: {
                id: user.id
            }
        }

        //create JWT token
        jwt.sign(
            authPayload,
            SECRET,
            {
                expiresIn: 84600
            },
            (err, token)=>{
                if(err) throw err;
                res
                .status(200)
                .json({ 
                    statusCode:200,
                    message: "Logged in successfully",
                    user: {
                        username: user.username,
                        email: user.email,
                        userType: user.userType
                    },
                    token
                });
            }
        )

    } catch (error) {
        res.status(500).send("SERVER ERROR!") //catch errors
    }
}

//logout function
exports.logOut = async (req, res) => {
    const token = req.header("x-auth-token") //capture token from header

    //check if token is valid
    if(!token)
        return res
        .status(401)
        .json({ 
            statusCode: 401, 
            message: "No token provided."
        });

    try {
        //check token in among invalidated tokens to prevent duplicates
        let isExistToken = await InvTokens.findOne({token})
        //add token to invalid token if it does not exist
        if(!isExistToken){
            const newLoggedOutToken = new InvTokens({
                token: token,
                reason: "terminated"
            });
            await newLoggedOutToken.save(); //log terminated token to prevent further use
        }

        //clear token from cookies
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res
        .status(200)
        .json({
            statusCode: 200,  message: "Logged out successfully" //success message
        });

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!") //capture error
    }

}

//admin-protected route
exports.adminRoute = (req, res) => {
    return res
    .status(200)
    .json({
        statusCode: 200,  message: "This is the admin route" //success message
    });
}

//staff-protected route
exports.staffRoute = (req, res) => {
    return res
    .status(200)
    .json({
        statusCode: 200,  message: "This is the staff route" //success message
    });
}

//manager-protected route
exports.managerRoute = (req, res) => {
    return res
    .status(200)
    .json({
        statusCode: 200,  message: "This is the manager route" //success message
    });
}

//loggedin-protected route
exports.loggedInRoute = (req, res) => {
    return res
    .status(200)
    .json({
        statusCode: 200,  message: "You are logged in" //success message
    });
}