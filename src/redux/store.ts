import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "../redux/slices/userSlice";
import LoadingReducer from "../redux/slices/loadingSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const userPersistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, UserReducer);

const rootReducer = combineReducers({
  user: persistedUserReducer,
  loading: LoadingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
