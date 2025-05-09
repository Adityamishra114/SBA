import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import {
  addCardPayment,
  addUpiPayment,
  sendPaymentDetails,
} from "../store/paymentSlice";
import { createOrder } from "../store/orderSlice";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const selectedAddress = useSelector(
    (state) => state.address.selectedAddressId
  );

  // Validation for enabling Pay button
  const isCardValid =
    method === "card" &&
    cardNumber.trim().length >= 12 &&
    expiry.trim().length >= 4 &&
    cvv.trim().length >= 3 &&
    amount &&
    Number(amount) > 0;

  const isUpiValid =
    method === "upi" &&
    upiId.trim().length > 4 &&
    amount &&
    Number(amount) > 0;

  const handlePay = async (e) => {
    e.preventDefault();

    if (!selectedAddress || !cartItems.length) {
      alert("Please select an address and add items to cart.");
      return;
    }

    let paymentData;
    if (method === "card") {
      paymentData = { cardNumber, expiry, cvv, amount: Number(amount), method: "card" };
      dispatch(addCardPayment(paymentData));
    } else {
      paymentData = { upiId, amount: Number(amount), method: "upi" };
      dispatch(addUpiPayment(paymentData));
    }

    try {
      const paymentResult = await dispatch(sendPaymentDetails(paymentData));
      if (!sendPaymentDetails.fulfilled.match(paymentResult)) {
        alert("Payment failed!");
        console.log("Payment error:", paymentResult.error);
        return;
      }
      const payment = paymentResult.payload;
      navigate("/thankyou", {
        state: {
          payment,
        },
      });
    } catch (err) {
      alert("Unexpected error!");
      console.log("Unexpected error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="payment-title">Payment Page</h1>
      <div className="payment-container">
        <div className="payment-box">
          <div className="payment-tabs">
            <button
              className={`payment-tab ${method === "card" ? "active" : ""}`}
              onClick={() => setMethod("card")}
              type="button"
            >
              Card
            </button>
            <button
              className={`payment-tab ${method === "upi" ? "active" : ""}`}
              onClick={() => setMethod("upi")}
              type="button"
            >
              UPI
            </button>
          </div>
          <div className="payment-methods-row">
            {/* Card Section */}
            <form
              className={`payment-method-col ${
                method === "card" ? "selected" : ""
              }`}
              onSubmit={handlePay}
              style={{ borderRight: "1px solid #eee" }}
            >
              <div>
                <div className="payment-field">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required={method === "card"}
                    disabled={method !== "card"}
                  />
                </div>
                <div className="payment-row">
                  <div className="payment-field">
                    <label>Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      required={method === "card"}
                      disabled={method !== "card"}
                    />
                  </div>
                  <div className="payment-field">
                    <label>CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required={method === "card"}
                      disabled={method !== "card"}
                    />
                  </div>
                </div>
                <div className="payment-field">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required={method === "card"}
                    min={1}
                    disabled={method !== "card"}
                  />
                </div>
                <div className="payment-btn-row">
                  <button
                    type="submit"
                    className="payment-btn"
                    disabled={!isCardValid}
                  >
                    Pay
                  </button>
                </div>
              </div>
            </form>
            {/* UPI Section */}
            <form
              className={`payment-method-col ${
                method === "upi" ? "selected" : ""
              }`}
              onSubmit={handlePay}
            >
              <div>
                <div className="payment-field">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required={method === "upi"}
                    disabled={method !== "upi"}
                  />
                </div>
                <div className="payment-field">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required={method === "upi"}
                    min={1}
                    disabled={method !== "upi"}
                  />
                </div>
                <div className="payment-btn-row">
                  <button
                    type="submit"
                    className="payment-btn"
                    disabled={!isUpiValid}
                  >
                    Pay
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
