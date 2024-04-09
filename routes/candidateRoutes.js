const express=require('express');
const route=express.Router();
const User=require('../models/User');
const bcrypt=require('bcrypt');
const Candidate=require('../models/Candidates');
const {generateToken,jwtwebtoken}= require('../jwt');

const checkAdminOrNot=async(userId)=>{
    try{
        const user=await User.findById(userId);
        if(user.role=='admin'){
         return true;
        }else{
         return false;
        }
    }catch(e){
        return false;
    }
}
route.post('/',jwtwebtoken,async(req,res)=>{
    try{
        if(! await checkAdminOrNot(req.user.id)) 
         return res.status(403).json("User does not not admin role");

       const candidateData=req.body;
       const newCandidate=new Candidate(candidateData);
       const response=await newCandidate.save();
       res.status(200).json({response: response});
    }catch(e){
        res.status(500).json({e: "Internal server error"});
    }
 });
 route.put('/:candidateId',jwtwebtoken,async(req,res)=>{
   try{
      if(! await checkAdminOrNot(req.user.id))
         return res.status(403).json("User does not not admin role");

      const candidateId=req.params.candidateId;
      const data=req.body;
      const updatedData=await Candidate.findByIdAndUpdate(candidateId, data,{
        new: true,
        runValidation: true
      });
      if(!updatedData){
        res.status(403).json("Candidate not found");
      }
      res.status(200).json(updatedData);
   }catch(e){
    res.status(500).json({e: "Internal server error"});
   }
 });
 route.delete('/:candidateId',jwtwebtoken,async(req,res)=>{
    try{
       if(!checkAdminOrNot(req.user.id))
          return res.status(403).json("User does not not admin role");
 
       const candidateId=req.params.candidateId;
       const deletedData=await Candidate.findByIdAndDelete(candidateId);
       if(!deletedData){
         res.status(403).json("Candidate not found");
       }
       res.status(200).json("Candidate Deleted!");
    }catch(e){
     res.status(500).json({e: "Internal server error"});
    }
  });
  //give vote to candidate
route.post('/vote/:candidateId',jwtwebtoken,async(req,res)=>{
   const candidateId=req.params.candidateId;
   const userId=req.user.id;
   try{
        if(checkAdminOrNot(userId)){
          res.status(401).json("Admin Not Allowed");
        }else{
         const candidate=await Candidate.findById(candidateId);
         if(!candidate){
            res.status(404).json("Candidate not found");
         }
         const user=await User.findById(userId);
         if(!user){
            res.status(404).json("User not found");
         }
         if(user.isVoted){
            res.status(400).json("You have already voted");
         }
         user.isVoted=true;
         await user.save();

         candidate.votes.push({user: userId});
         candidate.voteCount++;
         await candidate.save();

         res.status(200).json("Vote recorded successfully");
        }
   }catch(e){
      res.status(500).json({e: "Internal server error"});
   }
});
//get all the candidates with total no of votes
route.get('/vote/count',async(req,res)=>{
   try{
        const candidates=await Candidate.find().sort({voteCount: 'desc'});
        const totalRecords=candidates.map((data)=>{
           return{
               party: data.party,
               voteCount: data.voteCount
           }
        });
       return res.status(200).json(totalRecords);
   }catch(e){
      res.status(500).json({e: "Internal server error"});
   }
})
 module.exports=route;
//  // "name": "Ankit Verma",
//  "age": 22,
//  "email": "ankit9@gmail.com",
//  "work": "waiter",
//  "address": "Kachwa Road, Karnal",
//  "contact": 8965567881,
//  "salary": 600000,