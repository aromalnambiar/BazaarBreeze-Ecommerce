const Category=require('../../models/Category');

const viewCategories=async(req,res)=>{
    try {
        const categories=await Category.find();
        
        res.status(200).json({message:"success",categories});
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}


module.exports={
    viewCategories
}