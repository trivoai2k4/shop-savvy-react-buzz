
import { Middleware } from '@reduxjs/toolkit';

interface ActionWithType {
  type: string;
  payload?: any;
}

export const apiMiddleware: Middleware = (store) => (next) => (action: ActionWithType) => {
  // Log all actions in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Action dispatched:', action);
  }

  // createAsyncThunk actions already handle loading states automatically
  // We just need to log them for debugging purposes
  if (action.type?.includes('/pending')) {
    console.log('🔄 Loading started for:', action.type);
  } else if (action.type?.includes('/fulfilled')) {
    console.log('✅ Action fulfilled:', action.type);
  } else if (action.type?.includes('/rejected')) {
    console.log('❌ Action failed:', action.type, action.payload);
  }

  return next(action);
};
