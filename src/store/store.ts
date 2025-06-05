
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import productsSlice from './productsSlice';
import { apiMiddleware } from '../middleware/apiMiddleware';
import { performanceMiddleware } from '../middleware/performanceMiddleware';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    products: productsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        // Ignore these paths in the serializable check for better performance
        ignoredPaths: ['products.items.*.images'],
      },
      // Disable immutability check in production for better performance
      immutableCheck: process.env.NODE_ENV !== 'production',
    })
    .concat(performanceMiddleware)
    .concat(apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production' && {
    // Optimize DevTools for better performance
    maxAge: 50,
    trace: false,
    traceLimit: 25,
  },
  // Enable RTK Query if needed in the future
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({
      autoBatch: { type: 'tick' }, // Batch actions for better performance
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
