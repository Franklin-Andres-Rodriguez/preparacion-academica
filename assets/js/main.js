/* ===== APPLICATION ORCHESTRATION & SYSTEM INTEGRATION ===== */
/* The Grand Finale: Synthesizing wisdom from 50+ renowned software engineering educators */
/* Embodying Ian Sommerville's systematic structure, Robert C. Martin's Clean Architecture, */
/* and the collective expertise of the world's most influential programming educators */

/* =====================================================
 * ARCHITECTURAL PHILOSOPHY - The Synthesis of Educational Excellence
 * 
 * This orchestration system represents the culmination of principles from:
 * 
 * 🏛️ Ian Sommerville's Systematic Structure:
 * "Software systems must be built with careful attention to initialization order,
 *  dependency management, and systematic error handling"
 * 
 * 🏗️ Robert C. Martin's Clean Architecture:
 * "Dependencies should point inward. Higher-level modules should not depend 
 *  on lower-level modules. Both should depend on abstractions."
 * 
 * 🧪 Kent C. Dodds' Testing Excellence:
 * "Applications should be designed to fail gracefully and provide clear feedback
 *  when things go wrong. Every error should teach something."
 * 
 * 📚 Jonas Schmedtmann's Theory-Practice Integration:
 * "Every implementation decision should be explained, documented, and justified
 *  with clear reasoning that teaches while it executes"
 * 
 * 🔧 Martin Fowler's Evolutionary Design:
 * "Applications should be designed for change. Good architecture makes 
 *  the next change easier, not harder."
 * 
 * 🎨 Dan Abramov's Fundamental Focus:
 * "Focus on patterns and principles that don't change, rather than
 *  framework-specific implementations that become obsolete"
 * 
 * 🏆 Sandro Mancuso's Software Craftsmanship:
 * "Take responsibility for your work. Write code that you're proud to 
 *  show to other professionals."
 * ===================================================== */

/* =====================================================
 * APPLICATION CONFIGURATION
 * Centralized configuration following Ian Sommerville's systematic approach
 * Martin Fowler principle: "Configuration should be explicit and environment-aware"
 * ===================================================== */

/**
 * Application Environment Configuration
 * 
 * THEORY: Applications need different behaviors in different environments
 * PRACTICE: Environment detection drives initialization strategies and debugging levels
 * APPLICATION: Development vs Production behavior without code changes
 */
const APP_ENVIRONMENT = {
  // Environment detection
  isDevelopment: window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' ||
                 window.location.hostname.includes('localhost'),
  
  isProduction: window.location.protocol === 'https:' && 
                !window.location.hostname.includes('localhost'),
  
  // Feature flags for progressive enhancement
  features: {
    enableDebugMode: false,     // Will be set based on environment
    enablePerformanceMetrics: false,
    enableErrorReporting: false,
    enableAnimations: true,     // Can be overridden by user preferences
    enableSounds: true,         // Can be overridden by user preferences
    enableServiceWorker: false  // For future PWA implementation
  },
  
  // Performance thresholds
  performance: {
    maxInitializationTime: 3000,  // 3 seconds max for app ready
    slowModuleThreshold: 500,     // 500ms threshold for slow module loading
    memoryLeakThreshold: 50,      // 50MB threshold for memory monitoring
    errorReportingDelay: 1000     // Delay before sending error reports
  },
  
  // Debugging configuration
  debug: {
    logLevel: 'info',           // Will be 'debug' in development
    enableModuleTimings: false,
    enableMemoryMonitoring: false,
    enableEventTracking: false,
    verboseErrors: false
  }
};

/**
 * Module Dependencies Configuration
 * 
 * Robert C. Martin's Dependency Inversion Principle applied:
 * "High-level modules should not depend on low-level modules.
 *  Both should depend on abstractions."
 */
const MODULE_DEPENDENCIES = {
  // Core dependencies (must load first)
  core: {
    modules: ['utils'],
    required: true,
    timeout: 2000,
    fallback: 'gracefulDegradation'
  },
  
  // System dependencies (second tier)
  systems: {
    modules: ['core', 'notifications'],
    required: true,
    timeout: 3000,
    fallback: 'essentialFeaturesOnly'
  },
  
  // Feature dependencies (final tier)
  features: {
    modules: ['achievements', 'progress-tracker', 'analytics'],
    required: false,
    timeout: 5000,
    fallback: 'skipOptionalFeatures'
  }
};

/**
 * Error Recovery Strategies
 * 
 * Wes Bos principle: "Defensive programming prevents crashes"
 * Kent C. Dodds approach: "Fail gracefully with useful feedback"
 */
const ERROR_RECOVERY = {
  strategies: {
    gracefulDegradation: {
      description: 'Provide basic functionality without advanced features',
      actions: ['disableAnimations', 'useSimpleNavigation', 'basicNotifications']
    },
    
    essentialFeaturesOnly: {
      description: 'Load only critical features for core functionality',
      actions: ['disableOptionalFeatures', 'simplifyUI', 'basicInteractions']
    },
    
    skipOptionalFeatures: {
      description: 'Continue without optional enhancements',
      actions: ['logWarning', 'continueWithoutFeature', 'monitorPerformance']
    },
    
    fullReload: {
      description: 'Last resort: reload the application',
      actions: ['saveUserState', 'logCriticalError', 'reloadPage']
    }
  },
  
  retryAttempts: 3,
  retryDelay: 1000,
  escalationDelay: 5000
};

