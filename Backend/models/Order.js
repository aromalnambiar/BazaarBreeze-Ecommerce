const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    quantity:{type:Number},
    orderedItems:{type:Array},
    paymentStatus:{type:String},
    deliveryDate:{type:Date},
    offers:{type:Array},
    payment:{type:mongoose.Types.ObjectId},
    shippingAddress:{type:Object},
    shippingDate:{type:Date},
    coupons:{type:Array},
    totalAmount:{type:Number},
    userId:{type:mongoose.Types.ObjectId},
    orderStatus:{type:String}
})

const orderModel=mongoose.model("Order",OrderSchema);
module.exports=orderModel;