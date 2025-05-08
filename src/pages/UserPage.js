import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import UserSlider from "../components/UserSlider/UserSlider";

const UserPage = () => {
  const [showSlider, setShowSlider] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation for Navbar
  const handleNav = (path) => {
    if (location.pathname !== path) {
      navigate(path);
      if (path === "/user") setShowSlider(true);
      else setShowSlider(false);
    }
  };

  // Toggle UserSlider only on /user
  const handleToggleSlider = () => {
    if (location.pathname === "/user") setShowSlider((prev) => !prev);
  };

  return (
    <div>
      <Navbar
        onUserToggle={handleToggleSlider}
        showSlider={showSlider}
        onNav={handleNav}
      />
      <UserSlider
        show={showSlider && location.pathname === "/user"}
        onClose={() => setShowSlider(false)}
      />
    </div>
  );
};

export default UserPage;
