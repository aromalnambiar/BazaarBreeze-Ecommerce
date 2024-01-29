const mongoose=require('mongoose');

const ProductVariant=new mongoose.Schema({
    productId:{type: mongoose.Schema.Types.ObjectId},
    stock:{type:Number},
    regularPrice:{type:Number},
    color:{type:String},
    specificationsId:{type:mongoose.Schema.Types.ObjectId},
    variantName:{type:String},
    salePrice:{type:Number},
    images:{type:Array},
    specification:{type:Array}
})

const productVariantModel=mongoose.model("ProductVariant",ProductVariant);

module.exports=productVariantModel;