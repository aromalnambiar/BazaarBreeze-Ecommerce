const jwt=require('jsonwebtoken');
const Admin=require('../../models/Admin.js');

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordValid=(password==admin.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ adminId: admin._id ,role:'admin'}, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
      console.log("token : ",token);
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  module.exports={
    login
  }