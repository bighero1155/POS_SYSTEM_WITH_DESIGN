import React, { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import Cart from "./Cart";
import Checkout from "./Checkout";
import { getAllProducts } from "../../services/productService";
import ErrorHandler from "../ErrorHandler";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  image_url?: string;
}

const POSDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showLowStockAlert, setShowLowStockAlert] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();

      const normalizedProducts = data.map((product: any) => ({
        ...product,
        category:
          typeof product.category === "object" && product.category !== null
            ? product.category.name
            : product.category || "Uncategorized",
        image_url: product.image
          ? `http://localhost:8000/storage/${product.image}`
          : null,
      }));

      setProducts(normalizedProducts);
      setFilteredProducts(normalizedProducts);
    } catch (error) {
      setMessage("Error fetching products.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory)
      );
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const handleAddToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const lowStockProducts = products.filter((product) => product.quantity <= 5);

  return (
    <div
      className="container-fluid align-items-center min-vh-100 px-3"
      style={{ backgroundColor: "#F5F1EB" }}
    >
      {message && (
        <ErrorHandler
          message={message}
          type={messageType}
          clearMessage={() => setMessage(null)}
        />
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        {showLowStockAlert && lowStockProducts.length > 0 && (
          <div
            className="alert alert-dismissible fade show w-100"
            role="alert"
            style={{
              backgroundColor: "#E8DDD4",
              borderColor: "#D4C4B0",
              color: "#8B4513",
            }}
          >
            <strong>Low Stock Alert:</strong> The following products have low
            stock:
            <ul className="mb-0">
              {lowStockProducts.map((product) => (
                <li key={product.id}>
                  {product.name} ({product.quantity} left)
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowLowStockAlert(false)}
            ></button>
          </div>
        )}
        <div className="flex-grow-1">
          <h1 className="display-6 fw-bold mb-0" style={{ color: "#8B4513" }}>
            REKBRANEZ
          </h1>
          <p className="mb-0" style={{ color: "#A0826D" }}>
            Manage sales and transactions
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <span
            className="badge rounded-pill fs-6"
            style={{ backgroundColor: "#CD853F", color: "white" }}
          >
            {cart.length} Item{cart.length !== 1 ? "s" : ""} in Cart
          </span>
          <span
            className="badge rounded-pill fs-6"
            style={{ backgroundColor: "#8B4513", color: "white" }}
          >
            ₱{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div
            className="card shadow-sm border-0 h-100"
            style={{ backgroundColor: "#FAF7F2" }}
          >
            <div
              className="card-header py-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
              style={{ backgroundColor: "#F0E6D6" }}
            >
              <h5 className="card-title mb-0" style={{ color: "#8B4513" }}>
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Products
              </h5>
              <select
                className="form-select w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  backgroundColor: "#FAF7F2",
                  borderColor: "#D4C4B0",
                  color: "#8B4513",
                }}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ color: "#CD853F" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <ProductSelection
                  products={filteredProducts}
                  addToCart={handleAddToCart}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div
            className="card shadow-sm border-0 mb-4"
            style={{ backgroundColor: "#FAF7F2" }}
          >
            <div
              className="card-header py-3"
              style={{ backgroundColor: "#F0E6D6" }}
            >
              <h5 className="card-title mb-0" style={{ color: "#8B4513" }}>
                <i className="bi bi-cart me-2"></i>
                Current Order
              </h5>
            </div>
            <div className="card-body">
              <Cart
                cart={cart}
                removeFromCart={handleRemoveFromCart}
                updateQuantity={handleUpdateQuantity}
                clearCart={clearCart}
              />
            </div>
          </div>

          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "#FAF7F2" }}
          >
            <div
              className="card-header py-3"
              style={{ backgroundColor: "#F0E6D6" }}
            >
              <h5 className="card-title mb-0" style={{ color: "#8B4513" }}>
                <i className="bi bi-credit-card me-2"></i>
                Payment
              </h5>
            </div>
            <div className="card-body">
              <Checkout cart={cart} clearCart={clearCart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
