import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBrand = () => {
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_description: "",
    brand_status: "active",
  });
  const [brandImage, setBrandImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setError] = useState("");
  const [successMessage, setSuccess] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setBrandImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setError("Please select a category first!");
      return;
    }

    setError("");
    setSuccess("");

    const brandData = new FormData();
    brandData.append("brand_name", formData.brand_name);
    brandData.append("brand_description", formData.brand_description);
    brandData.append("brand_status", formData.brand_status);
    brandData.append("category_id", categoryId); // new: assign to category
    if (brandImage) brandData.append("brand_image", brandImage);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/brands/addbrand",
        brandData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200) {
        setSuccess("Brand added successfully!");
        setFormData({
          brand_name: "",
          brand_description: "",
          brand_status: "active",
        });
        setBrandImage(null);
        setPreview(null);
        setCategoryId("");
        setTimeout(() => {
          window.location.href = "/admin-dashboard/brands";
        }, 1500);
      }
    } catch {
      setError("Failed to add brand.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Brand</h2>
      {successMessage && <p className="mb-4 text-green-500 font-medium">{successMessage}</p>}
      {errorMessage && <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="mb-4">
          <label htmlFor="brand-category" className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            id="brand-category"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
            ))}
          </select>
        </div>
        {/* Brand Name */}
        <div className="mb-4">
          <label htmlFor="brand-name" className="block text-gray-700 font-medium mb-2">
            Brand Name
          </label>
          <input
            type="text"
            id="brand-name"
            name="brand_name"
            value={formData.brand_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Brand name"
            required
          />
        </div>
        {/* Brand Description */}
        <div className="mb-4">
          <label htmlFor="brand-description" className="block text-gray-700 font-medium mb-2">
            Brand Description
          </label>
          <textarea
            id="brand-description"
            rows="4"
            name="brand_description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a brief description"
            value={formData.brand_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {/* Brand Image */}
        <div className="mb-4">
          <label htmlFor="brand-image" className="block text-gray-700 font-medium mb-2">
            Brand Image
          </label>
          <input
            type="file"
            id="brand-image"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <img src={preview} alt="Brand Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
          )}
        </div>
        {/* Brand Status */}
        <div className="mb-4">
          <label htmlFor="brand-status" className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            id="brand-status"
            name="brand_status"
            value={formData.brand_status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Add Brand
        </button>
      </form>
    </div>
  );
};

export default AddBrand;