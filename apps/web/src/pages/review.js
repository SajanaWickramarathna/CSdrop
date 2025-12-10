import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Star, Edit, Trash2 } from "react-feather";

export default function ReviewSection({ productId, onStatsUpdate }) {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState({ rating: 5, comment: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (storedToken) {
        try {
          const { data } = await api.get(
            "/users/me",
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          setUser(data);
        } catch (err) {
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!productId) return;
    api
      .get(`/reviews/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      });
  }, [productId, refresh]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get(
        `/reviews/stats/${productId}`
      );
      if (onStatsUpdate) onStatsUpdate(data);
    } catch (err) {
      console.error("Error fetching updated stats:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!myReview.comment) return setError("Please add a comment");
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(
          `/reviews/${editingId}`,
          { ...myReview },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingId(null);
      } else {
        await api.post(
          "/reviews",
          {
            ...myReview,
            productId,
            userId: user.user_id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setMyReview({ rating: 5, comment: "" });
      setError("");
      setRefresh((r) => !r);
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setMyReview({ rating: review.rating, comment: review.comment });
    setEditingId(review._id);
    window.scrollTo({
      top: document.querySelector("form").offsetTop - 20,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh((r) => !r);
      await fetchStats();
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }

    return stars;
  };

  const isOwner = (review) => Number(review.userId) === Number(user?.user_id);
  const isAdmin = user?.role === "admin";

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Customer Reviews
      </h3>

      {reviews.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">{renderStars(r.rating)}</div>
                    <span className="text-sm text-gray-500">
                      {r.rating.toFixed(1)}/5.0
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{r.comment}</p>
                  <div className="text-sm text-gray-500">
                    Reviewed on{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                {(isOwner(r) || isAdmin) && (
                  <div className="flex space-x-2">
                    {isOwner(r) && (
                      <button
                        onClick={() => handleEdit(r)}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                        aria-label="Edit review"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      aria-label="Delete review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-white p-6 rounded-lg shadow-sm"
        >
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            {editingId ? "Edit Your Review" : "Write a Review"}
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setMyReview({ ...myReview, rating: star })}
                  className="focus:outline-none"
                >
                  {star <= myReview.rating ? (
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <Star className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {myReview.rating} out of 5
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="review-comment"
              value={myReview.comment}
              onChange={(e) =>
                setMyReview({ ...myReview, comment: e.target.value })
              }
              placeholder="Share your thoughts about this product..."
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingId ? "Updating..." : "Submitting..."}
              </span>
            ) : editingId ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setMyReview({ rating: 5, comment: "" });
              }}
              className="ml-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-blue-800">
            Please{" "}
            <a
              href="/login"
              className="font-semibold hover:underline text-blue-900"
            >
              log in
            </a>{" "}
            to leave a review.
          </p>
        </div>
      )}
    </div>
  );
}
