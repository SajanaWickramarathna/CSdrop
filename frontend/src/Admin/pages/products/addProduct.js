import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_status: "",
  });
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productImage, setProductImage] = useState();
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => setErrorMessage("Error fetching categories"));
  }, []);

  useEffect(() => {
    if (categoryId) {
      axios.get(`http://localhost:3001/api/brands/bycategory/${categoryId}`) // <-- Fixed endpoint
        .then(res => setBrands(res.data))
        .catch(() => setErrorMessage("Error fetching brands"));
    } else {
      setBrands([]);
    }
    setBrandId(""); // reset brand selection if category changes
  }, [categoryId]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProductImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setErrorMessage("Please select a valid image file.");
      setProductImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setErrorMessage("Please select a category before submitting.");
      return;
    }
    if (!brandId) {
      setErrorMessage("Please select a brand before submitting.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("product_description", formData.product_description);
    formDataToSend.append("product_price", formData.product_price);
    formDataToSend.append("product_status", formData.product_status);
    formDataToSend.append("category_id", categoryId);
    formDataToSend.append("brand_id", brandId);
    if (productImage) formDataToSend.append("product_image", productImage);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/products/addproduct",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        setSuccessMessage("Product Added Successfully. Redirecting...");
        setFormData({
          product_name: "",
          product_description: "",
          product_price: "",
          product_status: "",
        });
        setCategoryId("");
        setBrandId("");
        setProductImage(null);
        setPreview(null);
        setTimeout(() => {
          window.location.href = "/admin-dashboard/products";
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Failed to add product. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h2>
      {successMessage && <p className="mb-4 text-green-500 font-medium">{successMessage}</p>}
      {errorMessage && <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="mb-4">
          <label htmlFor="product-category" className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
            ))}
          </select>
        </div>
        {/* Brand (filtered by category) */}
        <div className="mb-4">
          <label htmlFor="product-brand" className="block text-gray-700 font-medium mb-2">
            Brand
          </label>
          <select
            value={brandId}
            onChange={e => setBrandId(e.target.value)}
            required
            disabled={!categoryId}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
            ))}
          </select>
        </div>
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="product-name" className="block text-gray-700 font-medium mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="product-description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="product_description"
            value={formData.product_description}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="product-price" className="block text-gray-700 font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            name="product_price"
            value={formData.product_price}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Product Image */}
        <div className="mb-4">
          <label htmlFor="product-image" className="block text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {preview && (
            <img src={preview} alt="Product Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
          )}
        </div>
        {/* Product Status */}
        <div className="mb-4">
          <label htmlFor="product-status" className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            name="product_status"
            value={formData.product_status}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;