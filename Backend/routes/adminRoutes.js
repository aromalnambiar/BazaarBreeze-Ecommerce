const router=require('express').Router();
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
const banner=require('../controllers/adminController/bannerController.js');
const {uploadSingle,uploadArray}=require('../middlewares/imageUpload.js');

router.post('/login', auth.login);

// Products
router.get('/products',authenticateJWT,isAdmin, product.viewProducts);
router.get('/products/:productId', authenticateJWT,isAdmin,product.viewProduct);
router.post('/products', authenticateJWT,isAdmin,product.addProduct);
router.put('/products', authenticateJWT,isAdmin,product.addProduct);
router.get('/products/variant/:productId', authenticateJWT,isAdmin,product.viewProductVariant);
router.post('/products/variant',authenticateJWT,isAdmin, uploadArray('product'), product.addProductVariant);
router.put('/products/:productId',authenticateJWT,isAdmin, product.editProduct);
router.put('/products/variant/:variantId', uploadArray('product'), product.editProductVariant);
router.patch('/products/:productId',authenticateJWT,isAdmin, product.deleteProduct);

// Categories
router.get('/categories',authenticateJWT,isAdmin, category.viewCategories);
router.post('/categories',authenticateJWT,isAdmin, uploadSingle('category'), category.addCategory);
router.put('/categories/:categoryId',authenticateJWT,isAdmin, uploadSingle('category'), category.editCategory);
router.get('/categories/:categoryId',authenticateJWT,isAdmin, category.viewCategory);

// Orders
router.get('/orders', order.viewOrders);
router.patch('/orders/status', order.changeOrderStatus);
router.get('/orders/bestselling-products', order.getBestSellingProducts);
router.get('/orders/bestselling-categories', order.getBestSellingCategories);
router.get('/orders/bestselling-brands', order.getBestSellingBrands);
router.get('/orders/monthlysales', order.getMonthlySales);
// router.get('/orders/monthlysalesarray', order.getMonthlySalesArray);
router.get('/orders/yearlysales', order.getYearlySales);
router.get('/orders/:orderId', order.getOrderDetails);

// Users
router.get('/users',authenticateJWT,isAdmin, user.viewUsers);
router.put('/users/:userId',authenticateJWT,isAdmin, user.blockUser);
router.get('/users/:userId', user.viewUser);

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
router.put('/offer/:Id/status',offer.updateOfferStatus);
router.delete('/offer/:offerId',authenticateJWT,isAdmin,offer.deleteOfferById);
// router.get('/offer/:productId/highest',offer.getProductDetailsWithOffer);

//sales
router.get('/sales',authenticateJWT,isAdmin,sales.generateSalesReport);
router.get('/salesReport',sales.getSalesReport);
router.get('/salesCount',authenticateJWT,isAdmin,sales.getOverallSalesCount);
router.get('/orderAmount',authenticateJWT,isAdmin,sales.getOverallOrderAmount);
router.get('/overallSalesCountAndAmount',sales.getOverallSalesCountAndAmount);
router.post('/salesCSV',sample.exportCSV);
router.post('/salesExcel',sample.exportExcel);
router.get('/salesPDF',sample.exportPDF);

//banners
router.get('/banner',banner.viewBanners)
router.get('/banner/:bannerId',banner.getBanner)
router.post('/banner',uploadSingle("banner"),banner.addBanner)
router.put('/banner/:bannerId' ,banner.editBanner)




module.exports=router;