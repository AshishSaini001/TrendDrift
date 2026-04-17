import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  createProduct,
  fetchAdminProducts,
  updateProduct,
} from "../../redux/slices/adminProductSlice";

const initialProductData = {
  name: "",
  description: "",
  price: 0,
  discountPrice: 0,
  countInStock: 0,
  sku: "",
  category: "",
  brand: "",
  sizes: [],
  colors: [],
  collections: "",
  material: [],
  gender: "Men",
  images: [],
  isFeatured: false,
  isPublished: false,
  tags: [],
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  weight: 0,
};

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.adminProducts);
  const [productData, setProductData] = useState(initialProductData);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "admin") {
      navigate("/");
      return;
    }

    if (products.length === 0) {
      dispatch(fetchAdminProducts());
    }
  }, [dispatch, navigate, products.length, user]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const selectedProduct = products.find((item) => item._id === id);
    if (!selectedProduct) {
      return;
    }

    setProductData({
      name: selectedProduct.name || "",
      description: selectedProduct.description || "",
      price: selectedProduct.price || 0,
      discountPrice: selectedProduct.discountPrice || 0,
      countInStock: selectedProduct.countInStock || 0,
      sku: selectedProduct.sku || "",
      category: selectedProduct.category || "",
      brand: selectedProduct.brand || "",
      sizes: Array.isArray(selectedProduct.sizes) ? selectedProduct.sizes : [],
      colors: Array.isArray(selectedProduct.colors)
        ? selectedProduct.colors
        : [],
      collections: selectedProduct.collections || "",
      material: Array.isArray(selectedProduct.material)
        ? selectedProduct.material
        : [],
      gender: selectedProduct.gender || "Men",
      images: Array.isArray(selectedProduct.images) ? selectedProduct.images : [],
      isFeatured: Boolean(selectedProduct.isFeatured),
      isPublished: Boolean(selectedProduct.isPublished),
      tags: Array.isArray(selectedProduct.tags) ? selectedProduct.tags : [],
      dimensions: selectedProduct.dimensions || {
        length: 0,
        width: 0,
        height: 0,
      },
      weight: selectedProduct.weight || 0,
    });
  }, [id, products]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) {
      return;
    }

    setIsUploadingImages(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    const uploadedImages = [];

    for (let index = 0; index < selectedFiles.length; index += 1) {
      const file = selectedFiles[index];
      const payload = new FormData();
      payload.append("image", file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          payload,
        );
        uploadedImages.push({
          url: response.data.imageUrl,
          altText: productData.name || "Product image",
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Image upload failed.");
      } finally {
        setUploadProgress((prev) => ({
          ...prev,
          current: index + 1,
        }));
      }
    }

    if (uploadedImages.length > 0) {
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      toast.success("Image uploaded successfully.");
    }

    setIsUploadingImages(false);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isUploadingImages) {
      toast.error("Please wait until image upload is complete.");
      return;
    }

    const payload = {
      ...productData,
      price: Number(productData.price),
      discountPrice: Number(productData.discountPrice) || 0,
      countInStock: Number(productData.countInStock),
      weight: Number(productData.weight) || 0,
      dimensions: {
        length: Number(productData.dimensions.length) || 0,
        width: Number(productData.dimensions.width) || 0,
        height: Number(productData.dimensions.height) || 0,
      },
      sizes: productData.sizes.filter(Boolean),
      colors: productData.colors.filter(Boolean),
      material: productData.material.filter(Boolean),
      tags: productData.tags.filter(Boolean),
    };

    const action = id
      ? updateProduct({ id, productData: payload })
      : createProduct(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(id ? "Product updated successfully." : "Product created successfully.");
        navigate("/admin/products");
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to save product.");
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      {loading && <p>Loading product details...</p>}

      <form onSubmit={handleSubmit}>
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
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

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
            min="0"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

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
              setProductData((prev) => ({
                ...prev,
                sizes: e.target.value.split(",").map((item) => item.trim()),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

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
              setProductData((prev) => ({
                ...prev,
                colors: e.target.value.split(",").map((item) => item.trim()),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Collection
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Material (comma separated)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="material"
            value={productData.material.join(", ")}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                material: e.target.value.split(",").map((item) => item.trim()),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

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
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={productData.tags.join(", ")}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((item) => item.trim()),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Dimensions (L/W/H)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              value={productData.dimensions.length}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    length: e.target.value,
                  },
                }))
              }
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Length"
            />
            <input
              type="number"
              value={productData.dimensions.width}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    width: e.target.value,
                  },
                }))
              }
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Width"
            />
            <input
              type="number"
              value={productData.dimensions.height}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    height: e.target.value,
                  },
                }))
              }
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Height"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Weight</label>
          <input
            type="number"
            name="weight"
            value={productData.weight}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={productData.isFeatured}
              onChange={handleChange}
            />
            <span>Featured product</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={productData.isPublished}
              onChange={handleChange}
            />
            <span>Published</span>
          </label>
        </div>

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
            disabled={isUploadingImages}
            className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-white file:cursor-pointer hover:file:bg-gray-700"
          />
          {isUploadingImages && (
            <p className="mt-2 text-sm text-blue-600">
              Uploading images {uploadProgress.current}/{uploadProgress.total}...
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt={img.altText || `Product ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isUploadingImages}
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
          disabled={isUploadingImages}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
        >
          {isUploadingImages
            ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
            : id
              ? "Update Product"
              : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
