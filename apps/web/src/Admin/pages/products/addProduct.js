import React, { useState, useEffect } from "react";
import { api } from "../../../api";
import { 
  PlusIcon, 
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-20 w-64 p-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg">
          {content}
          <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
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
    product_status: "active", // Default to active
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
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        setErrorMessage("Failed to load categories. Please try again later.");
      } finally {
        setIsFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      if (!categoryId) {
        setBrands([]);
        setBrandId("");
        return;
      }
      
      setIsFetchingBrands(true);
      try {
        const res = await api.get(`/brands/bycategory/${categoryId}`);
        setBrands(res.data);
      } catch (err) {
        setErrorMessage("Failed to load brands for this category.");
      } finally {
        setIsFetchingBrands(false);
      }
    };
    fetchBrands();
  }, [categoryId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'product_price') {
      // Allow only numbers and one decimal point
      const sanitizedValue = value.replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1'); // Remove extra decimal points
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrorMessage("Image size should be less than 2MB");
      return;
    }

    const newImages = [...productImages];
    newImages[index] = file;
    setProductImages(newImages);

    const newPreviews = [...previews];
    const reader = new FileReader();
    reader.onload = () => {
      newPreviews[index] = reader.result;
      setPreviews(newPreviews);
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
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

    // Validation
    if (!categoryId || !brandId) {
      setErrorMessage("Please select both category and brand");
      setIsLoading(false);
      return;
    }

    if (productImages.every(img => img === null)) {
      setErrorMessage("Please upload at least one product image");
      setIsLoading(false);
      return;
    }

    if (formData.product_name.length < 3) {
      setErrorMessage("Product name must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (formData.product_description.length < 10) {
      setErrorMessage("Description must be at least 10 characters");
      setIsLoading(false);
      return;
    }

    if (!formData.product_price || isNaN(formData.product_price)) {
      setErrorMessage("Please enter a valid price");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name.trim());
    formDataToSend.append("product_description", formData.product_description.trim());
    formDataToSend.append("product_price", parseFloat(formData.product_price).toFixed(2));
    formDataToSend.append("product_status", formData.product_status);
    formDataToSend.append("category_id", categoryId);
    formDataToSend.append("brand_id", brandId);

    productImages.forEach((image, index) => {
      if (image) {
         formDataToSend.append(`product_image_${index + 1}`, image);
      }
    });

    try {
      const res = await api.post("/products/addproduct", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.status === 200) {
        setSuccessMessage("Product added successfully! Redirecting...");
        // Reset form
        setFormData({
          product_name: "",
          product_description: "",
          product_price: "",
          product_status: "active",
        });
        setCategoryId("");
        setBrandId("");
        setProductImages([null, null, null, null]);
        setPreviews([]);
        setTouched({
          product_name: false,
          product_price: false,
          product_description: false,
        });
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          window.location.href = "/admin-dashboard/products";
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                     err.response?.data?.message || 
                     "Failed to add product. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation states
  const isNameValid = formData.product_name.length >= 3 || !touched.product_name;
  const isDescriptionValid = formData.product_description.length >= 10 || !touched.product_description;
  const isPriceValid = (!isNaN(formData.product_price) && parseFloat(formData.product_price) > 0) || !touched.product_price;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <p className="text-blue-100 mt-1">Fill in the details below to add a new product</p>
            </div>
            <button 
              onClick={() => window.location.href = "/admin-dashboard/products"}
              className="flex items-center text-blue-100 hover:text-white transition"
            >
              <XMarkIcon className="w-5 h-5 mr-1" />
              Cancel
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="px-6 pt-4">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">{errorMessage}</p>
                <button 
                  onClick={() => setErrorMessage("")}
                  className="mt-1 text-sm text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category & Brand */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isFetchingCategories ? 'bg-gray-100' : 'bg-white'
                }`}
                disabled={isFetchingCategories}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {isFetchingCategories && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                  Loading categories...
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
                disabled={!categoryId || isFetchingBrands}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !categoryId || isFetchingBrands ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
              {isFetchingBrands && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                  Loading brands...
                </div>
              )}
            </div>
          </div>
          
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleFormChange}
              required
              minLength={3}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isNameValid ? 'border-red-300 focus:ring-red-200' : ''
              }`}
              placeholder="e.g., Premium Wireless Headphones"
            />
            {!isNameValid && (
              <p className="mt-1 text-sm text-red-600">
                Product name must be at least 3 characters
              </p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleFormChange}
                required
                minLength={10}
                rows={4}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isDescriptionValid ? 'border-red-300 focus:ring-red-200' : ''
                }`}
                placeholder="Describe the product features, specifications, and benefits..."
              ></textarea>
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-1.5 py-0.5 rounded">
                {formData.product_description.length}/500
              </div>
            </div>
            {!isDescriptionValid && (
              <p className="mt-1 text-sm text-red-600">
                Description must be at least 10 characters
              </p>
            )}
          </div>
          
          {/* Price & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (LKR)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">LKR</span>
                </div>
                <input
                  type="text"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleFormChange}
                  required
                  className={`w-full pl-14 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isPriceValid ? 'border-red-300 focus:ring-red-200' : ''
                  }`}
                  placeholder="0.00"
                />
              </div>
              {!isPriceValid && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid price (greater than 0)
                </p>
              )}
            </div>
            
            <div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Tooltip content="Active products will be visible to customers in your store">
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </Tooltip>
              </div>
              <select
                name="product_status"
                value={formData.product_status}
                onChange={handleFormChange}
                required
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active (Visible to customers)</option>
                <option value="inactive">Inactive (Hidden from customers)</option>
              </select>
            </div>
          </div>
          
          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Upload up to 4 images (first image will be used as the main display)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col">
                  <label className="group relative aspect-square w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e)}
                      className="hidden"
                    />
                    <div className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${
                      previews[i] 
                        ? 'border-transparent overflow-hidden'
                        : 'border-gray-300 hover:border-blue-400 group-hover:bg-blue-50'
                    }`}>
                      {previews[i] ? (
                        <>
                          <img
                            src={previews[i]}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-xs text-gray-500 group-hover:text-blue-600 mt-1 transition-colors">
                            {i === 0 ? 'Main Image' : `Image ${i + 1}`}
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                  {previews[i] && (
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center justify-center"
                    >
                      <XMarkIcon className="w-3 h-3 mr-0.5" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-all ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Adding Product...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;