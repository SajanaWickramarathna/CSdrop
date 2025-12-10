const express = require('express');
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../Controllers/admin'); // Make sure the path is correct

// Define your routes
router.get('/admins', adminController.getAdmin); 
router.get('/admin',adminController.getAdminById);
router.post('/signup', upload.single("profile_image"), adminController.addAdmin);
router.put('/updateadmin', upload.single("profile_image"), adminController.updateAdmin);
router.put('/updatepassword', adminController.updatePassword);

// Export the router instance
module.exports = router;
