import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "../config";

// Fetch all sevas with pagination
export const fetchSevas = createAsyncThunk(
  "seva/fetchSevas",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/api/sevas?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch sevas");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const sevaSlice = createSlice({
  name: "seva",
  initialState: {
    sevas: [],
    totalSevas: 0,
    status: "idle",
    error: null,
    currentPage: 1,
    pageSize: 10,
  },
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    resetSevas(state) {
      state.sevas = [];
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSevas.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSevas.fulfilled, (state, action) => {
        state.status = "succeeded";
        // If page === 1, replace; else, append
        if (action.meta.arg.page === 1) {
          state.sevas = action.payload.sevas;
        } else {
          state.sevas = [...state.sevas, ...action.payload.sevas];
        }
        state.totalSevas = action.payload.totalSevas;
      })
      .addCase(fetchSevas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPage, resetSevas } = sevaSlice.actions;
export default sevaSlice.reducer;
