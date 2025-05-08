import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../store/userSlice";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.user);

  const handleSendOtp = async () => {
    setError("");

    const resultAction = await dispatch(sendOtp(phone));
    if (sendOtp.fulfilled.match(resultAction)) {
      navigate("/verify-otp", { state: { contact: phone } });
    } else {
      setError(resultAction.payload || "Failed to send OTP");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form>
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={!phone || status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send OTP"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      <p className="loginLink">
        Don’t have an account?{" "}
        <a href="/register" className="loginAnchor">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
