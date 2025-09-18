import React from "react";
import image1 from "../../assets/images/homesection.jpg";
import image2 from "../../assets/images/homesection1.jpg";
import image3 from "../../assets/images/homesection2.jpg";

const HomeSection4 = () => {
  return (
    <div className="w-full relative overflow-hidden"> {/* Ensure relative positioning for absolute children */}
      {/* Heading Section */}
      <section className="py-4 px-6 md:px-20 relative">
        <div className="absolute top-[150px] left-[500px] transform translate-x-4 translate-y-4">
          <h2 className="text-5xl font-bold text-gray-800 text-center md:text-left">
            CELEBRATE LOVE
          </h2>
        </div>
        <div className="absolute top-[200px] left-[700px] transform translate-x-4 translate-y-4">
          <h2 className="text-5xl font-bold text-gray-800 text-center md:text-left">
            YOUR WAY
          </h2>
        </div>
      </section>

      {/* Main Section with Left Image and Text */}
      <section className="bg-white py-16 px-6 md:pl-52 flex flex-col md:flex-row items-start gap-8 mb-11 w-full">
        {/* Left Image */}
        <div className="w-full md:w-[400px] h-[600px]">
          <img
            src={image1}
            alt="Left Image"
            className="w-full h-full shadow-lg object-cover"
          />
        </div>

        {/* Text Content */}
        <div
          className="absolute top-[250px] left-[595px] w-[500px] p-4 bg-transparent "
        > {/* Make this div movable */}
          <p className="text-sm uppercase tracking-widest text-gray-500 mt-2">
            Where Every Detail Tells Your Love Story
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            At Eventrix, we believe every celebration should be as unique as the couple at its heart. Whether you're envisioning a modern city soirée or a timeless countryside ceremony, our platform connects you with curated vendors to bring your vision to life.
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            From first ideas to final touches, Eventrix simplifies the journey. We help you discover venues, designers, and planners who understand your style — making it easy to craft a wedding that feels deeply personal, effortlessly beautiful, and joyfully unforgettable.
          </p>
        </div>

        {/* Right Small Images */}
        <div className="w-full md:w-4/12 flex flex-col gap-20">
          <img
            src={image3}
            alt="Top Right Image"
            className="w-[200px] h-[200px] shadow-lg object-cover ml-[400px]"
          />
          <img
            src={image2}
            alt="Bottom Right Image"
            className="w-[250px] h-[250px] shadow-lg object-cover ml-[623px]"
          />
        </div>
      </section>
    </div>
  );
};

export default HomeSection4;
