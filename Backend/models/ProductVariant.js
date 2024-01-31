const mongoose=require('mongoose');

const ProductVariant=new mongoose.Schema({
    productId:{type: mongoose.Schema.Types.ObjectId},
    stock:{type:Number},
    regularPrice:{type:Number},
    color:{type:String},
    variantName:{type:String},
    salePrice:{type:String},
    regularPrice:{type:String},
    images:{type:Array},
    specification:{type:Array}
})

const productVariantModel=mongoose.model("ProductVariant",ProductVariant);

module.exports=productVariantModel;