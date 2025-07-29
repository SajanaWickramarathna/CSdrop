import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Nav from "../components/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import ReviewSection from "../pages/review";
import { ShoppingCart, Heart, Share2, ChevronLeft } from "react-feather";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Star } from "react-feather";
import { api } from "../api";

const ProductViewPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { fetchCartCount } = useCart();
  const [reviewStats, setReviewStats] = useState({
    avgRating: 0,
    reviewCount: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const res = await api.get(
          `/reviews/stats/${id}`
        );
        setReviewStats(res.data);
      } catch (err) {
        console.error("Error fetching review stats", err);
      }
    }

    if (id) {
      fetchReviewStats();
    }
  }, [id]);

  useEffect(() => {
    async function fetchProductAndBrand() {
      try {
        const productRes = await api.get(
          `/products/product/${id}`
        );
        setProduct(productRes.data);

        if (productRes.data.brand_id) {
          const brandRes = await api.get(
            `/brands/${productRes.data.brand_id}`
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
    api
      .post(
        "/cart/addtocart",
        { product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Product added to cart");
        fetchCartCount();
      })
      .catch(() => {
        toast.error("Error adding to cart");
      });
  };

  

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.product_name,
          text: `Check out this product: ${product?.product_name}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard");
    }
  };

  const getProductImageSrc = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/600x400?text=No+Image";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/uploads"))
      return `http://localhost:3001${imgPath}`;
    if (imgPath.startsWith("uploads"))
      return `http://localhost:3001/${imgPath}`;
    return `http://localhost:3001/uploads/${imgPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Nav />
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <Skeleton height={400} />
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton height={40} width="80%" />
              <Skeleton count={4} />
              <Skeleton height={30} width="40%" />
              <Skeleton height={50} width="60%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Nav />
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or may have been
              removed.
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft size={18} className="mr-1" />
              Back to Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  const {
    product_name,
    product_description,
    product_price,
    product_image,
    product_status,
    product_id,
  } = product;

  const isAvailable =
    product_status &&
    (product_status.toLowerCase() === "active" || product_status === 1);

  // For demo purposes - in a real app, you might have multiple images
  const productImages =
    product?.images && product.images.length > 0
      ? product.images.map((img) => getProductImageSrc(img))
      : ["https://via.placeholder.com/600x400?text=No+Image"];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Nav />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="shadow-lg"
      />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="/products"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Products
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {product_name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Product Image Gallery */}
            <div className="md:w-1/2 p-6">
              <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                  </div>
                )}
                <img
                  src={productImages[selectedImage]}
                  alt={product_name}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
              </div>

              <div className="flex space-x-2 overflow-x-auto py-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product_name}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
                    aria-label="Share product"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {brand && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {brand.brand_name}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-3xl font-semibold text-blue-600 mb-2">
                  LKR {Number(product_price).toLocaleString("en-US")}
                </div>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(reviewStats.avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <a
                    href="#reviews"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ({reviewStats.reviewCount} review
                    {reviewStats.reviewCount !== 1 ? "s" : ""})
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {product_description || "No description available."}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleAddToCart(product_id)}
                  disabled={!isAvailable}
                  className={`flex items-center justify-center py-3 px-6 rounded-md font-medium ${
                    isAvailable
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  } transition-colors`}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
                <button
  onClick={() => {
    if (!isAvailable) return;
    api
      .post(
        "/cart/addtocart",
        { product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchCartCount();
        window.location.href = "/checkout"; // 🔁 Redirect to checkout
      })
      .catch(() => {
        toast.error("Error adding to cart");
      });
  }}
  disabled={!isAvailable}
  className={`py-3 px-6 border rounded-md font-medium ${
    isAvailable
      ? "border-blue-600 text-blue-600 hover:bg-blue-50"
      : "border-gray-300 text-gray-400 cursor-not-allowed"
  } transition-colors`}
>
  Buy Now
</button>

              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div
          id="reviews"
          className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <ReviewSection
            productId={product_id}
            onStatsUpdate={(newStats) => setReviewStats(newStats)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
