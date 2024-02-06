const mongoose=require('mongoose');

const AddressModel=new mongoose.Schema({
    fullName:{type:String,required:true},
    companyName:{type:String},
    address:{type:String,required:true},
    state:{type:String,required:true},
    street:{type:String,required:true},
    phone1:{type:Number,required:true},
    phone2:{type:Number},
    pincode:{type:Number,required:true},
    landmark:{type:String},
    userId:{type:mongoose.Types.ObjectId}
})

const Address=mongoose.model("Address",AddressModel);

module.exports=Address;