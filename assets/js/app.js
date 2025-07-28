/*
  ==========================================
  APPLICATION ORCHESTRATOR - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Main application controller following Clean Architecture principles.
  Coordinates all systems and manages application lifecycle.
  
  Archivo: assets/js/app.js
  
  "The secret to building large apps is never build large apps" - Justin Meyer
  "Programs must be written for people to read, and only incidentally for machines to execute" - Harold Abelson
  
  Architecture:
  1. Dependency Management
  2. System Initialization
  3. Error Handling & Recovery
  4. Performance Monitoring
  5. Educational State Management
  6. Cross-Module Communication
*/

(() => {
  'use strict';

  /*
    ==========================================
    APPLICATION CONTROLLER
    ==========================================
  */
  
  window.App = {
    // Configuración de la aplicación
    config: {
      name: 'Million Dollar Bugs Academy',
      version: '1.0.0',
      environment: 'production',
      debug: false,
      features: {
        analytics: true,
        offlineMode: true,
        progressTracking: true,
        achievements: true
      }
    },

    // Estado de la aplicación
    state: {
      initialized: false,
      initializationTime: null,
      systems: new Map(),
      errors: [],
      performance: {},
      lastActivity: null,
      isOnline: navigator.onLine
    },

    // Dependencias requeridas
    dependencies: [
      'AppConfig',
      'AppUtils', 
      'AppState'
    ],

    // Sistemas opcionales (no bloquean inicialización)
    optionalSystems: [
      'Analytics',
      'Components', 
      'Router'
    ],

    /*
      ==========================================
      INICIALIZACIÓN PRINCIPAL
      ==========================================
    */

    async init() {
      const startTime = performance.now();
      
      console.log(`🚀 Iniciando ${this.config.name} v${this.config.version}...`);
      
      try {
        // Configurar entorno
        this.setupEnvironment();
        
        // Verificar dependencias críticas
        await this.checkDependencies();
        
        // Inicializar sistemas core
        await this.initializeCoreSystem();
        
        // Inicializar sistemas opcionales
        await this.initializeOptionalSystems();
        
        // Configurar manejo de errores global
        this.setupErrorHandling();
        
        // Configurar monitoreo de performance
        this.setupPerformanceMonitoring();
        
        // Configurar conectividad
        this.setupConnectivityMonitoring();
        
        // Configurar actividad del usuario
        this.setupActivityTracking();
        
        // Finalizar inicialización
        await this.finalizeInitialization(startTime);
        
      } catch (error) {
        console.error('❌ Error crítico durante inicialización:', error);
        this.handleInitializationError(error);
      }
    },

    /*
      ==========================================
      CONFIGURACIÓN DE ENTORNO
      ==========================================
    */

    setupEnvironment() {
      // Detectar entorno
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      const isDev = hostname.includes('dev') || hostname.includes('staging');
      
      if (isLocal) {
        this.config.environment = 'development';
        this.config.debug = true;
      } else if (isDev) {
        this.config.environment = 'staging';
        this.config.debug = true;
      }

      // Configurar debugging
      if (this.config.debug) {
        window.DEBUG = true;
        console.log('🔧 Modo debug activado');
      }

      // Configurar características por entorno
      if (this.config.environment === 'development') {
        this.config.features.analytics = false; // Sin analytics en dev
      }

      this.log('🌍 Entorno configurado:', this.config.environment);
    },

    /*
      ==========================================
      VERIFICACIÓN DE DEPENDENCIAS
      ==========================================
    */

    async checkDependencies() {
      this.log('🔍 Verificando dependencias...');
      
      const missing = this.dependencies.filter(dep => 
        typeof window[dep] === 'undefined'
      );
      
      if (missing.length > 0) {
        throw new Error(`Dependencias críticas faltantes: ${missing.join(', ')}`);
      }
      
      // Verificar compatibilidad del navegador
      await this.checkBrowserCompatibility();
      
      this.log('✅ Dependencias verificadas');
    },

    async checkBrowserCompatibility() {
      const required = {
        localStorage: 'localStorage' in window,
        addEventListener: 'addEventListener' in window,
        JSON: 'JSON' in window,
        Promise: 'Promise' in window,
        fetch: 'fetch' in window
      };

      const unsupported = Object.entries(required)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);

      if (unsupported.length > 0) {
        throw new Error(`Navegador no compatible. Características faltantes: ${unsupported.join(', ')}`);
      }

      // Verificar características modernas (no críticas)
      const modern = {
        serviceWorker: 'serviceWorker' in navigator,
        intersectionObserver: 'IntersectionObserver' in window,
        webGL: this.checkWebGLSupport()
      };

      this.state.browserCapabilities = { ...required, ...modern };
      
      if (!modern.serviceWorker) {
        console.warn('⚠️ Service Worker no soportado - funcionalidad offline limitada');
      }
    },

    checkWebGLSupport() {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
      } catch (e) {
        return false;
      }
    },

    /*
      ==========================================
      INICIALIZACIÓN DE SISTEMAS
      ==========================================
    */

    async initializeCoreSystem() {
      this.log('⚙️ Inicializando sistemas core...');
      
      const coreInits = [];

      // AppState (gestión de estado educativo)
      if (window.AppState) {
        coreInits.push(this.initializeSystem('AppState', () => {
          window.AppState.init();
          return Promise.resolve();
        }));
      }

      await Promise.all(coreInits);
      this.log('✅ Sistemas core inicializados');
    },

    async initializeOptionalSystems() {
      this.log('🔧 Inicializando sistemas opcionales...');
      
      const optionalInits = this.optionalSystems.map(systemName => {
        if (window[systemName]) {
          return this.initializeSystem(systemName, () => {
            if (window[systemName].init) {
              return window[systemName].init();
            }
            return Promise.resolve();
          });
        }
        return Promise.resolve();
      });

      // No fallar si sistemas opcionales fallan
      const results = await Promise.allSettled(optionalInits);
      
      const failed = results
        .filter(result => result.status === 'rejected')
        .map((result, index) => ({
          system: this.optionalSystems[index],
          error: result.reason
        }));

      if (failed.length > 0) {
        console.warn('⚠️ Algunos sistemas opcionales fallaron:', failed);
      }

      this.log(`✅ Sistemas opcionales: ${results.length - failed.length}/${results.length} exitosos`);
    },

    async initializeSystem(name, initFunc) {
      const startTime = performance.now();
      
      try {
        await initFunc();
        
        const duration = performance.now() - startTime;
        this.state.systems.set(name, {
          status: 'initialized',
          duration,
          timestamp: Date.now()
        });
        
        this.log(`✅ ${name} inicializado en ${Math.round(duration)}ms`);
        
      } catch (error) {
        this.state.systems.set(name, {
          status: 'failed',
          error: error.message,
          timestamp: Date.now()
        });
        
        console.error(`❌ Error inicializando ${name}:`, error);
        throw error;
      }
    },

    /*
      ==========================================
      MANEJO DE ERRORES GLOBAL
      ==========================================
    */

    setupErrorHandling() {
      // Errores JavaScript no capturados
      window.addEventListener('error', (e) => {
        this.handleGlobalError('javascript', {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          error: e.error
        });
      });

      // Promises rechazadas no manejadas
      window.addEventListener('unhandledrejection', (e) => {
        this.handleGlobalError('promise', {
          reason: e.reason,
          promise: e.promise
        });
        
        // Prevenir que aparezca en consola
        e.preventDefault();
      });

      // Errores de recursos (imágenes, scripts, etc.)
      window.addEventListener('error', (e) => {
        if (e.target !== window) {
          this.handleGlobalError('resource', {
            source: e.target.src || e.target.href,
            tagName: e.target.tagName
          });
        }
      }, true);

      this.log('🛡️ Manejo de errores configurado');
    },

    handleGlobalError(type, details) {
      const error = {
        id: this.generateErrorId(),
        type,
        details,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        appState: this.getSystemsStatus()
      };

      this.state.errors.push(error);
      
      // Mantener solo los últimos 50 errores
      if (this.state.errors.length > 50) {
        this.state.errors.shift();
      }

      // Log del error
      console.error(`🚨 Error global [${type}]:`, details);

      // Reportar a analytics si está disponible
      if (window.Analytics && this.config.features.analytics) {
        window.Analytics.trackEvent('error', `global_${type}`, {
          errorId: error.id,
          message: details.message || details.reason || 'Unknown error'
        });
      }

      // Auto-recovery para errores críticos
      this.attemptErrorRecovery(type, details);
    },

    attemptErrorRecovery(type, details) {
      switch (type) {
        case 'javascript':
          if (details.message?.includes('localStorage')) {
            this.recoverFromStorageError();
          }
          break;
          
        case 'resource':
          if (details.tagName === 'SCRIPT') {
            this.recoverFromScriptError(details.source);
          }
          break;
      }
    },

    recoverFromStorageError() {
      console.log('🔄 Intentando recovery de localStorage...');
      try {
        localStorage.clear();
        window.location.reload();
      } catch (e) {
        console.error('❌ Recovery de storage falló:', e);
      }
    },

    recoverFromScriptError(source) {
      console.log(`🔄 Script falló, modo degradado: ${source}`);
      this.showUserNotification(
        'Algunas características pueden estar limitadas. Intenta recargar la página.',
        'warning'
      );
    },

    /*
      ==========================================
      MONITOREO DE PERFORMANCE
      ==========================================
    */

    setupPerformanceMonitoring() {
      // Performance Observer para métricas web vitals
      if ('PerformanceObserver' in window) {
        this.initializePerformanceObserver();
      }

      // Monitoreo de memoria (si está disponible)
      if ('memory' in performance) {
        this.monitorMemoryUsage();
      }

      // Monitoreo de FPS para animaciones
      this.monitorFrameRate();

      this.log('📊 Monitoreo de performance configurado');
    },

    initializePerformanceObserver() {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.state.performance.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.state.performance.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.state.performance.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('⚠️ Performance Observer falló:', error);
      }
    },

    monitorMemoryUsage() {
      const checkMemory = () => {
        const memory = performance.memory;
        this.state.performance.memory = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        };

        // Advertir si el uso de memoria es alto
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          console.warn('⚠️ Alto uso de memoria:', usagePercent.toFixed(1) + '%');
        }
      };

      checkMemory();
      setInterval(checkMemory, 30000); // Cada 30 segundos
    },

    monitorFrameRate() {
      let lastTime = performance.now();
      let frameCount = 0;
      let fps = 0;

      const measureFPS = (currentTime) => {
        frameCount++;
        
        if (currentTime - lastTime >= 1000) { // Cada segundo
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          this.state.performance.fps = fps;
          
          if (fps < 30) {
            console.warn('⚠️ FPS bajo detectado:', fps);
          }
          
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
      };

      requestAnimationFrame(measureFPS);
    },

    /*
      ==========================================
      MONITOREO DE CONECTIVIDAD
      ==========================================
    */

    setupConnectivityMonitoring() {
      window.addEventListener('online', () => {
        this.handleConnectivityChange(true);
      });

      window.addEventListener('offline', () => {
        this.handleConnectivityChange(false);
      });

      // Verificar connection info si está disponible
      if ('connection' in navigator) {
        this.monitorConnectionQuality();
      }

      this.log('🌐 Monitoreo de conectividad configurado');
    },

    handleConnectivityChange(isOnline) {
      const wasOnline = this.state.isOnline;
      this.state.isOnline = isOnline;

      if (isOnline && !wasOnline) {
        this.log('🌐 Conexión restaurada');
        this.showUserNotification('Conexión restaurada', 'success');
        this.syncOfflineData();
      } else if (!isOnline && wasOnline) {
        this.log('📴 Conexión perdida');
        this.showUserNotification('Modo offline activado', 'info');
      }

      // Analytics de conectividad
      if (window.Analytics) {
        window.Analytics.trackEvent('connectivity', isOnline ? 'online' : 'offline');
      }
    },

    monitorConnectionQuality() {
      const connection = navigator.connection;
      
      if (connection) {
        const updateConnectionInfo = () => {
          this.state.connectionInfo = {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
          };

          // Ajustar características basado en conexión
          if (connection.saveData || connection.effectiveType === 'slow-2g') {
            this.enableDataSavingMode();
          }
        };

        updateConnectionInfo();
        connection.addEventListener('change', updateConnectionInfo);
      }
    },

    enableDataSavingMode() {
      console.log('📱 Modo ahorro de datos activado');
      
      // Deshabilitar características que consumen datos
      this.config.features.analytics = false;
      
      // Reducir calidad de imágenes
      document.body.classList.add('data-saving-mode');
      
      this.showUserNotification('Modo ahorro de datos activado', 'info');
    },

    /*
      ==========================================
      TRACKING DE ACTIVIDAD
      ==========================================
    */

    setupActivityTracking() {
      const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const updateActivity = this.throttle(() => {
        this.state.lastActivity = Date.now();
      }, 1000);

      activities.forEach(event => {
        document.addEventListener(event, updateActivity, { passive: true });
      });

      // Verificar inactividad cada minuto
      setInterval(() => {
        this.checkInactivity();
      }, 60000);

      this.log('👤 Tracking de actividad configurado');
    },

    checkInactivity() {
      const now = Date.now();
      const inactiveTime = now - (this.state.lastActivity || now);
      const inactiveMinutes = Math.floor(inactiveTime / 60000);

      if (inactiveMinutes >= 30) {
        this.handleInactivity(inactiveMinutes);
      }
    },

    handleInactivity(minutes) {
      console.log(`😴 Usuario inactivo por ${minutes} minutos`);
      
      // Analytics de inactividad
      if (window.Analytics) {
        window.Analytics.trackEvent('user', 'inactive', { minutes });
      }

      // Pausar animaciones innecesarias
      document.body.classList.add('user-inactive');
    },

    /*
      ==========================================
      FINALIZACIÓN E INTEGRACIÓN
      ==========================================
    */

    async finalizeInitialization(startTime) {
      const duration = performance.now() - startTime;
      this.state.initializationTime = duration;
      this.state.initialized = true;

      // Notificar inicialización completa
      this.notifyInitializationComplete(duration);
      
      // Configurar health checks
      this.setupHealthChecks();
      
      // Mostrar información de debug si está habilitado
      if (this.config.debug) {
        this.showDebugInfo();
      }

      this.log(`🎉 ${this.config.name} inicializado en ${Math.round(duration)}ms`);
    },

    notifyInitializationComplete(duration) {
      // Event personalizado para otros scripts
      document.dispatchEvent(new CustomEvent('appInitialized', {
        detail: {
          duration,
          systems: Array.from(this.state.systems.keys()),
          performance: this.state.performance,
          timestamp: Date.now()
        }
      }));

      // Clase CSS para indicar app lista
      document.body.classList.add('app-initialized');
      
      // Remover loading states
      const loaders = document.querySelectorAll('.loading, .skeleton');
      loaders.forEach(loader => {
        loader.style.display = 'none';
      });

      // Analytics de inicialización
      if (window.Analytics && this.config.features.analytics) {
        window.Analytics.trackEvent('app', 'initialized', {
          duration: Math.round(duration),
          systemsCount: this.state.systems.size
        });
      }
    },

    setupHealthChecks() {
      // Health check cada 5 minutos
      setInterval(() => {
        this.performHealthCheck();
      }, 300000);
    },

    performHealthCheck() {
      const health = {
        timestamp: Date.now(),
        systems: this.getSystemsStatus(),
        performance: this.state.performance,
        errors: this.state.errors.length,
        memory: this.state.performance.memory?.used || 0,
        isOnline: this.state.isOnline
      };

      // Verificar problemas críticos
      const issues = this.detectHealthIssues(health);
      
      if (issues.length > 0) {
        console.warn('⚠️ Problemas de salud detectados:', issues);
        this.handleHealthIssues(issues);
      }

      this.log('💓 Health check completado');
    },

    detectHealthIssues(health) {
      const issues = [];

      // Sistemas fallidos
      const failedSystems = Object.entries(health.systems)
        .filter(([name, status]) => status === 'failed')
        .map(([name]) => name);
      
      if (failedSystems.length > 0) {
        issues.push({ type: 'failed_systems', systems: failedSystems });
      }

      // Alto uso de memoria
      if (health.memory > 100) { // > 100MB
        issues.push({ type: 'high_memory', usage: health.memory });
      }

      // Muchos errores
      if (health.errors > 10) {
        issues.push({ type: 'high_errors', count: health.errors });
      }

      return issues;
    },

    handleHealthIssues(issues) {
      issues.forEach(issue => {
        switch (issue.type) {
          case 'high_memory':
            this.optimizeMemoryUsage();
            break;
          case 'high_errors':
            this.clearOldErrors();
            break;
          case 'failed_systems':
            this.attemptSystemRecovery(issue.systems);
            break;
        }
      });
    },

    /*
      ==========================================
      UTILIDADES Y HELPERS
      ==========================================
    */

    handleInitializationError(error) {
      console.error('💥 Inicialización falló:', error);
      
      // Mostrar error al usuario
      this.showCriticalError(error);
      
      // Intentar modo degradado
      this.enterDegradedMode();
    },

    showCriticalError(error) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'critical-error';
      errorDiv.innerHTML = `
        <h2>🚨 Error de Inicialización</h2>
        <p>La aplicación no pudo iniciarse correctamente.</p>
        <details>
          <summary>Detalles técnicos</summary>
          <pre>${error.message}</pre>
        </details>
        <button onclick="window.location.reload()">🔄 Recargar Página</button>
      `;
      
      document.body.prepend(errorDiv);
    },

    enterDegradedMode() {
      console.log('🚧 Entrando en modo degradado...');
      
      document.body.classList.add('degraded-mode');
      this.config.features = {
        analytics: false,
        offlineMode: false,
        progressTracking: false,
        achievements: false
      };
    },

    showUserNotification(message, type = 'info') {
      if (window.Components && window.Components.notify) {
        window.Components.notify(message, type);
      } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
      }
    },

    syncOfflineData() {
      // Sincronizar datos offline cuando se restaure conexión
      if (window.Analytics && window.Analytics.syncOfflineData) {
        window.Analytics.syncOfflineData();
      }
    },

    optimizeMemoryUsage() {
      // Limpiar caches y optimizar memoria
      this.clearOldErrors();
      
      if (window.Analytics) {
        window.Analytics.cleanupOldData();
      }
      
      // Forzar garbage collection si está disponible
      if (window.gc) {
        window.gc();
      }
    },

    clearOldErrors() {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      this.state.errors = this.state.errors.filter(error => 
        new Date(error.timestamp).getTime() > oneHourAgo
      );
    },

    attemptSystemRecovery(failedSystems) {
      failedSystems.forEach(systemName => {
        if (window[systemName] && window[systemName].init) {
          console.log(`🔄 Intentando recovery de ${systemName}...`);
          try {
            window[systemName].init();
          } catch (error) {
            console.error(`❌ Recovery de ${systemName} falló:`, error);
          }
        }
      });
    },

    generateErrorId() {
      return `err_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    },

    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /*
      ==========================================
      API PÚBLICA
      ==========================================
    */

    getSystemsStatus() {
      const status = {};
      this.state.systems.forEach((info, name) => {
        status[name] = info.status;
      });
      return status;
    },

    getPerformanceMetrics() {
      return { ...this.state.performance };
    },

    getErrorLog() {
      return [...this.state.errors];
    },

    getHealthStatus() {
      return {
        initialized: this.state.initialized,
        systems: this.getSystemsStatus(),
        performance: this.getPerformanceMetrics(),
        errorCount: this.state.errors.length,
        isOnline: this.state.isOnline,
        lastActivity: this.state.lastActivity
      };
    },

    restart() {
      console.log('🔄 Reiniciando aplicación...');
      
      // Limpiar estado
      this.state.systems.clear();
      this.state.errors = [];
      this.state.initialized = false;
      
      // Reinicializar
      this.init();
    },

    showDebugInfo() {
      console.group('🔧 Debug Info - Million Dollar Bugs Academy');
      console.log('Config:', this.config);
      console.log('State:', this.state);
      console.log('Systems:', this.getSystemsStatus());
      console.log('Performance:', this.getPerformanceMetrics());
      console.log('Browser:', this.state.browserCapabilities);
      console.groupEnd();
    },

    log(...args) {
      if (this.config.debug) {
        console.log('[App]', ...args);
      }
    }
  };

  /*
    ==========================================
    AUTO-INICIALIZACIÓN
    ==========================================
  */

  // Inicializar cuando DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.App.init();
    });
  } else {
    window.App.init();
  }

  // Exponer para debugging global
  if (typeof window !== 'undefined') {
    window.DebugApp = window.App;
  }

})();

/*
  ==========================================
  APPLICATION ORCHESTRATOR COMPLETE
  ==========================================
  
  Este orquestador principal proporciona:
  
  ✅ Dependency Management:
  - Verificación automática de dependencias críticas
  - Inicialización ordenada de sistemas
  - Manejo de sistemas opcionales sin bloqueo
  
  ✅ Error Handling & Recovery:
  - Captura global de errores JavaScript
  - Auto-recovery para errores comunes
  - Modo degradado para fallos críticos
  
  ✅ Performance Monitoring:
  - Web Vitals (LCP, FID, CLS)
  - Monitoreo de memoria y FPS
  - Health checks automáticos
  
  ✅ Connectivity Management:
  - Detección de estado online/offline
  - Modo ahorro de datos
  - Sincronización automática
  
  ✅ Educational State Management:
  - Coordinación entre sistemas educativos
  - Tracking de actividad de usuario
  - Analytics de inicialización
  
  ✅ Development Support:
  - Debug mode automático en desarrollo
  - Información detallada de sistemas
  - Health status API completa
  
  Uso desde DevTools:
  
  // Ver estado de la aplicación
  window.DebugApp.getHealthStatus()
  
  // Ver métricas de performance
  window.DebugApp.getPerformanceMetrics()
  
  // Ver log de errores
  window.DebugApp.getErrorLog()
  
  // Reiniciar aplicación
  window.DebugApp.restart()
  
  // Información completa de debug
  window.DebugApp.showDebugInfo()
*/