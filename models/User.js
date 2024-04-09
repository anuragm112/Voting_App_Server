const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    mobile:{
        type: Number
    },
    address:{
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: Number,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['voter','admin'],
        default:'voter'
    },
   isVoted:{
     type: Boolean,
     default: false
   }
});
const User=mongoose.model('users',userSchema);
module.exports=User;