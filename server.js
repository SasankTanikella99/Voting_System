const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000
const passport = require('passport');
const {jwtAuthMiddleware, generateToken} = require('./jwt.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})


//Routes

const UserRouter = require('./routes/userRoutes.js');
const CandidateRouter = require('./routes/candidateRoutes.js');

app.use('/user',  UserRouter)
app.use('/candidate',  jwtAuthMiddleware, CandidateRouter)





app.listen(PORT, () => {
  console.log(`Server running on port `)
})