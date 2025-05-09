import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { fetchAddressByPincode, clearAddress, saveAddress, setSelectedAddressId } from "../store/addressSlice";
import { createOrder } from "../store/orderSlice";
import "./CheckoutPage.css";

const addressTypes = ["Home", "Work", "Other"];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const { userDetails } = useSelector((state) => state.user);
  const addressState = useSelector((state) => state.address);
  const userId = useSelector((state) => state.user.userId) || localStorage.getItem("userId");

  const [address, setAddress] = useState({
    type: "Home",
    line1: "",
    line2: "",
    pin: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (addressState.valid) {
      setAddress((prev) => ({
        ...prev,
        city: addressState.city,
        state: addressState.state,
      }));
    } else if (address.pin.length === 6 && !addressState.loading) {
      setAddress((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    }
  }, [addressState, address.pin.length]);

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));

    if (name === "pin") {
      if (value.length === 6) {
        dispatch(fetchAddressByPincode(value));
      } else {
        dispatch(clearAddress());
        setAddress((prev) => ({ ...prev, city: "", state: "" }));
      }
    }
  };

  // Validation
  const isUserValid =
    userDetails?.name && userDetails?.contact && userDetails?.email;
  const isAddressValid =
    address.type &&
    address.line1 &&
    address.pin &&
    addressState.valid &&
    address.city &&
    address.state;

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  // --- MAIN LOGIC: Save address, then create order, then redirect ---
  const handlePayNow = async () => {
    if (!isUserValid || !isAddressValid || cart.length === 0) {
      alert("Please fill all details and add items to cart.");
      return;
    }

    if (!userId) {
      alert("User ID missing. Please login again.");
      return;
    }

    // 1. Save address to backend
    const addressPayload = {
      name: userDetails.name,
      addrLine1: address.line1,
      addrLine2: address.line2,
      pincode: Number(address.pin),
      city: address.city,
      state: address.state,
      type: address.type,
      verified: true,
    };

    try {
      const result = await dispatch(saveAddress(addressPayload));
      if (saveAddress.fulfilled.match(result)) {
        const addressId = result.payload._id;
        dispatch(setSelectedAddressId(addressId));
        if (!userId || !addressId || cart.length === 0) {
          alert("User, address, or cart items missing!");
          return;
        }

        const orderPayload = {
          items: cart.map((item) => item._id),
          address: addressId,
          userId,
        };
        console.log("Order payload:", orderPayload);
        const orderResult = await dispatch(createOrder(orderPayload));
        if (createOrder.fulfilled.match(orderResult)) {
          // 3. Redirect to payment page after successful order creation
          navigate("/payment", {
            state: {
              orderId: orderResult.payload.orderId,
              amountToPay: orderResult.payload.amountToPay,
              items: cart,
              address: addressPayload,
            },
          });
        } else {
          alert(orderResult.payload || "Order creation failed");
        }
      } else {
        alert(result.payload || "Failed to save address");
      }
    } catch (err) {
      alert("Unexpected error saving address or creating order");
    }
  };

  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center", margin: "24px 0" }}>Checkout</h1>
      <div className="checkout-container">
        {/* Left: Cart Items */}
        <div className="checkout-products">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-image" />
                <div className="cart-item-title">{item.title || "Seva"}</div>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemove(item)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        {/* Right: User & Address Details */}
        <div className="checkout-details">
          <h2>User Details</h2>
          <form className="user-details-form">
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
          <h2 style={{ marginTop: 24 }}>Address</h2>
          <form className="address-form">
            <label>
              Pin Code
              <input
                type="text"
                name="pin"
                value={address.pin}
                onChange={handleAddressChange}
                required
                maxLength={6}
                disabled={addressState.loading}
              />
              {addressState.loading && (
                <span className="address-loader">Loading...</span>
              )}
              {addressState.error && address.pin.length === 6 && (
                <span className="address-error">{addressState.error}</span>
              )}
            </label>
            {addressState.valid && (
              <>
                <label>
                  Type
                  <select
                    name="type"
                    value={address.type}
                    onChange={handleAddressChange}
                    disabled={addressState.loading}
                  >
                    {addressTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Address Line 1
                  <input
                    type="text"
                    name="line1"
                    value={address.line1}
                    onChange={handleAddressChange}
                    required
                    disabled={addressState.loading}
                  />
                </label>
                <label>
                  Address Line 2
                  <input
                    type="text"
                    name="line2"
                    value={address.line2}
                    onChange={handleAddressChange}
                    disabled={addressState.loading}
                  />
                </label>
                <label>
                  State
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    readOnly
                  />
                </label>
                <label>
                  City
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    readOnly
                  />
                </label>
              </>
            )}
          </form>
          <button
            className="pay-now-btn"
            disabled={!(isUserValid && isAddressValid && cart.length > 0)}
            onClick={handlePayNow}
            style={{ marginTop: 24, width: "100%" }}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
