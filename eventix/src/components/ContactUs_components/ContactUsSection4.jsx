import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../../assets/images/contact10.jpg";
import image2 from "../../assets/images/contact11.jpg";
import image3 from "../../assets/images/contact12.jpg";
import image4 from "../../assets/images/contact13.jpg";

const testimonials = [
  {
    text: "I have for the first time found what I can truly love—I have found you. You are my sympathy—my better self—my good angel—I am bound to you with a strong attachment.",
    author: "Charlotte Brontë, Jane Eyre",
  },
  {
    text: "Whatever our souls are made of, his and mine are the same. If all else perished, and he remained, I should still continue to be; and if all else remained, and he were annihilated, the universe would turn to a mighty stranger.",
    author: "Emily Brontë, Wuthering Heights",
  },
  {
    text: "Love is not breathlessness, it is not excitement, it is not the promulgation of promises of eternal passion. That is just being ‘in love,’ which any fool can do. Love itself is what is left over when being in love has burned away, and this is both an art and a fortunate accident.",
    author: "Louis de Bernières, Captain Corelli’s Mandolin",
  },
  {
    text: "I choose you. And I’ll choose you over and over and over. Without pause, without a doubt, in a heartbeat. I’ll keep choosing you.",
    author: "Unknown (often used in vows)",
  },
  {
    text: "When I look at you, I see everything I’ve ever wanted. I see a life filled with laughter, shared burdens, whispered secrets, and a love so deep it echoes in our every breath. Marrying you is not just a promise—it is a privilege.",
    author: "Original (for use in custom vows or content)",
  },
];

const images = [image1, image2, image3, image4];

const ContactUsSection4 = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Automatically switch testimonials every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 15000); // 15 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-[#e6d7cb] pt-16 px-4 text-center h-[865px] relative">
      {/* References Section */}
      <div className="relative bg-[#e6d7cb] pt-16 pb-8 px-6 w-[900px] h-[800px] mx-auto rounded-t-[50%] border-1 border-white">
        <h2 className="text-4xl font-serif pt-28 text-gray-800">References</h2>
        <div className="mt-8">
          <p className="text-gray-600 mx-32">{testimonials[currentTestimonial].text}</p>
          <p className="mt-4 font-semibold">{testimonials[currentTestimonial].author}</p>
        </div>
      </div>

      {/* Fixed Button Section */}
      <div
        className="absolute z-50 p-4"
        style={{
          top: "460px", // Adjust the top position as needed
          left: "50%", // Center horizontally
          transform: "translateX(-50%)", // Center alignment
        }}
      >
        <div className="flex justify-center space-x-4">
          <button onClick={prevTestimonial} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextTestimonial} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Instagram Section */}
      <div className="relative bg-[#f4ebe6] pt-14 px-4 mt-0 h-[300px] w-[900px] mx-auto justify-center bottom-[300px]">
        <h3 className="text-4xl font-serif text-gray-800">Instagram</h3>
        <div className="mt-4 flex justify-center space-x-4">
          {images.map((src, index) => (
            <img key={index} src={src} alt="Instagram post" className="w-28 h-28 object-cover rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUsSection4;
