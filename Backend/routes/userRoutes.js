const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const user = require("../controllers/userController/userController.js");
const auth = require("../controllers/userController/authController.js");
const cart = require("../controllers/userController/cartController.js");
const order = require("../controllers/userController/orderController.js");
const product = require("../controllers/userController/productController.js");
const category = require("../controllers/userController/categoryController.js");
const wishlist = require("../controllers/userController/wishlistController.js");
const payment = require("../controllers/userController/paymentController.js");
const coupon = require("../controllers/userController/couponController.js");
const wallet = require("../controllers/userController/walletController.js");
const offer = require("../controllers/userController/offerController.js");
const invoice = require("../controllers/userController/invoiceController.js");
const banner = require("../controllers/userController/bannerController.js");

const { authenticateJWT } = require("../middlewares/authMiddleware.js");
const nonAuthMiddleware = require("../middlewares/nonAuthMiddleware.js");
const checkUserBlockStatus = require("../middlewares/checkUserBlockStatus.js");

const { uploadSingle, uploadArray } = require("../middlewares/imageUpload.js");

// authentication
router.post("/registration", auth.registerUser);
router.post("/verify-otp", auth.verifyOTP);
router.post("/login", auth.loginUser);
router.post("/forget-password", auth.forgetPassword);
router.post("/reset-password", auth.resetPassword);
router.post("/resend-otp", auth.resendOTP);

// products
router.get("/products", nonAuthMiddleware, product.listProducts);
router.get("/products/filter", product.filterProducts);
router.get("/products/variants", product.productVariants);
router.get("/products/search", product.searchProducts);
router.get(
  "/products/:categoryName",
  nonAuthMiddleware,
  product.listProductsByCategory
);
router.get(
  "/products/variants/:id",
  authenticateJWT,
  product.getProductVariantDetails
);
router.get(
  "/products/:productid/product",
  nonAuthMiddleware,
  product.productDetails
);
router.get(
  "/products/:categoryId/product",
  authenticateJWT,
  product.productDetails
);

// user
router.get("/", authenticateJWT, checkUserBlockStatus, user.showUser);
router.put(
  "/profile",
  authenticateJWT,
  uploadSingle("image"),
  user.editProfile
);

// address
router.get("/address", authenticateJWT, user.showAddresses);
router.post("/address", authenticateJWT, user.addAddress);
router.put("/address", authenticateJWT, user.editAddress);
router.delete("/address/:id", authenticateJWT, user.deleteAddress);

// cart
router.post("/cart", authenticateJWT, checkUserBlockStatus, cart.addToCart);
router.delete(
  "/cart",
  authenticateJWT,
  checkUserBlockStatus,
  cart.deleteFromCart
);
router.get("/cart", authenticateJWT, checkUserBlockStatus, cart.showCart);
router.delete(
  "/cart/clear",
  authenticateJWT,
  checkUserBlockStatus,
  cart.clearCart
);

// wishlist
router.get(
  "/wishlist",
  authenticateJWT,
  checkUserBlockStatus,
  wishlist.getAllWishlistItems
);
router.post(
  "/wishlist",
  authenticateJWT,
  checkUserBlockStatus,
  wishlist.addToWishlist
);
router.put(
  "/wishlist",
  authenticateJWT,
  checkUserBlockStatus,
  wishlist.removeFromWishlist
);

// orders
router.get("/orders", authenticateJWT, order.showOrders);
router.get("/orders/:orderId", authenticateJWT, order.showOrder);
router.post("/order/add", authenticateJWT, order.addOrder);
router.patch("/order/status", order.changeOrderStatus);
router.patch("/order/paymentstatus", order.changePaymentStatus);

//payment
router.post("/orders/razorpay", payment.placeOrder);
router.post("/orders/razorpay/verify", payment.verifyOrder);
router.post("/orders/razorpay/paymentcapture", payment.paymentCapture);
router.post("/orders/razorpay/refund", payment.paymentCapture);

// coupons
router.post("/coupon", coupon.applyCoupon);
router.get("/coupon", coupon.getAllValidCoupons);

//wallet
router.get("/wallet", authenticateJWT, wallet.getWalletHistory);

// categories
router.get("/categories", category.viewCategories);

//offers
router.get("/offers", offer.getAllOffers);
router.get("/offers/:productId", offer.getProductDetailsWithOffer);

// invoice
router.get("/generateinvoice", invoice.generateInvoice);

// banner
router.get("/banner", banner.viewBanners);
// router.get('/banners',banner.viewBanners)

module.exports = router;
