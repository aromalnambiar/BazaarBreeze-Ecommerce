const mongoose=require('mongoose');

const AddressModel=new mongoose.Schema({
    fullName:{type:String},
    companyName:{type:String},
    address:{type:String},
    state:{type:String},
    street:{type:String},
    phone1:{type:Number},
    phone2:{type:Number},
    pincode:{type:Number},
    landmark:{type:String},
    userId:{type:mongoose.Types.ObjectId}
})

const Address=mongoose.model("Address",AddressModel);

module.exports=Address;