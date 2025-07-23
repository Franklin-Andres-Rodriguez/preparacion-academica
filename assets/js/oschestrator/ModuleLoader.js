/* =====================================================
 * 📁 assets/js/orchestrator/ModuleLoader.js 
 * Single Responsibility: Module Loading & Dependency Management
 * ===================================================== */

/**
 * Advanced Module Loader with Dependency Management
 * 
 * Ian Sommerville: "Dependencies should be explicit, ordered, and recoverable"
 * Kent C. Dodds: "Fail gracefully with useful feedback"
 */
export class ModuleLoader {
  constructor(appState, config) {
    this.appState = appState;
    this.config = config;
    this.loadPromises = new Map();
    this.loadedModules = new Set();
    this.failedModules = new Set();
    this.retryAttempts = new Map();
  }
  
  async loadModule(moduleName, options = {}) {
    const {
      required = true,
      timeout = 5000,
      retryAttempts = 3,
      fallback = null
    } = options;
    
    if (this.loadPromises.has(moduleName)) {
      return this.loadPromises.get(moduleName);
    }
    
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
  
  async performModuleLoad(moduleName, options) {
    const startTime = performance.now();
    
    try {
      utils.logWithContext('info', 'ModuleLoader', `Loading module: ${moduleName}`);
      
      const moduleAvailable = await this.checkModuleAvailability(moduleName);
      
      if (!moduleAvailable) {
        throw new Error(`Module ${moduleName} is not available`);
      }
      
      await this.initializeModule(moduleName, options.timeout);
      
      this.loadedModules.add(moduleName);
      this.appState.setState(`initialization.loadedModules`, this.loadedModules);
      
      const loadTime = performance.now() - startTime;
      this.appState.setState(`performance.moduleLoadTimes`, 
        new Map(this.appState.getState('performance.moduleLoadTimes')).set(moduleName, loadTime)
      );
      
      if (loadTime > this.config.performance.slowModuleThreshold) {
        utils.logWithContext('warn', 'ModuleLoader', `Slow module load: ${moduleName} took ${loadTime.toFixed(2)}ms`);
      }
      
      utils.logWithContext('info', 'ModuleLoader', `✅ Module loaded successfully: ${moduleName} (${loadTime.toFixed(2)}ms)`);
      return true;
      
    } catch (error) {
      return this.handleModuleLoadError(moduleName, error, options);
    }
  }
  
  async checkModuleAvailability(moduleName) {
    const moduleCheckers = {
      'utils': () => window.utils && window.APP_CONFIG,
      'core': () => window.coreManager && window.coreAPI,
      'notifications': () => window.notifications && window.notificationAPI,
      'achievements': () => window.achievementManager,
      'progress-tracker': () => window.progressTracker,
      'analytics': () => window.analytics
    };
    
    const checker = moduleCheckers[moduleName];
    if (!checker) {
      utils.logWithContext('warn', 'ModuleLoader', `No availability checker for module: ${moduleName}`);
      return true;
    }
    
    const maxWait = 3000;
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      if (checker()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return false;
  }
  
  async initializeModule(moduleName, timeout) {
    const initMethods = {
      'core': async () => {
        if (window.coreManager && !window.coreManager.isReady()) {
          await window.coreManager.initialize();
        }
      },
      'notifications': async () => {
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
  
  async handleModuleLoadError(moduleName, error, options) {
    const currentAttempts = this.retryAttempts.get(moduleName) || 0;
    
    utils.logWithContext('error', 'ModuleLoader', `Failed to load module: ${moduleName}`, error);
    
    this.failedModules.add(moduleName);
    this.appState.setState('initialization.failedModules', this.failedModules);
    this.appState.setState('initialization.initializationErrors', [
      ...this.appState.getState('initialization.initializationErrors'),
      { module: moduleName, error: error.message, timestamp: Date.now() }
    ]);
    
    if (currentAttempts < options.retryAttempts) {
      this.retryAttempts.set(moduleName, currentAttempts + 1);
      
      utils.logWithContext('info', 'ModuleLoader', `Retrying module load: ${moduleName} (attempt ${currentAttempts + 1}/${options.retryAttempts})`);
      
      await new Promise(resolve => setTimeout(resolve, this.config.errorRecovery.retryDelay * Math.pow(2, currentAttempts)));
      
      this.loadPromises.delete(moduleName);
      
      return this.loadModule(moduleName, options);
    }
    
    if (options.fallback && this.config.errorRecovery.strategies[options.fallback]) {
      await this.applyErrorRecoveryStrategy(options.fallback, moduleName);
    }
    
    if (options.required) {
      utils.logWithContext('error', 'ModuleLoader', `Critical module failed to load: ${moduleName}. Application may not function correctly.`);
      return false;
    }
    
    utils.logWithContext('warn', 'ModuleLoader', `Optional module failed to load: ${moduleName}. Continuing without this feature.`);
    return false;
  }
  
  async applyErrorRecoveryStrategy(strategyName, failedModule) {
    const strategy = this.config.errorRecovery.strategies[strategyName];
    
    utils.logWithContext('info', 'ModuleLoader', `Applying error recovery strategy: ${strategyName} for module: ${failedModule}`);
    
    for (const action of strategy.actions) {
      try {
        await this.executeRecoveryAction(action, failedModule);
      } catch (error) {
        utils.logWithContext('error', 'ModuleLoader', `Recovery action failed: ${action}`, error);
      }
    }
  }
  
  async executeRecoveryAction(action, failedModule) {
    const actions = {
      disableAnimations: () => {
        if (window.APP_CONFIG) {
          window.APP_CONFIG.features.enableAnimations = false;
        }
        document.body.classList.add('disable-animations');
      },
      
      disableOptionalFeatures: () => {
        if (window.APP_CONFIG) {
          window.APP_CONFIG.features.enableSounds = false;
          window.APP_CONFIG.features.enableAnimations = false;
        }
      },
      
      useSimpleNavigation: () => {
        document.body.classList.add('simple-navigation');
      },
      
      basicNotifications: () => {
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
        this.appState.setState(`features.${failedModule}Ready`, false);
      },
      
      monitorPerformance: () => {
        if (window.APP_CONFIG) {
          window.APP_CONFIG.features.enablePerformanceMetrics = true;
        }
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