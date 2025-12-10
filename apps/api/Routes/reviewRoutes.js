const express = require("express");
const router = express.Router();
const reviewController = require("../Controllers/review");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/product/:id", reviewController.getReviewsByProduct);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.get("/stats/:id", reviewController.getReviewStatsByProduct);


module.exports = router;
