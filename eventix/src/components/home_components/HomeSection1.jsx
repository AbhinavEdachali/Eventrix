import React, { useState, useEffect } from "react";
import img1 from "../../assets/images/ab.jpg";
import img2 from "../../assets/images/home1.jpeg";
import img3 from "../../assets/images/home2.jpeg";
import img4 from "../../assets/images/ac.jpg";

const images = [img1, img2, img3, img4];

const HomeSection1 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // 5 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="p-2">
      <div className="relative w-[calc(100%-4px)] h-screen mx-auto overflow-hidden">
        {/* Background Images */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            } filter brightness-50`}
          />
        ))}

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10">
          <h1 className="text-7xl font-serif drop-shadow-md">Eventrix</h1>
          <p className="text-lg tracking-wide mt-2 drop-shadow-sm">
            Where Every Event Tells a Story.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSection1;
