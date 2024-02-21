const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    email:{type:String,required:true},
    username:{type:String,required:true},
    createdDate:{type:Date},
    image:{type:String},
    password:{type:String,required:true},
    updatedDate:{type:Date},
    isBlocked:{type:Boolean,default:false},
    gender:{type:String},
    age:{type:Number},
})

const userModel=mongoose.model("User",UserSchema);
module.exports=userModel;