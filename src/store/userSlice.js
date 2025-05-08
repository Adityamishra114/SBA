import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../config";

// Register user and send OTP
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ name, email, contact }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contact }),
      });
      if (!res.ok) throw new Error("Registration failed");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Send OTP to existing user (login)
export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async (contact, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Verify OTP and fetch user details
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ contact, otp }, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/otp-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "OTP verification failed");
      // Set user details directly from response
      dispatch(setUserDetails(data.user));
      return data.userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userDetails: {},
    status: "idle",
    error: null,
    otpSent: false,
    userId: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.userDetails = null;
      state.userId = null;
      state.otpSent = false;
      state.status = "idle";
      state.error = null;
    },
    resetOtpState(state) {
      state.otpSent = false;
      state.userId = null;
      state.status = "idle";
      state.error = null;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Send OTP (login)
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userId = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // This will show backend error
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.userDetails = action.payload || {};
        console.log("User Details from DB:", action.payload);
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, resetOtpState, setUserDetails } = userSlice.actions;
export default userSlice.reducer;
