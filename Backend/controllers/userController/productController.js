const mongoose=require('mongoose');
const Products=require('../../models/Products');
const ProductVariant=require('../../models/ProductVariant');
const Cart =require('../../models/Cart');
const Wishlist =require('../../models/Wishlist');
const Category=require('../../models/Category');


const listProducts = async (req, res) => {
    try {
      console.log("List products : ");
      // const products=[];
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
  
      console.log(products);
      res.status(200).json({ message: 'success', products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const productDetails = async (req, res) => {
    try {
      const productId = new mongoose.Types.ObjectId(req.params.productid);
  
      const { userId } = req.user;
  
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
      let isCartFound = false;
      let isWishlistFound = false;
  
      if (result.length > 0) {
        const product = result[0];
        const firstVariant = product.productDetails[0];
        console.log("first Variant : ",firstVariant);
        product.productDetails = firstVariant;
        
        if (userId) {
          // Check if the product variant exists in the cart
          const cart = await Cart.findOne({ user: userId });
          isCartFound = cart && cart.product.some(item => item.productVariantId.equals(firstVariant._id));
          
          // Check if the product variant exists in the wishlist
          const wishlist = await Wishlist.findOne({ userId });
          console.log("Wishlist : ",wishlist);
          isWishlistFound = wishlist && wishlist.items.some(item => item.productVariant.equals(firstVariant._id));
          console.log("isWishlistFound : ",isWishlistFound);
        }
  
        res.status(200).json({
          message: 'success',
          productDetails: product,
          isCartFound,
          isWishlistFound,
          category: category.name,
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const productVariants = async (req, res) => {
    try {
      let variantIds = req.query.variantIds;
      console.log("query : ",req.query);
      if (!variantIds) {
        return res.status(400).json({ error: 'Missing variantIds parameter' });
      }
  
      // Convert variantIds to an array if it is a string
      variantIds = variantIds.split(',');
      console.log("variantIds : ",variantIds);
  
      // Convert variant IDs to mongoose ObjectIds
      const variantObjectIds = variantIds.map((id) =>new mongoose.Types.ObjectId(id));
      console.log("variantObjectIds : ",variantObjectIds);
      const variants = await ProductVariant.aggregate([
        {
          $match: {
            _id: { $in: variantObjectIds },
          },
        },
      ]);
      console.log("variants : ",variants);
      if (variants.length > 0) {
        res.status(200).json({ message: 'success', variants });
      } else {
        res.status(404).json({ message: 'Product variants not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const listCategoryProducts=async(req,res)=>{
    try {
      
    } catch (error) {
      console.log(error);
    }
  }


  module.exports={
    listProducts,
    productDetails,
    productVariants,
    listCategoryProducts
  }