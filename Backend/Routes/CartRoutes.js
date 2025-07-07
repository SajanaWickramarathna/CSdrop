const express = require('express');
const router = express.Router();

const CartController = require('../Controllers/cart');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addtocart',authMiddleware(['customer']), CartController.addToCart);
router.get('/getcart/:user_id', CartController.getCart);
router.put('/updatecartitem', CartController.updateCartItem);
router.put('/updatetotalprice', CartController.updateTotalPrice);
router.delete('/removefromcart', CartController.removeFromCart);
router.delete('/clearcart/:id', CartController.clearCart);


module.exports = router;
