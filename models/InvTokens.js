const mongoose = require('mongoose')

//Schema to handle invalidated tokens and prevent reuse
const InvTokens = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("InvTokens", InvTokens)