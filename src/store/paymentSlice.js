import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../config";

const initialState = {
  paymentDetails: null,
  paymentStatus: "idle",
  paymentError: null,
};

// Async thunk to send (create) payment details to the database
export const sendPaymentDetails = createAsyncThunk(
  "payment/sendPaymentDetails",
  async (paymentData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save payment details");
      return data.payment; // return the saved payment object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to get payment details by ID
export const getPaymentDetails = createAsyncThunk(
  "payment/getPaymentDetails",
  async (paymentId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/payment/${paymentId}`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch payment details");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    addCardPayment: (state, action) => {
      const { cardNumber, expiry, cvv, amount } = action.payload;
      state.paymentDetails = {
        cardNumber,
        expiry,
        cvv,
        amount,
        method: "card",
      };
    },
    addUpiPayment: (state, action) => {
      const { upiId, amount } = action.payload;
      state.paymentDetails = {
        upiId,
        amount,
        method: "upi",
      };
    },
    clearPayment: (state) => {
      state.paymentDetails = null;
      state.paymentStatus = "idle";
      state.paymentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send payment
      .addCase(sendPaymentDetails.pending, (state) => {
        state.paymentStatus = "loading";
        state.paymentError = null;
      })
      .addCase(sendPaymentDetails.fulfilled, (state, action) => {
        state.paymentStatus = "succeeded";
        state.paymentDetails = action.payload;
      })
      .addCase(sendPaymentDetails.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.paymentError = action.payload;
      })
      // Get payment
      .addCase(getPaymentDetails.pending, (state) => {
        state.paymentStatus = "loading";
        state.paymentError = null;
      })
      .addCase(getPaymentDetails.fulfilled, (state, action) => {
        state.paymentStatus = "succeeded";
        state.paymentDetails = action.payload;
      })
      .addCase(getPaymentDetails.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.paymentError = action.payload;
      });
  },
});

export const { addCardPayment, addUpiPayment, clearPayment } =
  paymentSlice.actions;
export default paymentSlice.reducer;

