import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../store/orderSlice";
import { getPaymentDetails } from "../store/paymentSlice";
import "./ThankYou.css";

const ThankYou = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Get orderId and paymentId from location.state
  const orderId = location.state?.orderId;
  const paymentId = location.state?.paymentId;

  const [address, setAddress] = useState(null);

  // Redux state
  const orderDetails = useSelector((state) => state.order.orderDetails);
  const paymentDetails = useSelector((state) => state.payment.paymentDetails);

  // Fetch order and payment details if IDs are present
  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId)).then((res) => {
        if (res.payload && res.payload.address) {
          setAddress(res.payload.address);
        }
      });
    }
    if (paymentId) {
      dispatch(getPaymentDetails(paymentId));
    }
    // eslint-disable-next-line
  }, [orderId, paymentId, dispatch]);

  // Items from order details
  const items = orderDetails?.items || [];

  return (
    <div>
      <Navbar />
      <div className="thankyou-container">
        <h1>Thank You!</h1>
        <p>Your payment was successful.</p>
        {paymentDetails && (
          <div className="thankyou-section">
            <h3>Payment Details</h3>
            <pre className="thankyou-pre">{JSON.stringify(paymentDetails, null, 2)}</pre>
          </div>
        )}
        {address && (
          <div className="thankyou-section">
            <h3>Address Details</h3>
            <pre className="thankyou-pre">{JSON.stringify(address, null, 2)}</pre>
          </div>
        )}
        {items.length > 0 && (
          <div className="thankyou-section">
            <h3>Items Details</h3>
            <ul className="thankyou-items-list">
              {items.map((item, idx) => (
                <li key={item._id || idx}>
                  <strong>{item.title || item.name || "Seva"}</strong>
                  {item.price && <> — ₹{item.price}</>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
