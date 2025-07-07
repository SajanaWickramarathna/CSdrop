const express = require('express');
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const BrandController = require('../Controllers/brand'); 

// Get all brands
router.get('/', BrandController.getAllBrands);

// Get brand by ID
router.get('/brand/:id', BrandController.getBrandById);

// Get brands by category ID
router.get('/bycategory/:categoryId', BrandController.getBrandsByCategory);

// Add brand
router.post('/addbrand', upload.single("brand_image"), BrandController.addBrand);

// Update brand
router.put('/updatebrand/:id', upload.single("brand_image"), BrandController.updateBrand);

// Delete brand
router.delete('/deletebrand/:id', BrandController.deleteBrand);

// Get brand by ID
router.get('/:id', BrandController.getBrandById);

router.get('/with-product-count', BrandController.getAllBrandsWithProductCount);

module.exports = router;