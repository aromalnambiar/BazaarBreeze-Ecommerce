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
const Payment=require('../models/Payment');

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

const productDetails = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productid);

    const userId = req.query.userId;

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

    const category = await Category.findById(result[0].category);

    if (result.length > 0) {
      const product = result[0];
      const firstVariant = product.productDetails[0];
      product.productDetails = firstVariant;

      // Find the cart for the user
      const cart = await Cart.findOne({ user: userId });

      // Check if the product variant exists in the cart
      const isCartFound = cart && cart.product.some(item => item.productVariantId.equals(firstVariant._id));

      console.log("cart : ", cart);
      console.log(product);

      res.status(200).json({ message: 'success', productDetails: product, isCartFound, category: category.name });
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
    const { id } = req.params;
    const addresses = await Address.find({ userId: id });
    // console.log("address length : ",addresses);

    if (!addresses || addresses.length === 0) {
      return res.status(200).json({ message: "No addresses found",addresses });
    }

    res.status(200).json({ message: "Addresses found Successfully", addresses  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const showOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("user id ",userId);
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found" });
    }

    res.status(200).json({ message: "Success", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const showUser=async(req,res)=>{
  try {
    const {userid}=req.params;
    // console.log("user id : ",req.params);
    const user=await User.findById({_id:userid});
    // console.log("user : ",user);
    if(!user){
      return res.status(200).json({message:"User is not found"});
    }
    res.status(200).json({message:"success",user})
  } catch (error) {
    res.status(500).json({message:"Server error"});
  }
}

const editProfile = async (req, res) => {
  try {
    console.log("editProfile");
    const { userid, username, age, gender } = req.body;
    console.log("user  : ", req.body);

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userid },
      { 
        username,
        age,
        gender,
        image:req.file.filename||null 
      },
      { new: true } 
    );
      console.log("updated user : ",updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


const addAddress=async(req,res)=>{
  try {
    const {fullName,address,state,street,phone1,pincode,userId}=req.body;
    const {phone2}=req.body;
    const result=new Address({
      fullName,
      address,
      state,
      street,
      phone1,
      pincode,
      userId,
      phone2,
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
    const {phone2,addressId}=req.body;
      const updatedAddress=await Address.findByIdAndUpdate({_id:addressId},{
        fullName,
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
    const {id:addressId}=req.params;
    const result=await Address.findByIdAndDelete({_id:addressId});
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

    console.log("pv : ",productVariantId);
    console.log("quantity : ",quantity);
    console.log("userId : ",userId);

    const productVariant = await ProductVariant.findById(productVariantId );

    if (!productVariant) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    if (quantity > productVariant.stock) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

     const maxQuantityPerPerson = 5; // Set your maximum quantity per person
    const userCart = await Cart.findOne({ user:userId });
    // console.log("userCart : ",userCart);

    if (userCart) {
      const existingProductIndex = userCart.product.findIndex((item) => item.productVariantId.equals(productVariantId));
      console.log("existing : ",existingProductIndex);
      if (existingProductIndex !== -1) {
        const totalQuantity = userCart.product[existingProductIndex].quantity + quantity;

        if (totalQuantity > maxQuantityPerPerson) {
          return res.status(400).json({ message: `Maximum ${maxQuantityPerPerson} quantity allowed per person` });
        } 

        userCart.product[existingProductIndex].quantity += quantity || 1;
        userCart.product[existingProductIndex].totalPrice =
          userCart.product[existingProductIndex].quantity * productVariant.salePrice;
      } else {
        userCart.product.push({
          productVariantId,
          quantity: quantity || 1,
          price: productVariant.salePrice,
          totalPrice: quantity ? quantity * productVariant.salePrice : productVariant.salePrice,
        });
      }
      await userCart.save();
      res.status(200).json({ message: 'Successfully added to cart', cart: userCart });

    } else {
      const newUserCart = new Cart({ user:userId });
      console.log("newUserCart : ",newUserCart);
      newUserCart.product.push({
        productVariantId,
        quantity: quantity || 1,
        price: productVariant.salePrice,
        totalPrice: quantity ? quantity * productVariant.salePrice : productVariant.salePrice,
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
        const { userId, productVariantId } = req.query;
        console.log("userId , productVariantId ",req.query);
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
    const userId=req.params.id;
    // console.log("userId : ",userId);
    // const cart=await Cart.findOne({user:userId});
    // const cart = await Cart.findOne({ user: userId })
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'product.productVariantId',
      model: 'ProductVariant',
      select: 'variantName salePrice images',
    });
    // console.log("cart : ",cart);
    res.status(200).json({message:"success",cart});
  } catch (error) {
    res.status(500).json({message:"internal server issue"});
  }
}

const addOrder = async (req, res) => {
  try {
    console.log("Inside addOrder1");
    const {
      orderedItems,
      paymentStatus,
      deliveryDate,
      offers,
      payment,
      shippingAddress,
      shippingDate,
      coupons,
      totalAmount,
      userId,
      orderStatus,
    } = req.body;

    console.log("Inside addOrder2");
    console.log("Body : ",req.body);

    const newOrder = new Order({
      orderedItems,
      paymentStatus: paymentStatus || 'pending',
      deliveryDate,
      offers,
      payment,
      shippingAddress,
      shippingDate,
      coupons,
      totalAmount,
      userId,
      orderStatus: orderStatus || 'Pending',
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order added successfully', order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports={
  registerUser,verifyOTP,sendMail,loginUser,resetPassword,forgetPassword,resendOTP,
  listProducts,productDetails,
  showCart,addToCart,deleteFromCart,
  showAddresses,showOrders,showUser,
  addAddress,editAddress,deleteAddress,editProfile,addOrder
};

