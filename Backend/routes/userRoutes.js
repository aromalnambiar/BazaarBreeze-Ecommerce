const router=require('express').Router();
const userController=require('../controllers/userController.js');
const multer=require('multer');
const {authenticateJWT} = require('../middlewares/authMiddleware.js');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/registration',userController.registerUser);
router.post('/verify-otp',userController.verifyOTP);
router.post('/login',userController.loginUser);
router.post('/forget-password',userController.forgetPassword);
router.post('/reset-password',userController.resetPassword);
router.post('/resend-otp',userController.resendOTP);
router.get('/products',userController.listProducts);
router.get('/products/:productid',userController.productDetails);

router.get('/',userController.showUser);
router.get('/address',userController.showAddresses);
router.post('/address',userController.addAddress);
router.put('/address',userController.editAddress);
router.delete('/address',userController.deleteAddress);
router.get('/orders',userController.showOrders);

router.put('/profile',upload.single('image'),userController.editProfile)

module.exports=router;


// ctrl+k , ctrl+0,ctrl+1 
// ctrl+j 