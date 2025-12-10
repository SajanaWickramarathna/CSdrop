const Category = require('../Models/category');
const Brand = require('../Models/brand');
const Product = require('../Models/product'); // ADD THIS if not already imported

// ADD CATEGORY
exports.addCategory = async (req, res) => {
  try {
    let imagePath = '';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }
    const { category_name, category_description, category_status } = req.body;

    // Case-insensitive, trimmed duplicate check
    const exists = await Category.findOne({
      category_name: { $regex: `^${category_name.trim()}$`, $options: "i" }
    });
    if (exists) return res.status(400).json({ error: 'Category name already exists.' });

    const category = new Category({
      category_name: category_name.trim(),
      category_description,
      category_image: imagePath,
      category_status
    });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ category_id: Number(id) });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.category_name) {
      const exists = await Category.findOne({
        category_name: { $regex: `^${update.category_name.trim()}$`, $options: "i" },
        category_id: { $ne: Number(id) }
      });
      if (exists) return res.status(400).json({ error: 'Category name already exists.' });
      update.category_name = update.category_name.trim();
    }
    if (req.file) {
      update.category_image = '/uploads/' + req.file.filename;
    }
    const category = await Category.findOneAndUpdate({ category_id: Number(id) }, update, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories with brand count
exports.getAllCategoriesWithBrandCount = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithBrandCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Brand.countDocuments({ category_id: cat.category_id });
        return {
          ...cat.toObject(),
          brand_count: count,
        };
      })
    );
    res.json(categoriesWithBrandCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE CATEGORY + CASCADE DELETE BRANDS & PRODUCTS
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all brands in this category
    const brands = await Brand.find({ category_id: Number(id) });
    const brandIds = brands.map(b => b.brand_id);

    // Delete ALL products under these brands
    await Product.deleteMany({ brand_id: { $in: brandIds } });

    // Delete all brands under this category
    await Brand.deleteMany({ category_id: Number(id) });

    // Optionally: Delete products directly linked to category (if any)
    await Product.deleteMany({ category_id: Number(id) });

    // Delete the category itself
    const result = await Category.findOneAndDelete({ category_id: Number(id) });
    if (!result) return res.status(404).json({ error: 'Category not found' });

    res.json({ message: 'Category, related brands, and products deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};