const express = require('express')
const router = express.Router();
const candidate = require('../models/candidate.js')
const mongoose = require('mongoose');
const {jwtAuthMiddleware, generateToken} = require('../jwt.js')


const checkAdmin = async (userID) => {
    try {
        const user = await candidate.findById(userID)
        return user.role === 'admin'
    } catch (error) {
        return false;
    }
}

router.post("/", async (req,res) => {
    try{
        if(!checkAdmin(req.user.id)){
            return res.status(404).json({message: "You are not an admin"})
        }
        const data = req.body; // assuming the request body contains the candidate data
        const newCandidate = new candidate(data) // create a new candidate
        const response = await newCandidate.save() // save to database
        console.log("Successfully created candidate");

        const payload = {
            id: response.id,
            
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload)
        console.log(JSON.stringify(token))

        res.status(201).json({message: "Successfully created candidate"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error creating candidate"})
    }  
})




router.put("/:candidateID", async(req, res)=>{
    try{
        if(!checkAdmin(req.user.id)){
            return res.status(404).json({message: "You are not an admin"})
        }
        const id = req.candidate.id
        const person = req.body
        const update = await candidate.findByIdAndUpdate(id, updatedPersondata, {
            new: true, // return the new value so we can see it
            runValidators: true // run mongoose validation
        })
        if(!update){
            return res.status(404).json({message: "No person with this ID was found."})
        }
        
        console.log("Update Successful")
        res.status(200).json({message: "Updated successfully!", data:update})
    }
    catch(err){
        console.log("error fetching type")
        res.status(500).json({message:"Could not find the type"})
    }
})

router.delete("/:candidateID", async(req, res)=>{
    try{
        if(!checkAdmin(req.user.id)){
            return res.status(404).json({message: "You are not an admin"})
        }
        const id = req.candidate.id

        const update = await candidate.findByIdAndUpdate(id, updatedPersondata, {
            new: true, // return the new value so we can see it
            runValidators: true // run mongoose validation
        })
        if(!update){
            return res.status(404).json({message: "No person with this ID was found."})
        }
        
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
        const candidateData = req.candidate
        console.log("candidateData :",candidateData);
        const candidateID = candidateData.id
        const candidate = await candidate.findById(candidateID)
        res.status(200).json({message: "candidate found.",data:candidate});
    } catch (error) {
        res.status(500).json({message:"Could not find the candidate."})
    }
})

router.post("/vote/:candidateID",jwtAuthMiddleware, async(req,res) => {
    candidateID = req.params.candidateID
    userID = req.user.id
    try{
        const candidate = await candidate.findById(candidateID)
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }
        const user = await user.findById(userID)
        if(!user) {
            return res.status(401).json({ message: 'You are not authorized to vote' })
        } else if (user.isVoted){
            return res.status(401).json({ message: 'You already voted' })
        } else if(user.role === 'admin'){
            return res.status(401).json({ message: 'admin cannot vote' })
        }

        candidate.votes.push({user: userID})
        candidate.voteCount++;
        await candidate.save();

        user.isVoted=true;
        await user.save()
        res.status(200).json({ message: 'vote received' })

    } catch(err){

    }
})

// vote count
router.get('/vote/count',async (req,res)=>{
    try {
        const candidate = await candidate.find().sort({voteCount: 'desc'})
        const record = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
              
        })
        return res.status(200).json({record})  
    } catch (err) {
        
    }
})

module.exports = router;