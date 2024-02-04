const router=require('express').Router();
const adminController=require('../controllers/adminController.js');
const multer=require('multer');
const path=require('path');
const { authenticateJWT, isAdmin } = require('../middlewares/authMiddleware.js');


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/login', adminController.login);

router.get('/products',adminController.viewProducts);
router.get('/products/product',adminController.viewProduct);
router.post('/products',adminController.addProduct);
router.post('/products/variant',upload.array('photos',12),adminController.addProductVariant);
router.put('/products/:productid',adminController.editProduct);
router.put('/products/:variantid/variant',upload.array('photos'),adminController.editProductVariant);
router.delete('/products/:productid',adminController.deleteProduct); 

router.get('/products/category',adminController.viewCategories);
router.post('/products/category',upload.single('image'),adminController.addCategory);
router.put('/products/category/:categoryId',upload.single('image'),adminController.editCategory);
router.get('/products/category/:categoryId',adminController.viewCategory);
router.delete('/products/category/:categoryId', adminController.deleteCategory);

router.get('/users',adminController.viewUsers); 
router.put('/users/:userid',adminController.blockUser);
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