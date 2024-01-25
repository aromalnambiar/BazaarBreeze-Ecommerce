const mongoose=require('mongoose');

const connectDatabase=async()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce_electronics')
        .then(()=>console.log("DB successfully connected"));
      } catch (error) {
        handleError(error);
      }
}

module.exports=connectDatabase;