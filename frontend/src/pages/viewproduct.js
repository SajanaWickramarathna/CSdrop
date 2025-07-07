import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartIcon = () => <span style={{ marginRight: 6 }}>🛒</span>;

const ProductViewPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product and brand details
  useEffect(() => {
    async function fetchProductAndBrand() {
      try {
        const productRes = await axios.get(
          `http://localhost:3001/api/products/product/${id}`
        );
        setProduct(productRes.data);

        if (productRes.data.brand_id) {
          // Fetch brand details from repo endpoint
          const brandRes = await axios.get(
            `http://localhost:3001/api/brands/${productRes.data.brand_id}`
          );
          setBrand(brandRes.data);
        } else {
          setBrand(null);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    fetchProductAndBrand();
  }, [id]);

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

  // Availability logic
  const isAvailable =
    product_status && (product_status.toLowerCase() === "active" || product_status === 1);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Nav />
      <ToastContainer position="top-center" autoClose={3000} />
      <div
        className="flex flex-col md:flex-row w-full justify-center items-start px-8 pt-32 pb-12"
        style={{
          minHeight: "100vh",
          color: "#2D2D2D",
          background: "#fff",
        }}
      >
        {/* Left: Image and info */}
        <div className="flex-1 flex flex-col items-center max-w-lg">
          <div className="text-3xl md:text-4xl font-bold mb-4 tracking-wide text-left w-full">
            {product_name}
          </div>
          <div
            className="shadow-xl rounded-lg border border-gray-300 bg-white mb-2 w-full p-6 flex flex-col items-center"
            style={{ minWidth: 350 }}
          >
            <img
              src={getProductImageSrc(product_image)}
              alt={product_name}
              className="rounded-lg shadow-md w-96 h-72 object-contain"
              style={{ background: "#f5f5f5" }}
            />
          </div>
          <div className="mt-6 flex w-full max-w-lg">
            <div className="flex flex-col gap-2 w-1/2">
              <div className="text-gray-700">Availability</div>
              <div className="text-gray-700">Brand</div>
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <div
                className="font-semibold"
                style={{
                  color: isAvailable ? "#22c55e" : "#ef4444",
                  background: "none",
                }}
              >
                {isAvailable ? "Available" : "Not Available"}
              </div>
              <div
                className="font-semibold text-gray-900"
                style={{
                  background: "none",
                  display: "inline-block",
                  padding: "0 6px",
                  borderRadius: 4,
                  fontSize: 18,
                }}
              >
                {brand?.brand_name || "N/A"}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Price, description, actions */}
        <div className="flex-1 flex flex-col justify-start items-start pl-0 md:pl-20 pt-10 md:pt-0 max-w-xl w-full">
          <div className="mt-4 text-3xl font-bold mb-4">
            {Number(product_price).toLocaleString("en-US")} LKR
          </div>
          <div className="mb-6 text-base text-gray-700 whitespace-pre-line">
            {product_description}
          </div>
          <button
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded font-bold flex items-center transition-all"
            style={{ letterSpacing: "1px" }}
            onClick={() => {/* TODO: Implement Add to Cart */}}
            disabled={!isAvailable}
          >
            <CartIcon /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;