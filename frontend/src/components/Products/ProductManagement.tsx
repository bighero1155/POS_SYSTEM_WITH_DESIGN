import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import LowStockAlert from "./LowStockAlert";
import { getAllProducts } from "../../services/productService";

const ProductManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormSubmit = () => {
    fetchProducts();
    setSelectedProduct(null);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
  };
  return (
    <>
      <style>{`
        .main-container {
          background: linear-gradient(135deg, #f8f6f0 0%, #f5f1eb 100%);
          min-height: 100vh;
        }

        .header-section {
          background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
          position: sticky;
          top: 0;
          z-index: 1020;
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.25);
        }

        .content-section {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        .management-card {
          background: #ffffff;
          border: 2px solid rgba(139, 69, 19, 0.15);
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(139, 69, 19, 0.12);
        }

        .section-divider {
          border: none;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            #8b4513,
            transparent
          );
          margin: 2rem 0;
        }

        .stats-card {
          background: linear-gradient(135deg, #daa520 0%, #cd853f 100%);
          border-radius: 12px;
          color: white;
          box-shadow: 0 6px 20px rgba(218, 165, 32, 0.25);
        }

        .form-section {
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
          border: 1px solid rgba(139, 69, 19, 0.08);
          border-radius: 12px;
          box-shadow: inset 0 2px 4px rgba(139, 69, 19, 0.05);
        }

        .form-header {
          background: linear-gradient(135deg, #f8f6f0 0%, #f5f1eb 100%);
          border-bottom: 2px solid rgba(139, 69, 19, 0.12);
          border-radius: 12px 12px 0 0;
          padding: 1.5rem;
        }

        .list-header {
          background: linear-gradient(135deg, #f8f6f0 0%, #f5f1eb 100%);
          border-bottom: 2px solid rgba(139, 69, 19, 0.12);
          border-radius: 12px 12px 0 0;
          padding: 1.5rem;
        }

        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(139, 69, 19, 0.12);
        }

        .header-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          margin-right: 1rem;
        }

        .alert-section {
          margin-bottom: 1.5rem;
        }

        .enhanced-card {
          background: #ffffff;
          border: 1px solid rgba(139, 69, 19, 0.12);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.08);
        }

        .header-title {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          font-size: 2.2rem;
          font-weight: 700;
        }

        .stats-icon {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
        }

        .stats-number {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .stats-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0.9;
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #8b4513;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          box-shadow: 0 3px 10px rgba(139, 69, 19, 0.25);
        }

        .btn-secondary-custom {
          background: linear-gradient(135deg, #daa520 0%, #cd853f 100%);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          box-shadow: 0 3px 10px rgba(218, 165, 32, 0.25);
          color: white;
        }

        .alert-custom {
          border: 0;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.08);
          background: linear-gradient(135deg, #fff3cd 0%, #fef8e7 100%);
          border-left: 4px solid #ffc107;
        }

        @media (max-width: 768px) {
          .header-section {
            position: relative;
          }

          .content-section {
            padding-top: 1rem;
          }

          .management-card {
            margin: 0.5rem;
          }

          .stats-grid {
            gap: 1rem !important;
          }

          .header-title {
            font-size: 1.8rem;
          }

          .stats-number {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .stats-card {
            margin-bottom: 1rem;
            padding: 1.5rem !important;
          }

          .header-icon-wrapper {
            width: 40px;
            height: 40px;
            margin-right: 0.75rem;
          }

          .header-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="main-container">
        <div className="header-section">
          <div className="container-fluid">
            <div className="row py-3 py-md-4">
              <div className="col-12">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  <div className="mb-3 mb-md-0">
                    <div className="d-flex align-items-center">
                      <div className="header-icon-wrapper">
                        <i className="fas fa-cogs text-white fa-lg"></i>
                      </div>
                      <div>
                        <h1 className="text-white mb-1 header-title">
                          Product Management
                        </h1>
                        <p className="text-white-50 mb-0 d-none d-md-block">
                          Manage your inventory with ease and efficiency
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-section">
          <div className="container-fluid">
            {error && (
              <div className="row mb-4">
                <div className="col-12">
                  <div
                    className="alert alert-danger alert-dismissible fade show alert-custom"
                    role="alert"
                  >
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                </div>
              </div>
            )}
            <div className="row mb-4 g-3">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stats-card p-4 text-center h-100">
                  <div className="stats-icon">
                    <i className="fas fa-box fa-xl"></i>
                  </div>
                  <div className="stats-number">{products.length}</div>
                  <div className="stats-label">Total Products</div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stats-card p-4 text-center h-100">
                  <div className="stats-icon">
                    <i className="fas fa-exclamation-triangle fa-xl"></i>
                  </div>
                  <div className="stats-number">
                    {products.filter((p) => p.quantity <= 10).length}
                  </div>
                  <div className="stats-label">Low Stock Items</div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stats-card p-4 text-center h-100">
                  <div className="stats-icon">
                    <i className="fas fa-tags fa-xl"></i>
                  </div>
                  <div className="stats-number">
                    {new Set(products.map((p) => p.category?.name)).size}
                  </div>
                  <div className="stats-label">Categories</div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stats-card p-4 text-center h-100">
                  <div className="stats-icon">
                    <i className="fas fa-dollar-sign fa-xl"></i>
                  </div>
                  <div className="stats-number">
                    ₱
                    {products
                      .reduce((sum, p) => sum + p.price * p.quantity, 0)
                      .toLocaleString()}
                  </div>
                  <div className="stats-label">Total Value</div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-12">
                <div className="alert-section">
                  <LowStockAlert />
                </div>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <div className="management-card h-100">
                  <div className="form-header">
                    <div className="d-flex align-items-center">
                      <div className="icon-wrapper me-3">
                        <i
                          className="fas fa-edit"
                          style={{ color: "#8b4513" }}
                        ></i>
                      </div>
                      <h3 className="mb-0 section-title">
                        {selectedProduct ? "Edit Product" : "Add New Product"}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    {selectedProduct && (
                      <div className="alert alert-info border-0 mb-4 enhanced-card p-3">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-info-circle me-2 text-info"></i>
                          <span className="fw-semibold">
                            Editing:{" "}
                            <strong className="text-primary">
                              {selectedProduct.name}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}

                    <ProductForm
                      selectedProduct={selectedProduct}
                      onFormSubmit={handleFormSubmit}
                      clearSelectedProduct={clearSelectedProduct}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="management-card h-100">
                  <div className="list-header">
                    <div className="d-flex align-items-center">
                      <div className="icon-wrapper me-3">
                        <i
                          className="fas fa-list"
                          style={{ color: "#8b4513" }}
                        ></i>
                      </div>
                      <h3 className="mb-0 section-title">Product List</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <ProductList
                      products={products}
                      setProducts={setProducts}
                      selectProduct={handleSelectProduct}
                    />
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

export default ProductManagement;
