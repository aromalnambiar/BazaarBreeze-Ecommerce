const Cart =require('../../models/Cart');
const ProductVariant=require('../../models/ProductVariant');

  const addToCart = async (req, res) => {
    try {
      const { productVariantId, quantity } = req.body;
      const {userId}=req.user;
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
        } else {
          userCart.product.push({
            productVariantId,
            quantity: quantity || 1,
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
          const {  productVariantId } = req.query;
          const {userId}=req.user;
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
      const showCart = async (req, res) => {
        try {
          console.log("hello");
          console.log("user:", req.user);
      
          const { userId } = req.user;
          console.log("userId:", userId);
      
          const cart = await Cart.findOne({ user: userId }).populate({
            path: 'product.productVariantId',
            model: 'ProductVariant',
            select: 'variantName salePrice images',
          });
      
          if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
          }
      
          // Check if the cart is empty
          if (!cart.products || cart.products.length === 0) {
            return res.status(200).json({ message: "Cart is empty", cart });
          }
      
          res.status(200).json({ message: "Success", cart });
        } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ message: "Internal server issue" });
        }
      };
      
  const clearCart = async (req, res) => {
    try {
        console.log("clear cart : ");
        const { userId } = req.user;
        await Cart.findOneAndDelete({ user: userId });
        
        res.status(200).json({ message: 'Cart cleared after order' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

  module.exports={
    addToCart,
    deleteFromCart,
    showCart,
    clearCart
  }