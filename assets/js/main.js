/* ===== SIMPLIFIED APPLICATION ENTRY POINT ===== */
/* Clean Architecture Implementation: Robert C. Martin's Dependency Inversion */
/* Ian Sommerville's Systematic Structure with Martin Fowler's Evolutionary Design */

/* =====================================================
 * ARCHITECTURAL PHILOSOPHY - The Simplified Approach
 * 
 * Robert C. Martin: "The main function should be the lowest level policy"
 * Martin Fowler: "Keep the main function simple, delegate complexity to modules"
 * Ian Sommerville: "Entry points should coordinate, not implement"
 * 
 * This simplified main.js represents the ultimate in Clean Architecture:
 * - Single Responsibility: Coordinate application startup
 * - Open/Closed: Extensible via configuration, closed for modification
 * - Dependency Inversion: Depends on abstractions (config), not concretions
 * - Interface Segregation: Minimal, focused API surface
 * ===================================================== */

import { configManager } from './config/index.js';
import { ApplicationOrchestrator } from './orchestrator/ApplicationOrchestrator.js';

/* =====================================================
 * GLOBAL APPLICATION COORDINATOR
 * Single point of entry for the entire application
 * ===================================================== */

/**
 * Global Application Instance
 * Following Singleton pattern for application coordination
 */
let globalApplicationInstance = null;

/**
 * Application Startup Configuration
 * Can be overridden before calling initializeApplication()
 */
window.APP_STARTUP_CONFIG = {
  deferAutoInit: window.DEFER_APP_INIT || false,
  enableDevelopmentMode: false, // Will be auto-detected
  customConfigOverrides: {},    // Custom configuration overrides
  initializationTimeout: 10000, // 10 seconds max for full initialization
  enableGracefulDegradation: true
};

/* =====================================================
 * PUBLIC API - Application Initialization
 * Clean, simple interface following Martin Fowler's API design principles
 * ===================================================== */

/**
 * Initialize Application - Main Entry Point
 * 
 * PUBLIC API - Can be called multiple times safely
 * Returns existing promise if already initializing
 * 
 * @param {Object} options - Optional initialization overrides
 * @returns {Promise<boolean>} - Success status
 */
