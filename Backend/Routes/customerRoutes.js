// userRoutes.js
const express = require('express');
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require('../middleware/authMiddleware');
const customerController = require('../Controllers/customer'); // Make sure the path is correct

// Define your routes
router.get('/users', customerController.getCustomers); 
router.get('/user',customerController.getCustomerById);
router.post('/signup', upload.single("profile_image"), customerController.addCustomer);
router.put('/updatecustomer', upload.single("profile_image"), customerController.updateCustomer);
router.put('/updatepassword', customerController.updatePassword);

router.get('/customer' ,customerController.getCustomerNameById);

router.delete('/delete', customerController.deleteCustomer);

// Export the router instance
module.exports = router;
