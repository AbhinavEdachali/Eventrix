import React, { useEffect, useState } from "react";
import axios from "axios";

const backendGlobalRoute = "http://localhost:3001";

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/book/all-books`);
        setBookings(res.data || []);
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`${backendGlobalRoute}/api/book/update-book/${bookingId}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      alert("Status updated!");
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Bookings - Manage Status</h1>
      {loading ? (
        <div>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-500">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg bg-white shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Product(s)</th>
                <th className="py-2 px-4 text-left">Booking Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Notes</th>
                <th className="py-2 px-4 text-center">Modify Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">
                    {booking.user?.name || "Unknown"}
                    <div className="text-xs text-gray-500">{booking.email}</div>
                  </td>
                  <td className="py-2 px-4">
                    {booking.products && booking.products.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {booking.products.map((prod, idx) => (
                          <li key={idx}>
                            {prod.product?.product_name || prod.product || "Product"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleString()
                      : "-"}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {booking.notes || "-"}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const newStatus = e.target.status.value;
                        await handleStatusUpdate(booking._id, newStatus);
                      }}
                    >
                      <select
                        name="status"
                        defaultValue={booking.status}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        type="submit"
                        className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
