import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onUserToggle, showSlider }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button
        className={`navbar-btn${location.pathname === "/" ? " active" : ""}`}
        onClick={() => navigate("/")}
        type="button"
        aria-label="Home"
      >
        Home
      </button>
      <button
        className={`navbar-btn${
          location.pathname === "/cart" ? " active" : ""
        }`}
        onClick={() => navigate("/cart")}
        type="button"
        aria-label="Cart"
      >
        Cart
      </button>
      <button
        className={`navbar-btn userpage-toggle-btn${
          location.pathname === "/user" ? " active" : ""
        }${showSlider ? " toggled" : ""}`}
        onClick={() => {
          if (location.pathname !== "/user") {
            navigate("/user");
          } else {
            onUserToggle && onUserToggle();
          }
        }}
        type="button"
        aria-label={showSlider ? "Hide User Details" : "Show User Details"}
      >
        User
      </button>
    </nav>
  );
};

export default Navbar;
