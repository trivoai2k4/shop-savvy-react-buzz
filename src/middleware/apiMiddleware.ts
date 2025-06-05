
import { Middleware } from '@reduxjs/toolkit';
import { setLoading, setError } from '../store/productsSlice';

export const apiMiddleware: Middleware = (store) => (next) => (action) => {
  // Log all actions in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Action dispatched:', action);
  }

  // Handle async actions with loading states
  if (action.type?.endsWith('/pending')) {
    store.dispatch(setLoading(true));
  } else if (action.type?.endsWith('/fulfilled') || action.type?.endsWith('/rejected')) {
    store.dispatch(setLoading(false));
  }

  // Handle error actions
  if (action.type?.endsWith('/rejected')) {
    const errorMessage = action.payload?.message || 'An error occurred';
    store.dispatch(setError(errorMessage));
  }

  return next(action);
};
