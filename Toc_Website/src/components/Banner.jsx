import React from "react";
import Slider from "./Slider";

const Banner = () => {
  return (
    <section className="w-full flex flex-col items-center justify-start gap-12 pb-10">
      
      {/* Slider full width */}
      <div className="w-full">
        <Slider />
      </div>

      {/* Text + Button Container */}
      <div className="flex flex-col items-center gap-4 text-center px-4 sm:px-6 md:px-32">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-[IBM Plex Sans Thai] leading-[1.2] md:leading-[60px]">
          <span className="text-white">Your Ultimate </span>
          <span className="text-[#006EFA]">Car</span>
          <span className="text-white"> Information Hub</span>
        </h1>

        <p className="text-[#BFBFBF] text-sm sm:text-base md:text-base leading-5 sm:leading-6 md:leading-6 max-w-[95%] sm:max-w-[780px]">
          Explore comprehensive car specifications, features, and insights from multiple sources all in one place.
          Compare models, discover key details, and make informed decisions with ease.
        </p>

        {/* Button */}
        <button className="px-4 sm:px-6 md:px-6 py-2 sm:py-3 bg-[#006EFA] rounded-full text-white text-sm sm:text-base md:text-lg font-bold font-[IBM Plex Sans Thai] mt-4">
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default Banner;
