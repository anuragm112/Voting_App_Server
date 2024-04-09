const mongoose= require("mongoose");
const mongoClient=require('mongodb');
require('dotenv').config();
module.exports=async()=>{
    const mongodbUrl=process.env.MONGODB_URL;
     try{
        //mongodb globally database
         const connect=await mongoose.connect(mongodbUrl,{useNewUrlParser: true, useUnifiedTopology: true});
         console.log(`MongoDB connected: ${connect.connection.host}`);
     }catch(e){
           console.log(e);
     }
}