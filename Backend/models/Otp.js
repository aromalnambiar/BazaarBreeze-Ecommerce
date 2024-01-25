const mongoose=require('mongoose');

const OtpSchema=new mongoose.Schema({
    email:{type:String},
    otp:{type:String},
    createdAt:{type:Date,expires:'2m',default:Date.now},
})

const otpModel=mongoose.model("OTP",OtpSchema);
module.exports=otpModel;