const Users = require("../models/UsersModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const {SALT, MIN_PASSWORD} = process.env


exports.registerUser = async (req, res) => {
    try {
        const { email, password, passwordConfirm, username, userType } = req.body;

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

        const existsEmail = await Users.findOne({username: username, email: email})
        if(existsEmail){
            return res
            .status(400)
            .json({statusCode: 400, message: "Username or Email already exists."})
        }

        const saltGen = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, saltGen);


        const newUser = new Users({
            email: email,
            username: username,
            password: passwordHash,
            userType: userType
        });


        const savedUser = await newUser.save();
        res.json({
            statusCode: 200,
            message: "User registered successfully",
            user: {
                username: savedUser.username,
                email: savedUser.email,
                userType: savedUser.userType
            }
        })  
          
    } catch (error) {
        console.log(error)
        return  res
                .status(500)
                .json({statusCode: 500, message: "SERVER ERROR"})
    }
}