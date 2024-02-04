const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    name:{type:String},
    createdDate:{type:Date},
    description:{type:String},
    image:{type:String},
    updatedDate:{type:Date}
})

const categoryModel=mongoose.model("Category",categorySchema);
module.exports=categoryModel;