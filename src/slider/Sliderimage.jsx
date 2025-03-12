import React, { useState } from 'react';
import { Carousel } from '@material-tailwind/react';

function Sliderimage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80',
  ];

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <Carousel className="rounded-xl">
        <img
          src={images[currentIndex]}
          alt={`image ${currentIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </Carousel>
      <button
        onClick={nextImage}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Next
      </button>
    </div>
  );
}

export default Sliderimage;
