const mongoose=require('mongoose');
const Products=require('../../models/Products');
const ProductVariant=require('../../models/ProductVariant');
const Cart =require('../../models/Cart');
const Wishlist =require('../../models/Wishlist');
const Category=require('../../models/Category');


// const listProducts = async (req, res) => {
//   try {
//     const { categoryName, page = 1, pageSize = 15 } = req.params;
//     const skip = (page - 1) * pageSize;

//     if (!categoryName) {
//       return res.status(400).json({ error: 'Category name is required' });
//     }

//     const products = await Products.aggregate([
//       {
//         $match: {
//           category: mongoose.Types.ObjectId(categoryName),
//         },
//       },
//       {
//         $lookup: {
//           from: 'productvariants',
//           localField: '_id',
//           foreignField: 'productId',
//           as: 'variants',
//         },
//       },
//       {
//         $addFields: {
//           firstVariant: { $arrayElemAt: ['$variants', 0] },
//         },
//       },
//       {
//         $project: {
//           productId: '$_id',
//           productVariantId: '$firstVariant._id',
//           description: 1,
//           salePrice: '$firstVariant.salePrice',
//           // Include more fields as needed
//           firstImage: { $arrayElemAt: ['$firstVariant.images', 0] },
//         },
//       },
//       {
//         $skip: skip,
//       },
//       {
//         $limit: parseInt(pageSize),
//       },
//     ]);

