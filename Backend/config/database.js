const mongoose=require('mongoose');

const connectDatabase=async()=>{
    try {
        await mongoose.connect(`${process.env.DB_URL}`)
        .then(()=>console.log("DB successfully connected"));
      } catch (error) {
        console.log("Error connecting Your database : ",error);
      }
}

module.exports=connectDatabase;