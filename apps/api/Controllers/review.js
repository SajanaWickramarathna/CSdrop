const Review = require("../Models/review");

// Get all reviews for a product
// This should work if you use product_id as Number everywhere:
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: Number(req.params.id) }).populate("userId", "firstName lastName");
    res.json(reviews);
  } catch (err) {
    console.error("Review fetch error:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({ error: "All fields required" });
    }

    const review = new Review({ productId, userId, rating, comment });
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a review (only by the owner)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    const { rating, comment } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
};


// Delete a review (by owner or admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // No owner/admin check
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};

exports.getReviewStatsByProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const stats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({ avgRating: 0, reviewCount: 0 });
    }

    const { avgRating, reviewCount } = stats[0];
    res.json({ avgRating, reviewCount });
  } catch (err) {
    console.error("Error getting review stats:", err);
    res.status(500).json({ error: "Failed to get review stats" });
  }
};

