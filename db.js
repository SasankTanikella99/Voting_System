const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL)

const db = mongoose.connection;

// defining the EVENT LISTENERS

db.on('connected', () => {
    console.log("connection established")
})

db.on('error', () => {
    console.log(" error while connection is established")
})

db.on('disconnected', () => {
    console.log("disconnected")
})

module.exports = db