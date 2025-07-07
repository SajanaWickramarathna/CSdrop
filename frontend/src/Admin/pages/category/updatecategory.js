import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UpdateCategory() {
  const [categoryData, setCategoryData] = useState({
    category_id: '',
    category_name: '',
    category_description: '',
    category_status: 'active',
    category_image: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const categoryDataFromLocation = location.state?.categoryData;

  useEffect(() => {
    if (categoryDataFromLocation) {
      setCategoryData({
        category_id: categoryDataFromLocation.category_id || '',
        category_name: categoryDataFromLocation.category_name || '',
        category_description: categoryDataFromLocation.category_description || '',
        category_status: categoryDataFromLocation.category_status || 'active',
        category_image: categoryDataFromLocation.category_image || '',
      });
      setImagePreview(
        categoryDataFromLocation.category_image?.startsWith('http')
          ? categoryDataFromLocation.category_image
          : `http://localhost:3001${categoryDataFromLocation.category_image || ''}`
      );
    } else {
      navigate('/admin-dashboard/category');
    }
  }, [categoryDataFromLocation, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setErrorMessage('Please select a valid image file.');
      setCategoryImage(null);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!categoryData.category_name.trim() || !categoryData.category_description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Check duplicate name (optional, but matches AddCategory)
    try {
      const nameToCheck = categoryData.category_name.trim().toLowerCase();
      const checkRes = await axios.get("http://localhost:3001/api/categories");
      const duplicate = checkRes.data.find(cat =>
        cat.category_name && cat.category_name.trim().toLowerCase() === nameToCheck &&
        cat.category_id !== categoryData.category_id
      );
      if (duplicate) {
        setErrorMessage("Category name already exists.");
        return;
      }
    } catch (err) {
      // Allow update to proceed if fetch fails, but you may log error
    }

    const formDataToSend = new FormData();
    formDataToSend.append('category_name', categoryData.category_name.trim());
    formDataToSend.append('category_description', categoryData.category_description);
    formDataToSend.append('category_status', categoryData.category_status);
    if (categoryImage) formDataToSend.append('category_image', categoryImage);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/updatecategory/${categoryData.category_id}`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (response.status === 200) {
        setSuccessMessage('Category updated successfully!');
        setTimeout(() => {
          navigate('/admin-dashboard/category');
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to update category');
    }
  };

  if (!categoryDataFromLocation) {
    return <div className="text-center text-gray-500">Redirecting...</div>;
  }

  return (
    <div className="container bg-white rounded-2xl p-4 mt-6 min-h-[75vh]">
      <form
        className="w-full mx-auto bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleUpdateCategory}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Category</h2>

        {successMessage && <p className="mb-4 text-green-500 font-medium">{successMessage}</p>}
        {errorMessage && <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Category Name</label>
          <input
            type="text"
            name="category_name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={categoryData.category_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Category Description</label>
          <textarea
            name="category_description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={categoryData.category_description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {imagePreview && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Category Image</label>
            <img src={imagePreview} alt={categoryData.category_name} className="rounded-md" height="100" width="100" />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Upload New Image</label>
          <input
            type="file"
            name="category_image"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            name="category_status"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={categoryData.category_status}
            onChange={handleInputChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">
          Update Category
        </button>
      </form>
    </div>
  );
}