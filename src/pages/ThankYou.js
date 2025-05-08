import React from "react";
import { useLocation } from "react-router-dom";

const ThankYou = () => {
  const location = useLocation();
  const { order, payment } = location.state || {};

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Thank You!</h1>
      <p>Your order has been placed successfully.</p>
      {order && (
        <div style={{ marginTop: "24px" }}>
          <h3>Order Details</h3>
          <pre>{JSON.stringify(order, null, 2)}</pre>
        </div>
      )}
      {payment && (
        <div style={{ marginTop: "24px" }}>
          <h3>Payment Details</h3>
          <pre>{JSON.stringify(payment, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ThankYou;
