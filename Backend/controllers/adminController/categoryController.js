const mongoose=require('mongoose');
const Category=require('../../models/Category.js');



const addCategory=async(req,res)=>{
    try {
        const {name,description}=req.body;
        // console.log("body : ",req.body);
        const categoryExist=await Category.findOne({name});
        // console.log(categoryExist);
        if(categoryExist){
            return res.status(400).json({message:"Category already exist"});
        }
        const category=new Category({
            name,
            description,
            createdDate:Date.now(),
            updatedDate:null,
            image:req.file.filename

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
        const {name,description,isListed}=req.body;
        console.log(req.params);
        const { categoryId } = req.params;
        const categoryIdObjectId =new mongoose.Types.ObjectId(categoryId);
        const newCategory=await Category.findByIdAndUpdate({_id:categoryIdObjectId},{
            name,
            description,
            image:req.file.filename,
            isListed:isListed||true,
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
        // console.log("View categories");
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

module.exports={
    addCategory,
    editCategory,
    deleteCategory,
    viewCategories,
    viewCategory
}