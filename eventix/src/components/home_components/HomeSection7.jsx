import React from "react";
import { motion } from "framer-motion";

// Import images
import img1 from "../../assets/images/ab.jpg";
import img2 from "../../assets/images/ac.jpg";
import img3 from "../../assets/images/ae.jpg";
import img4 from "../../assets/images/ad.jpg";
import img5 from "../../assets/images/af.jpg";

const images = [img1, img2, img3, img4, img5];

const HomeSection6 = () => {
  return (
    <div className="relative w-full bg-gray-100 py-10 flex flex-col items-center overflow-hidden">
      <h2 className="text-center text-3xl font-bold mb-5">Gallery</h2>

      <div className="w-full overflow-hidden relative">
        <motion.div
          className="flex space-x-6"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {[...images, ...images].map((img, i) => (
            <div key={i} className="w-[450px] h-[700px] flex-shrink-0">
              <img
                src={img}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomeSection6;
