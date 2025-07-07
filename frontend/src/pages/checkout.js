import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/navigation';

const Checkout = ({ userId, cartTotal }) => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [form, setForm] = useState({ fullName: '', address: '', phone: '' });
  const [formError, setFormError] = useState({});
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

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
          const res = await axios.get(`http://localhost:3001/api/products/product?id=${item.product_id}`);
          return { ...item, product: res.data };
        })
      );

      calculatePrices(productDetails);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setFormError({ general: 'Error fetching cart.' });
    }
  };

  const calculatePrices = (productDetails) => {
    setProducts(productDetails);

    const total = productDetails.reduce((acc, item) => {
      return acc + (item.product?.product_price || 0) * item.quantity;
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

  const handlePromoCodeApply = async () => {
    setPromoError('');
    setPromoSuccess('');
    try {
      const response = await axios.post('http://localhost:3001/api/game/redeem', {id:userData.user_id, promoCode: promoCode });
      if (response.data.discount) {
        const discount = (totalPrice * response.data.discount) / 100;
        setDiscountedPrice(discount);
        setPromoSuccess('Promo code applied successfully!');
      } else {
        setPromoError(response.data.message || 'Invalid promo code.');
      }
    } catch (err) {
      console.error('Error validating promo code:', err);
      setPromoError('Failed to validate promo code.');
    }
  };

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
      errors.phone = 'Phone number must be numeric, start with optional +, and be 9–13 characters.';
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
      formData.append('total_price', discountedPrice !== 0 ? totalPrice - discountedPrice : totalPrice);
      formData.append('payment_method', paymentMethod);
      

      if (paymentMethod === 'Payment Slip') {
        formData.append('payment_slip', paymentSlip);
      }

      cart.items.forEach((item, index) => {
        formData.append(`items[${index}][product_id]`, item.product_id);
        formData.append(`items[${index}][quantity]`, item.quantity);
        formData.append(`items[${index}][price]`, item.product?.product_price || 0);
      });

      await axios.post('http://localhost:3001/api/orders/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.post('http://localhost:3001/api/game/add', {id: userData.user_id, totalPrice: totalPrice});

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error placing order:', err);
      setFormError({ general: 'Order failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading user data...</div>;

  if (!token) {
    return (
      <div>
        <Nav/>
        <div className="flex flex-col items-center py-32">
          <p className="text-center text-gray-500 text-lg font-semibold mt-4">
            Please log in to checkout
          </p>
          <Link
            to="/signin"
            className="mt-6 px-8 py-3 bg-custom-gradient text-white rounded-lg text-center"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (!cart) return <div>Loading cart...</div>;
  if (!cart.items || cart.items.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div>
      <Nav/>
      <div className="max-w-3xl mx-auto p-4 mt-6 py-32">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        {/* Shipping Information */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Shipping Information</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          {formError.fullName && <p className="text-red-500 text-sm">{formError.fullName}</p>}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          {formError.address && <p className="text-red-500 text-sm">{formError.address}</p>}
          <input
            type="text"
            name="phone"
            placeholder="+947XXXXXXXX"
            value={form.phone}
            onChange={handleChange}
            maxLength={12}
            className="w-full border p-2 mb-2 rounded"
          />
          {formError.phone && <p className="text-red-500 text-sm">{formError.phone}</p>}
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Promo Code</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full border p-2 rounded mr-2"
            />
            <button
              onClick={handlePromoCodeApply}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
          {promoSuccess && <p className="text-green-500 text-sm mt-2">{promoSuccess}</p>}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
          <div className="flex justify-between mb-1">
            <span>Product ({cart.items.length})</span>
            <span>LKR {totalPrice.toLocaleString()}</span>
          </div>
          {discountedPrice != 0 && (
            <div className="flex justify-between mb-1 text-green-600">
              <span>Discount Applied</span>
              <span>- LKR {(totalPrice - discountedPrice).toLocaleString()}</span>
            </div>
          )}
          <div className="font-bold text-lg">
            Total: LKR {(totalPrice - discountedPrice).toLocaleString()}
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Payment</h2>
          <label className="block mb-2">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={handlePaymentMethodChange}
              className="mr-2"
            />
            Cash on Delivery (COD)
          </label>
          <label className="block">
            <input
              type="radio"
              value="Payment Slip"
              checked={paymentMethod === 'Payment Slip'}
              onChange={handlePaymentMethodChange}
              className="mr-2"
            />
            Payment Slip
          </label>

          {paymentMethod === 'Payment Slip' && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePaymentSlipUpload}
                className="border p-2 rounded w-full"
              />
              {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
              {paymentSlip && (
                <p className="mt-2 text-green-600">Uploaded: {paymentSlip.name}</p>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded mb-3 hover:bg-green-600"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>

        <button
          onClick={() => window.history.back()}
          className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800"
        >
          Back to Cart
        </button>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
              <h2 className="text-xl font-semibold text-green-600 mb-2">Order Placed!</h2>
              <p className="mb-4">Your order has been placed successfully.</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;