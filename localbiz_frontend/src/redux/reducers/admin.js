import { createReducer } from "@reduxjs/toolkit";
import {
  LOAD_ADMIN_FAILURE,
  LOAD_ADMIN_REQUEST,
  LOAD_ADMIN_SUCCESS,
} from "../actions/adminActionTypes";

const initialState = {
  isAuthenticated: false,
};

export const adminReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(LOAD_ADMIN_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(LOAD_ADMIN_SUCCESS, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.admin = action.payload;
    })
    .addCase(LOAD_ADMIN_FAILURE, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });
});
