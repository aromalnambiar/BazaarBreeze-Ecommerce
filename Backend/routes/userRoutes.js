const router=require('express').Router();
const userController=require('../controllers/userController.js');
const {authenticateJWT} = require('../middlewares/authMiddleware.js');


router.post('/registration',userController.registerUser);
router.post('/verify-otp',userController.verifyOTP);
router.post('/login',userController.loginUser);
router.post('/forget-password',userController.forgetPassword);
router.post('/reset-password',userController.resetPassword);
router.post('/resend-otp',userController.resendOTP);
router.get('/products',userController.listProducts);
router.get('/products/:productid',userController.productDetails);

module.exports=router;