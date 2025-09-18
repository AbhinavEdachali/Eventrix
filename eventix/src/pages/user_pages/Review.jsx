"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import backendGlobalRoute from "../../config/config";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ name: "", rating: 1, comment: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendGlobalRoute}/api/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendGlobalRoute}/api/reviews`, formData);
      setFormData({ name: "", rating: 1, comment: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Customer Reviews</h2>
      <div className="mb-8">
        {reviews.map((review, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <p className="text-lg font-semibold">{review.name}</p>
            <div className="flex gap-1 text-yellow-500">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Your Review"
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Review;
