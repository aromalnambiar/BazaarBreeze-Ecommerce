const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{type:String},
    updatedDate:{type:Date},
    createdDate:{type:Date},
    description:{type:String},
    category:{type: String},
    brand:{type:String}
})

const productModel=mongoose.model("Product",productSchema);
module.exports=productModel;