async function initializeApplication(options = {}) {
  try {
    // Step 1: Configuration Initialization
    if (!window.APP_CONFIG) {
      utils.logWithContext('info', 'Main', '⚙️ Initializing configuration system...');
      const config = configManager.initialize();
      
      // Apply any custom overrides
      if (options.configOverrides || window.APP_STARTUP_CONFIG.customConfigOverrides) {
        const overrides = { ...window.APP_STARTUP_CONFIG.customConfigOverrides, ...options.configOverrides };
        Object.entries(overrides).forEach(([path, value]) => {
          configManager.updateConfiguration(path, value);
        });
      }
      
      utils.logWithContext('info', 'Main', `✅ Configuration initialized for ${config.environment.environment} environment`);
    }
    
    // Step 2: Application Orchestrator Initialization
    if (!globalApplicationInstance) {
      utils.logWithContext('info', 'Main', '🚀 Creating application orchestrator...');
      globalApplicationInstance = new ApplicationOrchestrator(window.APP_CONFIG);
    }
    
    // Step 3: System Initialization with Timeout
    utils.logWithContext('info', 'Main', '🎯 Starting application initialization...');
    
    const initTimeout = options.timeout || window.APP_STARTUP_CONFIG.initializationTimeout;
    const initPromise = globalApplicationInstance.initialize();
    
    const success = await Promise.race([
      initPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Initialization timeout after ${initTimeout}ms`)), initTimeout)
      )
    ]);
    
    if (success) {
      // Step 4: Final Setup
      window.app.ready = true;
      window.app.instance = globalApplicationInstance;
      
      utils.logWithContext('info', 'Main', '🎉 APPLICATION FULLY READY - All systems operational');
      
      // Fire legacy events for backward compatibility
      window.dispatchEvent(new CustomEvent('appReady'));
      window.dispatchEvent(new CustomEvent('applicationReady', {
        detail: globalApplicationInstance.appState.getStatus()
      }));
      
      return true;
    }
    
    return false;
    
  } catch (error) {
    return handleInitializationError(error, options);
  }
}

/**
 * Get Application Status - Health Check API
 * 
 * PUBLIC API - Application health and diagnostic information
 * 
 * @returns {Object} - Current application status
 */
function getApplicationStatus() {
  if (!globalApplicationInstance) {
    return {
      initialized: false,
      ready: false,
      status: 'not-started',
      message: 'Application not initialized'
    };
  }
  
  const status = globalApplicationInstance.appState.getStatus();
  
  return {
    ...status,
    uptime: Date.now() - (globalApplicationInstance.startTime || Date.now()),
    configHash: window.APP_CONFIG?.meta?.configurationHash,
    version: window.APP_CONFIG?.meta?.version || '2.0.0-modular'
  };
}

/**
 * Reload Application - Recovery API
 * 
 * PUBLIC API - Force reload with optional configuration changes
 * 
 * @param {Object} options - Reload options
 * @returns {Promise<boolean>} - Success status
 */
async function reloadApplication(options = {}) {
  utils.logWithContext('info', 'Main', '🔄 Reloading application...');
  
  try {
    // Clean up existing instance
    if (globalApplicationInstance) {
      // Cleanup if method exists
      if (typeof globalApplicationInstance.destroy === 'function') {
        await globalApplicationInstance.destroy();
      }
      globalApplicationInstance = null;
    }
    
    // Reset configuration if requested
    if (options.resetConfiguration) {
      window.APP_CONFIG = null;
      configManager.initialized = false;
    }
    
    // Reset global state
    window.app.ready = false;
    window.app.instance = null;
    
    // Reinitialize
    return await initializeApplication(options);
    
  } catch (error) {
    utils.logWithContext('error', 'Main', 'Application reload failed', error);
    return false;
  }
}

/* =====================================================
 * ERROR HANDLING - Graceful Degradation Strategy
 * Kent C. Dodds: "Fail gracefully with useful feedback"
 * ===================================================== */

/**
 * Handle initialization errors with recovery strategies
 * 
 * @param {Error} error - Initialization error
 * @param {Object} options - Initialization options
 * @returns {Promise<boolean>} - Recovery success status
 */
async function handleInitializationError(error, options = {}) {
  utils.logWithContext('error', 'Main', '💥 Application initialization failed', error);
  
  // Update app status
  window.app.ready = false;
  window.app.error = error;
  
  // Attempt graceful degradation if enabled
  if (window.APP_STARTUP_CONFIG.enableGracefulDegradation !== false) {
    try {
      utils.logWithContext('info', 'Main', '🔄 Attempting graceful degradation...');
      
      const success = await attemptGracefulDegradation(error);
      
      if (success) {
        window.app.ready = 'degraded';
        utils.logWithContext('info', 'Main', '✅ Application running in degraded mode');
        return true;
      }
      
    } catch (degradationError) {
      utils.logWithContext('error', 'Main', 'Graceful degradation failed', degradationError);
    }
  }
  
  // Show error UI as last resort
  showErrorUI(error);
  return false;
}

/**
 * Attempt graceful degradation when initialization fails
 * 
 * @param {Error} error - Original error
 * @returns {Promise<boolean>} - Degradation success status
 */
async function attemptGracefulDegradation(error) {
  try {
    // Provide basic navigation functionality
    provideBasicNavigation();
    
    // Provide basic demo functions
    provideBasicDemoFunctions();
    
    // Apply emergency styling
    applyEmergencyStyles();
    
    // Show degraded mode notification
    setTimeout(() => {
      if (window.alert) {
        window.alert('⚠️ La aplicación está funcionando en modo simplificado. Algunas funciones pueden no estar disponibles.');
      }
    }, 1000);
    
    return true;
    
  } catch (degradationError) {
    return false;
  }
}

/**
 * Provide basic navigation when systems fail
 */
function provideBasicNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Provide basic demo functions for case studies
 */
function provideBasicDemoFunctions() {
  const messages = {
    RUN: '🐛 Código ejecutado - Bug detectado en línea 23',
    FIX: '✅ ¡Excelente! Has corregido el error.',
    RESET: '🔄 Código reiniciado al estado original'
  };
  
  window.runCode = () => alert(messages.RUN);
  window.fixCode = () => alert(messages.FIX);
  window.resetCode = () => alert(messages.RESET);
}

/**
 * Apply emergency styles for degraded mode
 */
function applyEmergencyStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .emergency-mode {
      --animation-duration: 0s;
    }
    .emergency-mode * {
      animation: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('emergency-mode');
}

/**
 * Show error UI when all recovery attempts fail
 * 
 * @param {Error} error - The error that caused failure
 */
function showErrorUI(error) {
  const errorHTML = `
    <div id="app-error-ui" style="
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.9); color: white;
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 999999;
    ">
      <div style="
        background: #1a1a1a; padding: 2rem; border-radius: 8px;
        max-width: 500px; margin: 1rem; text-align: center;
        border: 1px solid #333;
      ">
        <h2 style="color: #ff6b6b; margin: 0 0 1rem 0;">⚠️ Error de Sistema</h2>
        <p style="margin: 0 0 1rem 0; line-height: 1.5;">
          La aplicación no se pudo inicializar correctamente. 
          Esto puede deberse a problemas de conectividad o incompatibilidad del navegador.
        </p>
        <details style="margin: 1rem 0; text-align: left;">
          <summary style="cursor: pointer; color: #4dabf7;">Información técnica</summary>
          <pre style="
            background: #000; padding: 1rem; border-radius: 4px;
            font-size: 12px; overflow: auto; margin-top: 0.5rem;
            color: #ffa8a8; border: 1px solid #333;
          ">${error.message}</pre>
        </details>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.location.reload()" style="
            background: #4dabf7; color: white; border: none;
            padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;
            font-weight: 500;
          ">Recargar Página</button>
          <button onclick="document.getElementById('app-error-ui').style.display='none'" style="
            background: transparent; color: #4dabf7; border: 1px solid #4dabf7;
            padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;
            font-weight: 500;
          ">Continuar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', errorHTML);
}

/* =====================================================
 * GLOBAL API SETUP - Backward Compatibility
 * Maintain compatibility while improving architecture
 * ===================================================== */

// Enhanced global API
window.app = {
  // Core API
  initialize: initializeApplication,
  getStatus: getApplicationStatus,
  reload: reloadApplication,
  
  // State properties
  ready: false,
  instance: null,
  error: null,
  
  // Metadata
  version: '2.0.0-clean-architecture',
  architecture: 'modular-orchestration'
};

// Development debugging API
if (configManager.getConfigValue('environment.environment') === 'development') {
  window.appDebug = {
    // Quick access to common debugging tasks
    status: () => getApplicationStatus(),
    config: () => window.APP_CONFIG,
    reload: (options) => reloadApplication(options),
    
    // Advanced debugging
    inspect: () => {
      console.group('🔍 Application Debug Info');
      console.log('Status:', getApplicationStatus());
      console.log('Config:', window.APP_CONFIG);
      console.log('Instance:', globalApplicationInstance);
      console.groupEnd();
    },
    
    // Configuration management
    setConfig: (path, value) => configManager.updateConfiguration(path, value),
    getConfig: (path, defaultValue) => configManager.getConfigValue(path, defaultValue)
  };
  
  // Development shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.altKey) {
      switch (e.key) {
        case 'I':
          e.preventDefault();
          window.appDebug.inspect();
          break;
        case 'R':
          e.preventDefault();
          window.appDebug.reload();
          break;
        case 'S':
          e.preventDefault();
          console.log('📊 Status:', window.appDebug.status());
          break;
      }
    }
  });
  
  console.log('🛠️ Development mode enabled');
  console.log('🔧 Debug shortcuts: Ctrl+Shift+Alt+I (inspect), R (reload), S (status)');
}

