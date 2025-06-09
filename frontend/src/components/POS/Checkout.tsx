import React, { useState } from "react";
import { createOrder } from "../../services/orderService";
import ErrorHandler from "../ErrorHandler";
import Receipt from "./Receipt";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  cart: Product[];
  clearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<
    "none" | "senior" | "student" | "pwd"
  >("none");
  const [amountPaid, setAmountPaid] = useState<number | "">("");
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  const calculateOriginalTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateDiscountAmount = (total: number) => {
    if (discountType === "senior" || discountType === "pwd") return total * 0.2;
    if (discountType === "student") return total * 0.1;
    return 0;
  };

  const calculateFinalAmount = (total: number, discount: number) =>
    total - discount;

  const calculateChangeDue = (finalAmount: number) =>
    typeof amountPaid === "number" && amountPaid >= finalAmount
      ? amountPaid - finalAmount
      : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage("Cart is empty. Add products to proceed.");
      setMessageType("error");
      return;
    }

    const originalTotal = calculateOriginalTotal();
    const discountAmount = calculateDiscountAmount(originalTotal);
    const finalAmount = calculateFinalAmount(originalTotal, discountAmount);

    if (typeof amountPaid !== "number" || amountPaid < finalAmount) {
      setMessage("Insufficient amount paid.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const orderData = {
      items: cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      original_total: originalTotal.toFixed(2),
      discount_type: discountType,
      discount_amount: discountAmount.toFixed(2),
      final_amount: finalAmount.toFixed(2),
      amount_paid: amountPaid.toFixed(2),
      change_due: calculateChangeDue(finalAmount).toFixed(2),
    };

    try {
      await createOrder(orderData);
      setMessage("Transaction successfully processed.");
      setMessageType("success");

      setReceiptData(orderData);
      setShowReceipt(false);
      clearCart();
      setAmountPaid("");
      setDiscountType("none");
    } catch (error: any) {
      setMessage(error.message || "Error processing transaction.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => setMessage(null);
  const handleToggleReceipt = () => setShowReceipt(!showReceipt);

  const originalTotal = calculateOriginalTotal();
  const discountAmount = calculateDiscountAmount(originalTotal);
  const finalAmount = calculateFinalAmount(originalTotal, discountAmount);
  const changeDue = calculateChangeDue(finalAmount);

  return (
    <div>
      <h3>Checkout</h3>

      {message && (
        <ErrorHandler
          message={message}
          type={messageType}
          clearMessage={clearMessage}
        />
      )}

      <div className="mb-3">
        <label htmlFor="discountType" className="form-label">
          Discount Type:
        </label>
        <select
          id="discountType"
          className="form-select"
          value={discountType}
          onChange={(e) =>
            setDiscountType(
              e.target.value as "none" | "senior" | "student" | "pwd"
            )
          }
        >
          <option value="none">None</option>
          <option value="senior">Senior Citizen (20%)</option>
          <option value="student">Student (10%)</option>
          <option value="pwd">PWD (20%)</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="amountPaid" className="form-label">
          Amount Paid:
        </label>
        <input
          type="number"
          className="form-control"
          id="amountPaid"
          value={amountPaid}
          min="0"
          onChange={(e) => {
            const value = e.target.value;
            setAmountPaid(value === "" ? "" : parseFloat(value));
          }}
        />
      </div>

      <div className="mt-3">
        <h5>Original Total: ₱{originalTotal.toFixed(2)}</h5>
        <h5>Discount: -₱{discountAmount.toFixed(2)}</h5>
        <h5>Final Amount: ₱{finalAmount.toFixed(2)}</h5>
        <h5>Change Due: ₱{changeDue.toFixed(2)}</h5>
      </div>

      <button
        className="btn btn-success mt-3"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Confirm Purchase"}
      </button>

      {receiptData && (
        <>
          <button
            className="btn btn-primary mt-3 ms-2"
            onClick={handleToggleReceipt}
          >
            {showReceipt ? "Hide Receipt" : "Show Receipt"}
          </button>

          {showReceipt && (
            <div className="receipt-container mt-3 p-3 border rounded bg-light">
              <Receipt
                cart={receiptData.items}
                originalTotal={parseFloat(receiptData.original_total)}
                discountType={receiptData.discount_type}
                discountAmount={parseFloat(receiptData.discount_amount)}
                finalAmount={parseFloat(receiptData.final_amount)}
                amountPaid={parseFloat(receiptData.amount_paid)}
                changeDue={parseFloat(receiptData.change_due)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
