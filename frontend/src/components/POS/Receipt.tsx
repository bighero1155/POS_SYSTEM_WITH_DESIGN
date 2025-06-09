import React from "react";
import { useNavigate } from "react-router-dom";
import EmailForm from "../Email";
import { useAuth } from "../../context/AuthContext"; // Adjust path if needed

interface Product {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  cart: Product[];
  originalTotal: number;
  discountType: "none" | "senior" | "student" | "pwd";
  discountAmount: number;
  finalAmount: number;
  amountPaid: number;
  changeDue: number;
  orderId?: number;
}

const Receipt: React.FC<ReceiptProps> = ({
  cart,
  originalTotal,
  discountType,
  discountAmount,
  finalAmount,
  amountPaid,
  changeDue,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // <-- get logged-in user and logout func

  // Get current date formatted as e.g. "June 9, 2025, 3:25 PM"
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedReceipt = `
Receipt Summary:
${user ? user.first_name : "Guest"}
Role: ${user ? user.role || "User" : "Guest"}
Date: ${formattedDate}
${cart
  .map(
    (item) =>
      `- ${item.name} x ${item.quantity} = ₱${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}

Original Total: ₱${originalTotal.toFixed(2)}
${
  discountType !== "none"
    ? `Discount (${discountType.toUpperCase()}): -₱${discountAmount.toFixed(2)}`
    : ""
}
Final Amount: ₱${finalAmount.toFixed(2)}
Amount Paid: ₱${amountPaid.toFixed(2)}
Change Due: ₱${changeDue.toFixed(2)}

Thank you for your purchase!
  `.trim();

  const handlePrint = () => {
    const newWindow = window.open("", "_blank", "width=600,height=600");

    if (newWindow) {
      const receiptHtml = `
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h3 { text-align: center; }
              .line { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .footer { text-align: center; margin-top: 20px; }
              hr { margin: 10px 0; }
            </style>
          </head>
          <body>
            <h3>Receipt</h3>
            <div class="line"><strong>Date:</strong><span>${formattedDate}</span></div>
            ${cart
              .map(
                (item) =>
                  `<div class="line"><span>${item.name} x ${
                    item.quantity
                  }</span><span>₱${(item.price * item.quantity).toFixed(
                    2
                  )}</span></div>`
              )
              .join("")}
            <hr />
            <div class="line"><strong>Original Total:</strong><span>₱${originalTotal.toFixed(
              2
            )}</span></div>
            ${
              discountType !== "none"
                ? `<div class="line"><strong>Discount (${discountType.toUpperCase()}):</strong><span>-₱${discountAmount.toFixed(
                    2
                  )}</span></div>`
                : ""
            }
            <div class="line"><strong>Final Amount:</strong><span>₱${finalAmount.toFixed(
              2
            )}</span></div>
            <div class="line"><strong>Amount Paid:</strong><span>₱${amountPaid.toFixed(
              2
            )}</span></div>
            <div class="line"><strong>Change Due:</strong><span>₱${changeDue.toFixed(
              2
            )}</span></div>

            <div class="footer">
              <h4>Thank you for your purchase!</h4>
            </div>

            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `;

      newWindow.document.open();
      newWindow.document.write(receiptHtml);
      newWindow.document.close();
    }
  };

  return (
    <div>
      {/* User info and logout */}

      <h3>Receipt</h3>
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div>
          {user ? (
            <>
              <div>
                <strong></strong> {user ? `${user.first_name}` : "Guest"}{" "}
              </div>
              <div>
                <strong>Role: </strong> {user.role || "User"}
              </div>
            </>
          ) : (
            <span>Guest</span>
          )}
        </div>
      </div>
      <div className="mb-2">
        <strong>Date:</strong> {formattedDate}
      </div>
      <div className="border-bottom mb-3 pb-2">
        {cart.length === 0 ? (
          <p>No items purchased.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.product_id}
              className="d-flex justify-content-between mb-2"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₱{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <div className="d-flex justify-content-between mb-2">
        <strong>Original Total:</strong>
        <span>₱{originalTotal.toFixed(2)}</span>
      </div>

      {discountType !== "none" && (
        <div className="d-flex justify-content-between mb-2">
          <strong>Discount ({discountType.toUpperCase()}):</strong>
          <span>-₱{discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="d-flex justify-content-between mb-2">
        <strong>Final Amount:</strong>
        <span>₱{finalAmount.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <strong>Amount Paid:</strong>
        <span>₱{amountPaid.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <strong>Change Due:</strong>
        <span>₱{changeDue.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-center mb-2">
        <h5>
          Thank you for your purchase! Have a great day! We appreciate your
          business!
        </h5>
      </div>

      <div className="d-flex justify-content-center mb-2">
        <EmailForm defaultMessage={formattedReceipt} />
      </div>

      <div className="d-flex justify-content-center mb-2">
        <button className="btn btn-primary me-2" onClick={handlePrint}>
          Print Receipt
        </button>
        <button className="btn btn-success" onClick={() => navigate("/survey")}>
          Go to Survey
        </button>
      </div>
    </div>
  );
};

export default Receipt;
