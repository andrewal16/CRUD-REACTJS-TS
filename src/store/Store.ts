import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "../reducer/UserSlice";

const rootReducer = combineReducers({
  user: UserSlice,
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;