/* =====================================================
 * APPLICATION STATE MANAGER
 * Centralized state management following Jonas Schmedtmann's approach
 * "State should be predictable, observable, and easy to debug"
 * ===================================================== */

/**
 * Global Application State Manager
 * 
 * THEORY: Complex applications need centralized state to avoid conflicts
 * PRACTICE: Single source of truth with event-driven updates
 * APPLICATION: Coordinates state between independent modules
 */
class ApplicationStateManager {
  constructor() {
    this.state = {
      // Application lifecycle
      initialization: {
        status: 'starting',     // starting, loading, ready, error
        startTime: Date.now(),
        loadedModules: new Set(),
        failedModules: new Set(),
        initializationErrors: []
      },
      
      // User session
      session: {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        pageViews: 1,
        interactions: 0,
        errors: 0
      },
      
      // Feature states
      features: {
        coreReady: false,
        notificationsReady: false,
        achievementsReady: false,
        progressReady: false,
        analyticsReady: false
      },
      
      // Performance metrics
      performance: {
        initializationTime: null,
        moduleLoadTimes: new Map(),
        memoryUsage: null,
        errorCount: 0
      },
      
      // User preferences (will be restored from localStorage equivalent)
      preferences: {
        reducedMotion: false,
        soundEnabled: true,
        highContrast: false,
        debugMode: false
      }
    };
    
    // Event listeners for state changes
    this.listeners = new Map();
    
    // Performance monitoring
    this.performanceObserver = null;
    
    this.init();
  }
  
  /**
   * Initialize state manager
   * 
   * Sets up performance monitoring and user preference detection
   */
  init() {
    this.detectUserPreferences();
    this.setupPerformanceMonitoring();
    this.setupEnvironmentConfig();
    
    utils.logWithContext('info', 'AppState', 'Application state manager initialized');
  }
  
  /**
   * Detect user preferences for adaptive behavior
   * 
   * Laurie Williams principle: "Respect user accessibility needs from the start"
   */
  detectUserPreferences() {
    // Motion preferences
    this.state.preferences.reducedMotion = utils.prefersReducedMotion();
    
    // High contrast detection
    this.state.preferences.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Sound preferences (default enabled unless reduced motion)
    this.state.preferences.soundEnabled = !this.state.preferences.reducedMotion;
    
    // Debug mode in development
    this.state.preferences.debugMode = APP_ENVIRONMENT.isDevelopment;
    
    // Apply preferences to environment
    APP_ENVIRONMENT.features.enableAnimations = !this.state.preferences.reducedMotion;
    APP_ENVIRONMENT.features.enableSounds = this.state.preferences.soundEnabled;
  }
  
