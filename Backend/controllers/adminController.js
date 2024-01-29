const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const Products=require('../models/Products');
const ProductVariant=require('../models/ProductVariant');
const Category=require('../models/Category');
const Users=require('../models/User.js');
const { findByIdAndDelete } = require('../models/User');


const viewProducts=async(req,res)=>{
    try {
        const products=await Products.find();
        res.status(200).json({message:"Success",products});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const viewProduct=async(req,res)=>{
    try {
        const {productId}=req.body;
        const product=await Products.find();

    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const addProduct=async(req,res)=>{
    try {
        const details=req.body;
        const {brand,name,category,description}=req.body;
        console.log("details : ",details);
        console.log("details : ");
        const product=new Products({
            brand,
            name,
            category,
            description,
            updatedDate:null,
            createdDate:Date.now(),
            
        })
        let productId=await product.save();
        productId=productId._id;
        console.log("product Id : ",productId);
        res.status(201).json({message:"success",productId});
        // console.log(images);
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const addProductVariant=async(req,res)=>{
    try {
        const {productId,stock,regularprice,color,specialprice,variantName}=req.body;
        let {specification}=req.body;
        const files=req.files;

        const images=files.map(item=>{
            return item.filename;
        });

        specification=specification.map(item=>item);

        const productvariant=new ProductVariant({
            productId,
            stock,
            color,
            regularprice,
            specialprice,
            variantName,
            images,
            specification
        });
        await productvariant.save();
        res.status(201).json({message:"Success",productvariant});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const editProduct=async(req,res)=>{
    try {
        console.log("editProduct working");
        const productId  = req.params.productid; // Assuming the productId is in the request params
        console.log(productId);
        const { brand, name, category, description } = req.body;
    
        // Assuming Products is the model for the Product collection
        const updatedProduct = await Products.findByIdAndUpdate(
          productId,
          {
            brand,
            name,
            category,
            description,
            updatedDate: Date.now(),
          },
          { new: true } // This option returns the modified document instead of the original
        );
    
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const editProductVariant=async(req,res)=>{
    try {
        const variantId=req.params.variantid;
        const { stock, regularprice, color, specialprice, variantName } = req.body;
        let { specification } = req.body;
        const files = req.files;
    
        const images = files.map((item) => {
          return item.filename;
        });
    
        specification = specification.map((item) => item);
    
        // Assuming ProductVariant is the model for the ProductVariant collection
        const updatedProductVariant = await ProductVariant.findByIdAndUpdate(
          variantId,
          {
            stock,
            color,
            regularprice,
            specialprice,
            variantName,
            images,
            specification,
          },
          { new: true } // This option returns the modified document instead of the original
        );
    
        if (!updatedProductVariant) {
          return res.status(404).json({ message: 'Product variant not found' });
        }
    
        res.status(200).json({ message: 'Product variant updated successfully', updatedProductVariant });
      } catch (error) {
        console.error(error);
         res.status(500).json({ error: 'Internal Server Error' });
      }
}

const deleteProduct=async(req,res)=>{
    try {
        const productId=req.params.productid;
        const product=await Products.findByIdAndDelete(productId);
        console.log(product);
        const productVariant=await ProductVariant.deleteMany({productId:productId});
        console.log(productVariant);
        res.status(200).json({message:"delete success"});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const addCategory=async(req,res)=>{
    try {
        const {name,description}=req.body;
        console.log(req.body);
        const category=new Category({
            name,
            description,
            createdDate:Date.now(),
            updatedDate:null
        });
        await category.save();
        res.status(201).json({message:"Succes, category added"});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const editCategory=async(req,res)=>{
    try {
        console.log("body : ",res.body);
        const {name,description}=req.body;
        console.log(req.params);
        const { categoryId } = req.params;
        const categoryIdObjectId =new mongoose.Types.ObjectId(categoryId);
        const newCategory=await Category.findByIdAndUpdate({_id:categoryIdObjectId},{
            name,
            description
        })
        console.log(newCategory);
        res.status(201).json({message:"Updated successfully",category:newCategory});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const deleteCategory=async(req,res)=>{
    try {
        console.log("Delete category : ");
        console.log(req.params);
        const { categoryId } = req.params;
        // console.log(req.body);
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({message:"Deleted successfully"});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const viewCategories=async(req,res)=>{
    try {
        const categories=await Category.find();
        res.status(200).json({message:"success",categories});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}
const viewCategory=async(req,res)=>{
    try {
        console.log(req.params);
        const { categoryId } = req.params;
        const category=await Category.findById(categoryId);
        res.status(200).json({message:"success",category});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const viewUsers=async(req,res)=>{
    try {
        const users=await Users.find();
        console.log(users);
        res.status(200).json({message:"success",users});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

const blockUser=async(req,res)=>{
    try {
        const userId = req.params.userid;
    
        // Find the user by ID
        const user = await Users.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Toggle the isBlocked field
        user.isBlocked = !user.isBlocked;
    
        // Save the updated user
        const updatedUser = await user.save();
    
        res.status(200).json({ message: 'User block status toggled successfully', user: updatedUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
module.exports={
    viewProducts,viewProduct,addProduct,addProductVariant,
    addCategory,editCategory,deleteCategory,viewCategory,
    editProduct,editProductVariant,deleteProduct,viewCategories,
    viewUsers,blockUser};