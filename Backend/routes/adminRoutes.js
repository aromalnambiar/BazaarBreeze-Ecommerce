const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const { authenticateJWT,isAdmin} = require('../middlewares/authMiddleware.js');
const auth=require('../controllers/adminController/authController.js');
const category=require('../controllers/adminController/categoryController.js');
const order=require('../controllers/adminController/orderController.js');
const product=require('../controllers/adminController/productController.js');
const user=require('../controllers/adminController/userController.js');
const coupon=require('../controllers/adminController/couponController.js');
const offer=require('../controllers/adminController/offerController.js');
const sales=require('../controllers/adminController/salesController.js');
const sample=require('../controllers/adminController/sample.js');



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/login', auth.login);

// Products
router.get('/products',authenticateJWT,isAdmin, product.viewProducts);
router.get('/products/:productId', authenticateJWT,isAdmin,product.viewProduct);
router.post('/products', authenticateJWT,isAdmin,product.addProduct);
router.put('/products', authenticateJWT,isAdmin,product.addProduct);
router.get('/products/variant/:productId', authenticateJWT,isAdmin,product.viewProductVariant);
router.post('/products/variant',authenticateJWT,isAdmin, upload.array('photos', 12), product.addProductVariant);
router.put('/products/:productId',authenticateJWT,isAdmin, product.editProduct);
router.put('/products/variant/:variantId',authenticateJWT,isAdmin, upload.array('photos'), product.editProductVariant);
router.patch('/products/:productId',authenticateJWT,isAdmin, product.deleteProduct);

// Categories
router.get('/categories',authenticateJWT,isAdmin, category.viewCategories);
router.post('/categories',authenticateJWT,isAdmin, upload.single('image'), category.addCategory);
router.put('/categories/:categoryId',authenticateJWT,isAdmin, upload.single('image'), category.editCategory);
router.get('/categories/:categoryId',authenticateJWT,isAdmin, category.viewCategory);
router.delete('/categories/:categoryId',authenticateJWT,isAdmin, category.deleteCategory);

// Orders
router.get('/orders',authenticateJWT,isAdmin, order.viewOrders);
router.patch('/orders/status',authenticateJWT,isAdmin, order.changeOrderStatus);
router.get('/orders/bestselling-products', order.getBestSellingProducts);
router.get('/orders/bestselling-categories', order.getBestSellingCategories);
router.get('/orders/bestselling-brands',authenticateJWT,isAdmin, order.getBestSellingBrands);

// Users
router.get('/users',authenticateJWT,isAdmin, user.viewUsers);
router.put('/users/:userId',authenticateJWT,isAdmin, user.blockUser);
// router.delete('/users/:user-id');
// router.put('/users/:user-id/disable');
// router.get('/users/search');
// router.get('/users/users/:user-id');

// Coupons
router.get('/coupon',authenticateJWT,isAdmin,coupon.getAllCoupons);
router.post('/coupon',authenticateJWT,isAdmin,coupon.createCoupon);
router.post('/coupon/:couponId',authenticateJWT,isAdmin,coupon.createCoupon);
router.get('/coupon/:couponId',authenticateJWT,isAdmin,coupon.getCouponById);
router.put('/coupon/:couponId',authenticateJWT,isAdmin,coupon.updateCouponById);
router.delete('/coupon/:couponId',authenticateJWT,isAdmin,coupon.deleteCouponById);

// Offers
router.get('/offer',authenticateJWT,isAdmin,offer.getAllOffers);
router.post('/offer',authenticateJWT,isAdmin,offer.createOffer);
router.get('/offer/:offerId',authenticateJWT,isAdmin,offer.getOfferById);
router.put('/offer/:offerId',authenticateJWT,isAdmin,offer.updateOfferById);
router.delete('/offer/:offerId',authenticateJWT,isAdmin,offer.deleteOfferById);

//sales
router.get('/sales',authenticateJWT,isAdmin,sales.generateSalesReport);
router.get('/salesReport',sales.getSalesReport);
router.get('/salesCount',authenticateJWT,isAdmin,sales.getOverallSalesCount);
router.get('/orderAmount',authenticateJWT,isAdmin,sales.getOverallOrderAmount);
router.get('/overallSalesCountAndAmount',sales.getOverallSalesCountAndAmount);

router.post('/salesCSV',authenticateJWT,isAdmin,sample.exportCSV);
router.post('/salesExcel',authenticateJWT,isAdmin,sample.exportExcel);
router.get('/salesPDF',authenticateJWT,isAdmin,sample.exportPDF);

// router.get('/orders');
// router.put('/orders/:order-id');
// router.delete('/orders/:order-id');
// router.get('/orders/:order-id');
// router.put('/orders/:order-id/status');
// router.put('/orders/:order-id/return');
// router.put('/orders/orders/return');



module.exports=router;