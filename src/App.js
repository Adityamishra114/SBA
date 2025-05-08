import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserById } from "./store/userSlice";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import CartPage from "./pages/CartPage";
import UserPage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import ThankYou from "./pages/ThankYou";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = () => {
      const phone = localStorage.getItem("authPhone");
      const verified = localStorage.getItem("otpVerified");
      setIsLoggedIn(phone && verified === "true");
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const otpVerified = localStorage.getItem("otpVerified");
    if (userId && otpVerified === "true") {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch]);

  return (
    <Router>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
