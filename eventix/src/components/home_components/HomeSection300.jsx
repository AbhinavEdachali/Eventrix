import React from "react";
import img1 from "../../assets/images/hitesh.jpg"

const HomeSection7 = () => {
  return (
    <section className="bg-[#f9f6f1] py-16 px-6 lg:px-20 flex justify-center">
      <div className="max-w-7xl flex flex-col md:flex-row items-center">
        {/* Left Image */}
        <div className="md:w-1/2">
          <img
            src= {img1} // Replace with actual path
            alt="Wedding Couple"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0">
          <p className="uppercase text-sm tracking-widest text-gray-500">
            Award-Winning Wedding Photographer
          </p>
          <h2 className="text-4xl font-serif font-bold mt-2">
            Capturing Love Stories of 300+ Couples
          </h2>
          <p className="text-gray-700 mt-4">
            Your wedding day is a story waiting to be told. With a passion for
            capturing raw emotions and timeless moments, we turn your memories
            into stunning visuals. From the first glance to the final dance, we
            ensure every detail is preserved beautifully.
          </p>
          <p className="text-gray-700 mt-4">
            Every love story is unique, and so is our approach. Whether it's an
            intimate elopement or a grand celebration, we bring out the
            extraordinary in every moment, creating a collection of heartfelt
            memories for you to cherish forever.
          </p>

          {/* Featured In */}
          <div className="mt-6">
            <p className="uppercase text-sm tracking-widest text-gray-500">
              Proudly Featured In:
            </p>
            <div className="flex space-x-6 mt-2">
              <img src="/assets/images/carats.png" alt="Carats & Cake" />
              <img src="/assets/images/stylemepretty.png" alt="Style Me Pretty" />
              <img src="/assets/images/brides.png" alt="Brides" />
              <img src="/assets/images/junebug.png" alt="Junebug Weddings" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection7;
