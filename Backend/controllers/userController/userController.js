const User=require('../../models/User');
const Address=require('../../models/Address');

const showAddresses = async (req, res) => {
    try {
      // const { id } = req.params;
      const {userId}=req.user;
      const addresses = await Address.find({ userId });
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

  const showUser=async(req,res)=>{
    try {
      const {userId}=req.user ;
      console.log("user id : ",userId);
      const user=await User.findById({_id:userId});
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
      const { username, age, gender } = req.body;
      const {userId}=req.user;
      console.log("user  : ", req.body);
  
      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
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
      const {fullName,address,state,street,phone1,pincode}=req.body;
      const {userId}=req.user;
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
      const {fullName,address,state,street,phone1,pincode}=req.body;
      const {userId}=req.user;
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
  
  const deleteAddress = async (req, res) => {
    try {
      const { id: addressId } = req.params;
      const {userId} = req.user;
      const isOwner = await Address.exists({ _id: addressId, userId: userId });
      if (!isOwner) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this address' });
      }
      const result = await Address.findByIdAndDelete(addressId);
      console.log(result);
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server issue" });
    }
  };

  module.exports={
    showAddresses,
    showUser,
    editProfile,
    addAddress,
    editAddress,
    deleteAddress
  }