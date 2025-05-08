import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import sevaReducer from "./sevaSlice";
import cartReducer from "./cartSlice";
import addressReducer from "./addressSlice";
import paymentReducer from "./paymentSlice";
import orderReducer from "./orderSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    seva: sevaReducer,
    cart: cartReducer,
    address: addressReducer,
    payment: paymentReducer,
    order: orderReducer,
  },
});

export default store;
