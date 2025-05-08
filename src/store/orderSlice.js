import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../config";

// Async thunk to create order (POST)
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");
      return data; // { orderId, paymentId, amountToPay, payment, order }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to get order details (GET)
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/order/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order fetch failed");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderDetails: null,
    createdOrder: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.orderDetails = null;
      state.createdOrder = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.createdOrder = action.payload; // Save creation response
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderDetails = action.payload; // Save full order details
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

