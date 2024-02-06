const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    quantity:{type:Number},
    orderedItems: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], required: true },
    paymentStatus:{type:String,default:'pending'},
    deliveryDate:{type:Date},
    offers:{ type: [{ type: mongoose.Schema.Types.ObjectId }] },
    payment:{type:mongoose.Types.ObjectId, required: true },
    shippingAddress:{ 
        street: { type: String, required: true },
        phone1:{type:Number,required:true},
        state: { type: String },
        pincode: { type: String, required: true },
    },
    shippingDate:{type:Date},
    coupons:{ type: [{ type: mongoose.Schema.Types.ObjectId }] },
    totalAmount: { type: Number, required: true },
    userId:{type:mongoose.Types.ObjectId,required:true},
    orderStatus:{type:String,default: 'Pending' }
})

const orderModel=mongoose.model("Order",OrderSchema);
module.exports=orderModel;