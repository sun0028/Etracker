import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
