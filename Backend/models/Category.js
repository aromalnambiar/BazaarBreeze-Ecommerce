const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    name:{type:String},
    createdDate:{type:Date},
    description:{type:String},
    image:{type:String},
    updatedDate:{type:Date},
    isListed:{type:Boolean,required:true}
})

const categoryModel=mongoose.model("Category",categorySchema);
module.exports=categoryModel;