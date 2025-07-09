// Your imports remain unchanged
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true); // toggle for filter panel
  const { fetchCartCount } = useCart();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    axios
      .get("http://localhost:3001/api/brands")
      .then((response) => {
        setBrands(response.data);
        setAllBrands(response.data);
      })
      .catch((error) => console.error("Error fetching brands:", error));

    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const fetchProductsByCategory = async (category_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/products/category/${category_id}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const fetchBrandsByCategory = async (category_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/brands/bycategory/${category_id}`
      );
      setBrands(response.data);
    } catch (error) {
      setBrands([]);
    }
  };

  useEffect(() => {
    let filtered = products;
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(
          String(product.brand_id ?? product.product_brand_id)
        )
      );
    }
    filtered = filtered.filter((product) => product.product_price <= maxPrice);
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedBrands, maxPrice, searchQuery, products]);

  const handleAddToCart = (product_id) => {
    axios
      .post(
        "http://localhost:3001/api/cart/addtocart",
        { product_id, quantity: 1 },
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

  const handleCategoryClick = async (category_id) => {
    setSelectedCategory(category_id);
    setShowFilterPanel(!!category_id);
    setSelectedBrands([]);
    setMaxPrice(1000000);
    setSearchQuery("");
    if (category_id) {
      await fetchProductsByCategory(category_id);
      await fetchBrandsByCategory(category_id);
    }
  };

  const handleClearBrandAndPriceFilters = () => {
    setSelectedBrands([]);
    setMaxPrice(1000000);
  };

  const handleShowAllProducts = async () => {
    setSelectedCategory("");
    setShowFilterPanel(false);
    setSelectedBrands([]);
    setMaxPrice(1000000);
    setSearchQuery("");
    setBrands(allBrands);
    await fetchAllProducts();
  };

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => String(c.category_id) === String(catId));
    return cat ? cat.category_name : "";
  };

  const getBrandName = (brandId) => {
    const brand = allBrands.find((b) => String(b.brand_id) === String(brandId));
    return brand ? brand.brand_name : "";
  };

  const getProductImageSrc = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/uploads"))
      return `http://localhost:3001${imgPath}`;
    if (imgPath.startsWith("uploads"))
      return `http://localhost:3001/${imgPath}`;
    return `http://localhost:3001/uploads/${imgPath}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Category Panel */}
      <aside className="w-60 h-screen fixed top-20 left-0 z-40 bg-white shadow-lg px-2 pt-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold tracking-widest text-blue-700 px-2">
          CATEGORIES
        </h2>
        <button
          onClick={handleShowAllProducts}
          className="mb-3 mx-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
        >
          Show All Products
        </button>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li
                key={category.category_id}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors
                ${
                  selectedCategory === String(category.category_id)
                    ? "bg-blue-100 text-blue-700 font-bold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() =>
                  handleCategoryClick(String(category.category_id))
                }
              >
                <span className="ml-2">{category.category_name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main & Filter Panel */}
      <div className="flex pt-20 pl-60">
        {showFilterPanel && (
          <div className="w-80 p-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div
                className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <h2 className="font-semibold text-lg">Filters</h2>
                <button className="text-sm">
                  {filterOpen ? "Hide" : "Show"}
                </button>
              </div>

              {filterOpen && (
                <div className="p-4 space-y-6">
                  {/* Price Filter */}
                  <div>
                    <div className="flex items-center text-blue-700 mb-2 text-sm">
                      <span>0 LKR</span>
                      <span className="ml-auto">{maxPrice} LKR</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1000000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-blue-700"
                    />
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h3 className="text-blue-700 font-semibold mb-2">BRANDS</h3>
                    {brands.length > 0 ? (
                      <div className="flex flex-col gap-2 text-sm">
                        {brands.map((brand) => (
                          <label
                            key={brand.brand_id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              className="accent-blue-700"
                              checked={selectedBrands.includes(
                                String(brand.brand_id)
                              )}
                              onChange={() =>
                                setSelectedBrands((prev) =>
                                  prev.includes(String(brand.brand_id))
                                    ? prev.filter(
                                        (id) => id !== String(brand.brand_id)
                                      )
                                    : [...prev, String(brand.brand_id)]
                                )
                              }
                            />
                            {brand.brand_name}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No brands for this category
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleClearBrandAndPriceFilters}
                    className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                {getCategoryName(selectedCategory)}
                <button
                  onClick={handleShowAllProducts}
                  className="ml-2 text-blue-600 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedBrands.map((id) => (
              <span
                key={id}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1"
              >
                {getBrandName(id)}
                <button
                  onClick={() =>
                    setSelectedBrands((prev) =>
                      prev.filter((bid) => bid !== id)
                    )
                  }
                  className="ml-2 text-green-600 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
            {maxPrice < 1000000 && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                Up to LKR {maxPrice}
                <button
                  onClick={() => setMaxPrice(1000000)}
                  className="ml-2 text-yellow-600 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative group overflow-hidden">
                    <img
                      src={getProductImageSrc(product.product_image)}
                      alt={product.product_name}
                      className="w-full h-56 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-6">
                    {product.product_name}
                  </h3>
                  <p className="text-lg text-gray-700 mt-2 font-medium">
                    LKR {product.product_price}
                  </p>
                  <div className="mt-4 space-y-4">
                    <button
                      className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition duration-300"
                      onClick={() => handleAddToCart(product.product_id)}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product.product_id}`}
                      className="w-full mt-2 py-3 text-gray-900 bg-transparent border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No products found
              </p>
            )}
          </div>
        </div>
      </div>

       {/* Footer */}
            <footer className="py-6 bg-custom-gradient text-white text-center space-y-4 pt-8 pb-6 relative z-50">
              <p>
                &copy; {new Date().getFullYear()} DROPship. All rights reserved.
                <br />
                Developed by Sajana Wickramarathna
              </p>
      
              <div className="flex justify-center gap-6 text-white text-lg">
                <a
                  href="https://www.facebook.com/profile.php?id=100073905762464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors flex items-center gap-2"
                >
                  <FaFacebook className="text-2xl" /> Facebook
                </a>
      
                <a
                  href="https://www.instagram.com/iamsaj.__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors flex items-center gap-2"
                >
                  <FaInstagram className="text-2xl" /> Instagram
                </a>
      
                <a
                  href="https://www.instagram.com/iamsaj.__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-2"
                >
                  <FaXTwitter className="text-2xl" /> X
                </a>
      
                <a
                  href="https://www.instagram.com/iamsaj.__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-2"
                >
                  <FaTiktok  className="text-2xl" /> Tik tok
                </a>
              </div>
      
              <p>
                <Link to="/privacypolicy" className="text-blue-200 hover:underline">
                  Privacy Policy
                </Link>{" "}
                |{" "}
                <Link to="/termsofservice" className="text-blue-200 hover:underline">
                  Terms of Service
                </Link>
              </p>
            </footer>
    </div>
  );
}
