const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const user=require('../controllers/userController/userController.js')
const auth=require('../controllers/userController/authController.js')
const cart=require('../controllers/userController/cartController.js')
const order=require('../controllers/userController/orderController.js')
const product=require('../controllers/userController/productController.js')
const category=require('../controllers/userController/categoryController.js')

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

router.post('/registration',auth.registerUser);
router.post('/verify-otp',auth.verifyOTP);
router.post('/login',auth.loginUser);
router.post('/forget-password',auth.forgetPassword);
router.post('/reset-password',auth.resetPassword);
router.post('/resend-otp',auth.resendOTP);

router.get('/products',product.listProducts);
router.get('/products/variants',product.productVariants)
router.get('/products/:productid/product',authenticateJWT,product.productDetails);

router.get('/',authenticateJWT,user.showUser);
router.put('/profile',authenticateJWT,upload.single('image'),user.editProfile)

router.get('/address',authenticateJWT,user.showAddresses);
router.post('/address',authenticateJWT,user.addAddress);
router.put('/address',authenticateJWT,user.editAddress);
router.delete('/address/:id',authenticateJWT,user.deleteAddress);

router.post('/cart',authenticateJWT,cart.addToCart);
router.delete('/cart',authenticateJWT,cart.deleteFromCart);
router.get('/cart',authenticateJWT,cart.showCart);

router.get('/orders',authenticateJWT,order.showOrders);
router.get('/orders/:orderId',authenticateJWT,order.showOrder);
router.post('/order/add',authenticateJWT,order.addOrder);
router.patch('/order/status',authenticateJWT,order.changeOrderStatus);
 
router.get('/categories', category.viewCategories);

module.exports=router;


// ctrl+k , ctrl+0,ctrl+1 
// ctrl+j 