import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 w-48 p-2 mt-1 text-sm text-white bg-gray-800 rounded shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

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
  const [productImages, setProductImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingBrands, setIsFetchingBrands] = useState(false);
  const [touched, setTouched] = useState({
    product_name: false,
    product_price: false,
    product_description: false,
    product_status: false,
  });

  useEffect(() => {
    setIsFetchingCategories(true);
    axios.get("http://localhost:3001/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => setErrorMessage("Error fetching categories"))
      .finally(() => setIsFetchingCategories(false));
  }, []);

  useEffect(() => {
    if (categoryId) {
      setIsFetchingBrands(true);
      axios.get(`http://localhost:3001/api/brands/bycategory/${categoryId}`)
        .then(res => setBrands(res.data))
        .catch(() => setErrorMessage("Error fetching brands"))
        .finally(() => setIsFetchingBrands(false));
    } else {
      setBrands([]);
    }
    setBrandId("");
  }, [categoryId]);

  const handleFormChange = (e) => {
    if (e.target.name === 'product_price') {
      // Remove non-numeric characters except decimal point
      const value = e.target.value.replace(/[^0-9.]/g, '');
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const newImages = [...productImages];
      newImages[index] = file;
      setProductImages(newImages);

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a valid image file.");
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
    const newImages = [...productImages];
    newImages[index] = null;
    setProductImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!categoryId || !brandId) {
      setErrorMessage("Category and Brand must be selected.");
      setIsLoading(false);
      return;
    }

    if (productImages.every(img => img === null)) {
      setErrorMessage("Please upload at least one product image.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("product_description", formData.product_description);
    formDataToSend.append("product_price", formData.product_price);
    formDataToSend.append("product_status", formData.product_status);
    formDataToSend.append("category_id", categoryId);
    formDataToSend.append("brand_id", brandId);

    productImages.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`product_image_${index + 1}`, image);
      }
    });

    try {
      const res = await axios.post("http://localhost:3001/api/products/addproduct", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.status === 200) {
        setSuccessMessage("Product added successfully!");
        setFormData({
          product_name: "",
          product_description: "",
          product_price: "",
          product_status: "",
        });
        setCategoryId("");
        setBrandId("");
        setProductImages([null, null, null, null]);
        setPreviews([]);
        setTouched({
          product_name: false,
          product_price: false,
          product_description: false,
          product_status: false,
        });
        setTimeout(() => {
          window.location.href = "/admin-dashboard/products";
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation helpers
  const isInvalidName = touched.product_name && formData.product_name.length < 3;
  const isInvalidPrice = touched.product_price && (isNaN(formData.product_price) || parseFloat(formData.product_price) <= 0);
  const isInvalidDescription = touched.product_description && formData.product_description.length < 10;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Add New Product</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {isFetchingCategories ? (
                <option>Loading categories...</option>
              ) : (
                <>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </>
              )}
            </select>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-gray-700">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
              disabled={!categoryId || isFetchingBrands}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              {isFetchingBrands ? (
                <option>Loading brands...</option>
              ) : (
                <>
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1 text-gray-700">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleFormChange}
            required
            minLength={3}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isInvalidName ? 'border-red-500' : ''}`}
            placeholder="Enter product name"
          />
          {isInvalidName && <p className="mt-1 text-sm text-red-500">Product name must be at least 3 characters</p>}
        </div>
        
        <div>
          <label className="block font-medium mb-1 text-gray-700">Description</label>
          <div className="relative">
            <textarea
              name="product_description"
              value={formData.product_description}
              onChange={handleFormChange}
              required
              minLength={10}
              rows={4}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isInvalidDescription ? 'border-red-500' : ''}`}
              placeholder="Enter detailed product description"
            ></textarea>
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
              {formData.product_description.length}/500
            </div>
          </div>
          {isInvalidDescription && <p className="mt-1 text-sm text-red-500">Description must be at least 10 characters</p>}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Price (LKR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2">LKR</span>
              <input
                type="text"
                name="product_price"
                value={formData.product_price}
                onChange={handleFormChange}
                required
                className={`w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isInvalidPrice ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
            </div>
            {isInvalidPrice && <p className="mt-1 text-sm text-red-500">Please enter a valid price</p>}
          </div>
          
          <div>
            <div className="flex items-center">
              <label className="block font-medium mb-1 text-gray-700 mr-2">Status</label>
              <Tooltip content="Active products will be visible to customers">
                <InformationCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </Tooltip>
            </div>
            <select
              name="product_status"
              value={formData.product_status}
              onChange={handleFormChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1 text-gray-700">Product Images</label>
          <p className="text-sm text-gray-500 mb-3">Upload up to 4 images (at least 1 required)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <label className="cursor-pointer w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(i, e)}
                    className="hidden"
                  />
                  <div className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition">
                    {previews[i] ? (
                      <img
                        src={previews[i]}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <>
                        <PlusIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Add Image</span>
                      </>
                    )}
                  </div>
                </label>
                {previews[i] && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="mt-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-3 rounded-md transition ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span className="ml-2">Adding Product...</span>
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;