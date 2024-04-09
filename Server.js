const express=require('express');
const app=express();
const db=require('./db');
require('dotenv').config();
const bodyParser=require('body-parser');//act as a middleware in which parse and extract data from json to javascript object.
app.use(bodyParser.json());//req.body
const PORT=process.env.PORT || 3000;
const userRoutes=require('./routes/userRoutes');
const candidateRoute=require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidates',candidateRoute);

app.listen(PORT, ()=>{
    console.log("Server is connected on port:",PORT);
});
db();