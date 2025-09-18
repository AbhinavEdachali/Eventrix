import React, { useState, useEffect } from "react";
import image1 from "../../assets/images/contact1.jpg";
import image2 from "../../assets/images/contact2.jpg";
import image3 from "../../assets/images/contact3.jpg";
import image4 from "../../assets/images/contact4.jpg";
import image5 from "../../assets/images/contact5.jpg";
import image6 from "../../assets/images/contact6.jpg";
import image7 from "../../assets/images/contact7.jpg";
import image8 from "../../assets/images/contact8.jpg";


const images = [image1, image2, image3, image4, image5, image6, image7, image8];

const ContactUsSection3 = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[850px] bg-white py-16 px-8 flex flex-col lg:flex-row items-center lg:items-start">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 space-y-6 relative z-10">
      <p className="text-lg text-gray-700 leading-relaxed p-0 mt-2 ml-10 mr-28">
  Our wedding portfolio captures the essence of every couple’s journey — from intimate ceremonies to grand celebrations.
</p>
<p className="text-lg text-gray-700 leading-relaxed ml-10 mr-28">
  Explore moments of love, joy, and timeless beauty through our carefully curated collection of weddings we’ve had the honor to plan and execute.
</p>


        <div className="relative w-[550px] overflow-hidden left-7">
        <div className="flex space-x-4 animate-marquee w-[calc(450px*2)]">
          {images.concat(images).map((img, index) => (
          <img key={index} src={img} className="w-40 h-40 object-cover rounded-md" alt="portfolio" />
        ))}
        </div>
        </div>
        
        {/* See More Button */}
        



      </div>

      {/* Right Content: Larger Overlay Image with Navigation */}
      <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0 right-20 top-[-170px]">
        <div className="relative w-[700px] h-[800px] lg:w-[800px] lg:h-[900px] overflow-hidden shadow-lg">
          <img
            src={images[currentImage]}
            alt="Portfolio showcase"
            className="w-full h-full object-cover transition-transform duration-1000 transform scale-1 animate-slide"
          />
          {/* Navigation Buttons */}
          <button
            onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
            className="absolute left-80 bottom-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 rounded-tl-[30px] rounded-br-[30px]"
          >
            &#8249;
          </button>
          <button
            onClick={() => setCurrentImage((currentImage + 1) % images.length)}
            className="absolute right-80 bottom-2 transform -translate-y-1/2 bg-white bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 rounded-tr-[30px] rounded-bl-[30px]"
          >
            &#8250;
          </button>
          
        </div>
      </div>

      {/* Overlay Effect */}
      <div className="absolute right-0 top-0 w-[800px] h-[900px] -z-10 bg-gray-200 opacity-30" />
    </section>
  );
};

export default ContactUsSection3;
