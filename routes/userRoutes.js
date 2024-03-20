const express = require('express')
const router = express.Router();
const user = require('../models/user.js')
const mongoose = require('mongoose');
const {jwtAuthMiddleware, generateToken} = require('../jwt.js')


router.post("/signup", async (req,res) => {
    try{
        const data = req.body; // assuming the request body contains the User data
        const newUser = new user(data) // create a new user
        const response = await newUser.save() // save to database
        console.log("Successfully created user");

        const payload = {
            id: response.id,
            
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload)
        console.log(JSON.stringify(token))

        res.status(201).json({message: "Successfully created user"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error creating user"})
    }  
})

// Login Route
router.post("/login", async (req, res) => {
    try {
        // Extract ID and password from request body
        const {id, password} = req.body; 
        
        // find by username and password
        const existuser = await user.findOne({ id: id})

        // if user does not exist, or password is incorrect, return error message
        if(!existuser || !(await existuser.comparePassword(password))){
            return res.status(401).json({errorMessage: 'Invalid ID or Password'})
        }

        // generate token
        const payload = {
            id: user.id,

        }
        const token = generateToken(payload)
        //return token as response

        res.json({token})
    } catch (error) {
        console.log(error)
        res.status(500).json({errorMessage: 'Server Error'})
    }
})

router.post("/", async (req,res) => {
    try{
        const data = req.body
        const newuser =  new user(data)
        const saveduser = await newuser.save()
        console.log("Successfully saved user");
        res.status(201).json({message: "Successfully saved user", data:saveduser});
    }catch(err){
        console.log("Error saving user");
        res.status(500).json({message: "Error saving user"})
    }        
    
})

router.put("/profile/password", async(req, res)=>{
    try{
        const id = req.user.id
        const {currentPassword, newPassword} = req.body;
        const update = await user.findById(id)
        if(!await update.comparePassword(password)){
            return res.status(404).json({message: " No such user found!"})
        }
        // update password
        update.password = newPassword
        await update.save();
        
        console.log("Update Successful")
        res.status(200).json({message: "Updated successfully!", data:update})
    }
    catch(err){
        console.log("error fetching type")
        res.status(500).json({message:"Could not find the type"})
    }
})



// Profile Routes
router.get("/profile", jwtAuthMiddleware, async(req,res) => { 
    try {
        const userData = req.user
        console.log("UserData :",userData);
        const userID = userData.id
        const User = await user.findById(userID)
        res.status(200).json({message: "User found.",data:user});
    } catch (error) {
        res.status(500).json({message:"Could not find the User."})
    }
})

module.exports = router;