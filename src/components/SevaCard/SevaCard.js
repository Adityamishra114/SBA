import React from "react";
import "./SevaCard.css";

const SevaCard = ({ seva, inCart, onAddToCart, onRemoveFromCart }) => {
  return (
    <div className="seva-card">
      <div className="seva-card-image" />
      <div className="seva-card-content">
        <div className="seva-card-title">{seva.title || "Seva"}</div>
        <div className="seva-card-price">
          ₹ {seva.discountedPrice || seva.price || "1000"}
        </div>
        <button
          className="seva-card-btn"
          onClick={() => onAddToCart && onAddToCart(seva)}
          disabled={inCart}
        >
          Add to Cart
        </button>
        <button
          className="seva-card-btn"
          onClick={() => onRemoveFromCart && onRemoveFromCart(seva)}
          disabled={!inCart}
        >
          Remove from Cart
        </button>
      </div>
    </div>
  );
};

export default SevaCard;
