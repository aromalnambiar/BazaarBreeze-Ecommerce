const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    email:{type:String,required:true},
    username:{type:String,required:true},
    createdDate:{type:Date},
    image:{type:String},
    password:{type:String,required:true},
    updatedDate:{type:Date},
    isBlocked:{type:Boolean,default:false},
    gender:{type:String},
    age:{type:Number},
    wallet: {
        balance: {
          type: Number,
          default: 0,
        },
        transactions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
          },
        ],
      }
})

const userModel=mongoose.model("User",UserSchema);
module.exports=userModel;