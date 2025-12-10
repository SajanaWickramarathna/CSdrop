import { api } from "../../../api";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Added XMarkIcon for close button

export default function UpdateProduct() {
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
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state?.productData;

  useEffect(() => {
    api.get("categories")
      .then(res => setCategories(res.data))
      .catch(() => setErrorMessage("Error fetching categories"));
  }, []);

  useEffect(() => {
    if (categoryId) {
      api.get(`/brands/bycategory/${categoryId}`)
        .then(res => setBrands(res.data))
        .catch(() => setErrorMessage("Error fetching brands"));
    } else {
      setBrands([]);
    }
    setBrandId("");
  }, [categoryId]);

  useEffect(() => {
    if (!productData) {
      navigate('/admin-dashboard/products');
      return;
    }

    setFormData({
      product_name: productData.product_name || "",
      product_description: productData.product_description || "",
      product_price: productData.product_price || "",
      product_status: productData.product_status || "",
    });

    setCategoryId(productData.category_id?.toString() || "");
    setBrandId(productData.brand_id?.toString() || "");

    const initialPreviews = [null, null, null, null];
    (productData.images || []).forEach((img, index) => {
      initialPreviews[index] = img.startsWith("http") ? img : `${api.defaults.baseURL.replace('/api', '')}/uploads/${img}`;
    });

    setPreviews(initialPreviews);
    setLoading(false);
  }, [productData, navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const newImages = [...productImages];
      const newPreviews = [...previews];
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      setProductImages(newImages);
      setPreviews(newPreviews);
    } else {
      setErrorMessage("Please select a valid image file.");
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    const newImages = [...productImages];
    newPreviews[index] = null;
    newImages[index] = null;
    setPreviews(newPreviews);
    setProductImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!categoryId || !brandId) {
      setErrorMessage("Category and Brand must be selected.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("product_description", formData.product_description);
    formDataToSend.append("product_price", formData.product_price);
    formDataToSend.append("product_status", formData.product_status);
    formDataToSend.append("category_id", categoryId);
    formDataToSend.append("brand_id", brandId);

    productImages.forEach((img, index) => {
      if (img) formDataToSend.append(`product_image_${index + 1}`, img);
    });

    try {
      const response = await api.put(
        `/products/updateproduct/${productData.product_id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        setSuccessMessage("Product updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/products"), 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to update product.");
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden"> {/* Updated: Added rounded-lg, shadow-lg, overflow-hidden */}
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center"> {/* Updated: Gradient background */}
        <h2 className="text-xl font-semibold">Update Product</h2> {/* Updated: Font size and weight */}
        <button
          type="button"
          onClick={() => navigate("/admin-dashboard/products")}
          className="text-white hover:text-blue-100"
        >
          <XMarkIcon className="h-6 w-6" /> {/* Close icon */}
        </button>
      </div>

      <div className="p-6 bg-white"> {/* Added padding to the content area */}
        {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
        {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category & Brand */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block mb-1 font-medium text-gray-700">Category *</label> {/* Added htmlFor and asterisk */}
              <select
                id="category" // Added ID
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // Updated: Added border-gray-300, rounded-md, focus styles
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="brand" className="block mb-1 font-medium text-gray-700">Brand *</label> {/* Added htmlFor and asterisk */}
              <select
                id="brand" // Added ID
                value={brandId}
                onChange={e => setBrandId(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // Updated: Added border-gray-300, rounded-md, focus styles
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name, Description, Price, Status */}
          <div>
            <label htmlFor="product_name" className="block mb-1 font-medium text-gray-700">Product Name *</label> {/* Added label and asterisk */}
            <input
              id="product_name" // Added ID
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // Updated: Added border-gray-300, rounded-md, focus styles
              placeholder="e.g., Premium Wireless Headphones" // Added placeholder
            />
          </div>

          <div>
            <label htmlFor="product_description" className="block mb-1 font-medium text-gray-700">Description *</label> {/* Added label and asterisk */}
            <textarea
              id="product_description" // Added ID
              name="product_description"
              value={formData.product_description}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // Updated: Added border-gray-300, rounded-md, focus styles
              placeholder="Describe the product features, specifications, and benefits..." // Added placeholder
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="product_price" className="block mb-1 font-medium text-gray-700">Price (LKR) *</label> {/* Added label and asterisk */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">LKR</span>
                <input
                  id="product_price" // Added ID
                  type="number"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 pl-12 pr-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // Updated: Added border-gray-300, rounded-md, focus styles, adjusted padding for LKR
                  placeholder="0.00" // Added placeholder
                />
              </div>
            </div>
            <div>
              <label htmlFor="product_status" className="block mb-1 font-medium text-gray-700">Status *</label> {/* Added label and asterisk */}
              <select
                id="product_status" // Added ID
                name="product_status"
                value={formData.product_status}
                onChange={handleFormChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // Updated: Added border-gray-300, rounded-md, focus styles
              >
                <option value="">Select Status</option>
                <option value="active">Active (Visible to customers)</option> {/* Updated text */}
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Multi-Image Upload */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Product Images</label>
            <p className="text-sm text-gray-500 mb-3">Upload up to 4 images (first image will be used as the main display)</p> {/* Added description */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e)}
                      className="hidden"
                    />
                    <div className="w-full h-28 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md hover:bg-gray-50 relative overflow-hidden"> {/* Updated: Added relative and overflow-hidden */}
                      {previews[i] ? (
                        <>
                          <img src={previews[i]} alt={`Preview ${i + 1}`} className="object-cover w-full h-full rounded-md" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removeImage(i); }} // Prevent form submission
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none"
                            style={{ width: '20px', height: '20px' }} // Fixed size for button
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center"> {/* Centered content */}
                          <PlusIcon className="w-8 h-8 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">{i === 0 ? "Main Image" : `Image ${i + 1}`}</span> {/* Image labels */}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // Updated: Added rounded-md, focus styles
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/products")}
              className="ml-4 bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" // Updated: Changed to gray-200, text-gray-800, rounded-md, focus styles
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
