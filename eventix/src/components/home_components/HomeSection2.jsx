import React from "react";

const HomeSection2 = () => {
  return (
    <div className="p-2">
        <div className="bg-[#EAE8E1] py-16 px-6 flex justify-center ">
      <div className="max-w-screen-2xl w-full flex flex-col md:flex-row items-center">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left px-6">
          <h2 className="text-5xl font-serif text-gray-800 leading-tight">
            CREATING UNFORGETTABLE <br /> WEDDING EXPERIENCES
          </h2>
          <p className="mt-3 text-gray-600 tracking-wide">
            PERFECTLY PLANNED, BEAUTIFULLY EXECUTED
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-300 h-40 mx-10"></div>

        {/* Right Side - Description */}
        <div className="w-full md:w-1/2 px-6 text-gray-600">
          <p>
            We specialize in turning wedding dreams into reality. From intimate
            elopements to grand celebrations, our team ensures every detail is
            flawlessly executed. Our expert planners bring your vision to life,
            creating moments of magic, beauty, and love.
          </p>
          <p className="mt-4">
            Let us handle everything from venue selection to decor, catering,
            and entertainment. With our wedding event management services, your
            special day will be stress-free, elegant, and truly memorable.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomeSection2;
