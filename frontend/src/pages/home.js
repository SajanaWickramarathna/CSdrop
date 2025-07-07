import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Nav from '../components/navigation';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem('token');


  useEffect(() => {
    axios.get('http://localhost:3001/api/products')
      .then(response => setProducts(response.data.sort(() => 0.5 - Math.random()).slice(0, 8)))
      .catch(error => console.error('Error fetching products:', error));

    axios.get('http://localhost:3001/api/brands')
      .then(response => setBrands(response.data.sort(() => 0.5 - Math.random()).slice(0, 5)))
      .catch(error => console.error('Error fetching brands:', error));

    axios.get('http://localhost:3001/api/categories')
      .then(response => setCategories(response.data.sort(() => 0.5 - Math.random()).slice(0, 5)))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleAddToCart = (product_id) => {
    axios.post(
      'http://localhost:3001/api/cart/addtocart',
      { product_id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      toast.success('Product added to cart');
    })
    .catch((err) => {
      toast.error('Error adding to cart');
      console.error('Error adding to cart:', err);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <Nav />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero Section */}
      <section 
        className="relative flex items-center justify-center h-screen bg-cover bg-center text-white" 
        style={{ backgroundImage: 'url(/images/hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/50"></div> {/* Black overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1 }} 
          className="relative text-center space-y-4"
        >
          <h1 className="text-6xl font-extrabold">KHB Associates</h1>
          <p className="text-xl">Innovative Textile Machinery Solutions</p>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            className="px-8 py-3 bg-white text-indigo-600 rounded-full shadow-md hover:bg-gray-200 transition-all"
            onClick={() => window.location.href = '/shop'}
          >
            Explore Now
          </motion.button>
        </motion.div>
      </section>


      {/* Products */}
      <section className="py-16 bg-white px-6 sm:px-16 lg:px-32">
        <h2 className="text-4xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div key={product.product_id} className="bg-gray-100 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl" whileHover={{ scale: 1.05 }}>
              <img src={`http://localhost:3001${product.product_image}`} alt={product.product_name} className="h-48 w-full object-cover rounded-md mb-4 transition-transform hover:scale-110" />
              <h3 className="text-lg font-semibold mb-2">{product.product_name}</h3>
              <p className="text-2xl font-bold text-green-600">Rs.{product.product_price}</p>
              <div className="mt-4 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition duration-300 flex items-center justify-center shadow-md"
                  onClick={() => handleAddToCart(product.product_id)}
                >
                  Add to Cart
                </motion.button>

                {/* View Product Link */}
                <Link
                  to={`/product/${product.product_id}`}
                  className="w-full mt-2 py-3 text-gray-900 bg-transparent border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  View Product
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50 px-32">
        <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img src="/images/about.jpg" alt="About Us" className="w-full h-96 object-cover rounded-xl shadow-md" />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <p className="text-lg text-gray-600">
              KHB Associates Pvt Ltd is a renowned name in the textile machinery industry, offering advanced solutions to meet the ever-evolving demands of modern textile production.
            </p>
            <p className="text-lg text-gray-600">
              With a commitment to quality and innovation, we deliver cutting-edge machinery from top global brands, tailored to streamline your textile manufacturing processes.
            </p>
            <p className="text-lg text-gray-600">
              Our customer-centric approach ensures reliable support and unmatched product performance, making us your trusted partner for all textile machinery needs.
            </p>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-gray-50 px-32">
        <h2 className="text-4xl font-bold text-center mb-8">Our Brands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {brands.map((brand) => (
            <motion.div key={brand.brand_id} className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <div className="flex justify-center items-center">
                <img src={`http://localhost:3001${brand.brand_image}`} alt={brand.brand_name} className="w-32 h-32 object-cover rounded-full border-2 border-blue-500" />
              </div>
              <h4 className="text-lg font-semibold text-center mt-4">{brand.brand_name}</h4>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Categories */}
      <section className="py-16 bg-gray-100 px-32">
        <h2 className="text-4xl font-bold text-center mb-8">Product Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <motion.div key={category.category_id} className="p-6 bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <div className="flex justify-center items-center">
                <img src={`http://localhost:3001${category.category_image}`} alt={category.category_name} className="w-32 h-32 object-cover rounded-lg" />
              </div>
              <h4 className="text-lg font-semibold text-center mt-4">{category.category_name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-custom-gradient text-white text-center">
        <p>© 2025 KHB Associates Pvt Ltd. All rights reserved.Developed by S JAY Web Solutions (pvt) Ltd.</p>
      </footer>
    </div>
  );
}
