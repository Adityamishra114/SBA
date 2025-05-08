import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../config";

export const fetchAddressByPincode = createAsyncThunk(
  "address/fetchByPincode",
  async (pincode, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/address-by-pincode/${pincode}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          return rejectWithValue(errorData.message || "Invalid pincode");
        } else {
          return rejectWithValue("Server error or invalid response");
        }
      }
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      } else {
        return rejectWithValue("Server error or invalid response");
      }
    } catch (err) {
      return rejectWithValue(err.message || "Unexpected error");
    }
  }
);

export const saveAddress = createAsyncThunk(
  "address/saveAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save address");
      return data; // address object from backend
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    loading: false,
    error: null,
    city: "",
    state: "",
    valid: false,
    selectedAddressId: null, // <-- add this
  },
  reducers: {
    clearAddress(state) {
      state.city = "";
      state.state = "";
      state.valid = false;
      state.error = null;
      state.selectedAddressId = null;
    },
    setSelectedAddressId(state, action) {
      state.selectedAddressId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressByPincode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.valid = false;
      })
      .addCase(fetchAddressByPincode.fulfilled, (state, action) => {
        state.loading = false;
        state.city = action.payload.city;
        state.state = action.payload.state;
        state.valid = true;
        state.error = null;
      })
      .addCase(fetchAddressByPincode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid pincode";
        state.city = "";
        state.state = "";
        state.valid = false;
      })
      .addCase(saveAddress.fulfilled, (state, action) => {
        state.selectedAddressId = action.payload._id;
      });
  },
});

export const { clearAddress, setSelectedAddressId } = addressSlice.actions;
export default addressSlice.reducer;
