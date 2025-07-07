const Cart = require('../Models/Cart');
const Product = require('../Models/product');

// Add item to cart
exports.addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    try {
        const product = await Product.findOne({ product_id });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user_id });
        if (!cart) cart = new Cart({ user_id, items: [] });

        const existingItem = cart.items.find(item => item.product_id.toString() === product_id.toString());
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product_id, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cart by user ID
exports.getCart = async (req, res) => {
    const { user_id } = req.params;
    try {
        let cart = await Cart.findOne({ user_id });
        if (!cart) {
            cart = new Cart({ user_id, items: [], total_price: 0 });
            await cart.save();
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.product_id.toString() === product_id.toString());
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update total price
exports.updateTotalPrice = async (req, res) => {
    const { user_id, total_price } = req.body;
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.total_price = total_price;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item
exports.removeFromCart = async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product_id.toString() !== product_id.toString());
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    const user_id = req.params.id;
    try {
        await Cart.findOneAndDelete({ user_id });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cart count (sum of quantities) for user
exports.getCartCount = async (req, res) => {
  const user_id = req.user.id; // get from auth middleware token payload
  try {
    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.status(200).json({ count: 0 });

    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