  /**
   * Setup performance monitoring
   * 
   * Brian Holt approach: "Monitor what matters for user experience"
   */
  setupPerformanceMonitoring() {
    if (!APP_ENVIRONMENT.features.enablePerformanceMetrics) return;
    
    try {
      // Performance Observer for timing metrics
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
      
      // Memory monitoring (Chrome only)
      if ('memory' in performance) {
        setInterval(() => {
          this.state.performance.memoryUsage = {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }, 30000); // Every 30 seconds
      }
      
    } catch (error) {
      utils.logWithContext('warn', 'AppState', 'Performance monitoring unavailable', error);
    }
  }
  
  /**
   * Setup environment configuration
   * 
   * Configure app behavior based on detected environment
   */
  setupEnvironmentConfig() {
    if (APP_ENVIRONMENT.isDevelopment) {
      APP_ENVIRONMENT.debug.logLevel = 'debug';
      APP_ENVIRONMENT.debug.enableModuleTimings = true;
      APP_ENVIRONMENT.debug.enableMemoryMonitoring = true;
      APP_ENVIRONMENT.debug.verboseErrors = true;
      APP_ENVIRONMENT.features.enableDebugMode = true;
    }
    
    if (APP_ENVIRONMENT.isProduction) {
      APP_ENVIRONMENT.features.enableErrorReporting = true;
      APP_ENVIRONMENT.features.enablePerformanceMetrics = true;
    }
  }
  
  /**
   * Update application state with event emission
   * 
   * @param {string} path - State path (e.g., 'features.coreReady')
   * @param {*} value - New value
   * @param {Object} metadata - Additional event metadata
   */
  setState(path, value, metadata = {}) {
    const oldValue = this.getState(path);
    
    // Update state using path notation
    const keys = path.split('.');
    let current = this.state;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    // Emit change event
    this.emit('stateChange', {
      path,
      oldValue,
      newValue: value,
      timestamp: Date.now(),
      ...metadata
    });
    
    // Emit specific path change event
    this.emit(`stateChange:${path}`, {
      oldValue,
      newValue: value,
      timestamp: Date.now(),
      ...metadata
    });
  }
  
  /**
   * Get state value by path
   * 
   * @param {string} path - State path
   * @returns {*} - State value
   */
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
  
  /**
   * Subscribe to state changes
   * 
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }
  
  /**
   * Emit state change event
   * 
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          utils.logWithContext('error', 'AppState', `Error in event callback for ${event}`, error);
        }
      });
    }
  }
  
  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get current application status
   * 
   * @returns {Object} - Application status summary
   */
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

/* =====================================================
 * MODULE LOADER SYSTEM
 * Systematic module loading following Ian Sommerville's structured approach
 * "Dependencies should be explicit, ordered, and recoverable"
 * ===================================================== */

/**
 * Advanced Module Loader
 * 
 * THEORY: Complex applications require careful module initialization order
 * PRACTICE: Dependency-aware loading with error recovery and timeouts
 * APPLICATION: Ensures reliable startup even when modules fail
 */
class ModuleLoader {
  constructor(appState) {
    this.appState = appState;
    this.loadPromises = new Map();
    this.loadedModules = new Set();
    this.failedModules = new Set();
    this.retryAttempts = new Map();
  }
  
  /**
   * Load module with dependency management and error recovery
   * 
   * @param {string} moduleName - Name of module to load
   * @param {Object} options - Loading options
   * @returns {Promise<boolean>} - Success status
   */
  async loadModule(moduleName, options = {}) {
    const {
      required = true,
      timeout = 5000,
      retryAttempts = 3,
      fallback = null
    } = options;
    
    // Return existing promise if already loading
    if (this.loadPromises.has(moduleName)) {
      return this.loadPromises.get(moduleName);
    }
    
    // Return true if already loaded
    if (this.loadedModules.has(moduleName)) {
      return true;
    }
    
    const loadPromise = this.performModuleLoad(moduleName, {
      required,
      timeout,
      retryAttempts,
      fallback
    });
    
    this.loadPromises.set(moduleName, loadPromise);
    return loadPromise;
  }
  
  /**
   * Perform actual module loading with error handling
   */
  async performModuleLoad(moduleName, options) {
    const startTime = performance.now();
    
    try {
      utils.logWithContext('info', 'ModuleLoader', `Loading module: ${moduleName}`);
      
      // Check if module is available
      const moduleAvailable = await this.checkModuleAvailability(moduleName);
      
      if (!moduleAvailable) {
        throw new Error(`Module ${moduleName} is not available`);
      }
      
      // Initialize module if it has init method
      await this.initializeModule(moduleName, options.timeout);
      
      // Mark as loaded
      this.loadedModules.add(moduleName);
      this.appState.setState(`initialization.loadedModules`, this.loadedModules);
      
      // Record performance
      const loadTime = performance.now() - startTime;
      this.appState.setState(`performance.moduleLoadTimes`, 
        new Map(this.appState.getState('performance.moduleLoadTimes')).set(moduleName, loadTime)
      );
      
      if (loadTime > APP_ENVIRONMENT.performance.slowModuleThreshold) {
        utils.logWithContext('warn', 'ModuleLoader', `Slow module load: ${moduleName} took ${loadTime.toFixed(2)}ms`);
      }
      
      utils.logWithContext('info', 'ModuleLoader', `✅ Module loaded successfully: ${moduleName} (${loadTime.toFixed(2)}ms)`);
      return true;
      
    } catch (error) {
      return this.handleModuleLoadError(moduleName, error, options);
    }
  }
  
  /**
   * Check if module is available in global scope
   */
  async checkModuleAvailability(moduleName) {
    const moduleChecks = {
      'utils': () => window.utils && window.APP_CONFIG,
      'core': () => window.coreManager && window.coreAPI,
      'notifications': () => window.notifications && window.notificationAPI,
      'achievements': () => window.achievementManager,
      'progress-tracker': () => window.progressTracker,
      'analytics': () => window.analytics
    };
    
    const checker = moduleChecks[moduleName];
    if (!checker) {
      utils.logWithContext('warn', 'ModuleLoader', `No availability checker for module: ${moduleName}`);
      return true; // Assume available if no checker
    }
    
    // Wait for module to be available with timeout
    const maxWait = 3000; // 3 seconds
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      if (checker()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return false;
  }
  
  /**
   * Initialize module if it has initialization method
   */
  async initializeModule(moduleName, timeout) {
    const initMethods = {
      'core': async () => {
        if (window.coreManager && !window.coreManager.isReady()) {
          await window.coreManager.initialize();
        }
      },
      'notifications': async () => {
        // Notifications auto-initialize, just wait for ready event
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Notification system initialization timeout'));
          }, timeout);
          
          if (window.notifications) {
            clearTimeout(timeoutId);
            resolve();
          } else {
            window.addEventListener('notificationSystemReady', () => {
              clearTimeout(timeoutId);
              resolve();
            }, { once: true });
          }
        });
      }
    };
    
