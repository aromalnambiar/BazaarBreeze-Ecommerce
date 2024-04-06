const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const User=require('../../models/User');
const OTP=require('../../models/Otp');


const generateOtp=()=>{
    const otp=Math.floor(100000 + Math.random() * 900000);;
    return String(otp);
}

const sendMail = async (email, otp) => {
try {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.USER}`,			
        pass: `${process.env.PASS}`				 
       }
   });

  const details = {
    from: `${process.env.USER}`,
    to: email,
    subject: "OTP for ecommerce",
    html: otp
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(details, function (error, data) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(data); 
        resolve();
      }
    });
  });
} catch (error) {
  console.log(error);
  throw error;
}
};

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const user=new User({email,username,password:hashedPassword});
        await user.save();
        res.status(200).json({message:"User created successfully"});
    }else{
        res.status(400).json({message:"Invalid OTP"});
    }
    
} catch (error) {
    console.log(error);
    res.status(400).json({message:"Invalid OTP"});
    throw new Error;
}
}

const resendOTP=async(req,res)=>{
try {
    const {email}=req.body; 
    const otp=generateOtp();
    await sendMail(email, otp);  
    storeOTP(email, otp);
    res.status(200).json({message:"OTP resend success"});
} catch (error) {
    console.log(error);
}
}

const forgetPassword=async(req,res)=>{
try {
    const {email}=req.body;
    console.log("email : ",email);
    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json({message:"can't find user"});
    }
    const otp=generateOtp();
    await sendMail(email,otp);
    storeOTP(email,otp);
    res.status(200).json({message:"OTP sent successfully",username:user.username});
} catch (error) {
    console.log(error);
    throw new Error;
}
}

const resetPassword=async(req,res)=>{
try {
    const {email,otp:enteredOTP,password:newPassword}=req.body;
    const storedOTP=await retrieveOTP(email);
    console.log("storedOTP : ",storedOTP);
    console.log("enteredOTP : ",enteredOTP);
    if(enteredOTP==storedOTP){
        const user=await User.findOne({email});
        if(!user){
            res.status(404).send("User not found");
        }else{
            const hashedPassword=await bcrypt.hash(newPassword,10);
            user.password=hashedPassword;
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

const registerUser = async (req, res) => {
try {
  const { email } = req.body;
  
  const existingUser = await User.findOne({ email });
  console.log("existingUser : ",existingUser);
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }
  const otp = generateOtp();
  await sendMail(email, otp);  
  storeOTP(email, otp);
  res.status(200).json({ message: "OTP sent to your email" });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to send OTP email" });
}
}; 

const loginUser=async(req,res)=>{
try {
    // console.log("loginUser");
    // console.log("req.body : ",req.body);
    const {email,password}=req.body;
    const user=await User.findOne({email});
    // console.log(user);
    if(!user){
        return res.status(404).json({message:"User isn't available"});
    }
    else if(bcrypt.compareSync(password,user.password)){
        if(user.isBlocked){
           return res.status(400).json({message:"User is blocked"})
        }
        const token=jwt.sign({userId:user._id,role:'user'},`${process.env.JWT_SECRET}`,{expiresIn:'30d'});
        return res.status(200).json({token,message:"Login successfull"});
    }else{
        return res.status(400).json({message:"username or password isn't matching"});
    }
} catch (error) {
    console.log(error);
    throw new Error;
}
}


module.exports={
    retrieveOTP,
    verifyOTP,
    resendOTP,
    forgetPassword,
    resetPassword,
    registerUser,
    loginUser
}