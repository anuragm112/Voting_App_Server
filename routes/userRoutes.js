const express=require('express');
const route=express.Router();
const User=require('../models/User');
const bcrypt=require('bcrypt');
const {generateToken,jwtwebtoken}= require('../jwt');
route.post('/signup',async(req,res)=>{
    try{
       const userData=req.body;
       const hashPassword=await bcrypt.hash(userData.password,10);
       const newUser=await new User({
        name: userData.name,
        age: userData.age,
        email: userData.email,
        mobile: userData.mobile,
        address: userData.address,
        aadharCardNumber: userData.aadharCardNumber,
        role: userData.role,
        password: hashPassword,
        isVoted: userData.isVoted
       });
       const response=await newUser.save();
       console.log("Data Saved");
       const payload={
        id: response.id
       }
       const token= generateToken(payload);
       console.log("Token is: ",token);
       res.status(200).json({response: response, token: token});
    }catch(e){
        res.status(500).json({e: "Internal server error"});
    }
 });
 route.post('/login', async(req,res)=>{
    try{
        const {aadharCardNumber, password}= req.body;
        const user=await User.findOne({aadharCardNumber: aadharCardNumber});
        if(!user){
            res.status(401).json({error: "Invalid aadharCardNumber"});
        }
        const matchPassword=await bcrypt.compare(password, user.password);
        if(!matchPassword){
            res.send("Incorrect Password");
        }
        const payload={
            id: user.id,
        }
        const token=generateToken(payload);
        res.json({token});
    }
    catch(e){
        res.status(500).json({e: "Internal server error"});
    }
   
 });
 route.get('/profile',jwtwebtoken,async(req,res)=>{
    try{
        const user=req.user;
        const getProfile=await User.findById(user.id);
        res.status(200).json(getProfile);
    }catch(e){
        res.status(500).json({e: "Internal server error"});
    } 
 });

 route.put('/profile/password',jwtwebtoken,async(req,res)=>{
   try{
       const userId=req.user;
       const {oldPassword,newPassword}=req.body;
       const user=await User.findById(userId.id);
       if(!user){
        res.status(401).json("Invalid User");
       }
       const matchPassword=await bcrypt.compare(oldPassword, user.password);
       if(!matchPassword){
        res.send("Incorrect Password");
       }
       const hashPassword=await bcrypt.hash(newPassword,10);
       user.password=hashPassword;
       await user.save();
       res.status(200).json("Password Updated");
   }catch(e){
    res.status(500).json({e: "Internal server error"});
   }
 });
 module.exports=route;
//  // "name": "Ankit Verma",
//  "age": 22,
//  "email": "ankit9@gmail.com",
//  "work": "waiter",
//  "address": "Kachwa Road, Karnal",
//  "contact": 8965567881,
//  "salary": 600000,