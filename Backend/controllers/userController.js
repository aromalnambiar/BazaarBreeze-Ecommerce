const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const User=require('../models/User');
const OTP=require('../models/Otp');

const generateOtp=()=>{
        const otp=Math.floor(100000 + Math.random() * 900000);;
        return String(otp);
}

const sendMail=(email,otp)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: `${process.env.USER}`,
              pass: `${process.env.PASS}`,
              clientId: `${process.env.CLIENT_ID}`,
              clientSecret:`${process.env.CLIENT_SECRET}`,
              refreshToken: `${process.env.REFRESH_TOKEN}`
            }
          });
    
        function sendMail(email,otp){
            const details={
                from:`${process.env.USER}`,
                to:email,
                subject:"Testing nodemailer",
                html:otp
            }
            transporter.sendMail(details,function(error,data){
                if(error)
                console.log(error);
                else
                console.log(data);
            });
        }    
    sendMail(email,otp);

    } catch (error) {
        console.log(error);
    }
}


const retrieveOTP=async(email)=>{
    try {
        const otpRecord=await OTP.findOne({email}).sort({createdAt:-1});
        return otpRecord?otpRecord.otp:null;
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const verifyOTP=async(req,res)=>{
    try {
        const {email,username,password,otp:enteredOTP}=req.body;
        const storedOTP=await retrieveOTP(email);

        if(enteredOTP==storedOTP){
            const user=new User({email,username,password});
            await user.save();
            res.status(200).json({message:"User created successfully"});
        }else{
            res.status(400).json({message:"Invalid OTP"});
        }

    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const resendOTP=async(req,res)=>{
    try {
        const {email}=req.body; 
        const otp=generateOtp();
        sendMail(email,otp);
        storeOTP(email,otp);
        res.status(200).json({message:"OTP resend success"});
    } catch (error) {
        console.log(error);
    }
}

const forgetPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"can't find user"});
        }
        const otp=generateOtp();
        sendMail(email,otp);
        storeOTP(email,otp);
        res.status(200).json({message:"success"});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const resetPassword=async(req,res)=>{
    try {
        const {email,otp:enteredOTP,newPassword}=req.body;
        const storedOTP=await retrieveOTP(email);
        console.log("storedOTP : ",storedOTP);
        console.log("enteredOTP : ",enteredOTP);
        if(enteredOTP==storedOTP){
            const user=await User.findOne({email});
            if(!user){
                res.status(404).send("User not found");
            }else{
                user.password=newPassword;
                await user.save();
                res.status(200).json({message:"password reset successfully"});
            }
        }else{
            res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const storeOTP=async(email,otp)=>{
    try {
        const newOTP=new OTP({email,otp});
        await newOTP.save();
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}



const registerUser=async(req,res)=>{
    try {
        const {email}=req.body;

        const otp=generateOtp();
        sendMail(email,otp);
        storeOTP(email,otp);
        res.status(200).json({message:"OTP sent to your email"});
    } catch (error) {
        console.log(error);
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User isn't available"});
        }
        else if(user.password===password){
            if(user.isBlocked){
                res.status(400).json({message:"User is blocked"})
            }
            return res.status(200).json({message:"Login successfull"});
        }else{
            return res.status(400).json({message:"password isn't matching"});
        }
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

module.exports={registerUser,verifyOTP,sendMail,loginUser,resetPassword,forgetPassword,resendOTP};

