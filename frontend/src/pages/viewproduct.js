import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";

const CartIcon = () => <span style={{ marginRight: 6 }}>🛒</span>;

const ProductViewPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchProductAndBrand() {
      try {
        const productRes = await axios.get(
          `http://localhost:3001/api/products/product/${id}`
        );
        setProduct(productRes.data);

        if (productRes.data.brand_id) {
          const brandRes = await axios.get(
            `http://localhost:3001/api/brands/${productRes.data.brand_id}`
          );
          setBrand(brandRes.data);
        } else {
          setBrand(null);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product or brand:", err);
        setLoading(false);
      }
    }
    fetchProductAndBrand();
  }, [id]);

 const handleAddToCart = (product_id) => {
  axios
    .post(
      "http://localhost:3001/api/cart/addtocart",
      { product_id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      toast.success("Product added to cart");
      fetchCartCount(); // 🔄 refresh cart count
    })
    .catch(() => {
      toast.error("Error adding to cart");
    });
};

  const getProductImageSrc = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/uploads")) return `http://localhost:3001${imgPath}`;
    if (imgPath.startsWith("uploads")) return `http://localhost:3001/${imgPath}`;
    return `http://localhost:3001/uploads/${imgPath}`;
  };

  if (loading)
    return (
      <div className="text-center p-10 bg-white" style={{ minHeight: "100vh", color: "#2D2D2D" }}>
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="text-center p-10 bg-white" style={{ minHeight: "100vh", color: "#2D2D2D" }}>
        Product not found
      </div>
    );

  const {
    product_name,
    product_description,
    product_price,
    product_image,
    product_status,
  } = product;

  const isAvailable =
    product_status && (product_status.toLowerCase() === "active" || product_status === 1);

  return (
     <div className="bg-gray-100 min-h-screen">
    <Nav />
    <ToastContainer position="top-center" autoClose={3000} />

    <div className="flex justify-center items-center pt-24 pb-12 px-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={getProductImageSrc(product_image)}
            alt={product_name}
            className="rounded-lg shadow-md w-full max-w-md h-80 object-contain bg-gray-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{product_name}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{product_description}</p>
            <div className="text-2xl font-semibold text-blue-700 mb-4">
              LKR {Number(product_price).toLocaleString("en-US")}
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <span>
                <strong>Availability:</strong>{" "}
                <span className={isAvailable ? "text-green-600" : "text-red-600"}>
                  {isAvailable ? "Available" : "Not Available"}
                </span>
              </span>
              <span>
                <strong>Brand:</strong> {brand?.brand_name || "N/A"}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`mt-6 py-3 text-white rounded-lg ${
              isAvailable
                ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                : "bg-gray-400 cursor-not-allowed"
            } transition duration-300`}
            onClick={() => handleAddToCart(product.product_id)}
            disabled={!isAvailable}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProductViewPage;
