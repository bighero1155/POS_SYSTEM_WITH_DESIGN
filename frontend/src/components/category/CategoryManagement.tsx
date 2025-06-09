import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

export interface Category {
  id: number;
  name: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data ?? []);
    } catch {
      setMessage("Failed to fetch categories.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (selectedCategory) {
      await handleUpdateCategory(selectedCategory.id, categoryName);
    } else {
      await handleAddCategory(categoryName);
    }
    setCategoryName("");
    setSelectedCategory(null);
  };

  const handleAddCategory = async (name: string) => {
    try {
      const category = await createCategory({ name });
      setCategories((prev) => [...prev, category]);
      setMessage("Category added successfully.");
      setMessageType("success");
    } catch {
      setMessage("Failed to add category.");
      setMessageType("error");
    }
  };

  const handleUpdateCategory = async (id: number, name: string) => {
    try {
      const updated = await updateCategory(id, { name });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      );
      setMessage("Category updated successfully.");
      setMessageType("success");
    } catch {
      setMessage("Failed to update category.");
      setMessageType("error");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setMessage("Category deleted successfully.");
      setMessageType("success");
      if (selectedCategory?.id === id) setSelectedCategory(null);
    } catch {
      setMessage("Failed to delete category.");
      setMessageType("error");
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
  };

  const customStyles = `
    .category-container {
      background: linear-gradient(135deg, #f5f0e8 0%, #ede0d3 100%);
      min-height: 100vh;
      padding: 2rem 0;
    }
    
    .category-card {
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
      border: none;
      overflow: hidden;
    }
    
    .category-header {
      background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
      color: white;
      padding: 1.5rem;
      margin: -1rem -1rem 1.5rem -1rem;
      text-align: center;
    }
    
    .category-header h2 {
      margin: 0;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .form-section {
      background: #faf7f2;
      border-radius: 10px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 2px solid #ddd2c4;
    }
    
    .form-label {
      color: #654321;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .form-control {
      border: 2px solid #ddd2c4;
      border-radius: 8px;
      padding: 0.75rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .form-control:focus {
      border-color: #8b4513;
      box-shadow: 0 0 0 0.25rem rgba(139, 69, 19, 0.25);
      background: white;
    }
    
    .btn-brown {
      background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
      border: none;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .btn-brown:hover {
      background: linear-gradient(135deg, #a0522d 0%, #8b4513 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
      color: white;
    }
    
    .btn-light-brown {
      background: linear-gradient(135deg, #deb887 0%, #d2b48c 100%);
      border: none;
      color: #654321;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-light-brown:hover {
      background: linear-gradient(135deg, #d2b48c 0%, #deb887 100%);
      transform: translateY(-1px);
      color: #654321;
    }
    
    .btn-edit {
      background: linear-gradient(135deg, #cd853f 0%, #daa520 100%);
      border: none;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 5px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-edit:hover {
      background: linear-gradient(135deg, #daa520 0%, #cd853f 100%);
      transform: translateY(-1px);
      color: white;
    }
    
    .btn-delete {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      border: none;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 5px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-delete:hover {
      background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
      transform: translateY(-1px);
      color: white;
    }
    
    .table-section {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
    }
    
    .table-header {
      background: linear-gradient(135deg, #f4f1eb 0%, #ede0d3 100%);
      padding: 1rem;
      border-bottom: 2px solid #ddd2c4;
    }
    
    .table-header h4 {
      margin: 0;
      color: #654321;
      font-weight: 600;
    }
    
    .custom-table {
      margin: 0;
      border: none;
    }
    
    .custom-table thead {
      background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
    }
    
    .custom-table thead th {
      color: white;
      border: none;
      padding: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.875rem;
    }
    
    .custom-table tbody tr {
      transition: all 0.3s ease;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .custom-table tbody tr:hover {
      background: #faf7f2;
      transform: scale(1.01);
    }
    
    .custom-table td {
      padding: 1rem;
      vertical-align: middle;
      border: none;
    }
    
    .alert-custom {
      border-radius: 10px;
      border: none;
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    
    .alert-success-custom {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
      border-left: 4px solid #28a745;
    }
    
    .alert-error-custom {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
      border-left: 4px solid #dc3545;
    }
    
    .loading-spinner {
      text-align: center;
      padding: 3rem;
      color: #8b4513;
      font-size: 1.1rem;
    }
    
    .no-data {
      text-align: center;
      padding: 3rem;
      color: #a0522d;
      font-size: 1.1rem;
      font-style: italic;
    }
    
    @media (max-width: 768px) {
      .category-container {
        padding: 1rem 0;
      }
      
      .btn-group-mobile {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .btn-group-mobile .btn {
        width: 100%;
      }
      
      .table-responsive {
        font-size: 0.875rem;
      }
      
      .custom-table td {
        padding: 0.75rem 0.5rem;
      }
    }
    
    @media (max-width: 576px) {
      .category-header {
        padding: 1rem;
        margin: -1rem -1rem 1rem -1rem;
      }
      
      .form-section {
        padding: 1rem;
      }
      
      .custom-table thead th {
        padding: 0.75rem 0.5rem;
        font-size: 0.75rem;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="category-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <div className="category-card card">
                <div className="card-body p-4">
                  <div className="category-header">
                    <h2>Category Management</h2>
                  </div>

                  {message && (
                    <div
                      className={`alert-custom ${
                        messageType === "success"
                          ? "alert-success-custom"
                          : "alert-error-custom"
                      }`}
                      role="alert"
                    >
                      <strong>
                        {messageType === "success" ? "Success!" : "Error!"}
                      </strong>{" "}
                      {message}
                    </div>
                  )}

                  <div className="form-section">
                    <div onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          id="categoryName"
                          className="form-control"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          placeholder="Enter category name..."
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && categoryName.trim()) {
                              handleSubmit(e);
                            }
                          }}
                        />
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-brown"
                          onClick={handleSubmit}
                          disabled={!categoryName.trim()}
                        >
                          {selectedCategory
                            ? "Update Category"
                            : "Add Category"}
                        </button>
                        {selectedCategory && (
                          <button
                            type="button"
                            className="btn btn-light-brown"
                            onClick={() => {
                              setSelectedCategory(null);
                              setCategoryName("");
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="table-section">
                    <div className="table-header">
                      <h4>Existing Categories ({categories.length})</h4>
                    </div>

                    {loading ? (
                      <div className="loading-spinner">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading categories...</p>
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="no-data">
                        <i className="fas fa-folder-open fa-3x mb-3 d-block"></i>
                        <p>
                          No categories found. Create your first category above!
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table custom-table">
                          <thead>
                            <tr>
                              <th scope="col">ID</th>
                              <th scope="col">Category Name</th>
                              <th scope="col" style={{ minWidth: "150px" }}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((category) => (
                              <tr key={category.id}>
                                <td>
                                  <strong>#{category.id}</strong>
                                </td>
                                <td>
                                  <span className="fw-medium">
                                    {category.name}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex gap-2 btn-group-mobile">
                                    <button
                                      className="btn btn-edit btn-sm"
                                      onClick={() => handleEditClick(category)}
                                      title="Edit category"
                                    >
                                      <i className="fas fa-edit me-1"></i>
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-delete btn-sm"
                                      onClick={() =>
                                        handleDeleteCategory(category.id)
                                      }
                                      title="Delete category"
                                    >
                                      <i className="fas fa-trash me-1"></i>
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
