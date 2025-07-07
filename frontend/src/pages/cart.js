import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from '../components/navigation';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [user_id, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);  
  const [products, setProducts] = useState([]);

  // Fetch user data
  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setToken(null);
          window.location.href = "/logout";
        } else {
          setError("API Error: " + (error.response?.status || "Unknown"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch cart and product details
  useEffect(() => {
    if (!userData) return;

    const fetchCartAndProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/cart/getcart/${userData.user_id}`);
        const cartData = response.data;

        const productPromises = cartData.items.map(async (item) => {
          try {
            const res = await axios.get(`http://localhost:3001/api/products/product?id=${item.product_id}`);
            return { ...item, product: res.data };
          } catch (err) {
            console.warn(`Product with ID ${item.product_id} not found or deleted.`);
            return null;
          }
        });

        const productsWithDetails = await Promise.all(productPromises);
        const validProducts = productsWithDetails.filter(p => p !== null);
        const validProductIds = validProducts.map(p => p.product_id);

        // Filter out invalid items from cart
        const updatedCartItems = cartData.items.filter(item =>
          validProductIds.includes(item.product_id)
        );

        setCart({ ...cartData, items: updatedCartItems });
        setProducts(validProducts);
        setUserId(userData.user_id);
      } catch (err) {
        console.error('Error fetching cart or products:', err);
        setError('Error fetching cart');
      }
    };

    fetchCartAndProducts();
  }, [userData]);

  // Recalculate total price
  useEffect(() => {
    if (!cart || !userData) return;

    const total = cart.items.reduce((acc, item) => {
      const product = products.find(p => p.product_id === item.product_id)?.product;
      return acc + (product?.product_price || 0) * item.quantity;
    }, 0);

    setTotalPrice(total);

    axios.put('http://localhost:3001/api/cart/updatetotalprice', {
      user_id: userData.user_id,
      total_price: total
    })
      .then(response => setCart(response.data))
      .catch(err => console.error('Error updating total price:', err));
  }, [cart, products, userData]);

  // Cart actions
  const handleRemoveFromCart = (product_id) => {
    axios.delete('http://localhost:3001/api/cart/removefromcart', {
      data: { user_id, product_id }
    })
      .then(response => {
        setCart(response.data);
      })
      .catch(() => {
        setError('Error removing from cart');
      });
  };

  const handleClearCart = () => {
    axios.delete(`http://localhost:3001/api/cart/clearcart/${userData.user_id}`)
      .then(() => {
        setCart(null);
        setTimeout(() => {
          window.location.href = '/shop';
        }, 1000);
      })
      .catch(() => {
        setError('Error clearing cart');
      });
  };

  const handleUpdateQuantity = (user_id, product_id, quantity) => {
    if (quantity < 1) return;
    axios.put('http://localhost:3001/api/cart/updatecartitem', {
      user_id, product_id, quantity
    })
      .then(response => {
        setCart(response.data);
      })
      .catch(() => {
        setError('Error updating cart item');
      });
  };

  // Render logic
  if (!token) {
    return (
      <div>
        <Nav/>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 py-32">
          <p className="text-center text-gray-500 text-lg font-semibold mb-6">
            Please log in to view your cart
          </p>
          <Link to="/signin" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-lg shadow-md hover:shadow-xl transition-all duration-200 ease-in-out">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="text-center text-gray-600">Loading user data...</div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <Nav/>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 py=32">
          <p className="text-center text-gray-500 text-lg font-semibold mb-6">
            Your cart is empty
          </p>
          <Link to="/shop" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-lg shadow-md hover:shadow-xl transition-all duration-200 ease-in-out">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav/>
      <div className="p-12 bg-gray-50 min-h-screen flex flex-col space-y-4 py-32">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Your Cart</h2>
        <div className="space-y-6">
          {cart.items.map(item => {
            const product = products.find(p => p.product_id === item.product_id)?.product;
            if (!product) return null;

            return (
              <div key={item.product_id} className="flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out">
                <img
                  src={`http://localhost:3001${product.product_image}`}
                  alt={product.product_name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{product.product_name}</h3>
                  <p className="text-lg text-gray-600">LKR {product.product_price}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-200"
                      onClick={() => handleUpdateQuantity(user_id, item.product_id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-200"
                      onClick={() => handleUpdateQuantity(user_id, item.product_id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="ml-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                  onClick={() => handleRemoveFromCart(item.product_id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-auto flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-900">Total: LKR {totalPrice}</h3>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </div>
        <div className="mt-8 space-y-4">
          <Link to="/checkout" className="block px-6 py-3 bg-custom-gradient text-white rounded-lg text-lg text-center shadow-md hover:shadow-xl transition-all duration-200">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="block px-6 py-3 bg-gray-500 text-white rounded-lg text-lg text-center shadow-md hover:shadow-xl transition-all duration-200">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
