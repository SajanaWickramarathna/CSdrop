const express = require('express');
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const ProductController = require('../Controllers/product'); 

// Get all products
router.get('/', ProductController.getAllProducts);

// Get product by ID
router.get('/product/:id', ProductController.getProductById);

// Add product
router.post('/addproduct', upload.single("product_image"), ProductController.addProduct);

// Update product
router.put('/updateproduct/:id', upload.single("product_image"), ProductController.updateProduct);

// Delete product
router.delete('/deleteproduct/:id', ProductController.deleteProduct);

// Get all products with brand/category names
router.get('/with-names', ProductController.getAllProductsWithNames);

// NEW: Get products by category
router.get('/category/:categoryId', ProductController.getProductsByCategory);

module.exports = router;