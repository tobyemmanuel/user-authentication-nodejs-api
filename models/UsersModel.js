const mongoose = require('mongoose'); //import dependencies

const UsersSchema = mongoose.Schema({ //create schema for the database table
    username: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    userType: {
        type: String, 
        enum: ["admin", "user", "staff", "manager"], 
        default: "user"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', UsersSchema);