import React from "react";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  removeFromCart,
  updateQuantity,
}) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    updateQuantity(item.id, quantity);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {item.name} - ₱{item.price} x
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={handleQuantityChange}
        style={{ width: "50px", marginRight: "10px" }}
      />
      <button
        className="btn btn-danger btn-sm"
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>
    </li>
  );
};

export default CartItem;
