import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resetOtpState } from "../store/userSlice";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  const location = useLocation();
  const contact = location.state?.contact || localStorage.getItem("authPhone");
  const [localError, setLocalError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!contact) {
      setLocalError("Contact number missing.");
      return;
    }
    const resultAction = await dispatch(verifyOtp({ contact, otp }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      // Save userId to localStorage for later use (CheckoutPage, etc)
      if (resultAction.payload) {
        localStorage.setItem("userId", resultAction.payload);
      }
      localStorage.setItem("authPhone", contact);
      localStorage.setItem("otpVerified", "true");
      dispatch(resetOtpState());
      window.dispatchEvent(new Event("storage"));
      navigate("/"); // Redirect to LandingPage
    } else {
      // Show backend error or fallback
      setLocalError(resultAction.payload || "OTP verification failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" disabled={!otp || status === "loading"}>
          {status === "loading" ? "Verifying..." : "Verify OTP"}
        </button>
        {(localError || error) && (
          <div style={{ color: "red" }}>{localError || error}</div>
        )}
      </form>
    </div>
  );
};

export default VerifyOtp;
