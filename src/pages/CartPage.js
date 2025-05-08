import React from "react";
import Cart from "../components/Cart/Cart";
import Navbar from "../components/Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../store/cartSlice";

const CartPage = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center", margin: "24px 0" }}>Checkout Page</h1>
      <Cart cartItems={cart} onRemove={handleRemove} />
    </div>
  );
};

export default CartPage;
