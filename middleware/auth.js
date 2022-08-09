const jwt = require("jsonwebtoken")
const Users = require("../models/UsersModel")
require('dotenv').config()
const SECRET = process.env.SECRET;

exports.auth = (req, res, next) => {
    //get token from header
    const token = req.header("x-auth-token")

    if(!token)
        return res
        .status(401)
        .json({ 
            statusCode: 401, 
            message: "No token provided."
        });

    try {
       const decode = jwt.verify(token, SECRET)
       req.user = decode.user
       next()
    } catch (error) {
        res
        .status(401)
        .json({ 
            statusCode: 401, 
            message: "Invalid token."
        });
    }
}

exports.checkAdmin = async (req, res, next) => {
    try {
        const getUser = await Users.findById(req.user.id)
        if(getUser.userType !== "admin")
        return res.status(401).send("You are not authorized to access the admin route!")

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!")
    }
    next()
}

exports.checkStaff = async (req, res, next) => {
    try {
        const getUser = await Users.findById(req.user.id)
        if(getUser.userType !== "staff")
        return res.status(401).send("You are not authorized to access the staff route!")

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!")
    }
    next()
}

exports.checkManager = async (req, res, next) => {
    try {
        const getUser = await Users.findById(req.user.id)
        if(getUser.userType !== "manager")
        return res.status(401).send("You are not authorized to access the manager route!")

    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR!")
    }
    next()
}