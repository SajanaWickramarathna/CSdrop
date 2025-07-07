const express = require('express');
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require('../middleware/authMiddleware');
const supporterController = require('../Controllers/customerSupporter'); // Make sure the path is correct

// Define your routes
router.get('/supporters', supporterController.getCustomerSupporter); 
router.get('/supporter',supporterController.getCustomerSupporterById);
router.post('/signup', upload.single("profile_image"), supporterController.addCustomerSupporter);
router.put('/updatesupporter', upload.single("profile_image"), supporterController.updateCustomerSupporter);
router.put('/updatepassword', supporterController.updatePassword);

// Export the router instance
module.exports = router;
