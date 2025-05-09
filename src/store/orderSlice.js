import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../config";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ items, address, userId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");
      return data; // { orderId, amountToPay, order }
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

// Async thunk to get latest orders for a user
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/user/${userId}/orders`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch user orders");
      return data; // Array of orders
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
    userOrders: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.orderDetails = null;
      state.createdOrder = null;
      state.userOrders = [];
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
        state.createdOrder = action.payload;
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
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
