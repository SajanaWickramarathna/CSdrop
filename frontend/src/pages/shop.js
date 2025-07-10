import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaFilter,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaEye,
  FaChevronRight, 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


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
  const [filterOpen, setFilterOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { fetchCartCount } = useCart();

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
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
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category_id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/products/category/${category_id}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
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
    if (!token) {
      toast.warn("Please login to add products to the cart.");
      return;
    }
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
    <div className="bg-gray-50 min-h-screen">
      <Nav className="fixed top-0 left-0 right-0 h-16 z-50 shadow bg-white" />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Mobile Search and Filter Bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 h-16 bg-white shadow-sm z-30 px-4 py-3 flex items-center gap-2">

        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="p-2 rounded-lg bg-blue-500 text-white"
          aria-label="Toggle filters"
        >
          <FaFilter />
        </button>
      </div>

      {/* Desktop Search bar */}
      <div className="hidden lg:block fixed top-16 left-60 right-0 h-16 z-30 bg-white shadow px-8 py-3">


        <div className="relative max-w-2xl mx-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto pt-20 pb-16 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleShowAllProducts}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    !selectedCategory
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.category_id}
                    onClick={() =>
                      handleCategoryClick(String(category.category_id))
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      selectedCategory === String(category.category_id)
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.category_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Price Range
              </h3>
              <div className="px-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>0 LKR</span>
                  <span>{maxPrice} LKR</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Brands
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.brand_id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
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
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{brand.brand_name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClearBrandAndPriceFilters}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Panel */}
      <aside className="hidden lg:block w-60 h-screen fixed top-20 left-0 z-30 bg-white shadow-lg px-4 pt-4 flex flex-col gap-3">
        <h2 className="text-lg font-bold tracking-widest text-blue-700 px-2 select-none">
          CATEGORIES
        </h2>

        <button
          onClick={handleShowAllProducts}
          className={`mb-3 mx-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            !selectedCategory
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } font-semibold`}
        >
          Show All Products
        </button>

        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li
                key={category.category_id}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors select-none
                ${
                  selectedCategory === String(category.category_id)
                    ? "bg-blue-100 text-blue-700 font-bold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() =>
                  handleCategoryClick(String(category.category_id))
                }
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCategoryClick(String(category.category_id));
                  }
                }}
                role="button"
                aria-pressed={selectedCategory === String(category.category_id)}
              >
                <span className="ml-2">{category.category_name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main & Filter Panel */}
      <div className="flex pt-[128px] lg:pt-[128px] lg:pl-60 min-h-screen">

        {showFilterPanel && (
          <div
            className={`hidden lg:block w-80 p-4 transition-all duration-300 ease-in-out ${
              filterOpen ? "max-h-[600px]" : "max-h-12 overflow-hidden"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div
                className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center cursor-pointer select-none"
                onClick={() => setFilterOpen(!filterOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setFilterOpen(!filterOpen);
                }}
                aria-expanded={filterOpen}
                aria-controls="filter-panel"
              >
                <h2 className="font-semibold text-lg">Filters</h2>
                <div className="flex items-center">
                  {filterOpen ? (
                    <FiChevronUp className="text-xl" />
                  ) : (
                    <FiChevronDown className="text-xl" />
                  )}
                </div>
              </div>

              <div id="filter-panel" className="p-4 space-y-6">
                {filterOpen && (
                  <>
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3">
                        Price Range
                      </h3>
                      <div className="flex items-center text-blue-700 mb-2 text-sm select-none">
                        <span>0 LKR</span>
                        <span className="ml-auto">{maxPrice} LKR</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1000000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label="Filter by maximum price"
                      />
                    </div>

                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3">
                        Brands
                      </h3>
                      {brands.length > 0 ? (
                        <div className="flex flex-col gap-2 text-sm max-h-52 overflow-auto">
                          {brands.map((brand) => (
                            <label
                              key={brand.brand_id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                            >
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500"
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
                        <p className="text-gray-500 select-none">
                          No brands for this category
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleClearBrandAndPriceFilters}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                      aria-label="Clear brand and price filters"
                    >
                      Clear Filters
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Active Filters */}
          <div
            className="flex flex-wrap gap-2 mb-6"
            aria-live="polite"
            aria-atomic="true"
          >
            {selectedCategory && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium flex items-center gap-1 select-none">
                {getCategoryName(selectedCategory)}
                <button
                  onClick={handleShowAllProducts}
                  className="ml-1 text-blue-600 hover:text-red-700 focus:outline-none rounded-full p-1"
                  aria-label="Remove category filter"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            )}
            {selectedBrands.map((id) => (
              <span
                key={id}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1 select-none"
              >
                {getBrandName(id)}
                <button
                  onClick={() =>
                    setSelectedBrands((prev) =>
                      prev.filter((bid) => bid !== id)
                    )
                  }
                  className="ml-1 text-green-600 hover:text-red-700 focus:outline-none rounded-full p-1"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
            {maxPrice < 1000000 && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium flex items-center gap-1 select-none">
                Up to LKR {maxPrice.toLocaleString()}
                <button
                  onClick={() => setMaxPrice(1000000)}
                  className="ml-1 text-yellow-600 hover:text-red-700 focus:outline-none rounded-full p-1"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            )}
          </div>

          {/* Product Count */}
          <div className="mb-6 text-gray-600">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.product_id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-square">
                    <img
                      src={getProductImageSrc(product.product_image)}
                      alt={product.product_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.product_name}
                    </h3>
                    <p className="text-lg text-gray-800 font-bold mt-1">
                      LKR {product.product_price.toLocaleString()}
                    </p>
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => handleAddToCart(product.product_id)}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                          token
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        title={!token ? "Please login to add to cart" : ""}
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product.product_id}`}
                        className="w-full flex items-center justify-center gap-2 py-2 text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FaEye />
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={handleShowAllProducts}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Show All Products
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 space-y-4 pt-8 pb-6 relative z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">DROPship</h3>
                    <p className="mb-4">
                      Premium products delivered straight to your doorstep.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <FaFacebook className="text-xl" />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <FaInstagram className="text-xl" />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <FaXTwitter className="text-xl" />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <FaTiktok className="text-xl" />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><Link to="/shop" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Shop</Link></li>
                      <li><Link to="/about" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> About Us</Link></li>
                      <li><Link to="/contactform" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Contact</Link></li>
                      <li><Link to="/faq" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> FAQ</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                      <li><Link to="/shipping" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Shipping Policy</Link></li>
                      <li><Link to="/returns" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Return Policy</Link></li>
                      <li><Link to="/privacypolicy" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Privacy Policy</Link></li>
                      <li><Link to="/termsofservice" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Terms of Service</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>
                    <address className="not-italic space-y-2">
                      <p className="flex items-start">
                        <svg className="w-5 h-5 mr-2 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        123 Main Street, Colombo
                      </p>
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +94 76 123 4567
                      </p>
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
