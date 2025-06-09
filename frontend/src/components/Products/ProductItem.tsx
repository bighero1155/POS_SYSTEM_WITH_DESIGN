import React, { useState } from "react";
import ErrorHandler from "../ErrorHandler";

interface ProductItemProps {
  product: {
    id: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    category: {
      id: number;
      name: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
    };
  };
  onDelete: (id: number) => Promise<void>;
  onEdit: (product: any) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onDelete,
  onEdit,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(true);
      try {
        await onDelete(product.id);
        setMessage("Product successfully deleted.");
        setMessageType("success");
      } catch (error: any) {
        setMessage(error.message || "Error deleting product.");
        setMessageType("error");
      } finally {
        setIsDeleting(false);
      }
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const clearMessage = () => setMessage(null);

  return (
    <>
      {message && (
        <ErrorHandler
          message={message}
          type={messageType}
          clearMessage={clearMessage}
        />
      )}
      <div
        className="card mb-3 shadow-sm border-0"
        style={{ backgroundColor: "#f5f1eb" }}
      >
        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-12 col-md-8 col-lg-9 mb-2 mb-md-0">
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                <span
                  className="badge rounded-pill me-2 mb-2 mb-sm-0"
                  style={{ backgroundColor: "#8b4513", color: "white" }}
                >
                  {product.category?.name ?? "Uncategorized"}
                </span>
                <div className="product-details">
                  <h6 className="mb-1 fw-bold text-dark">{product.name}</h6>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <small className="text-muted">SKU: {product.sku}</small>
                    <span className="fw-semibold" style={{ color: "#8b4513" }}>
                      ₱{product.price.toLocaleString()}
                    </span>
                    <span className="badge bg-secondary">
                      Qty: {product.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <div className="d-flex gap-2 justify-content-md-end">
                <button
                  className="btn btn-sm flex-fill flex-md-grow-0"
                  style={{
                    backgroundColor: "#daa520",
                    borderColor: "#daa520",
                    color: "white",
                  }}
                  onClick={() => onEdit(product)}
                  disabled={isDeleting}
                >
                  <i className="fas fa-edit me-1"></i>
                  <span className="d-none d-sm-inline">Edit</span>
                </button>
                <button
                  className="btn btn-sm flex-fill flex-md-grow-0"
                  style={{
                    backgroundColor: "#cd853f",
                    borderColor: "#cd853f",
                    color: "white",
                  }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="d-none d-sm-inline">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-1"></i>
                      <span className="d-none d-sm-inline">Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
