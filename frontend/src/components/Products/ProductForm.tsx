import React, { useEffect, useState } from "react";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import ErrorHandler from "../ErrorHandler";
import { ProductFieldErrors } from "../../Errors/ProductFieldErrors";

interface ProductFormProps {
  selectedProduct: any;
  onFormSubmit: (updatedProduct?: any) => void;
  clearSelectedProduct: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  selectedProduct,
  onFormSubmit,
  clearSelectedProduct,
}) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name || "");
      setSku(selectedProduct.sku || "");
      setPrice(
        selectedProduct.price != null ? selectedProduct.price.toString() : ""
      );
      setQuantity(
        selectedProduct.quantity != null
          ? selectedProduct.quantity.toString()
          : ""
      );
      setReorderLevel(
        selectedProduct.reorder_level != null
          ? selectedProduct.reorder_level.toString()
          : ""
      );
      setCategory(
        selectedProduct.category_id != null
          ? selectedProduct.category_id.toString()
          : ""
      );

      if (selectedProduct.image_url) {
        setImagePreview(selectedProduct.image_url);
      } else {
        setImagePreview(null);
      }

      setImageFile(null);
    } else {
      clearForm();
    }
  }, [selectedProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = (): ProductFieldErrors => {
    const newErrors: ProductFieldErrors = {};

    if (!name.trim()) newErrors.name = ["Product name is required."];
    else if (name.trim().length > 15)
      newErrors.name = ["Product name is too long."];

    if (!sku.trim()) newErrors.sku = ["SKU is required."];
    else if (sku.trim().length > 100) newErrors.sku = ["SKU is too long."];

    if (!price.trim()) newErrors.price = ["Price is required."];
    else if (isNaN(Number(price)) || Number(price) < 0)
      newErrors.price = ["Price must be a valid positive number."];

    if (!quantity.trim()) newErrors.quantity = ["Quantity is required."];
    else if (isNaN(Number(quantity)) || Number(quantity) < 0)
      newErrors.quantity = ["Quantity must be a valid positive number."];

    if (!reorderLevel.trim())
      newErrors.reorder_level = ["Reorder level is required."];
    else if (isNaN(Number(reorderLevel)) || Number(reorderLevel) < 0)
      newErrors.reorder_level = [
        "Reorder level must be a valid positive number.",
      ];

    if (!category.trim()) newErrors.category = ["Category is required."];

    if (imageFile) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(imageFile.type)) {
        newErrors.image = ["Only JPG, PNG, and GIF images are allowed."];
      }
      const maxSizeMB = 2;
      if (imageFile.size > maxSizeMB * 1024 * 1024) {
        newErrors.image = [`Image size must be less than ${maxSizeMB}MB.`];
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      const existingProducts = await getAllProducts();
      const isDuplicate = existingProducts.some(
        (product: { name: string; id: any }) =>
          product.name.toLowerCase() === name.trim().toLowerCase() &&
          product.id !== selectedProduct?.id
      );

      if (isDuplicate) {
        setMessage("Product name already exists.");
        setMessageType("error");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("sku", sku.trim());
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("reorder_level", reorderLevel);
      formData.append("category_id", category);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (selectedProduct) {
        const updatedProduct = await updateProduct(
          selectedProduct.id,
          formData
        );
        setMessage("Product successfully updated.");
        setMessageType("success");
        onFormSubmit(updatedProduct);
      } else {
        const newProduct = await createProduct(formData);
        setMessage("Product successfully added.");
        setMessageType("success");
        onFormSubmit(newProduct);
      }

      clearForm();
    } catch (error: any) {
      setMessage(
        error.message || "An error occurred while saving the product."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setName("");
    setSku("");
    setPrice("");
    setQuantity("");
    setReorderLevel("");
    setCategory("");
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    clearSelectedProduct();
  };

  const clearMessage = () => setMessage(null);

  return (
    <>
      <style>{`
        .card-brown {
          background: linear-gradient(135deg, #f5f1eb 0%, #ede4d3 100%);
          border: 1px solid #d4c4a8;
          box-shadow: 0 8px 32px rgba(139, 115, 85, 0.15);
        }

        .card-header-brown {
          background: linear-gradient(135deg, #8b7355 0%, #6d5a47 100%);
          border-bottom: 2px solid #5d4e37;
        }

        .form-control-brown {
          border: 1.5px solid #c4a484;
          background-color: #faf8f5;
          transition: all 0.3s ease;
        }

        .form-control-brown:focus {
          border-color: #8b7355;
          box-shadow: 0 0 0 0.2rem rgba(139, 115, 85, 0.25);
          background-color: #ffffff;
        }

        .form-select-brown {
          border: 1.5px solid #c4a484;
          background-color: #faf8f5;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23c4a484' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          transition: all 0.3s ease;
        }

        .form-select-brown:focus {
          border-color: #8b7355;
          box-shadow: 0 0 0 0.2rem rgba(139, 115, 85, 0.25);
          background-color: #ffffff;
        }

        .btn-brown {
          background: linear-gradient(135deg, #8b7355 0%, #6d5a47 100%);
          border: 1px solid #5d4e37;
          color: white;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
        }

        .btn-brown:hover {
          background: linear-gradient(135deg, #6d5a47 0%, #5d4e37 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 115, 85, 0.4);
          color: white;
        }

        .btn-brown:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.3);
        }

        .btn-secondary-brown {
          background: linear-gradient(135deg, #c4a484 0%, #a08968 100%);
          border: 1px solid #8b7355;
          color: white;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-secondary-brown:hover {
          background: linear-gradient(135deg, #a08968 0%, #8b7355 100%);
          transform: translateY(-1px);
          color: white;
        }

        .form-label-brown {
          color: #5d4e37;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .input-group-text-brown {
          background: linear-gradient(135deg, #c4a484 0%, #a08968 100%);
          border: 1.5px solid #c4a484;
          color: white;
          font-weight: 500;
        }

        .image-preview-container {
          background: linear-gradient(135deg, #faf8f5 0%, #f0ede6 100%);
          border: 2px dashed #c4a484;
          border-radius: 0.75rem;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .image-preview-container:hover {
          border-color: #8b7355;
          background: linear-gradient(135deg, #f0ede6 0%, #ede4d3 100%);
        }

        .form-floating-brown .form-control {
          border: 1.5px solid #c4a484;
          background-color: #faf8f5;
        }

        .form-floating-brown .form-control:focus {
          border-color: #8b7355;
          box-shadow: 0 0 0 0.2rem rgba(139, 115, 85, 0.25);
        }

        .form-floating-brown label {
          color: #8b7355;
        }

        @media (max-width: 768px) {
          .btn-brown,
          .btn-secondary-brown {
            width: 100%;
            margin-bottom: 0.5rem;
          }

          .image-preview-container img {
            max-width: 100px !important;
            max-height: 100px !important;
          }
        }

        .spinner-border-brown {
          color: #8b7355;
        }
      `}</style>

      <div className="container-fluid px-0">
        <div className="card card-brown border-0 shadow-lg">
          <div className="card-header card-header-brown text-white">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 fw-bold">
                <i
                  className={`bi ${
                    selectedProduct ? "bi-pencil-square" : "bi-plus-circle"
                  } me-2`}
                ></i>
                {selectedProduct ? "Update Product" : "Add New Product"}
              </h4>
              <div className="badge bg-light text-dark px-3 py-2">
                <i className="bi bi-box-seam me-1"></i>
                Product Management
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {message && (
              <div className="mb-4">
                <ErrorHandler
                  message={message}
                  type={messageType}
                  clearMessage={clearMessage}
                />
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
            >
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-muted mb-3 border-bottom border-2 pb-2">
                    <i className="bi bi-info-circle me-2"></i>
                    Basic Information
                  </h5>
                </div>

                <div className="col-lg-6 col-md-12 mb-3">
                  <label
                    htmlFor="productName"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-tag me-1"></i>
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    className={`form-control form-control-brown ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={15}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback fw-bold">
                      {errors.name[0]}
                    </div>
                  )}
                  <div className="form-text text-muted">
                    <small>Maximum 15 characters</small>
                  </div>
                </div>

                <div className="col-lg-6 col-md-12 mb-3">
                  <label
                    htmlFor="productSku"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-upc-scan me-1"></i>
                    SKU <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="productSku"
                    className={`form-control form-control-brown ${
                      errors.sku ? "is-invalid" : ""
                    }`}
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    maxLength={100}
                    placeholder="Enter SKU code"
                  />
                  {errors.sku && (
                    <div className="invalid-feedback fw-bold">
                      {errors.sku[0]}
                    </div>
                  )}
                  <div className="form-text text-muted">
                    <small>Stock Keeping Unit - Maximum 100 characters</small>
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-muted mb-3 border-bottom border-2 pb-2">
                    <i className="bi bi-currency-exchange me-2"></i>
                    Pricing & Inventory
                  </h5>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <label
                    htmlFor="productPrice"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-currency-dollar me-1"></i>
                    Price <span className="text-danger">*</span>
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text input-group-text-brown">
                      ₱
                    </span>
                    <input
                      type="number"
                      id="productPrice"
                      className={`form-control form-control-brown ${
                        errors.price ? "is-invalid" : ""
                      }`}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <div className="invalid-feedback fw-bold">
                        {errors.price[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <label
                    htmlFor="productQuantity"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-boxes me-1"></i>
                    Quantity <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="productQuantity"
                    className={`form-control form-control-brown ${
                      errors.quantity ? "is-invalid" : ""
                    }`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="0"
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <div className="invalid-feedback fw-bold">
                      {errors.quantity[0]}
                    </div>
                  )}
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <label
                    htmlFor="reorderLevel"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-arrow-repeat me-1"></i>
                    Reorder Level <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="reorderLevel"
                    className={`form-control form-control-brown ${
                      errors.reorder_level ? "is-invalid" : ""
                    }`}
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    required
                    min="0"
                    placeholder="Enter reorder level"
                  />
                  {errors.reorder_level && (
                    <div className="invalid-feedback fw-bold">
                      {errors.reorder_level[0]}
                    </div>
                  )}
                  <div className="form-text text-muted">
                    <small>Minimum stock level before reordering</small>
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-muted mb-3 border-bottom border-2 pb-2">
                    <i className="bi bi-collection me-2"></i>
                    Category & Media
                  </h5>
                </div>

                <div className="col-lg-6 col-md-12 mb-3">
                  <label
                    htmlFor="categorySelect"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-bookmark me-1"></i>
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    id="categorySelect"
                    className={`form-select form-select-brown ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback fw-bold">
                      {errors.category[0]}
                    </div>
                  )}
                </div>

                <div className="col-lg-6 col-md-12 mb-3">
                  <label
                    htmlFor="productImage"
                    className="form-label form-label-brown"
                  >
                    <i className="bi bi-image me-1"></i>
                    Product Image
                  </label>
                  <input
                    type="file"
                    id="productImage"
                    className={`form-control form-control-brown ${
                      errors.image ? "is-invalid" : ""
                    }`}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <div className="invalid-feedback fw-bold">
                      {errors.image[0]}
                    </div>
                  )}
                  <div className="form-text text-muted">
                    <small>Accepted formats: JPG, PNG, GIF (Max 2MB)</small>
                  </div>

                  {imagePreview && (
                    <div className="image-preview-container mt-3">
                      <p className="text-muted mb-2 fw-bold">Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="img-thumbnail shadow-sm"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "cover",
                          border: "3px solid #c4a484",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-flex flex-column flex-md-row gap-2 justify-content-end pt-3 border-top">
                    <button
                      type="submit"
                      className="btn btn-brown px-4 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm spinner-border-brown me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {selectedProduct ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <i
                            className={`bi ${
                              selectedProduct
                                ? "bi-check2-circle"
                                : "bi-plus-circle"
                            } me-2`}
                          ></i>
                          {selectedProduct ? "Update Product" : "Add Product"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary-brown px-4 py-2"
                      onClick={clearForm}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Clear Form
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
