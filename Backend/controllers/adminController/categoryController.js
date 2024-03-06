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

const editCategory = async (req, res) => {
    try {
        const { name, description, isListed } = req.body;
        const { categoryId } = req.params;

        const categoryIdObjectId = new mongoose.Types.ObjectId(categoryId);

        const existingCategory = await Category.findById(categoryIdObjectId);

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const image = req.file ? req.file.filename : existingCategory.image;

        const updatedData = {
            name: name || existingCategory.name,
            description: description || existingCategory.description,
            isListed: isListed || existingCategory.isListed,
            image,
        };

        const newCategory = await Category.findByIdAndUpdate({ _id: categoryIdObjectId }, updatedData, { new: true });

        res.status(201).json({ message: 'Updated successfully', category: newCategory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const viewCategories = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const totalCategories = await Category.countDocuments();
      const categories = await Category.find().skip(startIndex).limit(limit);
  
      res.status(200).json({ message: "success", categories, totalCategories });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

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
    viewCategories,
    viewCategory
}