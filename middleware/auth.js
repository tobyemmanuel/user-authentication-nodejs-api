const jwt = require("jsonwebtoken") //load JWT
const Users = require("../models/UsersModel") // user schema
const InvTokens = require("../models/InvTokens")  // model for invalidated tokens to ensure total logout
require('dotenv').config() //load .env
const SECRET = process.env.SECRET; //secret for JWT

exports.auth = async (req, res, next) => {
    //get token from header
    const token = req.header("x-auth-token")

    //check if token is valid
    if(!token)
        return res
        .status(401)
        .json({ 
            statusCode: 401, 
            message: "No token provided."
        });

    try {
        let isExistToken = await InvTokens.findOne({token}) //check if token has been invalidated
        if(isExistToken) return res.status(401).send("Token was loggedout already") //redirect if invalidated

        //verify the token
       const decode = jwt.verify(token, SECRET)
       req.user = decode.user
       next()
    } catch (error) {
        res
        .status(401)
        .json({ 
            statusCode: 401, 
            message: "Invalid token."
        }); //catch error
    }
}

//verify if user is admin
exports.checkAdmin = async (req, res, next) => {
    try {
        const getUser = await Users.findById(req.user.id) //get id from JWT

        // check if user is admin
        if(getUser.userType !== "admin")
        return res.status(401).send("You are not authorized to access the admin route!") //redirect if user is not admin

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!") //catch error
    }
    next()
}

//verify if user is staff
exports.checkStaff = async (req, res, next) => {
    try {
        const getUser = await Users.findById(req.user.id) //get id from JWT

         // check if user is staff
        if(getUser.userType !== "staff")
        return res.status(401).send("You are not authorized to access the staff route!")//redirect if user is not staff

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!") //catch error
    }
    next()
}

exports.checkManager = async (req, res, next) => {
    try {
        const getUser = await Users.findById(req.user.id) //get id from JWT

        // check if user is manager
        if(getUser.userType !== "manager")
        return res.status(401).send("You are not authorized to access the manager route!") //redirect if user is not manager

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!") //catch error
    }
    next()
}