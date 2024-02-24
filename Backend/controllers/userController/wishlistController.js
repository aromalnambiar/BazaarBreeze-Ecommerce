const Wishlist = require('../../models/Wishlist');
const Cart = require('../../models/Cart');
const ProductVariant = require('../../models/ProductVariant');

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
  
// const getAllWishlistItems = async (req, res) => {
//   const { userId } = req.user;

//   try {
//     const wishlist = await Wishlist.findOne({ userId }).populate('items.productVariant');

//     if (!wishlist) {
//       return res.status(404).json({ message: 'Wishlist not found' });
//     }

//     const wishlistItems = wishlist.items.map(item => ({
//       productVariant: item.productVariant,
//       addedAt: item.addedAt,
//     }));

//     res.status(200).json({ wishlistItems });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
const getAllWishlistItems = async (req, res) => {
  const { userId } = req.user;

  try {
    // Check if the user has any items in the cart
    const cartItems = await Cart.findOne({ user: userId }, { product: 1 });
    console.log("cartItems : ",cartItems);
    // Fetch wishlist items
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productVariant');
    
    // console.log("wishlists : ",wishlist);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const wishlistItems = wishlist.items.map(item => {
    console.log("WishlistItem : ",item.productVariant.productId);

      const isInCart = cartItems?.product.some(cartItem =>{
        // console.log("cartItem : ",cartItem);
        // console.log("first : ",item.productVariant.productId);
       return cartItem.productVariantId.equals(item.productVariant)
      }
      );
      console.log("isincart : ",isInCart);

      return {
        productVariant: item.productVariant,
        addedAt: item.addedAt,
        isInCart: isInCart || false,
      };
    });

    res.status(200).json({ wishlistItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const getAllWishlistItems = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const wishlistItems = await Wishlist.findOne({ userId });
    
//     console.log("wishlistItems : ",wishlistItems.items);
//     if (!wishlistItems) {
//       return res.status(404).json({ message: 'Wishlist not found' });
//     }

//     const cartItems = await Cart.findOne({ user: userId });
//     console.log("cartItems : ",cartItems.product)
//     const cartMap = new Map();
//     cartItems.product.forEach(item => cartMap.set(String(item.productVariant), true));

//     const response = await Promise.all(wishlistItems.items.map(async (item) => {
//       const isCartFound = cartMap.has(String(item.productVariant));
//       const productVariant = await ProductVariant.findById(item.productVariant); // Assuming ProductVariant is your model
//       return {
//         productVariant,
//         addedAt: item.addedAt,
//         isCartFound,
//       };
//     }));
//     console.log("response : ",response);
//     res.status(200).json(response);

//   } catch (error) {
//     console.error('Error in getAllWishlistItems:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllWishlistItems
};
