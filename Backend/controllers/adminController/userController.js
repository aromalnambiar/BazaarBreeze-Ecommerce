const Users=require('../../models/User.js');

const viewUsers=async(req,res)=>{
    try {
        const users=await Users.find();
        // console.log(users);
        res.status(200).json({message:"success",users});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const blockUser=async(req,res)=>{
    try {
        const {userId} = req.params;
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.isBlocked = !user.isBlocked;
        const updatedUser = await user.save();
        res.status(200).json({ message: 'Success', user: updatedUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}



module.exports={
    viewUsers,
    blockUser
    }