/* =====================================================
 * 📁 assets/js/orchestrator/ApplicationOrchestrator.js
 * Main Orchestrator - Coordinates all subsystems
 * ===================================================== */

import { ApplicationStateManager } from './StateManager.js';
import { ModuleLoader } from './ModuleLoader.js';
import { PerformanceMonitor } from './PerformanceMonitor.js';
import { ErrorRecovery } from './ErrorRecovery.js';
import { IntegrationTester } from './IntegrationTester.js';

/**
 * Main Application Orchestrator
 * 
 * Robert C. Martin: "The orchestrator should depend on abstractions, not concretions"
 * Ian Sommerville: "Systematic initialization with dependency management"
 */
export class ApplicationOrchestrator {
  constructor(config) {
    this.config = config;
    this.appState = new ApplicationStateManager();
    this.moduleLoader = new ModuleLoader(this.appState, this.config);
    this.performanceMonitor = new PerformanceMonitor(this.appState, this.config);
    this.errorRecovery = new ErrorRecovery(this.appState, this.config);
    this.integrationTester = new IntegrationTester(this.appState, this.config);
    
    this.initializationPromise = null;
    this.startTime = performance.now();
  }
  
  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }
  
  async performInitialization() {
    try {
      utils.logWithContext('info', 'App', '🚀 Starting application initialization...');
      this.appState.setState('initialization.status', 'loading');
      
      await this.setupEnvironment();
      await this.loadCoreDependencies();
      await this.loadSystemDependencies();
      await this.loadFeatureDependencies();
      await this.performIntegrationTests();
      await this.finalizeInitialization();
      
      const totalTime = performance.now() - this.startTime;
      this.appState.setState('performance.initializationTime', totalTime);
      this.appState.setState('initialization.status', 'ready');
      
      utils.logWithContext('info', 'App', `🎉 Application initialized successfully in ${totalTime.toFixed(2)}ms`);
      
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
  
  async setupEnvironment() {
    utils.logWithContext('info', 'App', '⚙️ Setting up application environment...');
    
    const requiredAPIs = ['Promise', 'fetch', 'addEventListener', 'querySelector', 'localStorage'];
    const missingAPIs = requiredAPIs.filter(api => !(api in window));
    
    if (missingAPIs.length > 0) {
      throw new Error(`Missing required browser APIs: ${missingAPIs.join(', ')}`);
    }
    
    if (this.config.environment.isDevelopment) {
      this.setupDevelopmentTools();
    }
    
    this.applyUserPreferences();
    
    utils.logWithContext('info', 'App', '✅ Environment setup complete');
  }
  
  async loadCoreDependencies() {
    utils.logWithContext('info', 'App', '🔧 Loading core dependencies...');
    
    const coreModules = this.config.dependencies.core.modules;
    const loadPromises = coreModules.map(module => 
      this.moduleLoader.loadModule(module, {
        required: true,
        timeout: this.config.dependencies.core.timeout,
        fallback: this.config.dependencies.core.fallback
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
    
    if (!window.utils || !window.APP_CONFIG) {
      throw new Error('Core utilities not available after loading');
    }
    
    utils.logWithContext('info', 'App', '✅ Core dependencies loaded successfully');
  }
  
  async loadSystemDependencies() {
    utils.logWithContext('info', 'App', '🎯 Loading system dependencies...');
    
    const systemModules = this.config.dependencies.systems.modules.filter(m => m !== 'utils');
    const loadPromises = systemModules.map(module => 
      this.moduleLoader.loadModule(module, {
        required: true,
        timeout: this.config.dependencies.systems.timeout,
        fallback: this.config.dependencies.systems.fallback
      })
    );
    
    const results = await Promise.allSettled(loadPromises);
    
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
  
  async loadFeatureDependencies() {
    utils.logWithContext('info', 'App', '✨ Loading feature dependencies...');
    
    const featureModules = this.config.dependencies.features.modules;
    const loadPromises = featureModules.map(module => 
      this.moduleLoader.loadModule(module, {
        required: false,
        timeout: this.config.dependencies.features.timeout,
        fallback: this.config.dependencies.features.fallback
      })
    );
    
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
    
    utils.logWithContext('info', 'App', '✅ Feature loading initiated (will complete asynchronously)');
  }
  
  async performIntegrationTests() {
    utils.logWithContext('info', 'App', '🧪 Performing integration tests...');
    
    try {
      const results = await this.integrationTester.runAllTests();
      
      if (results.failed > 0) {
        utils.logWithContext('warn', 'App', `Integration tests completed with ${results.failed} failures`);
      }
      
    } catch (error) {
      utils.logWithContext('warn', 'App', 'Integration tests failed', error);
    }
    
    utils.logWithContext('info', 'App', '✅ Integration tests completed');
  }
  
  async finalizeInitialization() {
    utils.logWithContext('info', 'App', '🎯 Finalizing initialization...');
    
    this.setupGlobalEventCoordination();
    
    if (this.config.environment.isDevelopment) {
      this.setupDevelopmentDebugging();
    }
    
    if (window.notifications) {
      setTimeout(() => {
        window.notifications.success('🚀 Sistema inicializado correctamente', {
          duration: 2000
        });
      }, 500);
    }
    
    utils.logWithContext('info', 'App', '✅ Initialization finalized');
  }
  
  setupGlobalEventCoordination() {
    window.addEventListener('coreSystemsReady', (event) => {
      utils.logWithContext('info', 'App', 'Core systems ready', event.detail);
    });
    
    window.addEventListener('notificationSystemReady', () => {
      utils.logWithContext('info', 'App', 'Notification system ready');
    });
    
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.appState.setState('session.interactions', 
          this.appState.getState('session.interactions') + 1
        );
      }, { passive: true });
    });
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        utils.logWithContext('info', 'App', 'Page hidden - pausing non-essential operations');
      } else {
        utils.logWithContext('info', 'App', 'Page visible - resuming operations');
      }
    });
  }
  
  setupDevelopmentTools() {
    const styles = {
      success: 'color: #22c55e; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;',
      warning: 'color: #f59e0b; font-weight: bold;',
      info: 'color: #3b82f6; font-weight: bold;'
    };
    
    window.logStyled = (message, type = 'info') => {
      console.log(`%c${message}`, styles[type]);
    };
    
    window.measurePerformance = (name, fn) => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    };
  }
  
  setupDevelopmentDebugging() {
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
      testIntegration: () => this.integrationTester.runAllTests(),
      reloadModule: (moduleName) => {
        this.moduleLoader.loadPromises.delete(moduleName);
        this.moduleLoader.loadedModules.delete(moduleName);
        return this.moduleLoader.loadModule(moduleName);
      },
      getPerformanceReport: () => this.performanceMonitor.getPerformanceReport()
    };
    
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
          case 'P':
            e.preventDefault();
            console.log('⚡ Performance Report:', window.appDebug.getPerformanceReport());
            break;
        }
      }
    });
    
    utils.logWithContext('info', 'App', '🛠️ Development debugging tools enabled');
    utils.logWithContext('info', 'App', 'Shortcuts: Ctrl+Shift+D (debug), Ctrl+Shift+M (modules), Ctrl+Shift+T (test), Ctrl+Shift+P (performance)');
  }
  
  applyUserPreferences() {
    const preferences = this.appState.getState('preferences');
    
    if (preferences.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
    
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    if (preferences.debugMode) {
      document.body.classList.add('debug-mode');
    }
  }
  
  async handleInitializationFailure(error) {
    utils.logWithContext('error', 'App', '💥 Application initialization failed', error);
    
    this.appState.setState('initialization.status', 'error');
    this.appState.setState('initialization.initializationErrors', [
      ...this.appState.getState('initialization.initializationErrors'),
      { error: error.message, timestamp: Date.now(), critical: true }
    ]);
    
    try {
      const success = await this.errorRecovery.attemptGracefulDegradation();
      
      if (!success) {
        await this.errorRecovery.showEmergencyUI(error);
      } else if (window.alert) {
        setTimeout(() => {
          window.alert('⚠️ La aplicación no se pudo inicializar completamente. Algunas funciones pueden no estar disponibles.');
        }, 100);
      }
      
      return false;
      
    } catch (degradationError) {
      utils.logWithContext('error', 'App', 'Graceful degradation also failed', degradationError);
      await this.errorRecovery.showEmergencyUI(error);
      return false;
    }
  }
}