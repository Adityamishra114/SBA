import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, logout } from "../../store/userSlice";
import "./UserSlider.css";

const UserSlider = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const { userDetails, user, userId } = useSelector((state) => state.user);
  const isVerified = localStorage.getItem("otpVerified") === "true";
  const currentPath = window.location.pathname;

  // Always fetch user details if verified or on verify-otp page
  useEffect(() => {
    if (show && userId && (isVerified || currentPath === "/verify-otp")) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId, isVerified, show, currentPath]);

  const details = userDetails || user;

  // Log user details to the console
  useEffect(() => {
    if (details) {
      console.log("User Details:", details);
    }
  }, [details]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authPhone");
    localStorage.removeItem("otpVerified");
    window.dispatchEvent(new Event("storage"));
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("userpage-overlay")) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="userpage-overlay" onClick={handleOverlayClick}>
      <div
        className={`user-slider-container${show ? " open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-slider">
          <div className="user-details">
            <h2>User Details</h2>
            {(isVerified || currentPath === "/verify-otp") && details ? (
              <>
                <p>Name: {details.name || ""}</p>
                <p>Email: {details.email || ""}</p>
                <p>Contact: {details.contact || ""}</p>
              </>
            ) : (
              <p style={{ color: "#888" }}>Not logged in</p>
            )}
          </div>
          <div className="latest-orders">
            <h2>Latest Orders</h2>
            <ul>
              {(isVerified || currentPath === "/verify-otp") &&
              details?.orders &&
              details.orders.length > 0 ? (
                details.orders.map((order, index) => (
                  <li key={index}>
                    Order ID: {order.id} - Status: {order.status}
                  </li>
                ))
              ) : (
                <li></li>
              )}
            </ul>
          </div>
          {(isVerified || currentPath === "/verify-otp") && details && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSlider;
