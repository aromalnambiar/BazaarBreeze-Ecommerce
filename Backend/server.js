const express=require('express');
const app=express();
const http = require('http');
const morgan=require('morgan');
const cors=require('cors');
require('dotenv').config();
const socketIo=require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
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

app.set('socketIO', io);

app.use(morgan('combined'));

io.on('connection', (socket) => {
    console.log('A user connected'); 
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

const port = process.env.PORT||4000;
// app.listen(port,()=>console.log(`listening on port ${port}`));
server.listen(port, () => console.log(`listening on port ${port}`));