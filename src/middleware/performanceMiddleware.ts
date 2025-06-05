
import { Middleware } from '@reduxjs/toolkit';

interface PerformanceMetrics {
  actionType: string;
  executionTime: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static maxMetrics = 100;

  static addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  static getSlowActions(threshold = 10): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.executionTime > threshold);
  }

  static getAverageTime(actionType: string): number {
    const actionMetrics = this.metrics.filter(m => m.actionType === actionType);
    if (actionMetrics.length === 0) return 0;
    
    const total = actionMetrics.reduce((sum, m) => sum + m.executionTime, 0);
    return total / actionMetrics.length;
  }

  static logPerformanceReport() {
    if (process.env.NODE_ENV === 'development') {
      const slowActions = this.getSlowActions();
      if (slowActions.length > 0) {
        console.group('🐌 Slow Redux Actions (>10ms)');
        slowActions.forEach(action => {
          console.log(`${action.actionType}: ${action.executionTime.toFixed(2)}ms`);
        });
        console.groupEnd();
      }
    }
  }
}

interface ActionWithType {
  type: string;
  payload?: any;
}

export const performanceMiddleware: Middleware = (store) => (next) => (action: ActionWithType) => {
  const startTime = performance.now();
  
  const result = next(action);
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  // Only track performance in development or for slow actions
  if (process.env.NODE_ENV === 'development' || executionTime > 5) {
    PerformanceMonitor.addMetric({
      actionType: action.type,
      executionTime,
      timestamp: Date.now(),
    });
    
    // Log slow actions immediately
    if (executionTime > 10) {
      console.warn(`🐌 Slow action: ${action.type} took ${executionTime.toFixed(2)}ms`);
    }
  }
  
  // Generate performance report every 50 actions in development
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.02) {
    PerformanceMonitor.logPerformanceReport();
  }
  
  return result;
};

export { PerformanceMonitor };
