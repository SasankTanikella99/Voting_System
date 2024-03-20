const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const Candidateschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId, 
                ref: "voter",
                required: true
            },
            timeStamp:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type: Number,
        default: Date.now()
    }
})

const candidate = mongoose.model("candidate", Candidateschema)

module.exports = candidate