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

  const handlePay = async (e) => {
    e.preventDefault();
    let paymentData;
    if (method === "card") {
      paymentData = { cardNumber, expiry, cvv, amount: Number(amount) };
      dispatch(addCardPayment(paymentData));
    } else {
      paymentData = { upiId, amount: Number(amount) };
      dispatch(addUpiPayment(paymentData));
    }

    try {
      // 1. Send payment details to /payment
      const paymentResult = await dispatch(sendPaymentDetails(paymentData));
      if (!sendPaymentDetails.fulfilled.match(paymentResult)) {
        alert("Payment failed!");
        console.log("Payment error:", paymentResult.error);
        return;
      }
      const payment = paymentResult.payload;

      // 2. Wait 1 second, then send order details to /order
      setTimeout(async () => {
        const orderPayload = {
          items: cartItems.map((item) => item._id),
          address: selectedAddress,
          payment: payment._id,
        };
        const orderResult = await dispatch(createOrder(orderPayload));
        if (!createOrder.fulfilled.match(orderResult)) {
          alert("Order failed!");
          console.log("Order error:", orderResult.error);
          return;
        }
        const order = orderResult.payload;

        // 3. Wait another 1 second, then redirect to thank you page
        setTimeout(() => {
          navigate("/thankyou", {
            state: { order: order.order, payment: payment },
          });
        }, 1000);
      }, 1000);
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
            >
              Card
            </button>
            <button
              className={`payment-tab ${method === "upi" ? "active" : ""}`}
              onClick={() => setMethod("upi")}
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
                    disabled={method !== "card"}
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
                    disabled={method !== "upi"}
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
