/* =====================================================
 * 📁 assets/js/orchestrator/StateManager.js
 * Single Responsibility: Application State Management
 * ===================================================== */

/**
 * Centralized Application State Manager
 * 
 * Robert C. Martin: "State should be predictable and observable"
 * Dan Abramov: "Single source of truth with event-driven updates"
 */
export class ApplicationStateManager {
  constructor() {
    this.state = this.initializeDefaultState();
    this.listeners = new Map();
    this.performanceObserver = null;
    this.init();
  }
  
  initializeDefaultState() {
    return {
      initialization: {
        status: 'starting',
        startTime: Date.now(),
        loadedModules: new Set(),
        failedModules: new Set(),
        initializationErrors: []
      },
      session: {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        pageViews: 1,
        interactions: 0,
        errors: 0
      },
      features: {
        coreReady: false,
        notificationsReady: false,
        achievementsReady: false,
        progressReady: false,
        analyticsReady: false
      },
      performance: {
        initializationTime: null,
        moduleLoadTimes: new Map(),
        memoryUsage: null,
        errorCount: 0
      },
      preferences: {
        reducedMotion: false,
        soundEnabled: true,
        highContrast: false,
        debugMode: false
      }
    };
  }
  
  init() {
    this.detectUserPreferences();
    this.setupPerformanceMonitoring();
    utils.logWithContext('info', 'StateManager', 'Application state manager initialized');
  }
  
  detectUserPreferences() {
    this.state.preferences.reducedMotion = utils.prefersReducedMotion();
    this.state.preferences.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    this.state.preferences.soundEnabled = !this.state.preferences.reducedMotion;
    this.state.preferences.debugMode = window.APP_CONFIG?.environment?.isDevelopment || false;
  }
  
  setupPerformanceMonitoring() {
    if (!window.APP_CONFIG?.features?.enablePerformanceMetrics) return;
    
    try {
      if ('PerformanceObserver' in window) {
        this.performanceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
              this.state.performance.moduleLoadTimes.set(entry.name, entry.duration);
            }
          }
        });
        this.performanceObserver.observe({ entryTypes: ['measure'] });
      }
      
      if ('memory' in performance) {
        setInterval(() => {
          this.state.performance.memoryUsage = {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }, 30000);
      }
    } catch (error) {
      utils.logWithContext('warn', 'StateManager', 'Performance monitoring unavailable', error);
    }
  }
  
  setState(path, value, metadata = {}) {
    const oldValue = this.getState(path);
    const keys = path.split('.');
    let current = this.state;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    this.emit('stateChange', {
      path,
      oldValue,
      newValue: value,
      timestamp: Date.now(),
      ...metadata
    });
    
    this.emit(`stateChange:${path}`, {
      oldValue,
      newValue: value,
      timestamp: Date.now(),
      ...metadata
    });
  }
  
  getState(path) {
    const keys = path.split('.');
    let current = this.state;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          utils.logWithContext('error', 'StateManager', `Error in event callback for ${event}`, error);
        }
      });
    }
  }
  
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getStatus() {
    return {
      initialization: this.state.initialization.status,
      ready: this.state.initialization.status === 'ready',
      modules: {
        loaded: Array.from(this.state.initialization.loadedModules),
        failed: Array.from(this.state.initialization.failedModules)
      },
      performance: {
        initTime: this.state.performance.initializationTime,
        memoryUsage: this.state.performance.memoryUsage
      },
      features: { ...this.state.features }
    };
  }
}