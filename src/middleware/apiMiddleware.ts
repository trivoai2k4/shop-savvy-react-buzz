
import { Middleware } from '@reduxjs/toolkit';

interface ActionWithType {
  type: string;
  payload?: any;
}

// Debounce function for logging to reduce console spam
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Batched logging for better performance
class ApiLogger {
  private static logQueue: { type: string; message: string; timestamp: number }[] = [];
  private static flushInterval = 1000; // Flush every second
  private static maxQueueSize = 50;

  static log(type: string, message: string) {
    if (process.env.NODE_ENV !== 'development') return;

    this.logQueue.push({
      type,
      message,
      timestamp: Date.now()
    });

    if (this.logQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  static flush = debounce(() => {
    if (ApiLogger.logQueue.length === 0) return;

    console.group('📡 API Actions Batch');
    ApiLogger.logQueue.forEach(({ type, message }) => {
      switch (type) {
        case 'pending':
          console.log('🔄', message);
          break;
        case 'fulfilled':
          console.log('✅', message);
          break;
        case 'rejected':
          console.warn('❌', message);
          break;
        default:
          console.log(message);
      }
    });
    console.groupEnd();
    
    ApiLogger.logQueue = [];
  }, ApiLogger.flushInterval);
}

// Auto-flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ApiLogger.flush();
  });
}

export const apiMiddleware: Middleware = (store) => (next) => (action: ActionWithType) => {
  // Only process async thunk actions for better performance
  if (action.type?.includes('/')) {
    if (action.type.includes('/pending')) {
      ApiLogger.log('pending', `Loading started for: ${action.type}`);
    } else if (action.type.includes('/fulfilled')) {
      ApiLogger.log('fulfilled', `Action fulfilled: ${action.type}`);
    } else if (action.type.includes('/rejected')) {
      ApiLogger.log('rejected', `Action failed: ${action.type} - ${action.payload?.message || 'Unknown error'}`);
    }
  }

  return next(action);
};
