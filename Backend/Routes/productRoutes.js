const express = require('express');
const router = express.Router();

const upload = require("../middleware/uploadMiddleware"); // Now using .fields()
const ProductController = require('../Controllers/product'); 

// ✅ Multer: Support up to 4 image fields
const productImageUpload = upload.fields([
  { name: "product_image_1", maxCount: 1 },
  { name: "product_image_2", maxCount: 1 },
  { name: "product_image_3", maxCount: 1 },
  { name: "product_image_4", maxCount: 1 },
]);

// Get all products
router.get('/', ProductController.getAllProducts);

// Get product by ID
router.get('/product/:id', ProductController.getProductById);

// ✅ Add product (multi-image)
router.post('/addproduct', productImageUpload, ProductController.addProduct);

// ✅ Update product (multi-image)
router.put('/updateproduct/:id', productImageUpload, ProductController.updateProduct);

// Delete product
router.delete('/deleteproduct/:id', ProductController.deleteProduct);

// Get all products with brand/category names
router.get('/with-names', ProductController.getAllProductsWithNames);

// Get products by category
router.get('/category/:categoryId', ProductController.getProductsByCategory);

module.exports = router;
