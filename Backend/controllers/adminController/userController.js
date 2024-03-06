const Users=require('../../models/User.js');
const Wallet=require('../../models/Wallet.js');
const Wishlist=require('../../models/Wishlist.js');
const Cart=require('../../models/Cart.js');

const viewUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalUsers = await Users.countDocuments();
    const users = await Users.find().skip(startIndex).limit(limit);

    res.status(200).json({ message: "success", users, totalUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const viewUser=async (req, res) => {
  try {
    const {userId} = req.params; 

    const userDetails = await Users.findById(userId, { password: 0 });

    const walletDetails = await Wallet.findOne({ user: userId });

    const wishlistItemsCount = await Wishlist.findOne({ userId }).select('items').countDocuments();

    const cartItemsCount = await Cart.findOne({ user: userId }).select('product').countDocuments();

    res.status(200).json({
      userDetails,
      walletDetails,
      wishlistItemsCount,
      cartItemsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
    blockUser,
    viewUser
    }