import React, { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    category_name: "",
    category_description: "",
    category_status: "active",
  });

  const [catIcon, setCatIcon] = useState();
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCatIcon(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setErrorMessage("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Normalize name for duplicate check
    const nameToCheck = formData.category_name.trim().toLowerCase();

    try {
      // Get all categories and check normalized
      const checkRes = await axios.get("http://localhost:3001/api/categories");
      const duplicate = checkRes.data.find(
        cat => cat.category_name && cat.category_name.trim().toLowerCase() === nameToCheck
      );
      if (duplicate) {
        setErrorMessage("Category name already exists.");
        return;
      }
    } catch (err) {
      setErrorMessage("Failed to check existing categories.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("category_name", formData.category_name.trim());
    formDataToSend.append("category_description", formData.category_description);
    formDataToSend.append("category_status", formData.category_status);

    if (catIcon) {
      formDataToSend.append("category_image", catIcon);
    } else {
      setErrorMessage("Category image is required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/categories/addcategory",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        alert("Category Added Successfully");
        setSuccessMessage("Process complete. Redirecting....");
        setFormData({
          category_name: "",
          category_description: "",
          category_status: "active",
        });
        setCatIcon(null);
        setPreview(null);

        setTimeout(() => {
          window.location.href = "/admin-dashboard/category";
        }, 1500);
      }
    } catch {
      setErrorMessage("Failed to add category.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h2>
      {successMessage && <p className="mb-4 text-green-500 font-medium">{successMessage}</p>}
      {errorMessage && <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-4">
          <label htmlFor="category-name" className="block text-gray-700 font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            required
            placeholder="Enter a Category Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        {/* Category Description */}
        <div className="mb-4">
          <label htmlFor="category-description" className="block text-gray-700 font-medium mb-2">
            Category Description
          </label>
          <textarea
            rows={4}
            name="category_description"
            value={formData.category_description}
            onChange={handleChange}
            required
            placeholder="Enter a brief description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        {/* Category Image */}
        <div className="mb-4">
          <label htmlFor="category-image" className="block text-gray-700 font-medium mb-2">
            Category Image
          </label>
          <input
            type="file"
            id="category_image"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <img src={preview} alt="Category Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
          )}
        </div>
        {/* Category Status */}
        <div className="mb-4">
          <label htmlFor="category-status" className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            id="category-status"
            name="category_status"
            value={formData.category_status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;