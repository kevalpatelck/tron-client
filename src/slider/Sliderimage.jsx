import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function SliderImage({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    "/images/step1.png",
    "/images/step2.png",
    "/images/step3.png",
    "/images/step4.png",
  ];
  
  const texts = [
    "Step 1: Welcome to the journey! Let's get started.",
    "Step 2: Follow the instructions carefully.",
    "Step 3: Almost there! Keep going.",
    "Step 4: Congratulations! You have completed the steps.",
  ];

  useEffect(() => {
    if (currentIndex === images.length - 1) {
      setTimeout(() => onClose(), 2000); // Auto-close popup after last step
    }
  }, [currentIndex, onClose]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  return (
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
    >
      {/* Image Section with Animation */}
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Step ${currentIndex + 1}`}
        className="w-full h-96 object-contain rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Text Section with Animation */}
      <motion.p 
        key={currentIndex + "-text"}
        className="text-lg text-gray-700 mt-4 text-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {texts[currentIndex]}
      </motion.p>

      {/* Next Button */}
      <button
        onClick={nextImage}
        className={`mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                    rounded-full shadow-lg hover:scale-105 transition-all duration-300 ${
                      currentIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
        disabled={currentIndex === images.length - 1}
      >
        {currentIndex === images.length - 1 ? "Completed ✔" : "Next →"}
      </button>
    </motion.div>
  );
}

export default SliderImage;
