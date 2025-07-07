const Brand = require('../Models/brand');
const Category = require('../Models/category');
const Product = require('../Models/product');

exports.addBrand = async (req, res) => {
  try {
    const { brand_name, brand_description, brand_status, category_id } = req.body;
    if (!category_id) return res.status(400).json({ error: 'category_id is required' });

    const category = await Category.findOne({ category_id: Number(category_id) });
    if (!category) return res.status(400).json({ error: 'Invalid category_id' });

    let brand_image = "";
    if (req.file && req.file.filename) {
      brand_image = req.file.filename;
    } else {
      return res.status(400).json({ error: 'Brand image is required' });
    }

    const brand = new Brand({
      brand_name,
      brand_description,
      brand_image,
      brand_status,
      category_id: Number(category_id),
      category_name: category.category_name
    });
    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all brands with product count
exports.getAllBrandsWithProductCount = async (req, res) => {
  try {
    const brands = await Brand.find();
    const brandsWithProductCount = await Promise.all(
      brands.map(async (brand) => {
        const count = await Product.countDocuments({ brand_id: brand.brand_id });
        return {
          ...brand.toObject(),
          product_count: count,
        };
      })
    );
    res.json(brandsWithProductCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBrandsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const brands = await Brand.find({ category_id: Number(categoryId) });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({ brand_id: Number(id) });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (req.file && req.file.filename) {
      update.brand_image = req.file.filename;
    }
    if (update.category_id) {
      const category = await Category.findOne({ category_id: Number(update.category_id) });
      if (!category) return res.status(400).json({ error: 'Invalid category_id' });
      update.category_name = category.category_name;
    }
    const brand = await Brand.findOneAndUpdate({ brand_id: Number(id) }, update, { new: true });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MODIFIED: Delete brand and all related products
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    // First, delete all products related to this brand
    await Product.deleteMany({ brand_id: Number(id) });
    // Then, delete the brand itself
    const result = await Brand.findOneAndDelete({ brand_id: Number(id) });
    if (!result) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand and all related products deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};