import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  image_url?: string;
}

interface ProductSelectionProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  products,
  addToCart,
}) => {
  return (
    <div>
      {products.length > 0 ? (
        <div className="row g-3">
          {products.map((product) => (
            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div
                  className="card-img-top bg-light d-flex align-items-center justify-content-center position-relative"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling!.classList.remove("d-none");
                      }}
                    />
                  ) : null}
                  <div
                    className={`d-flex flex-column align-items-center justify-content-center text-muted ${
                      product.image_url ? "d-none" : ""
                    }`}
                  >
                    <i className="bi bi-image" style={{ fontSize: "48px" }}></i>
                    <small>No Image</small>
                  </div>

                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-primary bg-opacity-90 text-white">
                      {product.category}
                    </span>
                  </div>

                  <div className="position-absolute top-0 end-0 m-2">
                    <span
                      className={`badge ${
                        product.quantity > 0 ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {product.quantity > 0
                        ? `${product.quantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  <h6
                    className="card-title mb-2 fw-semibold"
                    title={product.name}
                  >
                    {product.name.length > 25
                      ? `${product.name.substring(0, 25)}...`
                      : product.name}
                  </h6>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h5 mb-0 text-success fw-bold">
                        ₱{Number(product.price).toFixed(2)}
                      </span>
                    </div>

                    <button
                      className={`btn w-100 ${
                        product.quantity > 0
                          ? "btn-primary"
                          : "btn-secondary disabled"
                      }`}
                      onClick={() => product.quantity > 0 && addToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-4 text-muted mb-3"></i>
          <h5 className="text-muted">No products available</h5>
          <p className="text-muted mb-0">
            {products.length === 0
              ? "No products match your current filter"
              : "Check back later for new products"}
          </p>
        </div>
      )}

      <style>{`
        .product-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .product-card:hover .card-img-top img {
          transform: scale(1.05);
        }

        .product-card .btn {
          transition: all 0.2s ease;
        }

        .product-card .btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default ProductSelection;
