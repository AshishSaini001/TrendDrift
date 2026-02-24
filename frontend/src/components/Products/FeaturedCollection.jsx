import React from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";
const FeaturedCollection = () => {
  return (
    <section className="pt-16 pb-4 px-4 ">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-cyan-50 rounded-3xl">
        {/* Left Content */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Comfort and Style
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Apparel made for your everyday life
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover high-quality, comfortable apparel designed to fit your
            lifestyle. Our collection offers a perfect blend of style and
            functionality, ensuring you look and feel great every day.
          </p>
          <Link
            to="/collections/all"
            className="bg-TrendDrift-red text-white px-6 py-3 rounded-lg text-lg hover:bg-[#017a96]"
          >
            Shop Now
          </Link>
        </div>
        {/* Right Image */}
        <div className="lg:w-1/2">
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
