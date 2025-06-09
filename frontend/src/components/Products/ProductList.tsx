import React from "react";
import ProductItem from "./ProductItem";
import ErrorHandler from "../ErrorHandler";
import { deleteProduct } from "../../services/productService";

interface ProductListProps {
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  selectProduct: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  setProducts,
  selectProduct,
}) => {
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageType, setMessageType] = React.useState<"success" | "error">(
    "success"
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setMessage("Product successfully deleted.");
      setMessageType("success");
    } catch (error: any) {
      setMessage(error.message || "Error deleting product.");
      setMessageType("error");
    }
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const clearMessage = () => setMessage(null);

  return (
    <div className="container-fluid px-0">
      {message && (
        <ErrorHandler
          message={message}
          type={messageType}
          clearMessage={clearMessage}
        />
      )}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ backgroundColor: "#8b4513" }}
          >
            <div className="card-body py-3">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                <h3 className="mb-2 mb-sm-0 text-white">
                  <i className="fas fa-box me-2"></i>
                  Product Inventory
                </h3>
                <div className="d-flex align-items-center">
                  <span
                    className="badge rounded-pill fs-6 px-3 py-2"
                    style={{ backgroundColor: "#f5f1eb", color: "#8b4513" }}
                  >
                    {products.length}{" "}
                    {products.length === 1 ? "Product" : "Products"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {products.length > 0 ? (
            <div className="products-container">
              {products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  onEdit={() => selectProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div
                className="card border-0 shadow-sm mx-auto"
                style={{
                  backgroundColor: "#f5f1eb",
                  maxWidth: "400px",
                }}
              >
                <div className="card-body py-5">
                  <div className="mb-3">
                    <i
                      className="fas fa-box-open fa-3x"
                      style={{ color: "#8b4513", opacity: 0.5 }}
                    ></i>
                  </div>
                  <h5 className="mb-3" style={{ color: "#8b4513" }}>
                    No Products Available
                  </h5>
                  <p className="text-muted mb-0">
                    Start by adding your first product to the inventory.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .products-container {
          max-height: 70vh;
          overflow-y: auto;
        }

        .products-container::-webkit-scrollbar {
          width: 6px;
        }

        .products-container::-webkit-scrollbar-track {
          background: #f5f1eb;
          border-radius: 3px;
        }

        .products-container::-webkit-scrollbar-thumb {
          background: #8b4513;
          border-radius: 3px;
        }

        .products-container::-webkit-scrollbar-thumb:hover {
          background: #654321;
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15) !important;
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 576px) {
          .products-container {
            max-height: 60vh;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;
