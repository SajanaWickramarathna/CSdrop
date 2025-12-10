// userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../Controllers/user'); 
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);

router.get("/user", userController.getUserById);

router.post('/signin', userController.login); 

router.get('/me', authMiddleware(['admin', 'customer', 'inventory_manager', 'customer_supporter', 'deliver']), userController.authentication);

router.get("/verify/:token", userController.verifyemail);

router.put("/updateuser",upload.single('profile_image'), userController.updateUser);

router.post('/forgotpassword', userController.forgotPassword);

router.post('/reset-password/:token', userController.resetPassword);

router.delete("/deleteuser", userController.deleteUser)


router.get('/admin-dashboard', authMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard' });
  });
  
  router.get('/customer-dashboard', authMiddleware(['customer']), (req, res) => {
    res.json({ message: 'Welcome to Customer Dashboard' });
  });
    
  router.get('/support-dashboard', authMiddleware(['customer_supporter']), (req, res) => {
    res.json({ message: 'Welcome to Customer Support Dashboard' });
  });

  router.get('/inventory-dashboard', authMiddleware(['inventory_manager']), (req, res) => {
    res.json({ message: 'Welcome to Inventory Dashboard' });
  });

module.exports = router;