/* =====================================================
 * ENHANCED DEMO FUNCTIONS - Integrated Error Handling
 * Improve existing demo functions with error handling
 * ===================================================== */

// Enhanced demo functions that integrate with the new system
const createEnhancedDemoFunction = (originalFn, fallbackMessage) => {
  return async function(...args) {
    try {
      // Try advanced notification system first
      if (window.notifications && globalApplicationInstance?.appState?.getState('features.notificationsReady')) {
        return await originalFn.apply(this, args);
      }
      
      // Fallback to basic alert
      alert(fallbackMessage);
      
    } catch (error) {
      utils.logWithContext('error', 'Demo', 'Demo function failed', error);
      alert(`⚠️ ${fallbackMessage}`);
    }
  };
};

// Preserve existing demo functions with enhanced error handling
const originalDemoFunctions = {
  runCode: window.runCode,
  fixCode: window.fixCode,
  resetCode: window.resetCode
};

window.runCode = createEnhancedDemoFunction(
  originalDemoFunctions.runCode || (() => window.notifications?.bugDetected('🐛 Código ejecutado - Bug detectado')),
  '🐛 Código ejecutado - Bug detectado en línea 23'
);

window.fixCode = createEnhancedDemoFunction(
  originalDemoFunctions.fixCode || (() => window.notifications?.codeFixed('✅ ¡Excelente! Has corregido el error.')),
  '✅ ¡Excelente! Has corregido el error.'
);

window.resetCode = createEnhancedDemoFunction(
  originalDemoFunctions.resetCode || (() => window.notifications?.info('🔄 Código reiniciado')),
  '🔄 Código reiniciado al estado original'
);

/* =====================================================
 * AUTO-INITIALIZATION - Smart Startup Logic
 * Initialize automatically unless explicitly deferred
 * ===================================================== */

// Smart auto-initialization with better error handling
if (!window.APP_STARTUP_CONFIG.deferAutoInit) {
  // Small delay to ensure all modules are loaded
  setTimeout(async () => {
    try {
      const success = await initializeApplication();
      
      if (success) {
        utils.logWithContext('info', 'Main', '🎉 AUTO-INITIALIZATION COMPLETED SUCCESSFULLY');
      } else {
        utils.logWithContext('warn', 'Main', '⚠️ Auto-initialization completed with degraded functionality');
      }
      
    } catch (error) {
      utils.logWithContext('error', 'Main', '💥 Auto-initialization failed completely', error);
    }
  }, 150); // Slightly longer delay for module loading
}

// Log successful module load
utils.logWithContext('info', 'Main', '📋 Simplified main orchestrator loaded - Clean Architecture implementation ready');

/* =====================================================
 * EXPORT FOR MODULE SYSTEMS
 * Support both global and module-based usage
 * ===================================================== */

// ES6 Module exports for module-based usage
export {
  initializeApplication,
  getApplicationStatus,
  reloadApplication
};

// CommonJS compatibility if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApplication,
    getApplicationStatus,
    reloadApplication
  };
}