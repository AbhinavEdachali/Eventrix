import React, { useEffect, useState } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const ReviewResponce = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${backendGlobalRoute}/api/allreviews`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(res.data || []);
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Product Reviews</h1>
      {loading ? (
        <div>Loading...</div>
      ) : reviews.length === 0 ? (
        <div>No reviews found.</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Rating</th>
              <th className="py-2 px-4 text-left">Review</th>
              <th className="py-2 px-4 text-left">Photos</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="py-2 px-4">{r.username || (r.userId && r.userId.name) || "User"}</td>
                <td className="py-2 px-4">
                  {r.productName ||
                    (r.productId && r.productId.product_name) ||
                    "Product"}
                </td>
                <td className="py-2 px-4">{r.rating}★</td>
                <td className="py-2 px-4">{r.reviewContent}</td>
                <td className="py-2 px-4">
                  {r.photos && r.photos.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {r.photos.slice(0, 2).map((photo, idx) => (
                        <img
                          key={idx}
                          src={`${backendGlobalRoute}/${photo.replace(/\\/g, "/")}`}
                          alt="Review"
                          className="w-10 h-10 object-cover rounded"
                        />
                      ))}
                      {r.photos.length > 2 && (
                        <span className="text-xs text-gray-400 ml-2">
                          +{r.photos.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-2 px-4">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewResponce;
