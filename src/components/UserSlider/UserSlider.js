import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, logout } from "../../store/userSlice";
import { getUserOrders } from "../../store/orderSlice";
import "./UserSlider.css";

const UserSlider = ({ show, onClose }) => {
  const dispatch = useDispatch();
  // Always get userId from Redux or fallback to localStorage
  const userId =
    useSelector((state) => state.user.userId) || localStorage.getItem("userId");
  const { userDetails, user } = useSelector((state) => state.user);
  const { userOrders } = useSelector((state) => state.order);
  const isVerified = localStorage.getItem("otpVerified") === "true";
  const currentPath = window.location.pathname;

  // Fetch user details and latest orders when slider opens and userId is available
  useEffect(() => {
    if (show && userId && (isVerified || currentPath === "/verify-otp")) {
      dispatch(fetchUserById(userId));
      dispatch(getUserOrders(userId));
    }
  }, [dispatch, userId, isVerified, show, currentPath]);

  const details = userDetails || user;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authPhone");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("userId");
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
              {userOrders && userOrders.length > 0 ? (
                userOrders.slice(0, 3).map((order, index) => (
                  <li key={order._id || index} style={{ marginBottom: "18px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    <div><strong>Order ID:</strong> {order._id}</div>
                    <div><strong>Status:</strong> {order.status || "N/A"}</div>
                    <div><strong>Amount:</strong> ₹{order.amount || order.amountToPay || (order.total && order.total.amount) || "N/A"}</div>
                    {order.items && order.items.length > 0 && (
                      <div>
                        <strong>Items:</strong>{" "}
                        {order.items.map((item) => item.title || item.name || "Seva").join(", ")}
                      </div>
                    )}
                    {order.address && (
                      <div>
                        <strong>Address:</strong>{" "}
                        {(order.address.addrLine1 || order.address.line1 || "") +
                          (order.address.city ? `, ${order.address.city}` : "")}
                      </div>
                    )}
                    <div>
                      <strong>Date:</strong>{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                    </div>
                  </li>
                ))
              ) : (
                <li>No orders found</li>
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
