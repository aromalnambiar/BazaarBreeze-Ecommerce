const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const OTP=require('../models/Otp');
const Products=require('../models/Products');
const mongoose=require('mongoose');

const generateOtp=()=>{
        const otp=Math.floor(100000 + Math.random() * 900000);;
        return String(otp);
}

const sendMail = async (email, otp) => {
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: `${process.env.USER}`,
          pass: `${process.env.PASS}`,
          clientId: `${process.env.CLIENT_ID}`,
          clientSecret: `${process.env.CLIENT_SECRET}`,
          refreshToken: `${process.env.REFRESH_TOKEN}`
        }
      });
  
      const details = {
        from: `${process.env.USER}`,
        to: email,
        subject: "Testing nodemailer",
        html: otp
      };
  
      // Return a promise that resolves on successful sending or rejects on error
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
      console.log(existingUser);
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
        console.log("loginUser");
        console.log("req.body : ",req.body);
        const {email,password}=req.body;
        const user=await User.findOne({email});
        console.log(user);
        if(!user){
            return res.status(404).json({message:"User isn't available"});
        }
        else if(bcrypt.compareSync(password,user.password)){
            if(user.isBlocked){
               return res.status(400).json({message:"User is blocked"})
            }
            const token=jwt.sign({userId:user._id,role:'user'},`${process.env.JWT_SECRET}`,{expiresIn:'1h'});
            return res.status(200).json({token,userId:user._id,message:"Login successfull"});
        }else{
            return res.status(400).json({message:"password isn't matching"});
        }
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

// const listProducts=async(req,res)=>{
//     try {
//          const products=await Products.find();
//          console.log(products);
//          res.status(200).json({message:"success",products});
         
//     } catch (error) {
//         console.log(error);
//         throw new Error;
//     }
// }

const listProducts = async (req, res) => {
  try {
    const products = await Products.aggregate([
      {
        $lookup: {
          from: 'productvariants',
          localField: '_id',
          foreignField: 'productId',
          as: 'variants',
        },
      },
      {
        $addFields: {
          firstVariant: { $arrayElemAt: ['$variants', 0] },
        },
      },
      {
        $project: {
          variants: 0, 
        },
      },
    ]);

    // console.log(products);
    res.status(200).json({ message: 'success', products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const productDetails = async (req, res) => {
//     try {
//       const productId = new mongoose.Types.ObjectId(req.params.productid); // Replace with the actual product ID
//         console.log(req.params.productid);
//       const result = await Products.aggregate([
//         {
//           $match: {
//             _id: productId,
//           },
//         },
//         {
//           $lookup: {
//             from: 'productvariants',
//             localField: '_id',
//             foreignField: 'productId',
//             as: 'productDetails',
//           },
//         },
//       ]);
  
//       console.log(result[0]);
  
  
//       res.status(200).json({ message: "success", productDetails: result[0] });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
const productDetails = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productid);
    const result = await Products.aggregate([
      {
        $match: {
          _id: productId,
        },
      },
      {
        $lookup: {
          from: 'productvariants',
          localField: '_id',
          foreignField: 'productId',
          as: 'productDetails',
        },
      },
    ]);

    if (result.length > 0) {
      const product = result[0];

      const firstVariant = product.productDetails[0];

      product.productDetails = firstVariant;

      console.log(product);

      res.status(200).json({ message: 'success', productDetails: product });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports={registerUser,verifyOTP,sendMail,loginUser,resetPassword,forgetPassword,resendOTP,listProducts,productDetails};

