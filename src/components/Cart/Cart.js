import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = ({ cartItems = [], onRemove }) => {
  // Use userDetails from Redux for more accurate user info
  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <div className="cart-products">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-image" />
                <div className="cart-item-title">{item.title || "Seva"}</div>
                <button
                  className="cart-remove-btn"
                  onClick={() => onRemove(item)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              style={{ marginTop: "16px", width: "100%" }}
            >
              Checkout
            </button>
          </>
        )}
      </div>
      <div className="cart-user-details">
        <h2>User Details</h2>
        <form>
          <label>
            Name
            <input type="text" value={userDetails?.name || ""} readOnly />
          </label>
          <label>
            Number
            <input type="text" value={userDetails?.contact || ""} readOnly />
          </label>
          <label>
            Email
            <input type="email" value={userDetails?.email || ""} readOnly />
          </label>
        </form>
      </div>
    </div>
  );
};

export default Cart;
