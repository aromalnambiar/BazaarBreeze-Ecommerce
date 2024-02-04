const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const OTP=require('../models/Otp');
const Products=require('../models/Products');
const ProductVariant=require('../models/ProductVariant');
const Address=require('../models/Address');
const Order=require('../models/Order');
const Cart =require('../models/Cart');
const Category=require('../models/Category');

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
    const category= await Category.findById(result[0].category);
    console.log("Category : ",category);

    if (result.length > 0) {
      const product = result[0];
      const firstVariant = product.productDetails[0];
      product.productDetails = firstVariant;
      console.log(product);
      res.status(200).json({ message: 'success', productDetails: product ,category:category.name});
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const showAddresses = async (req, res) => {
  try {
    const { userId } = req.body;
    const addresses = await Address.find({ userId: userId });

    if (!addresses || addresses.length === 0) {
      return res.status(200).json({ message: "No addresses found" });
    }

    res.status(200).json({ message: "Addresses found Successfully", addresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


const showOrders=async(req,res)=>{
  try {
    const {userId}=req.body;
    const orders=await Order.findById({_id:userId});
    if(!orders){
      return res.status(200).json({message:"No orders found"});
    }
    res.status(200).json({message:"Success",orders});
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server error"});
  }
}

const showUser=async(req,res)=>{
  try {
    const {userId}=req.body;
    const user=await User.findById({userId});
    if(!user){
      return res.status(200).json({message:"User is not found"});
    }
    res.status(200).json({message:"success",user})
  } catch (error) {
    res.status(500).json({message:"Server error"});
  }
}

const addAddress=async(req,res)=>{
  try {
    const {fullName,address,state,street,phone1,pincode,userId}=req.body;
    const {phone2,landmark,companyName}=req.body;
    const result=new Address({
      fullName,
      address,
      state,
      street,
      phone1,
      pincode,
      userId,
      phone2,
      landmark,
    });
    const response=await result.save();
    res.status(201).json({message:"Address added successfully",response});

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server issue"});
  }
}

const editAddress=async(req,res)=>{
  try {
    const {fullName,address,state,street,phone1,pincode,userId}=req.body;
    const {companyName,phone2}=req.body;
      const updatedAddress=await Address.findByIdAndUpdate({addressId},{
        fullName,
        companyName,
        address,
        state,
        street,
        phone1,
        phone2,
        pincode,
        userId
      })
      await updatedAddress.save();
      res.status(201).json({message:"Updated successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server issue"});
  }
}

const deleteAddress=async(req,res)=>{
  try {
    const {addressId}=req.body;
    const result=await Address.findByIdAndDelete({addressId});
    console.log(result);
    res.status(200).json({message:"Address deleted successfully"});
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Server issue"});
  }
}

const addToCart = async (req, res) => {
  try {
    const { userId, productVariantId, quantity } = req.body;

    // Check if the product variant exists
    const productVariant = await ProductVariant.findOne({ productVariantId });

    if (!productVariant) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    // Check if the requested quantity is greater than the available stock
    if (quantity > productVariant.stock) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Check if the requested quantity exceeds the maximum allowed quantity per person
    const maxQuantityPerPerson = 5; // Set your maximum quantity per person
    const userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      const existingProductIndex = userCart.product.findIndex((item) => item.productVariantId.equals(productVariantId));

      if (existingProductIndex !== -1) {
        const totalQuantity = userCart.product[existingProductIndex].quantity + quantity;

        if (totalQuantity > maxQuantityPerPerson) {
          return res.status(400).json({ message: `Maximum ${maxQuantityPerPerson} quantity allowed per person` });
        } 

        // If the product exists, update the quantity and totalPrice
        userCart.product[existingProductIndex].quantity += quantity || 1;
        userCart.product[existingProductIndex].totalPrice =
          userCart.product[existingProductIndex].quantity * productVariant.price;
      } else {
        // If the product doesn't exist, add it to the cart
        userCart.product.push({
          productVariantId,
          quantity: quantity || 1,
          price: productVariant.price,
          totalPrice: quantity ? quantity * productVariant.price : productVariant.price,
        });
      }
    } else {
      // If the user's cart doesn't exist, create a new one
      const newUserCart = new Cart({ user: userId });
      newUserCart.product.push({
        productVariantId,
        quantity: quantity || 1,
        price: productVariant.price,
        totalPrice: quantity ? quantity * productVariant.price : productVariant.price,
      });
      await newUserCart.save();
      res.status(200).json({ message: 'Successfully added to cart', cart: userCart || newUserCart });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteFromCart = async (req, res) => {
      try {
        const { userId, productVariantId } = req.body;
        const userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
        const existingProductIndex = userCart.product.findIndex((item) => item.productVariantId.equals(productVariantId));
        if (existingProductIndex === -1) {
          return res.status(404).json({ message: 'Product variant not found in the cart' });
        }
        userCart.product.splice(existingProductIndex, 1);
        await userCart.save();
        res.status(200).json({ message: 'Successfully deleted from cart', cart: userCart });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };

const showCart= async(req,res)=>{
  try {
    const {userId}=req.body;
    const cart=await Cart.findById({user:userId});
    res.status(200).json({message:"success",cart});
  } catch (error) {
    res.status(500).json({message:"internal server issue"});
  }
}

const editProfile=async(req,res)=>{
  try {
    const {username,phone,userId}=req.body;
    const user=await User.findByIdAndUpdate({userId},{
      username,
      phone,
      image:req.file.filename
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error"});
  }
}

module.exports = { addToCart };


module.exports={
  registerUser,verifyOTP,sendMail,loginUser,resetPassword,forgetPassword,resendOTP,
  listProducts,productDetails,
  showCart,addToCart,deleteFromCart,
  showAddresses,showOrders,showUser,
  addAddress,editAddress,deleteAddress,editProfile
};

