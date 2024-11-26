import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "../redux/slices/userSlice";
import LoadingReducer from "../redux/slices/loadingSlice";
import BookingReducer from "../redux/slices/bookingSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const userPersistConfig = {
  key: "user",
  storage,
};

const bookingPersistConfig = {
  key: "booking",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, UserReducer);
const persistedBookingReducer = persistReducer(
  bookingPersistConfig,
  BookingReducer,
);

const rootReducer = combineReducers({
  user: persistedUserReducer,
  loading: LoadingReducer,
  booking: persistedBookingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredActionPaths: ["meta.arg", "register"],
        ignoredPaths: ["items.dates"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
