import React from "react";
import backgroundImage from "../../assets/images/peach2.jpg";
import weddingIcon from "../../assets/images/arch.png"; // Import a relevant icon

const ContactUsSection2 = () => {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center h-[1500px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Border Wrapper */}
      <div className="absolute top-0 right-0 w-full sm:w-[404px] md:w-[454px] lg:w-[1012px] lg:h-[574px] 
                      rounded-bl-[290px] border-3 border-white opacity-50"></div>

      {/* About Us Box */}
      <div className="relative bg-white p-12 md:p-16 lg:p-20 
                      rounded-bl-[270px] shadow-lg w-full sm:w-[400px] md:w-[450px] lg:w-[988px] lg:h-[550px] 
                      flex flex-col justify-between gap-16 ml-auto">
        {/* Text Section */}
        <div className="space-y-6 space-x-9">
  <h2 className="text-5xl md:text-6xl font-bold text-gray-900 ml-9 ">About Us</h2>
  <p className="text-lg text-gray-700 leading-relaxed">
    At DreamDay Weddings, we don’t just plan events — we design unforgettable experiences filled with love, joy, and timeless memories.
    Our passion is turning your dream wedding into reality, tailored to reflect your story and style.
  </p>
  <p className="text-lg text-gray-700 leading-relaxed">
    With a dedicated team of creative planners, designers, and coordinators, we bring elegance, efficiency, and emotion to every detail —
    from your first “yes” to your final dance. Whether it's an intimate beach ceremony or a grand ballroom affair,
    we make sure your big day feels effortlessly magical.
  </p>
</div>


        {/* Button Positioned at Bottom-Right */}
        <div className="flex justify-end mt-[-30px]">
          <a 
            href="/about-us" 
            className="px-[100px] py-4 bg-[#3D3144] text-white font-semibold 
                       rounded-tl-[30px] rounded-br-[30px] shadow-md w-[35%] hover:bg-[#2B1E2D]"
          >
            ABOUT US
          </a>
        </div>
      </div>

      {/* Our Offer Section */}
      <div className="relative w-full flex flex-col items-center mt-52 p-12">
        <h2 className="text-5xl font-bold text-white text-center">Our Offer</h2>

        {/* Flex container for left and right content with a vertical line */}
        <div className="flex flex-col lg:flex-row justify-center items-center mt-12 w-full max-w-7xl">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-left pl-44 space-y-4 text-white">
            <p className="text-lg font-semibold">Floral & Venue Decorations</p>
            <p className="text-lg font-semibold">Catering & Custom Wedding Cake</p>
            <p className="text-lg font-semibold">Full-Service Coordination</p>
            <p className="text-lg font-semibold">Live Music & Guest Entertainment</p>
            <p className="text-lg font-semibold">Professional Photography & Videography</p>
            <p className="text-lg font-semibold">Bridal Makeup & Hairstyling</p>
          </div>

          {/* Vertical Line */}
          <div className="hidden lg:block h-[300px] w-[2px] bg-gray-400 mx-8"></div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-gray-700 text-lg space-y-4">
            {/* Wedding Icon */}
            <div className="w-32 h-32">
              <img src={weddingIcon} alt="Wedding Icon" className="w-full h-full object-cover" />
            </div>
            <p className="text-white text-left max-w-md">
              From breathtaking venue styling to delectable cakes and seamless event flow, we handle every detail 
              with elegance and expertise. Let us make your wedding day truly magical.
            </p>
            <p className="text-white text-left max-w-md">
              Whether it's an intimate beach ceremony or a grand ballroom celebration, our goal is to exceed your expectations 
              and create timeless memories.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Text Positioned Inside the Box */}
      <div className="absolute bottom-10 left-32 text-7xl font-bold text-white">
        Portfolio
      </div>
    </section>
  );
};

export default ContactUsSection2;
