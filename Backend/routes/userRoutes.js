const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const user=require('../controllers/userController/userController.js')
const auth=require('../controllers/userController/authController.js')
const cart=require('../controllers/userController/cartController.js')
const order=require('../controllers/userController/orderController.js')
const product=require('../controllers/userController/productController.js')
const category=require('../controllers/userController/categoryController.js')
const wishlist=require('../controllers/userController/wishlistController.js')
const payment=require('../controllers/userController/paymentController.js')
const coupon=require('../controllers/userController/couponController.js');
const wallet=require('../controllers/userController/walletController.js');
const offer=require('../controllers/userController/offerController.js');

const {authenticateJWT} = require('../middlewares/authMiddleware.js');
const checkUserBlockStatus = require('../middlewares/checkUserBlockStatus.js');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
  });
  
const upload = multer({ storage: storage });

// authentication
router.post('/registration',auth.registerUser);
router.post('/verify-otp',auth.verifyOTP);
router.post('/login',auth.loginUser);
router.post('/forget-password',auth.forgetPassword);
router.post('/reset-password',auth.resetPassword);
router.post('/resend-otp',auth.resendOTP);

// products
router.get('/products',product.listProducts);
router.get('/products/variants',product.productVariants)
router.get('/products/:productid/product',authenticateJWT,product.productDetails);
router.get('/products/:categoryId/product',authenticateJWT,product.productDetails);
router.get('/products/search',product.searchProducts);
router.get('/products/filter',product.filterProducts);

// user
router.get('/',authenticateJWT,checkUserBlockStatus,user.showUser);
router.put('/profile',authenticateJWT,upload.single('image'),user.editProfile)

// address
router.get('/address',authenticateJWT,user.showAddresses);
router.post('/address',authenticateJWT,user.addAddress);
router.put('/address',authenticateJWT,user.editAddress);
router.delete('/address/:id',authenticateJWT,user.deleteAddress);

// cart
router.post('/cart',authenticateJWT,checkUserBlockStatus,cart.addToCart);
router.delete('/cart',authenticateJWT,checkUserBlockStatus,cart.deleteFromCart);
router.get('/cart',authenticateJWT,checkUserBlockStatus,cart.showCart);
router.delete('/cart/clear',authenticateJWT,checkUserBlockStatus,cart.clearCart);

// wishlist
router.get('/wishlist',authenticateJWT,checkUserBlockStatus,wishlist.getAllWishlistItems);
router.post('/wishlist',authenticateJWT,checkUserBlockStatus,wishlist.addToWishlist);
router.put('/wishlist',authenticateJWT,checkUserBlockStatus,wishlist.removeFromWishlist);

// orders
router.get('/orders',authenticateJWT,order.showOrders);
router.get('/orders/:orderId',authenticateJWT,order.showOrder);
router.post('/order/add',authenticateJWT,order.addOrder);
router.patch('/order/status',authenticateJWT,order.changeOrderStatus);
router.post('/orders/razorpay',payment.placeOrder);
router.post('/orders/razorpay/verify',payment.verifyOrder);

// coupons
router.post('/coupon',coupon.applyCoupon);
router.get('/coupon',coupon.getAllValidCoupons);

//wallet
router.get('/wallet',authenticateJWT,wallet.getWalletHistory)

// categories
router.get('/categories', category.viewCategories);

//offers
router.get('/offers', offer.getAllOffers);


module.exports=router;
