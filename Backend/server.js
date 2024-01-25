const express=require('express');
const app=express();
const morgan=require('morgan');
const cors=require('cors');
require('dotenv').config();
const mongooseConnection=require('./config/database');
const userRoutes=require('./routes/userRoutes.js')

mongooseConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userRoutes);

const port = process.env.PORT||4000;
app.listen(port,()=>console.log(`listening on port ${port}`));