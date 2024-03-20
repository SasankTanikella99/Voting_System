const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Userschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type :String , 
        enum : ['admin','voter'],
        default:'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    }
    
})

Userschema.pre('save', async function(next) {
    const person = this;
    // Hashing only if password has been changed
    if(!person.isModified('password')) return next();

    try {
        // hashing password
        const salt = await bcrypt.genSalt(10)

        const hashedpassword = await bcrypt.hash(person.password, salt)
        // override the password with hashed password
        person.password = hashedpassword
        next()
    } catch (error) {
        return next(error)
    }
})

Userschema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatched = await bcrypt.compare(candidatePassword, this.password)
        return isMatched
    } catch (error) {
        throw error

    }
}

const voter = mongoose.model("users", Userschema)

module.exports = voter