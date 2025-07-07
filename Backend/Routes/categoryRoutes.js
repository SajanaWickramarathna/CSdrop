const express = require('express');
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const CategoryController = require('../Controllers/category'); 

router.get('/', CategoryController.getAllCategories);
router.get('/category/:id', CategoryController.getCategoryById); 
router.post('/addcategory', upload.single("category_image"), CategoryController.addCategory); 
router.put('/updatecategory/:id', upload.single("category_image"), CategoryController.updateCategory);
router.delete('/deletecategory/:id', CategoryController.deleteCategory); 
router.get('/with-brand-count', CategoryController.getAllCategoriesWithBrandCount);

module.exports = router;