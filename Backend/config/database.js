const mongoose=require('mongoose');

const connectDatabase=async()=>{
    try {
        await mongoose.connect(`${process.env.DB_URL}`)
        .then(()=>console.log("DB successfully connected"));
      } catch (error) {
        handleError(error);
      }
}

module.exports=connectDatabase;