import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Nav from "../components/navigation";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaChevronRight,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchCartCount } = useCart();

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:3001/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, brandsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/brands`),
        ]);

        setProducts(
          productsRes.data.sort(() => 0.5 - Math.random()).slice(0, 8)
        );
        setBrands(brandsRes.data.sort(() => 0.5 - Math.random()).slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product_id) => {
    if (!token) {
      toast.info("Please login to add items to cart");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/cart/addtocart`,
        { product_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added to cart");
      fetchCartCount();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding to cart");
      console.error("Error adding to cart:", err);
    }
  };

  const getImageSrc = (imgPath, type = "product") => {
    if (!imgPath) {
      return type === "product"
        ? "https://via.placeholder.com/300x200?text=No+Image"
        : "https://via.placeholder.com/150?text=No+Image";
    }

    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/") || imgPath.startsWith("uploads")) {
      return `${API_BASE_URL.replace("/api", "")}${
        imgPath.startsWith("/") ? "" : "/"
      }${imgPath}`;
    }
    return `${API_BASE_URL.replace("/api", "")}/uploads/${imgPath}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <Nav />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen bg-cover bg-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/hero.jpg)",
            filter: "brightness(0.7)",
          }}
        ></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center space-y-6 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            DROPship
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Premium products delivered straight to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-gray-100 transition-all font-medium"
              onClick={() => (window.location.href = "/shop")}
            >
              Shop Now
            </motion.button>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full shadow-lg hover:bg-white hover:text-indigo-600 transition-all font-medium"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/product/${product.product_id}`}>
                <div className="relative h-60 overflow-hidden group">
                  <img
                    src={getImageSrc(product.images?.[0])}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
              </Link>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {product.product_name}
                </h3>
                <p className="text-xl font-bold text-green-600 mb-4">
                  Rs.{product.product_price.toLocaleString()}
                </p>

                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(product.product_id)}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-sm"
                  >
                    Add to Cart
                  </motion.button>

                  <Link
                    to={`/product/${product.product_id}`}
                    className="w-full py-2.5 text-center text-gray-900 bg-transparent border border-gray-300 hover:border-blue-500 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About DROPship
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src="/images/about.jpg"
                alt="About DROPship"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700">
                At DROPship, we're passionate about connecting you with the
                highest quality products from around the world. Our carefully
                curated selection ensures you get only the best items delivered
                straight to your doorstep.
              </p>
              <p className="text-lg text-gray-700">
                Founded in 2023, we've grown from a small startup to a trusted
                e-commerce platform serving thousands of satisfied customers
                nationwide. Our mission is to make premium shopping accessible
                to everyone.
              </p>
              <p className="text-lg text-gray-700">
                What sets us apart is our commitment to quality, customer
                service, and fast, reliable shipping. We personally vet every
                product and brand in our inventory to ensure they meet our high
                standards.
              </p>
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted Brands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We partner with the most reputable brands in the industry
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {brands.map((brand) => (
              <motion.div
                key={brand.brand_id}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center p-4"
              >
                <div className="w-32 h-32 rounded-full border-2 border-gray-200 p-1 mb-4 overflow-hidden">
                  <img
                    src={getImageSrc(brand.brand_image, "brand")}
                    alt={brand.brand_name}
                    className="w-full h-full object-contain rounded-full"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-900 text-center">
                  {brand.brand_name}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Premium Shopping?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust DROPship for quality
            products and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/contactform"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                DROPship
              </h3>
              <p className="mb-4">
                Premium products delivered straight to your doorstep.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaXTwitter className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTiktok className="text-xl" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/shop"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contactform"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/shipping"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> Return Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacypolicy"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termsofservice"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <FaChevronRight className="text-xs mr-2" /> Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Contact Info
              </h3>
              <address className="not-italic space-y-2">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  123 Main Street, Colombo
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +94 76 123 4567
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@dropship.com
                </p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} DROPship. All rights reserved.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>
              Developed by Sajana Wickramarathna
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
