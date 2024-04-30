import { configureStore } from "@reduxjs/toolkit";
import { adminReducer } from "./reducers/admin";

const Store = configureStore({
  reducer: {
    admin: adminReducer,
  }, // root reducer with router state
});

export default Store;
