import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(true);

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

        {/* Image Section */}
        <div className="relative w-full h-80 overflow-hidden bg-gray-100">

          {/* Skeleton Loader */}
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          )}

          <img
            loading="lazy"
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            onLoad={() => setLoading(false)}
            className={`w-full h-full object-cover transition-all duration-700 
              ${loading ? "opacity-0" : "opacity-100 group-hover:scale-110"}`}
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 group-hover:text-black transition">
            {product.name}
          </h3>
          <p className="text-gray-900 font-semibold mt-2">
            ${product.price}
          </p>
        </div>

      </div>
    </Link>
  );
};

export default ProductGrid;