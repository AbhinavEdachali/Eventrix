

import { useState, useEffect } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

export default function HomeSection5() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchFiveStarReviews = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/allreviews?rating=5`);
        const fiveStarReviews = response.data.map((review) => ({
          quote: "Amazing Experience!",
          text: review.reviewContent,
          author: `Review by ${review.username}`,
        }));
        setTestimonials(fiveStarReviews);
      } catch (error) {
        console.error("Error fetching 5-star reviews:", error);
      }
    };

    fetchFiveStarReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  if (testimonials.length === 0) {
    return (
      <div className="bg-[#F9F7F3] flex items-center justify-center p-10">
        <p className="text-gray-500">No 5-star reviews available.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F3] flex items-center justify-center p-10 relative">
      <button onClick={prevSlide} className="absolute left-5 bg-[#F1ECE3] p-3 rounded">
        ←
      </button>
      <div className="text-center max-w-2xl">
        <div className="text-6xl text-gray-500">&ldquo;</div>
        <h2 className="text-5xl font-serif text-gray-700 italic">{testimonials[currentIndex].quote}</h2>
        <p className="mt-4 text-gray-600">{testimonials[currentIndex].text}</p>
        <p className="mt-6 font-semibold text-gray-500">{testimonials[currentIndex].author}</p>
      </div>
      <button onClick={nextSlide} className="absolute right-5 bg-[#F1ECE3] p-3 rounded">
        →
      </button>
    </div>
  );
}
