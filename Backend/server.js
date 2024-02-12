const express=require('express');
const app=express();
const morgan=require('morgan');
const cors=require('cors');
require('dotenv').config();
const mongooseConnection=require('./config/database');
const userRoutes=require('./routes/userRoutes.js')
const adminRoutes=require('./routes/adminRoutes.js')

mongooseConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/uploads', express.static('uploads'));

app.use('/user',userRoutes);
app.use('/admin',adminRoutes);


// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


const port = process.env.PORT||4000;
// app.listen(port,()=>console.log(`listening on port ${port}`));
app.listen(port, () => console.log(`listening on port ${port}`));