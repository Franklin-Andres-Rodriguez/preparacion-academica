/* =====================================================
 * 📁 assets/js/orchestrator/PerformanceMonitor.js
 * Single Responsibility: Performance Tracking & Optimization
 * ===================================================== */

/**
 * Performance Monitoring and Optimization
 * 
 * Brian Holt: "Monitor what matters for user experience"
 * Martin Fowler: "Measure before optimizing"
 */
export class PerformanceMonitor {
  constructor(appState, config) {
    this.appState = appState;
    this.config = config;
    this.monitoringIntervals = new Map();
    this.init();
  }
  
  init() {
    if (!this.config.features.enablePerformanceMetrics) return;
    
    this.setupMemoryMonitoring();
    this.setupErrorFrequencyMonitoring();
    this.setupPerformanceObserver();
    
    utils.logWithContext('info', 'PerformanceMonitor', 'Performance monitoring initialized');
  }
  
  setupMemoryMonitoring() {
    if (!('memory' in performance)) return;
    
    const memoryInterval = setInterval(() => {
      const memoryInfo = this.appState.getState('performance.memoryUsage');
      if (memoryInfo && memoryInfo.used > this.config.performance.memoryLeakThreshold * 1024 * 1024) {
        utils.logWithContext('warn', 'PerformanceMonitor', `High memory usage detected: ${(memoryInfo.used / 1024 / 1024).toFixed(2)}MB`);
        
        this.appState.emit('performance:memoryWarning', {
          used: memoryInfo.used,
          threshold: this.config.performance.memoryLeakThreshold * 1024 * 1024
        });
      }
    }, 60000);
    
    this.monitoringIntervals.set('memory', memoryInterval);
  }
  
  setupErrorFrequencyMonitoring() {
    this.appState.on('stateChange:performance.errorCount', (data) => {
      if (data.newValue > 10) {
        utils.logWithContext('warn', 'PerformanceMonitor', `High error count detected: ${data.newValue} errors`);
        
        this.appState.emit('performance:errorThreshold', {
          errorCount: data.newValue,
          threshold: 10
        });
      }
    });
  }
  
  setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (error) {
      utils.logWithContext('warn', 'PerformanceMonitor', 'Performance Observer setup failed', error);
    }
  }
  
  processPerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'measure':
        if (entry.duration > this.config.performance.slowModuleThreshold) {
          utils.logWithContext('warn', 'PerformanceMonitor', `Slow operation: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
        break;
        
      case 'navigation':
        this.analyzeNavigationTiming(entry);
        break;
        
      case 'paint':
        this.analyzePaintTiming(entry);
        break;
    }
  }
  
  analyzeNavigationTiming(entry) {
    const metrics = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      totalTime: entry.loadEventEnd - entry.fetchStart
    };
    
    if (metrics.totalTime > this.config.performance.maxInitializationTime) {
      utils.logWithContext('warn', 'PerformanceMonitor', `Slow page load: ${metrics.totalTime.toFixed(2)}ms`);
    }
    
    this.appState.emit('performance:navigationMetrics', metrics);
  }
  
  analyzePaintTiming(entry) {
    if (entry.name === 'first-contentful-paint' && entry.startTime > 2000) {
      utils.logWithContext('warn', 'PerformanceMonitor', `Slow first contentful paint: ${entry.startTime.toFixed(2)}ms`);
    }
    
    this.appState.emit('performance:paintMetrics', {
      name: entry.name,
      time: entry.startTime
    });
  }
  
  measureOperation(name, operation) {
    performance.mark(`${name}-start`);
    
    const result = operation();
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    return result;
  }
  
  async measureAsyncOperation(name, operation) {
    performance.mark(`${name}-start`);
    
    const result = await operation();
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    return result;
  }
  
  getPerformanceReport() {
    return {
      memory: this.appState.getState('performance.memoryUsage'),
      loadTimes: Object.fromEntries(this.appState.getState('performance.moduleLoadTimes') || new Map()),
      errorCount: this.appState.getState('performance.errorCount'),
      initializationTime: this.appState.getState('performance.initializationTime')
    };
  }
  
  destroy() {
    this.monitoringIntervals.forEach((interval, name) => {
      clearInterval(interval);
      utils.logWithContext('debug', 'PerformanceMonitor', `Cleared monitoring interval: ${name}`);
    });
    
    this.monitoringIntervals.clear();
  }
}