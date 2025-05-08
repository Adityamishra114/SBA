import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetOtpState } from "../store/userSlice";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, otpSent } = useSelector((state) => state.user);

  useEffect(() => {
    if (otpSent) {
      localStorage.setItem("authPhone", form.phone);
      navigate("/verify-otp", { state: { contact: form.phone } });
    }
  }, [otpSent, form.phone, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        contact: form.phone,
      })
    );
  };

  const isFormValid = form.name && form.email && form.phone;

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSendOtp}>
        <Input
          type="text"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <button type="submit" disabled={!isFormValid || status === "loading"}>
          {status === "loading" ? "Sending..." : "Send OTP"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      <p className="loginLink">
        Already have an account?{" "}
        <a href="/login" className="loginAnchor">
          Login here
        </a>
      </p>
    </div>
  );
};

export default Register;
