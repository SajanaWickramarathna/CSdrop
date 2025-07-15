const Product = require('../Models/product');
const Brand = require('../Models/brand');
const Category = require('../Models/category');

exports.addProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      product_status,
      category_id,
      brand_id,
    } = req.body;

    if (!category_id || !brand_id)
      return res.status(400).json({ error: "category_id and brand_id are required" });

    const brand = await Brand.findOne({
      brand_id: Number(brand_id),
      category_id: Number(category_id),
    });
    if (!brand)
      return res
        .status(400)
        .json({ error: "Brand does not belong to the given category" });

    // ✅ Handle multiple uploaded images
    let imageFilenames = [];
    for (let i = 1; i <= 4; i++) {
      const file = req.files?.[`product_image_${i}`];
      if (file && file[0]) {
        imageFilenames.push(file[0].filename);
      }
    }

    if (imageFilenames.length === 0) {
      return res.status(400).json({ error: "At least one product image is required" });
    }

    const product = new Product({
      product_name,
      product_description,
      product_price,
      product_status,
      category_id: Number(category_id),
      brand_id: Number(brand_id),
      images: imageFilenames,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// NEW: Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Make sure your product schema uses "category_id"
    const products = await Product.find({ category_id: Number(categoryId) });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products with brand and category names
exports.getAllProductsWithNames = async (req, res) => {
  try {
    // Get all products
    const products = await Product.find();
    // For each product, get brand and category name
    const productsWithNames = await Promise.all(products.map(async (prod) => {
      const brand = await Brand.findOne({ brand_id: prod.brand_id });
      const category = await Category.findOne({ category_id: prod.category_id });
      return {
        ...prod.toObject(),
        brand_name: brand ? brand.brand_name : "",
        category_name: category ? category.category_name : "",
      };
    }));
    res.json(productsWithNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ product_id: Number(id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // Handle optional image upload
    if (req.file && req.file.filename) {
      update.product_image = req.file.filename;
    }

    if (update.category_id || update.brand_id) {
      const catId = update.category_id ? Number(update.category_id) : undefined;
      const brId = update.brand_id ? Number(update.brand_id) : undefined;
      const product = await Product.findOne({ product_id: Number(id) });
      const finalCatId = catId || product.category_id;
      const finalBrId = brId || product.brand_id;

      // Validate brand-category association
      const brand = await Brand.findOne({ brand_id: finalBrId, category_id: finalCatId });
      if (!brand) return res.status(400).json({ error: 'Brand does not belong to the given category' });
    }

    const product = await Product.findOneAndUpdate({ product_id: Number(id) }, update, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOneAndDelete({ product_id: Number(id) });
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};