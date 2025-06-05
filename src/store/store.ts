
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import productsSlice from './productsSlice';
import { apiMiddleware } from '../middleware/apiMiddleware';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    products: productsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
