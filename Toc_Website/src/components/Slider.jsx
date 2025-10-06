import React, { useState, useEffect } from "react";
import car1 from "../assets/cars-1.png";
import car2 from "../assets/cars-2.png";
import car3 from "../assets/cars-3.png";

const images = [car1, car2, car3];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[360px] relative overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
        />
      ))}
    </div>
  );
};

export default Slider;