//     res.status(200).json({ message: 'success', products });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
const listProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 15 } = req.params;
    const { userId } = req.user; 

    const skip = (page - 1) * parseInt(pageSize);

    const wishlistItems = await Wishlist.findOne({ userId })
      .select('items.productVariant')
      .lean();

    const wishlistProductVariantIds = wishlistItems
      ? wishlistItems.items.map(item =>new mongoose.Types.ObjectId(item.productVariant))
      : [];

    // console.log("wishlistProductVariantIds : ", wishlistProductVariantIds);

    const products = await Products.aggregate([
      {
        $sample: { size: parseInt(pageSize) },
      },
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
          _id: 0,
          name: 1,
          brand: 1,
          description: 1,
          salePrice: '$firstVariant.salePrice',
          productId: '$_id',
          productVariantId: '$firstVariant._id',
          image: { $arrayElemAt: ['$firstVariant.images', 0] },
          isWishlist: { $in: ['$firstVariant._id', wishlistProductVariantIds] },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(pageSize),
      },
    ]);

    // console.log("products : ", products);

    res.status(200).json({ message: 'success', products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const listProductsByCategory = async (req, res) => {
  try {
    const { categoryName, page = 1, pageSize = 15 } = req.params;
    const skip = (page - 1) * pageSize;

    if (!categoryName) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Fetch category by name to get its _id
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { userId } = req.user; 

    const wishlistItems = await Wishlist.findOne({ userId })
      .select('items.productVariant')
      .lean();

    const wishlistProductVariantIds = wishlistItems
      ? wishlistItems.items.map(item => new mongoose.Types.ObjectId(item.productVariant))
      : [];

    const products = await Products.aggregate([
      {
        $match: {
          category: category._id,
        },
      },
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
          _id: 0,
          name: 1,
          brand: 1,
          description: 1,
          salePrice: '$firstVariant.salePrice',
          productId: '$_id',
          productVariantId: '$firstVariant._id',
          image: { $arrayElemAt: ['$firstVariant.images', 0] },
          isWishlist: { $in: ['$firstVariant._id', wishlistProductVariantIds] },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(pageSize),
      },
    ]);

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
      // console.log("result : ",result[0].productDetails.map(item=>item._id));
      // const variantIds = product.productDetails.map(variant => variant._id);
      // console.log("variantIds : ",variantIds);
      const variantIds=result[0].productDetails.map(item=>item._id);
  
      if (result.length > 0) {
        const product = result[0];
        const firstVariant = product.productDetails[0];
        // console.log("first Variant : ",firstVariant);
        product.productDetails = firstVariant;
        
        if (userId) {
          // Check if the product variant exists in the cart
          const cart = await Cart.findOne({ user: userId });
          isCartFound = cart && cart.product.some(item => item.productVariantId.equals(firstVariant._id));
          
          // Check if the product variant exists in the wishlist
          const wishlist = await Wishlist.findOne({ userId });
          // console.log("Wishlist : ",wishlist);
          isWishlistFound = wishlist && wishlist.items.some(item => item.productVariant.equals(firstVariant._id));
          // console.log("isWishlistFound : ",isWishlistFound);
        }
  
        res.status(200).json({
          message: 'success',
          productDetails: product,
          isCartFound,
          variantIds,
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
      // console.log("query : ",req.query);
      if (!variantIds) {
        return res.status(400).json({ error: 'Missing variantIds parameter' });
      }
  
      // Convert variantIds to an array if it is a string
      variantIds = variantIds.split(',');
      // console.log("variantIds : ",variantIds);
  
      // Convert variant IDs to mongoose ObjectIds
      const variantObjectIds = variantIds.map((id) =>new mongoose.Types.ObjectId(id));
      // console.log("variantObjectIds : ",variantObjectIds);
      const variants = await ProductVariant.aggregate([
        {
          $match: {
            _id: { $in: variantObjectIds },
          },
        },
      ]);
      // console.log("variants : ",variants);
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

  const getProductVariantDetails = async (req, res) => {
    try {
      const productVariantId = new mongoose.Types.ObjectId(req.params.id);
      const { userId } = req.user;
      console.log("USER ID : ",userId);
      // Fetch product variant details
      const productVariant = await ProductVariant.findById(productVariantId);
  
      if (!productVariant) {
        return res.status(404).json({ message: 'Product variant not found' });
      }
  
      // Check if the product variant exists in the user's wishlist
      let isWishlistFound = false;
      let isCartFound = false;
      //for checking wishlist found
      if (userId) {
        const wishlist = await Wishlist.findOne({ userId });
        
        if (wishlist) {
          isWishlistFound = wishlist.items.some(item => item.productVariant.equals(productVariantId));
        }
      }
      //for checking cartfound
     if(userId){
      const userCart = await Cart.findOne({ user: userId });

      // Check if the product variant exists in the user's cart
      if (userCart) {
        const cart=await Cart.findOne({user:userId});
        if(cart){
          isCartFound = cart.product.some(item => item.productVariantId.equals(productVariantId));
        }
      }
     }
      console.log("isCartFound : ",isCartFound);
      res.status(200).json({
        message: 'success',
        productVariant,
        isWishlistFound,
        isCartFound
      });
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

  const searchProducts=async (req, res)=> {
    const { query } = req.query;
    console.log("query : ",req.query);
    try {
      const regex = new RegExp(query, 'i');
  
      const products = await Products.find(
        {
          $and: [
            { isDelete: false },
            {
              $or: [
                { name: { $regex: regex } },
                { brand: { $regex: regex } },
              ],
            },
          ],
        },
        { _id: 1, name: 1 }
      );
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  const filterProducts = async (req, res) => {
    try {
      const { category, maxPrice, brand } = req.query;
      console.log("filter products");
      console.log("query : ", req.query);
  
      let filter = {};
  
      if (category) {
        const categoryId = await Category.findOne({ name: category }).select('_id');
        console.log("category Id : ", categoryId);
        if (categoryId) {
          filter.category = categoryId._id;
        }
      }
  
      if (maxPrice) {
        filter['variant.salePrice'] = { $lte: parseInt(maxPrice) };
      }
  
      if (brand) {
        filter['brand'] = brand;
      }
  
      console.log("filter : ", filter);
  
      const result = await Products.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'productvariants',
            localField: '_id',
            foreignField: 'productId',
            as: 'variant',
          },
        },
        {
          $unwind: '$variant',
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            description: { $first: '$description' },
            category: { $first: '$category' },
            brand: { $first: '$brand' },
            createdDate: { $first: '$createdDate' },
            updatedDate: { $first: '$updatedDate' },
            isDelete: { $first: '$isDelete' },
            variants: { $push: '$variant' },
          },
        },
      ]);
  
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  module.exports={
    listProducts,
    productDetails,
    productVariants,
    listCategoryProducts,
    searchProducts,
    filterProducts,
    getProductVariantDetails,
    listProductsByCategory
  }