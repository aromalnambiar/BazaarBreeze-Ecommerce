const Wishlist = require('../../models/Wishlist');

const addToWishlist = async (req, res) => {
  const {  productVariant } = req.body;
  const {userId}=req.user;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [],
      });
    }

    const existingItem = wishlist.items.find(item => item.productVariant.equals(productVariant));

    if (existingItem) {
      return res.status(400).json({ message: 'Item already exists in the wishlist' });
    }

    wishlist.items.push({ productVariant });
    await wishlist.save();

    res.status(201).json({ message: 'Item added to the wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const removeFromWishlist = async (req, res) => {
    const { productVariant } = req.body;
    const { userId } = req.user;
  
    try {
      let wishlist = await Wishlist.findOne({ userId });
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      const updatedItems = wishlist.items.filter(item => !item.productVariant.equals(productVariant));
  
      if (updatedItems.length === wishlist.items.length) {
        return res.status(404).json({ message: 'Item not found in the wishlist' });
      }
  
      wishlist.items = updatedItems;
      await wishlist.save();
  
      res.status(200).json({ message: 'Item removed from the wishlist successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getWishlist = async (req, res) => {
    const { userId } = req.user;
  
    try {
      const wishlist = await Wishlist.findOne({ userId }).populate('items.productVariant');
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      res.status(200).json({ wishlist });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  
const getAllWishlistItems = async (req, res) => {
  const { userId } = req.user;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productVariant');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const wishlistItems = wishlist.items.map(item => ({
      productVariant: item.productVariant,
      addedAt: item.addedAt,
    }));

    res.status(200).json({ wishlistItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllWishlistItems
};
