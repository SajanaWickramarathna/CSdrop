import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/navigation';
import Swal from 'sweetalert2';
import { useCart } from "../context/CartContext";

const Checkout = ({ userId, cartTotal }) => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [form, setForm] = useState({ fullName: '', address: '', phone: '' });
  const [formError, setFormError] = useState({});
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  // Helper function to get product image source
  const getProductImageSrc = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/uploads")) return `http://localhost:3001${imgPath}`;
    if (imgPath.startsWith("uploads")) return `http://localhost:3001/${imgPath}`;
    return `http://localhost:3001/uploads/${imgPath}`;
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      handleTokenError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/logout');
    } else {
      setFormError({ general: 'Failed to fetch user data.' });
    }
  };

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/cart/getcart/${userId}`);
      setCart(response.data);

      const productDetails = await Promise.all(
        response.data.items.map(async (item) => {
          try {
            const res = await axios.get(`http://localhost:3001/api/products/product/${item.product_id}`);
            return { ...item, product: res.data };
          } catch (err) {
            console.warn(`Product with ID ${item.product_id} not found`);
            return { ...item, product: null };
          }
        })
      );

      setProducts(productDetails);
      calculatePrices(productDetails);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setFormError({ general: 'Error fetching cart.' });
    }
  };

  const calculatePrices = (productDetails) => {
    const total = productDetails.reduce((acc, item) => {
      return acc + ((item.product?.product_price || 0) * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (userData) {
      setForm({
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        address: userData.address || '',
        phone: userData.phone || '',
      });
      fetchCart(userData.user_id);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (/^\+?\d{0,12}$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaymentError('');
  };

  const handlePaymentSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPaymentSlip(file);
      setPaymentError('');
    } else {
      setPaymentError('Please upload a valid image file (e.g., JPG, PNG).');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.fullName) errors.fullName = 'Full Name is required.';
    if (!form.address) errors.address = 'Address is required.';
    if (!/^\+?\d{9,13}$/.test(form.phone)) {
      errors.phone = 'Phone number must be 9–13 digits and may start with +.';
    }
    if (paymentMethod === 'Payment Slip' && !paymentSlip) {
      errors.paymentSlip = 'Please upload a payment slip.';
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
  if (!validateForm()) return;
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('user_id', userData.user_id);
    formData.append('email', userData.email);
    formData.append('shipping_address', `${form.fullName}, ${form.address}, ${form.phone}`);
    formData.append('total_price', totalPrice);
    formData.append('payment_method', paymentMethod);

    if (paymentMethod === 'Payment Slip') {
      formData.append('payment_slip', paymentSlip);
    }

    products.forEach((item, index) => {
      formData.append(`items[${index}][product_id]`, item.product_id);
      formData.append(`items[${index}][quantity]`, item.quantity);
      formData.append(`items[${index}][price]`, item.product?.product_price || 0);
    });

    const orderResponse = await axios.post('http://localhost:3001/api/orders/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Order creation failed - no response data');
    }

    await axios.delete(`http://localhost:3001/api/cart/clearcart/${userData.user_id}`);
    await fetchCartCount();

    // Show success alert and handle navigation in the then() block
    await Swal.fire({
      title: 'Order Placed Successfully!',
      text: 'Thank you for your purchase. Your order has been confirmed.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continue Shopping',
      timer: 3000, // Auto-close after 3 seconds
      timerProgressBar: true,
    }).then((result) => {
      // This will run when the alert is closed (either by timer or button click)
      navigate('/shop');
    });

    // Remove the separate navigate('/shop') call that was here before

  } catch (err) {
    console.error('Error placing order:', err);
    
    let errorMessage = 'There was an error processing your order. Please try again.';
    if (err.response) {
      errorMessage = err.response.data.message || errorMessage;
    } else if (err.request) {
      errorMessage = 'Network error - please check your connection and try again.';
    } else if (err.message.includes('Order creation failed')) {
      errorMessage = 'Order could not be processed. Please contact support.';
    }

    await Swal.fire({
      title: 'Order Not Processed',
      html: `
        <div>
          <p>${errorMessage}</p>
          <p class="mt-2 text-sm text-gray-500">Order ID: Not assigned</p>
          <p class="text-sm text-gray-500">Status: Failed</p>
        </div>
      `,
      icon: 'error',
      confirmButtonText: 'OK',
      footer: '<a href="/contactform" class="text-blue-500 hover:underline">Contact Support</a>'
    });

    try {
      if (cart && cart.items.length > 0) {
        await axios.post(`http://localhost:3001/api/cart/restore`, {
          user_id: userData.user_id,
          items: cart.items
        });
      }
    } catch (restoreError) {
      console.error('Failed to restore cart:', restoreError);
    }
  } finally {
    setLoading(false);
  }
};

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading user data...</div>;

  if (!token) {
    return (
      <div>
        <Nav />
        <div className="flex flex-col items-center py-32">
          <p className="text-center text-gray-500 text-lg font-semibold mt-4">
            Please log in to checkout
          </p>
          <Link
            to="/signin"
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (!cart) return <div className="flex justify-center items-center h-screen">Loading cart...</div>;
  if (!cart.items || cart.items.length === 0) {
    return (
      <div>
        <Nav />
        <div className="flex flex-col items-center py-32">
          <p className="text-center text-gray-500 text-lg font-semibold">
            Your cart is empty
          </p>
          <Link
            to="/shop"
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="max-w-3xl mx-auto p-4 mt-6 py-12">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-700">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {formError.fullName && <p className="text-red-500 text-sm mt-1">{formError.fullName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {formError.address && <p className="text-red-500 text-sm mt-1">{formError.address}</p>}
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="+947XXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                maxLength={12}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {formError.phone && <p className="text-red-500 text-sm mt-1">{formError.phone}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-700">Order Summary</h2>
          
          <div className="space-y-4 mb-4">
            {products.map((item) => {
              const product = item.product;
              if (!product) return null;
              
              return (
                <div key={item.product_id} className="flex items-center border-b border-gray-100 pb-4">
                  <img
                    src={getProductImageSrc(product.product_image)}
                    alt={product.product_name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{product.product_name}</h3>
                    <div className="flex justify-between mt-1">
                      <div>
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="ml-4 text-gray-600">Price: LKR {product.product_price.toLocaleString()}</span>
                      </div>
                      <span className="font-medium">LKR {(product.product_price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">LKR {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>LKR {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-700">Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={handlePaymentMethodChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="Payment Slip"
                checked={paymentMethod === 'Payment Slip'}
                onChange={handlePaymentMethodChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Payment Slip</span>
            </label>

            {paymentMethod === 'Payment Slip' && (
              <div className="mt-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePaymentSlipUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
                {paymentSlip && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-600 font-medium">Uploaded: {paymentSlip.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Order...
              </span>
            ) : (
              'Place Order'
            )}
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Cart
          </button>
        </div>

        {formError.general && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-red-500">{formError.general}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;