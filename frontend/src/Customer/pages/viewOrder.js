import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ViewOrder() {
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
        if (response.status !== 200) throw new Error("Failed to fetch order details");

        const order = response.data;
        setOrderData(order);

        const productDetails = await Promise.all(
          order.items.map(async (item) => {
            try {
              const productRes = await axios.get(
                `http://localhost:3001/api/products/product/${item.product_id}`
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
                product_name: "Unknown Product",
                product_price: 0,
                product_image: null,
              };
            }
          })
        );

        setProducts(productDetails);

        const total = productDetails.reduce((acc, item) => {
          return acc + (item.product_price * item.quantity);
        }, 0);
        setTotalPrice(total);
      } catch (err) {
        setError("Error fetching order details.");
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!orderData) return <div>Loading order details...</div>;

  const formatDateTime = (isoDate) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(isoDate).toLocaleString("en-GB", options);
  };

  const getProductImageSrc = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/uploads")) return `http://localhost:3001${imgPath}`;
    if (imgPath.startsWith("uploads")) return `http://localhost:3001/${imgPath}`;
    return `http://localhost:3001/uploads/${imgPath}`;
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Order Details</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold mb-2">Order Items</h4>
        <div className="flex flex-col space-y-4 mb-6">
          {products.map((item, index) => (
            <div key={index} className="flex items-center bg-white p-4 rounded-xl shadow-md">
              <img
                src={getProductImageSrc(item.product_image)}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div className="ml-4 flex-1">
                <h5 className="text-lg font-semibold text-gray-900">{item.product_name}</h5>
                <p className="text-lg text-gray-600">LKR {item.product_price.toLocaleString()}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">
                  Subtotal: LKR {(item.product_price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Order ID: {orderData.order_id}
        </h3>
        <p className="text-lg text-gray-600 mb-1">Status: {orderData.status}</p>
        <p className="text-lg text-gray-600 mb-4">
          Ordered On: {formatDateTime(orderData.created_at)}
        </p>

        {/* Payment Section */}
        {orderData.payment_slip ? (
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Payment Method</h4>
            <p className="text-gray-800">Payment Slip</p>
            <img
              src={`http://localhost:3001/uploads/${orderData.payment_slip}`}
              alt="Payment Slip"
              className="w-80 border border-gray-300 rounded-lg shadow-sm mt-2"
            />
            <a
              href={`http://localhost:3001/uploads/${orderData.payment_slip}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-500 mt-2 underline"
            >
              View full image
            </a>
          </div>
        ) : (
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Payment Method</h4>
            <p className="text-gray-800">Cash on Delivery (COD)</p>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-lg font-semibold">Total Price: LKR {totalPrice.toLocaleString()}</h4>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
