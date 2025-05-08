import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
      if (!state.items.find((item) => item._id === action.payload._id)) {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(
        (item) => item._id !== action.payload._id
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
