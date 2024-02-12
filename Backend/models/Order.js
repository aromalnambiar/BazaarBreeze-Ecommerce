const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    orderedItems: { 
        type: [
            { 
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product', 
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price:{
                    type:Number,
                    required:true,
                }
            }
        ], 
        required: true 
    },
    deliveryDate:{type:Date,default:null},
    offers:{ 
        type: [
            { 
                type: mongoose.Schema.Types.ObjectId 
            }
        ] 
    },
    payment:{type:mongoose.Types.ObjectId },
    paymentStatus:{
        type:String,
        enum:['Pending','Processing','Completed','Failed','Refunded'],
        default:'Pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash On Delivery'],
      },
    shippingAddress:{ 
        street: { type: String, required: true },
        phone1:{type:Number,required:true},
        phone2:{type:Number},
        state: { type: String,required:true },
        pincode: { type: String, required: true },
        address:{type:String},
        fullName:{type:String,required:true}
    }, 
    orderDate: {
        type: Date,
        default: Date.now,
      },
    coupons:{ type: [{ type: mongoose.Schema.Types.ObjectId }] },
    totalAmount: { type: Number, required: true },
    orderStatus:{
        type:String,
        default: 'Pending',
        enum:['Pending','Processing','Shipped','Delivered','Cancelled','Returned'] 
    }
})

const orderModel=mongoose.model("Order",OrderSchema);
module.exports=orderModel;