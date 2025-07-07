import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UpdateOrder() {
  const [orderData, setOrderData] = useState({
    order_id: '',
    user_id: '',
    total_price: '',
    status: 'pending',
    items: [],
    payment_slip: '',
  });

  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const orderDataFromLocation = location.state?.orderData;

  useEffect(() => {
    if (orderDataFromLocation) {
      setOrderData({
        order_id: orderDataFromLocation.order_id || '',
        user_id: orderDataFromLocation.user_id || '',
        total_price: orderDataFromLocation.total_price || '',
        status: orderDataFromLocation.status || 'pending',
        items: orderDataFromLocation.items || [],
        payment_slip: orderDataFromLocation.payment_slip || '',
      });
    } else {
      navigate('/orders');
    }
  }, [orderDataFromLocation, navigate]);

  useEffect(() => {
    if (orderData.items.length > 0) {
      const productPromises = orderData.items.map(async (item) => {
        try {
          const productRes = await axios.get(
            `http://localhost:3001/api/products/product?id=${item.product_id}`
          );
          const product = productRes.data;
          return {
            ...item,
            product_name: product.product_name,
            product_price: product.product_price,
            product_image: product.product_image,
          };
        } catch (err) {
          console.error(`Error fetching product ${item.product_id}`, err);
          return {
            ...item,
            product_name: 'Unknown',
            product_price: 0,
          };
        }
      });

      Promise.all(productPromises)
        .then((productsWithDetails) => setProducts(productsWithDetails))
        .catch((err) => {
          console.error('Error fetching product details:', err);
          setErrorMessage('Failed to fetch product details.');
        });
    }
  }, [orderData.items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!orderData.status) {
      setErrorMessage('Please select a status.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/orders/update/${orderData.order_id}`,
        orderData
      );

      if (response.status === 200) {
        setSuccessMessage('Order status updated successfully!');
        setTimeout(() => {
          navigate('/admin-dashboard/orders/orders');
        }, 2000);
      }
    } catch (err) {
      console.error('Axios Error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (!orderDataFromLocation) {
    return <div className="text-center text-gray-500">Redirecting...</div>;
  }

  return (
    <div className="container bg-white rounded-2xl p-6 mt-6 min-h-[75vh]">
      <form
        className="w-full mx-auto bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleUpdateOrder}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Order Status</h2>

        {successMessage && <p className="mb-4 text-green-500 font-medium">{successMessage}</p>}
        {errorMessage && <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>}

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-gray-700 font-medium">Order ID</h4>
            <p className="text-gray-900 font-semibold">{orderData.order_id}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-gray-700 font-medium">User ID</h4>
            <p className="text-gray-900 font-semibold">{orderData.user_id}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-gray-700 font-medium">Total Price</h4>
            <p className="text-gray-900 font-semibold">${orderData.total_price}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Order Status</label>
          <div className="flex flex-wrap gap-4">
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <label key={status} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={orderData.status === status}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="text-gray-700">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Items with Pictures */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Order Items</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div key={item.product_id} className="p-4 bg-gray-100 rounded-lg shadow">
                <img
                  src={`http://localhost:3001${item.product_image}`}
                  alt={item.product_name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="text-gray-800 font-medium">{item.product_name}</h4>
                <p className="text-gray-600">Price: LKR {item.product_price}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {orderData.payment_slip ? (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Payment Details</label>
            <div>
              <p className="text-gray-800">Payment Slip</p>
              <img
                src={`http://localhost:3001/uploads/${orderData.payment_slip}`}
                alt="Payment Slip"
                className="w-80 border border-gray-300 rounded-lg shadow-sm my-2"
              />
              <a
                href={`http://localhost:3001/uploads/${orderData.payment_slip}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-500 underline"
              >
                View full image
              </a>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <p className="text-gray-800">Cash on Delivery (COD)</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Update Order Status
        </button>
      </form>
    </div>
  );
}