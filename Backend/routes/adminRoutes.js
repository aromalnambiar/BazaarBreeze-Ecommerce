const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const { authenticateJWT} = require('../middlewares/authMiddleware.js');
const auth=require('../controllers/adminController/authController.js');
const category=require('../controllers/adminController/categoryController.js');
const order=require('../controllers/adminController/orderController.js');
const product=require('../controllers/adminController/productController.js');
const user=require('../controllers/adminController/userController.js');


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
router.get('/products', product.viewProducts);
router.get('/products/:productId', product.viewProduct);
router.post('/products', product.addProduct);
router.get('/products/variant/:productId', product.viewProductVariant);
router.post('/products/variant', upload.array('photos', 12), product.addProductVariant);
router.put('/products/:productId', product.editProduct);
router.put('/products/variant/:variantId', upload.array('photos'), product.editProductVariant);
router.delete('/products/:productId', product.deleteProduct);

// Categories
router.get('/categories', category.viewCategories);
router.post('/categories', upload.single('image'), category.addCategory);
router.put('/categories/:categoryId', upload.single('image'), category.editCategory);
router.get('/categories/:categoryId', category.viewCategory);
router.delete('/categories/:categoryId', category.deleteCategory);

// Orders
router.get('/orders', order.viewOrders);
router.patch('/orders/status', order.changeOrderStatus);

// Users
router.get('/users', user.viewUsers);
router.put('/users/:userId', user.blockUser);
// router.delete('/users/:user-id');
// router.put('/users/:user-id/disable');
// router.get('/users/search');
// router.get('/users/users/:user-id');

// router.get('/orders');
// router.put('/orders/:order-id');
// router.delete('/orders/:order-id');
// router.get('/orders/:order-id');
// router.put('/orders/:order-id/status');
// router.put('/orders/:order-id/return');
// router.put('/orders/orders/return');



module.exports=router;