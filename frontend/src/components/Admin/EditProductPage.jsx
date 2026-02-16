import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
const EditProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: [],
    material: "",
    gender: "",
    images: [
      {
        url: "https://picsum.photos/150?random=1",
      },
      {
        url: "https://picsum.photos/150?random=2",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
  };

  const handleRemoveImage = (index) => {
    setProductData({
      ...productData,
      images: productData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated product data:", productData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Product Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Description
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Price
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Count In Stock
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            SKU
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Category
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Brand
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma separated)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma separated)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Collections */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Collections (comma separated)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="collections"
            value={productData.collections.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                collections: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Material
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Gender
            <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Image upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Upload Image
            <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-white file:cursor-pointer hover:file:bg-gray-700"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt={`Product ${index}`}
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
        >
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