    const initMethod = initMethods[moduleName];
    if (initMethod) {
      await Promise.race([
        initMethod(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Module ${moduleName} initialization timeout`)), timeout)
        )
      ]);
    }
  }
  
  /**
   * Handle module loading errors with recovery strategies
   */
  async handleModuleLoadError(moduleName, error, options) {
    const currentAttempts = this.retryAttempts.get(moduleName) || 0;
    
    utils.logWithContext('error', 'ModuleLoader', `Failed to load module: ${moduleName}`, error);
    
    // Record failure
    this.failedModules.add(moduleName);
    this.appState.setState('initialization.failedModules', this.failedModules);
    this.appState.setState('initialization.initializationErrors', [
      ...this.appState.getState('initialization.initializationErrors'),
      { module: moduleName, error: error.message, timestamp: Date.now() }
    ]);
    
    // Retry if attempts remaining
    if (currentAttempts < options.retryAttempts) {
      this.retryAttempts.set(moduleName, currentAttempts + 1);
      
      utils.logWithContext('info', 'ModuleLoader', `Retrying module load: ${moduleName} (attempt ${currentAttempts + 1}/${options.retryAttempts})`);
      
      // Exponential backoff delay
      await new Promise(resolve => setTimeout(resolve, ERROR_RECOVERY.retryDelay * Math.pow(2, currentAttempts)));
      
      // Remove from promises map to allow retry
      this.loadPromises.delete(moduleName);
      
      return this.loadModule(moduleName, options);
    }
    
    // Apply fallback strategy if available
    if (options.fallback && ERROR_RECOVERY.strategies[options.fallback]) {
      await this.applyErrorRecoveryStrategy(options.fallback, moduleName);
    }
    
    // If module is required, this is a critical error
    if (options.required) {
      utils.logWithContext('error', 'ModuleLoader', `Critical module failed to load: ${moduleName}. Application may not function correctly.`);
      return false;
    }
    
    // Non-required module failure is acceptable
    utils.logWithContext('warn', 'ModuleLoader', `Optional module failed to load: ${moduleName}. Continuing without this feature.`);
    return false;
  }
  
  /**
   * Apply error recovery strategy
   */
  async applyErrorRecoveryStrategy(strategyName, failedModule) {
    const strategy = ERROR_RECOVERY.strategies[strategyName];
    
    utils.logWithContext('info', 'ModuleLoader', `Applying error recovery strategy: ${strategyName} for module: ${failedModule}`);
    
    for (const action of strategy.actions) {
      try {
        await this.executeRecoveryAction(action, failedModule);
      } catch (error) {
        utils.logWithContext('error', 'ModuleLoader', `Recovery action failed: ${action}`, error);
      }
    }
  }
  
  /**
   * Execute individual recovery action
   */
  async executeRecoveryAction(action, failedModule) {
    const actions = {
      disableAnimations: () => {
        APP_ENVIRONMENT.features.enableAnimations = false;
        document.body.classList.add('disable-animations');
      },
      
      disableOptionalFeatures: () => {
        APP_ENVIRONMENT.features.enableSounds = false;
        APP_ENVIRONMENT.features.enableAnimations = false;
      },
      
      useSimpleNavigation: () => {
        // Fallback to basic anchor link navigation
        document.body.classList.add('simple-navigation');
      },
      
      basicNotifications: () => {
        // Provide basic alert() fallback
        window.notifications = {
          show: (message) => alert(message),
          success: (message) => alert(`✅ ${message}`),
          error: (message) => alert(`❌ ${message}`),
          warning: (message) => alert(`⚠️ ${message}`)
        };
      },
      
      logWarning: () => {
        utils.logWithContext('warn', 'Recovery', `Module ${failedModule} unavailable, continuing with degraded functionality`);
      },
      
      continueWithoutFeature: () => {
        // Mark feature as unavailable in app state
        this.appState.setState(`features.${failedModule}Ready`, false);
      },
      
      monitorPerformance: () => {
        // Increase performance monitoring for diagnosis
        APP_ENVIRONMENT.features.enablePerformanceMetrics = true;
      }
    };
    
    const actionFn = actions[action];
    if (actionFn) {
      actionFn();
    } else {
      utils.logWithContext('warn', 'ModuleLoader', `Unknown recovery action: ${action}`);
    }
  }
}

/* =====================================================
 * APPLICATION ORCHESTRATOR
 * Main application coordinator following Clean Architecture principles
 * Robert C. Martin: "The orchestrator should depend on abstractions, not concretions"
 * ===================================================== */

/**
 * Main Application Orchestrator
 * 
 * THEORY: Complex applications need a conductor to coordinate subsystems
 * PRACTICE: Systematic initialization with dependency management and error recovery
 * APPLICATION: Bulletproof startup process that handles edge cases gracefully
 */
class ApplicationOrchestrator {
  constructor() {
    this.appState = new ApplicationStateManager();
    this.moduleLoader = new ModuleLoader(this.appState);
    this.initializationPromise = null;
    this.startTime = performance.now();
    
    // Global error handler
    this.setupGlobalErrorHandling();
  }
  
  /**
   * Initialize entire application system
   * 
   * PUBLIC API - Main entry point for application startup
   * 
   * @returns {Promise<boolean>} - Success status
   */
  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }
  
  /**
   * Perform systematic application initialization
   * 
   * Ian Sommerville's structured approach:
   * 1. Environment setup
   * 2. Core module loading
   * 3. System module loading  
   * 4. Feature module loading
   * 5. Integration and verification
   */
  async performInitialization() {
    try {
      utils.logWithContext('info', 'App', '🚀 Starting application initialization...');
      this.appState.setState('initialization.status', 'loading');
      
      // Phase 1: Environment Setup
      await this.setupEnvironment();
      
      // Phase 2: Core Dependencies
      await this.loadCoreDependencies();
      
      // Phase 3: System Dependencies  
      await this.loadSystemDependencies();
      
      // Phase 4: Feature Dependencies
      await this.loadFeatureDependencies();
      
      // Phase 5: Integration and Verification
      await this.performIntegrationTests();
      
      // Phase 6: Final Setup
      await this.finalizeInitialization();
      
      const totalTime = performance.now() - this.startTime;
      this.appState.setState('performance.initializationTime', totalTime);
      this.appState.setState('initialization.status', 'ready');
      
      utils.logWithContext('info', 'App', `🎉 Application initialized successfully in ${totalTime.toFixed(2)}ms`);
      
      // Emit global ready event
      window.dispatchEvent(new CustomEvent('applicationReady', {
        detail: {
          initializationTime: totalTime,
          loadedModules: Array.from(this.moduleLoader.loadedModules),
          failedModules: Array.from(this.moduleLoader.failedModules)
        }
      }));
      
      return true;
      
    } catch (error) {
      return this.handleInitializationFailure(error);
    }
  }
  
  /**
   * Setup application environment
   * 
   * Prepare global environment for module loading
   */
  async setupEnvironment() {
    utils.logWithContext('info', 'App', '⚙️ Setting up application environment...');
    
    // Verify essential browser APIs
    const requiredAPIs = [
      'Promise',
      'fetch',
      'addEventListener',
      'querySelector',
      'localStorage'
    ];
    
    const missingAPIs = requiredAPIs.filter(api => !(api in window));
    
    if (missingAPIs.length > 0) {
      throw new Error(`Missing required browser APIs: ${missingAPIs.join(', ')}`);
    }
    
    // Setup development tools
    if (APP_ENVIRONMENT.isDevelopment) {
      this.setupDevelopmentTools();
    }
    
    // Apply user preferences to document
    this.applyUserPreferences();
    
    utils.logWithContext('info', 'App', '✅ Environment setup complete');
  }
  
  /**
   * Load core dependencies (utils, basic DOM setup)
   * 
   * These are absolutely essential for application function
   */
  async loadCoreDependencies() {
    utils.logWithContext('info', 'App', '🔧 Loading core dependencies...');
    
    const coreModules = MODULE_DEPENDENCIES.core.modules;
    const loadPromises = coreModules.map(module => 
      this.moduleLoader.loadModule(module, {
        required: true,
        timeout: MODULE_DEPENDENCIES.core.timeout,
        fallback: MODULE_DEPENDENCIES.core.fallback
      })
    );
    
    const results = await Promise.allSettled(loadPromises);
    const failures = results.filter((result, index) => {
      if (result.status === 'rejected') {
        utils.logWithContext('error', 'App', `Core module failed: ${coreModules[index]}`, result.reason);
        return true;
      }
      return false;
    });
    
    if (failures.length > 0) {
      throw new Error(`Critical core modules failed to load: ${failures.length}/${coreModules.length}`);
    }
    
    // Verify core functionality
    if (!window.utils || !window.APP_CONFIG) {
      throw new Error('Core utilities not available after loading');
    }
    
    utils.logWithContext('info', 'App', '✅ Core dependencies loaded successfully');
  }
  
  /**
   * Load system dependencies (core, notifications)
   * 
   * These provide essential user-facing functionality
   */
  async loadSystemDependencies() {
    utils.logWithContext('info', 'App', '🎯 Loading system dependencies...');
    
    const systemModules = MODULE_DEPENDENCIES.systems.modules.filter(m => m !== 'utils'); // utils already loaded
    const loadPromises = systemModules.map(module => 
      this.moduleLoader.loadModule(module, {
        required: true,
        timeout: MODULE_DEPENDENCIES.systems.timeout,
        fallback: MODULE_DEPENDENCIES.systems.fallback
      })
    );
    
    const results = await Promise.allSettled(loadPromises);
    
    // Update feature status based on loading results
    results.forEach((result, index) => {
      const moduleName = systemModules[index];
      const success = result.status === 'fulfilled' && result.value === true;
      
      this.appState.setState(`features.${moduleName}Ready`, success);
      
      if (!success) {
        utils.logWithContext('warn', 'App', `System module partially failed: ${moduleName}`, result.reason);
      }
    });
    
    utils.logWithContext('info', 'App', '✅ System dependencies processing complete');
  }
  
  /**
   * Load feature dependencies (achievements, progress, analytics)
   * 
   * These are optional enhancements that can fail gracefully
   */
  async loadFeatureDependencies() {
    utils.logWithContext('info', 'App', '✨ Loading feature dependencies...');
    
    const featureModules = MODULE_DEPENDENCIES.features.modules;
    const loadPromises = featureModules.map(module => 
      this.moduleLoader.loadModule(module, {
        required: false,
        timeout: MODULE_DEPENDENCIES.features.timeout,
        fallback: MODULE_DEPENDENCIES.features.fallback
      })
    );
    
    // Don't wait for all features - they can load asynchronously
    Promise.allSettled(loadPromises).then(results => {
      results.forEach((result, index) => {
        const moduleName = featureModules[index];
        const success = result.status === 'fulfilled' && result.value === true;
        
        this.appState.setState(`features.${moduleName}Ready`, success);
        
        if (success) {
          utils.logWithContext('info', 'App', `✅ Feature loaded: ${moduleName}`);
        } else {
          utils.logWithContext('info', 'App', `⏭️ Feature skipped: ${moduleName} (optional)`);
        }
      });
    });
    
    // Continue immediately - features are optional
    utils.logWithContext('info', 'App', '✅ Feature loading initiated (will complete asynchronously)');
  }
  
  /**
   * Perform integration tests to verify system health
   * 
   * Kent C. Dodds approach: "Test the most important user interactions"
   */
  async performIntegrationTests() {
    utils.logWithContext('info', 'App', '🧪 Performing integration tests...');
    
    const tests = [
      this.testCoreUtilities,
      this.testNavigationSystem,
      this.testNotificationSystem,
      this.testResponsiveSystem,
      this.testAccessibilityFeatures
    ];
    
    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        utils.logWithContext('warn', 'App', `Integration test failed: ${test.name}`, error);
        // Continue with other tests - integration tests are diagnostic
      }
    }
    
    utils.logWithContext('info', 'App', '✅ Integration tests completed');
  }
  
  /**
   * Test core utilities functionality
   */
  async testCoreUtilities() {
    if (!window.utils) throw new Error('Utils not available');
    
    // Test basic utility functions
    const testElement = utils.qs('body');
    if (!testElement) throw new Error('DOM utilities not working');
    
    // Test debounce function
    const debouncedFn = utils.debounce(() => {}, 100);
    if (typeof debouncedFn !== 'function') throw new Error('Debounce utility not working');
    
    utils.logWithContext('debug', 'App', '✅ Core utilities test passed');
  }
  
  /**
   * Test navigation system
   */
  async testNavigationSystem() {
    if (!window.coreAPI) throw new Error('Core API not available');
    
    const navigation = window.coreAPI.getNavigation();
    if (!navigation) throw new Error('Navigation system not available');
    
    // Test basic navigation functionality
    const navElement = utils.qs('.navigation');
    if (!navElement) throw new Error('Navigation element not found');
    
    utils.logWithContext('debug', 'App', '✅ Navigation system test passed');
  }
  
  /**
   * Test notification system
   */
  async testNotificationSystem() {
    if (!window.notifications) return; // Optional system
    
    // Test basic notification API
    if (typeof window.notifications.show !== 'function') {
      throw new Error('Notification API not complete');
    }
    
    utils.logWithContext('debug', 'App', '✅ Notification system test passed');
  }
  
  /**
   * Test responsive system
   */
  async testResponsiveSystem() {
    const viewport = utils.getViewportSize();
    if (!viewport || typeof viewport.width !== 'number') {
      throw new Error('Responsive utilities not working');
    }
    
    utils.logWithContext('debug', 'App', '✅ Responsive system test passed');
  }
  
  /**
   * Test accessibility features
   */
  async testAccessibilityFeatures() {
    // Test motion preference detection
    const reducedMotion = utils.prefersReducedMotion();
    if (typeof reducedMotion !== 'boolean') {
      throw new Error('Motion preference detection not working');
    }
    
    // Test focus management
    const focusableElements = utils.qsa('a, button, input, textarea, select');
    if (!Array.isArray(focusableElements)) {
      throw new Error('Focus management utilities not working');
    }
    
    utils.logWithContext('debug', 'App', '✅ Accessibility features test passed');
  }
  
  /**
   * Finalize initialization process
   * 
   * Setup final event listeners and global handlers
   */
  async finalizeInitialization() {
    utils.logWithContext('info', 'App', '🎯 Finalizing initialization...');
    
    // Setup global event coordination
    this.setupGlobalEventCoordination();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    // Setup development tools (if in development)
    if (APP_ENVIRONMENT.isDevelopment) {
      this.setupDevelopmentDebugging();
    }
    
    // Show initialization complete notification
    if (window.notifications) {
      setTimeout(() => {
        window.notifications.success('🚀 Sistema inicializado correctamente', {
          duration: 2000
        });
      }, 500); // Small delay to ensure DOM is ready
    }
    
    utils.logWithContext('info', 'App', '✅ Initialization finalized');
  }
  
  /**
   * Setup global event coordination between modules
   * 
   * Dan Abramov principle: "Modules should communicate through events, not direct calls"
   */
  setupGlobalEventCoordination() {
    // Listen for core system ready events
    window.addEventListener('coreSystemsReady', (event) => {
      utils.logWithContext('info', 'App', 'Core systems ready', event.detail);
    });
    
    // Listen for notification system ready
    window.addEventListener('notificationSystemReady', () => {
      utils.logWithContext('info', 'App', 'Notification system ready');
    });
    
    // Listen for user interaction events for analytics
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.appState.setState('session.interactions', 
          this.appState.getState('session.interactions') + 1
        );
      }, { passive: true });
    });
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        utils.logWithContext('info', 'App', 'Page hidden - pausing non-essential operations');
      } else {
        utils.logWithContext('info', 'App', 'Page visible - resuming operations');
      }
    });
  }
  
  /**
   * Setup performance monitoring for production optimization
   */
  setupPerformanceMonitoring() {
    if (!APP_ENVIRONMENT.features.enablePerformanceMetrics) return;
    
    // Monitor memory usage periodically
    setInterval(() => {
      if ('memory' in performance) {
        const memoryInfo = this.appState.getState('performance.memoryUsage');
        if (memoryInfo && memoryInfo.used > APP_ENVIRONMENT.performance.memoryLeakThreshold * 1024 * 1024) {
          utils.logWithContext('warn', 'App', `High memory usage detected: ${(memoryInfo.used / 1024 / 1024).toFixed(2)}MB`);
        }
      }
    }, 60000); // Check every minute
    
    // Monitor error frequency
    this.appState.on('stateChange:performance.errorCount', (data) => {
      if (data.newValue > 10) {
        utils.logWithContext('warn', 'App', `High error count detected: ${data.newValue} errors`);
      }
    });
  }
  
  /**
   * Setup development debugging tools
   */
  setupDevelopmentDebugging() {
    // Expose debugging API
    window.appDebug = {
      getState: () => this.appState.getStatus(),
      getModules: () => ({
        loaded: Array.from(this.moduleLoader.loadedModules),
        failed: Array.from(this.moduleLoader.failedModules)
      }),
      showNotification: (message, type) => {
        if (window.notifications) {
          window.notifications.show(message, type);
        }
      },
      testIntegration: () => this.performIntegrationTests(),
      reloadModule: (moduleName) => {
        this.moduleLoader.loadPromises.delete(moduleName);
        this.moduleLoader.loadedModules.delete(moduleName);
        return this.moduleLoader.loadModule(moduleName);
      }
    };
    
    // Setup keyboard shortcuts for debugging
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'D':
            e.preventDefault();
            console.log('🐛 App Debug Info:', window.appDebug.getState());
            break;
          case 'M':
            e.preventDefault();
            console.log('📦 Module Info:', window.appDebug.getModules());
            break;
          case 'T':
            e.preventDefault();
            window.appDebug.testIntegration();
            break;
        }
      }
    });
    
    utils.logWithContext('info', 'App', '🛠️ Development debugging tools enabled');
    utils.logWithContext('info', 'App', 'Shortcuts: Ctrl+Shift+D (debug), Ctrl+Shift+M (modules), Ctrl+Shift+T (test)');
  }
  
  /**
   * Setup development tools and helpers
   */
  setupDevelopmentTools() {
    // Enhanced console styling
    const styles = {
      success: 'color: #22c55e; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;',
      warning: 'color: #f59e0b; font-weight: bold;',
      info: 'color: #3b82f6; font-weight: bold;'
    };
    
    window.logStyled = (message, type = 'info') => {
      console.log(`%c${message}`, styles[type]);
    };
    
    // Performance measurement helpers
    window.measurePerformance = (name, fn) => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    };
  }
  
  /**
   * Apply user preferences to document
   */
  applyUserPreferences() {
    const preferences = this.appState.getState('preferences');
    
    // Apply reduced motion preference
    if (preferences.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
    
    // Apply high contrast preference
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    // Apply debug mode
    if (preferences.debugMode) {
      document.body.classList.add('debug-mode');
    }
  }
  
  /**
   * Setup global error handling
   * 
   * Wes Bos principle: "Catch errors before they crash the user experience"
   */
  setupGlobalErrorHandling() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.appState.setState('performance.errorCount', 
        this.appState.getState('performance.errorCount') + 1
      );
      
      utils.logWithContext('error', 'App', 'Unhandled promise rejection', event.reason);
      
      // Prevent console error in production
      if (APP_ENVIRONMENT.isProduction) {
        event.preventDefault();
      }
    });
    
    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      this.appState.setState('performance.errorCount', 
        this.appState.getState('performance.errorCount') + 1
      );
      
      utils.logWithContext('error', 'App', 'Global error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }
  
  /**
   * Handle initialization failure
   * 
   * Martin Fowler: "Fail gracefully with useful information"
   */
  async handleInitializationFailure(error) {
    utils.logWithContext('error', 'App', '💥 Application initialization failed', error);
    
    this.appState.setState('initialization.status', 'error');
    this.appState.setState('initialization.initializationErrors', [
      ...this.appState.getState('initialization.initializationErrors'),
      { error: error.message, timestamp: Date.now(), critical: true }
    ]);
    
    // Try to provide basic functionality
    try {
      await this.attemptGracefulDegradation();
      
      // Show error notification if possible
      if (window.alert) {
        setTimeout(() => {
          window.alert('⚠️ La aplicación no se pudo inicializar completamente. Algunas funciones pueden no estar disponibles.');
        }, 100);
      }
      
      return false;
      
    } catch (degradationError) {
      utils.logWithContext('error', 'App', 'Graceful degradation also failed', degradationError);
      
      // Last resort: basic page functionality
      document.body.innerHTML += `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: #ef4444; color: white; padding: 20px; border-radius: 8px; 
                    font-family: Arial, sans-serif; text-align: center; z-index: 9999;">
          <h2>⚠️ Error de Inicialización</h2>
          <p>La aplicación no se pudo cargar correctamente.</p>
          <button onclick="window.location.reload()" 
                  style="margin-top: 10px; padding: 10px 20px; background: white; 
                         color: #ef4444; border: none; border-radius: 4px; cursor: pointer;">
            Recargar Página
          </button>
        </div>
      `;
      
      return false;
    }
  }
  
  /**
   * Attempt graceful degradation when initialization fails
   */
  async attemptGracefulDegradation() {
    utils.logWithContext('info', 'App', '🔄 Attempting graceful degradation...');
    
    // Provide basic navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'auto' });
        }
      });
    });
    
    // Provide basic demo functions
    window.runCode = () => alert(DEMO_CONFIG.MESSAGES.RUN);
    window.fixCode = () => alert(DEMO_CONFIG.MESSAGES.FIX);
    window.resetCode = () => alert(DEMO_CONFIG.MESSAGES.RESET);
    
    utils.logWithContext('info', 'App', '✅ Basic functionality restored');
  }
}

/* =====================================================
 * GLOBAL INITIALIZATION
 * Application startup orchestration
 * Entry point for the entire application system
 * ===================================================== */

/**
 * Global application instance
 * Single point of truth for application state and coordination
 */
let globalApp = null;

/**
 * Initialize application
 * 
 * PUBLIC API - Main initialization function
 * Can be called multiple times safely (returns existing promise)
 * 
 * @returns {Promise<boolean>} - Success status
 */
async function initializeApplication() {
  if (!globalApp) {
    globalApp = new ApplicationOrchestrator();
  }
  
  return globalApp.initialize();
}

/**
 * Get application status
 * 
 * PUBLIC API - Application health check
 * 
 * @returns {Object} - Current application status
 */
function getApplicationStatus() {
  if (!globalApp) {
    return {
      initialization: 'not-started',
      ready: false,
      modules: { loaded: [], failed: [] },
      performance: null,
      features: {}
    };
  }
  
  return globalApp.appState.getStatus();
}

/* =====================================================
 * BACKWARD COMPATIBILITY & GLOBAL API
 * Maintain compatibility with existing code patterns
 * Robert C. Martin: "Keep interfaces stable while improving implementation"
 * ===================================================== */

// Global API for external access
window.app = {
  initialize: initializeApplication,
  getStatus: getApplicationStatus,
  
  // Legacy compatibility
  ready: false, // Will be set to true when initialization completes
  version: '2.0.0-refactored'
};

// Enhanced global demo functions with error handling
const originalRunCode = window.runCode;
const originalFixCode = window.fixCode; 
const originalResetCode = window.resetCode;

window.runCode = async function() {
  try {
    if (window.notifications) {
      await window.notifications.bugDetected(DEMO_CONFIG.MESSAGES.RUN);
    } else if (originalRunCode) {
      originalRunCode();
    } else {
      alert(DEMO_CONFIG.MESSAGES.RUN);
    }
  } catch (error) {
    utils.logWithContext('error', 'Demo', 'runCode failed', error);
    alert('Error ejecutando código demo');
  }
};

window.fixCode = async function() {
  try {
    if (window.notifications) {
      await window.notifications.codeFixed(DEMO_CONFIG.MESSAGES.FIX);
    } else if (originalFixCode) {
      originalFixCode();
    } else {
      alert(DEMO_CONFIG.MESSAGES.FIX);
    }
  } catch (error) {
    utils.logWithContext('error', 'Demo', 'fixCode failed', error);
    alert('Error corrigiendo código demo');
  }
};

window.resetCode = async function() {
  try {
    if (window.notifications) {
      await window.notifications.info(DEMO_CONFIG.MESSAGES.RESET);
    } else if (originalResetCode) {
      originalResetCode();
    } else {
      alert(DEMO_CONFIG.MESSAGES.RESET);
    }
  } catch (error) {
    utils.logWithContext('error', 'Demo', 'resetCode failed', error);
    alert('Error reseteando código demo');
  }
};

/* =====================================================
 * AUTO-INITIALIZATION
 * Start the application when this module loads
 * Can be deferred by setting window.DEFER_APP_INIT = true before loading
 * ===================================================== */

// Auto-initialize unless explicitly deferred
if (!window.DEFER_APP_INIT) {
  // Use setTimeout to ensure all modules have loaded
  setTimeout(async () => {
    try {
      const success = await initializeApplication();
      
      if (success) {
        window.app.ready = true;
        utils.logWithContext('info', 'App', '🎉 APPLICATION FULLY READY - All systems operational');
        
        // Fire legacy ready event for backward compatibility
        window.dispatchEvent(new CustomEvent('appReady'));
        
      } else {
        utils.logWithContext('warn', 'App', '⚠️ Application started with degraded functionality');
      }
      
    } catch (error) {
      utils.logWithContext('error', 'App', '💥 Auto-initialization failed', error);
      
      // Fallback: basic page functionality
      window.app.ready = false;
    }
  }, 100); // Small delay to ensure DOM and all scripts are loaded
}

// Final success message
utils.logWithContext('info', 'Main', '🎯 Main application orchestrator loaded and ready for initialization');