import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from './imagesSlice';

export const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;