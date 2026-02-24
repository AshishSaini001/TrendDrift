import React from "react";
import { Link } from "react-router-dom";
import mens1 from "../../assets/Mens-collection-1.jpg";
import mens2 from "../../assets/Mens-collection-2.jpg";
import mens3 from "../../assets/Mens-collection-3.jpg";
import women1 from "../../assets/Women-collection-1.jpg";
import women2 from "../../assets/Women-collection-2.jpg";
import women3 from "../../assets/Women-collection-3.jpg";
const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Women's collection */}

        <div className="grid grid-rows-2 h-[700px]  cursor-pointer group">
          {/* top Two Images */}
          <div className="grid grid-cols-2">
            <div className="relative overflow-hidden">
              <img
                src={women3}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="relative overflow-hidden">
              <img
                src={women2}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
          {/* bottom Landscape */}
          <div className="relative overflow-hidden">
            <img
              src={women1}
              alt="Women's Collection"
              className="w-full  object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-500"></div>

            {/* TEXT HERE */}
            <div className="absolute bottom-7 left-8 text-white">
              <h2 className="text-4xl font-semibold mb-2 tracking-tight">
                Women's Collection
              </h2>
              <Link
                to="/collections/all?gender=Women"
                className="text-sm uppercase tracking-wider border-b border-white pb-1 hover:opacity-80 transition"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>

        {/* GRID MENS COLLECTION*/}

        <div className="grid grid-rows-2 h-[700px] cursor-pointer group">
          {/* top Two Images */}
          <div className="grid grid-cols-2">
            <div className="relative overflow-hidden">
              <img
                src={mens2}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="relative overflow-hidden">
              <img
                src={mens3}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
          {/* bottom Landscape */}
          <div className="relative overflow-hidden">
            <img
              src={mens1}
              alt="Men's Collection"
              className="w-full  object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-500"></div>

            {/* TEXT HERE */}
            <div className="absolute bottom-7 left-8 text-white">
              <h2 className="text-4xl font-semibold mb-2 tracking-tight">
                Men's Collection
              </h2>
              <Link
                to="/collections/all?gender=Men"
                className="text-sm uppercase tracking-wider border-b border-white pb-1 hover:opacity-80 transition"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
