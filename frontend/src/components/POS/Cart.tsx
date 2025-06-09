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

interface CartProps {
  cart: Product[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  removeFromCart,
  updateQuantity,
  clearCart,
}) => {
  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div>
      {cart.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-cart-x display-4 text-muted mb-3"></i>
          <p className="text-muted mb-0">Your cart is empty</p>
          <small className="text-muted">Add some products to get started</small>
        </div>
      ) : (
        <>
          <div
            className="cart-items mb-3"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {cart.map((item) => (
              <div key={item.id} className="card mb-2 border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    <div className="col-3">
                      <div
                        className="rounded bg-light d-flex align-items-center justify-content-center"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling!.classList.remove(
                                "d-none"
                              );
                            }}
                          />
                        ) : null}
                        <i
                          className={`bi bi-image text-muted ${
                            item.image_url ? "d-none" : ""
                          }`}
                          style={{ fontSize: "24px" }}
                        ></i>
                      </div>
                    </div>

                    <div className="col-5">
                      <h6 className="mb-1 fw-semibold">{item.name}</h6>
                      <p className="mb-0 text-success fw-bold">
                        ₱{Number(item.price).toFixed(2)}
                      </p>
                      <small className="text-muted">{item.category}</small>
                    </div>

                    <div className="col-4">
                      <div className="d-flex align-items-center justify-content-end">
                        <div
                          className="input-group input-group-sm me-2"
                          style={{ width: "80px" }}
                        >
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 1) {
                                updateQuantity(item.id, value);
                              }
                            }}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove from cart"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <div className="text-end mt-1">
                        <small className="text-muted">
                          Subtotal:{" "}
                          <span className="fw-bold text-dark">
                            ₱{(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-top pt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Total:</h5>
              <h5 className="mb-0 text-success">₱{totalAmount.toFixed(2)}</h5>
            </div>
            <button
              className="btn btn-outline-warning w-100"
              onClick={clearCart}
            >
              <i className="bi bi-cart-x me-2"></i>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
