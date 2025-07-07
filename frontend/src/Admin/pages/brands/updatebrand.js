import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function UpdateBrand() {
  const [formData, setFormData] = useState({
    brand_name: '',
    brand_description: '',
    brand_status: 'active',
  });
  const [brandImage, setBrandImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Get brand ID either from URL param or location.state
  const brandId = params.id || location.state?.brandData?.brand_id;

  // Fetch categories
  useEffect(() => {
    axios.get('http://localhost:3001/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => setErrorMessage('Failed to load categories'));
  }, []);

  // Fetch brand data
  useEffect(() => {
    if (!brandId) {
      setErrorMessage('No brand selected');
      setLoading(false);
      return;
    }
    axios.get(`http://localhost:3001/api/brands/brand/${brandId}`)
      .then(res => {
        const brand = res.data;
        setFormData({
          brand_name: brand.brand_name || '',
          brand_description: brand.brand_description || '',
          brand_status: brand.brand_status || 'active',
        });
        setCategoryId(brand.category_id?.toString() || '');
        setImagePreview(
          brand.brand_image
            ? (brand.brand_image.startsWith('http')
                ? brand.brand_image
                : `http://localhost:3001/uploads/${brand.brand_image}`)
            : ''
        );
        setLoading(false);
      })
      .catch(err => {
        setErrorMessage('Failed to load brand data');
        setLoading(false);
      });
  }, [brandId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setBrandImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setErrorMessage('Please select a valid image file.');
      setBrandImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!categoryId) {
      setErrorMessage('Please select a category!');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('brand_name', formData.brand_name);
    formDataToSend.append('brand_description', formData.brand_description);
    formDataToSend.append('brand_status', formData.brand_status);
    formDataToSend.append('category_id', categoryId);
    if (brandImage) formDataToSend.append('brand_image', brandImage);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/brands/updatebrand/${brandId}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.status === 200) {
        setSuccessMessage('Brand updated successfully!');
        setTimeout(() => {
          navigate('/admin-dashboard/brands');
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to update brand');
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (errorMessage) return <div className="text-center text-red-500">{errorMessage}</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Brand</h2>
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
          />
          {imagePreview && (
            <img src={imagePreview} alt="Brand Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
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
          Update Brand
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin-dashboard/brands')}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 mt-4"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}