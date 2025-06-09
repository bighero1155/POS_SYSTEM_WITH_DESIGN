import React, { useEffect, useState } from "react";
import { getLowStockProducts } from "../../services/productService";

interface Product {
  id: number;
  name: string;
  quantity: number;
}

const LowStockAlert: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [threshold, setThreshold] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLowStock = async () => {
      setIsLoading(true);
      try {
        const products = await getLowStockProducts(threshold);
        setLowStockProducts(products);
      } catch (error) {
        console.error("Failed to fetch low stock products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLowStock();
  }, [threshold]);

  return (
    <>
      <style>{`
        .card-brown {
          background: linear-gradient(135deg, #f5f1eb 0%, #ede4d3 100%);
          border: 1px solid #d4c4a8;
          box-shadow: 0 8px 32px rgba(139, 115, 85, 0.15);
        }

        .card-body-brown {
          background: linear-gradient(135deg, #faf8f5 0%, #f0ede6 100%);
          padding: 2rem;
        }

        .form-control-brown {
          border: 1.5px solid #c4a484;
          background-color: #faf8f5;
          transition: all 0.3s ease;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }

        .form-control-brown:focus {
          border-color: #8b7355;
          box-shadow: 0 0 0 0.2rem rgba(139, 115, 85, 0.25);
          background-color: #ffffff;
        }

        .form-label-brown {
          color: #5d4e37;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .list-group-item-brown {
          background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
          border: 1px solid #d4c4a8;
          border-radius: 0.5rem !important;
          margin-bottom: 0.75rem;
          padding: 1rem 1.25rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
        }

        .list-group-item-brown:hover {
          background: linear-gradient(135deg, #f0ede6 0%, #ede4d3 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(139, 115, 85, 0.2);
        }

        .list-group-item-brown:last-child {
          margin-bottom: 0;
        }

        .badge-brown-warning {
          background: linear-gradient(135deg, #d4a574 0%, #c4975c 100%);
          color: #5d4e37;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          border: 1px solid #b8935a;
        }

        .badge-brown-critical {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .success-message-brown {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border: 1px solid #b8dacc;
          color: #155724;
          padding: 1.5rem;
          border-radius: 0.75rem;
          text-align: center;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(21, 87, 36, 0.1);
        }

        .product-name-brown {
          color: #5d4e37;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .threshold-container {
          background: linear-gradient(135deg, #f0ede6 0%, #ede4d3 100%);
          border: 1px solid #d4c4a8;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
        }

        .input-group-brown .input-group-text {
          background: linear-gradient(135deg, #c4a484 0%, #a08968 100%);
          border: 1.5px solid #c4a484;
          color: white;
          font-weight: 500;
          border-radius: 0.5rem 0 0 0.5rem;
        }

        .spinner-brown {
          color: #8b7355;
          width: 2rem;
          height: 2rem;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          background: linear-gradient(135deg, #faf8f5 0%, #f0ede6 100%);
          border-radius: 0.75rem;
        }

        .alert-stats {
          background: linear-gradient(135deg, #8b7355 0%, #6d5a47 100%);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
          .card-body-brown {
            padding: 1.5rem;
          }

          .threshold-container {
            padding: 1rem;
          }

          .list-group-item-brown {
            padding: 0.75rem 1rem;
          }

          .alert-stats {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="container-fluid px-0">
        <div className="card card-brown border-0 shadow-lg mt-4">
          <div className="card-header bg-danger text-white">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Low Stock Alerts
              </h4>
              <div className="badge bg-light text-danger px-3 py-2">
                <i className="bi bi-boxes me-1"></i>
                {lowStockProducts.length} Alert
                {lowStockProducts.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="card-body card-body-brown">
            <div className="threshold-container">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-sliders alert-icon text-muted"></i>
                <label htmlFor="threshold" className="form-label-brown mb-0">
                  Alert Threshold Configuration
                </label>
              </div>

              <div className="input-group">
                <span className="input-group-text input-group-brown">
                  <i className="bi bi-bar-chart-line me-1"></i>
                  Min Stock
                </span>
                <input
                  id="threshold"
                  type="number"
                  min="1"
                  max="100"
                  className="form-control form-control-brown"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  placeholder="Enter minimum stock level"
                />
              </div>
              <div className="form-text text-muted mt-2">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  Products with stock below this threshold will trigger alerts
                </small>
              </div>
            </div>
            {!isLoading && (
              <div className="alert-stats">
                <div className="d-flex align-items-center">
                  <i className="bi bi-graph-down-arrow me-2"></i>
                  <span className="fw-bold">Stock Alert Summary</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-3">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {lowStockProducts.length} Product
                    {lowStockProducts.length !== 1 ? "s" : ""} Low
                  </span>
                  <span>
                    <i className="bi bi-arrow-down-circle me-1"></i>
                    Threshold: {threshold}
                  </span>
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="loading-container">
                <div className="text-center">
                  <div
                    className="spinner-border spinner-brown mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mb-0 fw-bold">
                    <i className="bi bi-search me-2"></i>
                    Checking stock levels...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {lowStockProducts.length === 0 ? (
                  <div className="success-message-brown">
                    <div className="mb-3">
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ fontSize: "3rem", color: "#28a745" }}
                      ></i>
                    </div>
                    <h5 className="mb-2">
                      <i className="bi bi-shield-check me-2"></i>
                      All Products Sufficiently Stocked
                    </h5>
                    <p className="mb-0">
                      All products have stock levels above the threshold of{" "}
                      <strong>{threshold}</strong> units.
                    </p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {lowStockProducts.map((product) => {
                      const isCritical =
                        product.quantity <= Math.floor(threshold / 2);

                      return (
                        <div
                          key={product.id}
                          className="list-group-item list-group-item-brown d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i
                                className={`bi ${
                                  isCritical
                                    ? "bi-exclamation-triangle-fill text-danger"
                                    : "bi-exclamation-circle-fill text-warning"
                                }`}
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </div>
                            <div>
                              <h6 className="product-name-brown mb-1">
                                {product.name}
                              </h6>
                              <small className="text-muted">
                                <i className="bi bi-hash me-1"></i>
                                Product ID: {product.id}
                              </small>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`badge ${
                                isCritical
                                  ? "badge-brown-critical"
                                  : "badge-brown-warning"
                              }`}
                            >
                              <i className="bi bi-boxes me-1"></i>
                              {product.quantity} left
                            </span>
                            {isCritical && (
                              <span className="badge bg-danger">
                                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                Critical
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {!isLoading && lowStockProducts.length > 0 && (
              <div
                className="mt-4 p-3"
                style={{
                  background:
                    "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                  border: "1px solid #ffecb5",
                  borderRadius: "0.75rem",
                }}
              >
                <h6 className="text-warning-emphasis mb-2">
                  <i className="bi bi-lightbulb-fill me-2"></i>
                  Recommended Actions
                </h6>
                <ul className="mb-0 text-warning-emphasis">
                  <li className="mb-1">
                    <i className="bi bi-arrow-right me-1"></i>
                    Review and update reorder levels for critical items
                  </li>
                  <li className="mb-1">
                    <i className="bi bi-arrow-right me-1"></i>
                    Contact suppliers for immediate restocking
                  </li>
                  <li>
                    <i className="bi bi-arrow-right me-1"></i>
                    Consider adjusting alert thresholds based on demand patterns
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LowStockAlert;
