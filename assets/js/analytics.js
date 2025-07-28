/*
  ==========================================
  ANALYTICS SYSTEM - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Educational analytics following privacy-first principles.
  Measures learning effectiveness without compromising user privacy.
  
  Archivo: assets/js/analytics.js
  
  "What gets measured gets managed" - Peter Drucker
  "Privacy is not something that I'm merely entitled to, it's an absolute prerequisite" - Marlon Brando
  
  Architecture:
  1. Privacy-First Analytics (No external tracking)
  2. Learning Progress Measurement
  3. Performance Metrics
  4. Educational Insights
  5. Offline Support
*/

(() => {
  'use strict';

  // Verificar dependencias antes de inicializar
  if (typeof window.AppConfig === 'undefined') {
    console.warn('🔧 Analytics: AppConfig no disponible. Modo degradado activado.');
    return;
  }

  /*
    ==========================================
    ANALYTICS CORE SYSTEM
    ==========================================
  */
  
  window.Analytics = {
    // Configuración del sistema
    config: {
      version: '1.0.0',
      sessionTimeout: 30 * 60 * 1000, // 30 minutos
      maxEvents: 1000, // Límite de eventos almacenados
      debug: window.AppConfig?.ENVIRONMENT === 'development'
    },

    // Estado interno
    state: {
      sessionId: null,
      sessionStart: null,
      lastActivity: null,
      eventsBuffer: [],
      currentProject: null,
      hintsUsed: 0,
      errorsCount: 0
    },

    /*
      ==========================================
      INICIALIZACIÓN Y CONFIGURACIÓN
      ==========================================
    */

    init() {
      this.log('📊 Iniciando sistema de analytics educativo...');
      
      try {
        this.initializeSession();
        this.bindEvents();
        this.startPerformanceMonitoring();
        this.loadStoredData();
        
        this.log('✅ Analytics system ready');
        
        // Notificar inicialización exitosa
        this.trackEvent('system', 'analytics_initialized', {
          version: this.config.version,
          sessionId: this.state.sessionId
        });
        
      } catch (error) {
        console.error('❌ Error inicializando analytics:', error);
      }
    },

    /*
      ==========================================
      GESTIÓN DE SESIONES EDUCATIVAS
      ==========================================
    */

    initializeSession() {
      const now = Date.now();
      
      // Verificar si hay sesión activa
      const existingSession = this.getStoredData('session');
      
      if (existingSession && this.isSessionValid(existingSession)) {
        // Continuar sesión existente
        this.state.sessionId = existingSession.sessionId;
        this.state.sessionStart = existingSession.startTime;
        this.log('🔄 Continuando sesión existente:', this.state.sessionId);
      } else {
        // Crear nueva sesión
        this.state.sessionId = this.generateSessionId();
        this.state.sessionStart = now;
        this.log('🆕 Nueva sesión educativa iniciada:', this.state.sessionId);
      }
      
      this.state.lastActivity = now;
      this.saveSessionData();
    },

    generateSessionId() {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9);
      return `session_${timestamp}_${random}`;
    },

    isSessionValid(session) {
      const now = Date.now();
      const sessionAge = now - session.startTime;
      const lastActivity = now - (session.lastActivity || session.startTime);
      
      return sessionAge < 24 * 60 * 60 * 1000 && // 24 horas máximo
             lastActivity < this.config.sessionTimeout; // 30 min inactividad
    },

    updateActivity() {
      this.state.lastActivity = Date.now();
      this.saveSessionData();
    },

    /*
      ==========================================
      TRACKING DE PROGRESO EDUCATIVO
      ==========================================
    */

    trackProgress(projectId, action, data = {}) {
      this.updateActivity();
      
      const event = {
        id: this.generateEventId(),
        timestamp: new Date().toISOString(),
        sessionId: this.state.sessionId,
        type: 'progress',
        projectId,
        action, // 'started', 'completed', 'hint_used', 'error_made', 'solution_viewed'
        data: {
          ...data,
          hintsUsed: this.state.hintsUsed,
          errorsCount: this.state.errorsCount,
          timeSpent: this.getTimeSpent()
        }
      };

      this.addEvent(event);
      this.updateProgressMetrics(projectId, action, data);
      
      this.log('📈 Progreso tracked:', event);
    },

    updateProgressMetrics(projectId, action, data) {
      // Actualizar métricas específicas por acción
      switch (action) {
        case 'started':
          this.state.currentProject = projectId;
          this.state.hintsUsed = 0;
          this.state.errorsCount = 0;
          break;
          
        case 'hint_used':
          this.state.hintsUsed++;
          break;
          
        case 'error_made':
          this.state.errorsCount++;
          break;
          
        case 'completed':
          this.calculateCompletionMetrics(projectId, data);
          break;
      }
    },

    calculateCompletionMetrics(projectId, data) {
      const metrics = {
        projectId,
        completionTime: this.getTimeSpent(),
        hintsUsed: this.state.hintsUsed,
        errorsCount: this.state.errorsCount,
        efficiency: this.calculateEfficiency(),
        moneySaved: this.calculateMoneySaved(projectId)
      };

      this.trackEvent('completion', 'project_completed', metrics);
      
      // Actualizar progreso global
      this.updateGlobalProgress(projectId, metrics);
    },

    calculateEfficiency() {
      // Eficiencia basada en hints usados y errores cometidos
      const maxScore = 100;
      const hintPenalty = this.state.hintsUsed * 5; // -5 puntos por hint
      const errorPenalty = this.state.errorsCount * 10; // -10 puntos por error
      
      return Math.max(0, maxScore - hintPenalty - errorPenalty);
    },

    calculateMoneySaved(projectId) {
      // Basado en la configuración de proyectos
      const project = window.AppConfig?.EDUCATIONAL_PROJECTS?.find(p => p.id === projectId);
      return project ? project.costImpact : 0;
    },

    /*
      ==========================================
      ANALYTICS DE NAVEGACIÓN
      ==========================================
    */

    trackNavigation(from, to, method = 'click') {
      this.updateActivity();
      
      const event = {
        id: this.generateEventId(),
        timestamp: new Date().toISOString(),
        sessionId: this.state.sessionId,
        type: 'navigation',
        action: 'route_change',
        data: {
          from,
          to,
          method, // 'click', 'back', 'forward', 'direct'
          timeSpent: this.getTimeSpent()
        }
      };

      this.addEvent(event);
      this.log('🧭 Navegación tracked:', event);
    },

    /*
      ==========================================
      PERFORMANCE MONITORING
      ==========================================
    */

    startPerformanceMonitoring() {
      // Page Load Performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.trackPerformance();
        }, 100);
      });

      // User Interaction Performance
      this.monitorInteractions();
    },

    trackPerformance() {
      if (!window.performance) return;

      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      const metrics = {
        loadTime: navigation ? Math.round(navigation.loadEventEnd) : 0,
        domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd) : 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };

      this.trackEvent('performance', 'page_load', metrics);
    },

    monitorInteractions() {
      // Tiempo de respuesta de botones
      document.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) {
          const startTime = performance.now();
          
          requestAnimationFrame(() => {
            const responseTime = performance.now() - startTime;
            
            if (responseTime > 100) { // Solo track si es > 100ms
              this.trackEvent('performance', 'slow_interaction', {
                element: e.target.closest('.btn').className,
                responseTime: Math.round(responseTime)
              });
            }
          });
        }
      });
    },

    /*
      ==========================================
      GESTIÓN DE EVENTOS
      ==========================================
    */

    trackEvent(category, action, data = {}) {
      this.updateActivity();
      
      const event = {
        id: this.generateEventId(),
        timestamp: new Date().toISOString(),
        sessionId: this.state.sessionId,
        type: 'event',
        category,
        action,
        data
      };

      this.addEvent(event);
      this.log(`📊 Evento tracked [${category}]:`, action, data);
    },

    addEvent(event) {
      this.state.eventsBuffer.push(event);
      
      // Mantener buffer dentro del límite
      if (this.state.eventsBuffer.length > this.config.maxEvents) {
        this.state.eventsBuffer.shift(); // Eliminar el más antiguo
      }
      
      // Persistir eventos críticos inmediatamente
      if (this.isCriticalEvent(event)) {
        this.saveEventsData();
      }
    },

    isCriticalEvent(event) {
      const criticalActions = ['completed', 'error_made', 'system_error'];
      return criticalActions.includes(event.action);
    },

    generateEventId() {
      return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    },

    /*
      ==========================================
      INSIGHTS Y REPORTES EDUCATIVOS
      ==========================================
    */

    generateLearningInsights() {
      const events = this.getStoredData('events') || [];
      const progressEvents = events.filter(e => e.type === 'progress');
      
      if (progressEvents.length === 0) {
        return this.getEmptyInsights();
      }

      return {
        totalProjects: this.getUniqueProjects(progressEvents).length,
        completedProjects: this.getCompletedProjects(progressEvents).length,
        totalTimeSpent: this.getTotalTimeSpent(progressEvents),
        averageHintsUsed: this.getAverageHintsUsed(progressEvents),
        totalMoneySaved: this.getTotalMoneySaved(progressEvents),
        learningVelocity: this.calculateLearningVelocity(progressEvents),
        strongAreas: this.identifyStrongAreas(progressEvents),
        improvementAreas: this.identifyImprovementAreas(progressEvents)
      };
    },

    getEmptyInsights() {
      return {
        totalProjects: 0,
        completedProjects: 0,
        totalTimeSpent: 0,
        averageHintsUsed: 0,
        totalMoneySaved: 0,
        learningVelocity: 0,
        strongAreas: [],
        improvementAreas: []
      };
    },

    getUniqueProjects(events) {
      const projects = new Set();
      events.forEach(e => e.projectId && projects.add(e.projectId));
      return Array.from(projects);
    },

    getCompletedProjects(events) {
      return events.filter(e => e.action === 'completed');
    },

    getTotalTimeSpent(events) {
      return events.reduce((total, e) => {
        return total + (e.data?.timeSpent || 0);
      }, 0);
    },

    getAverageHintsUsed(events) {
      const completedEvents = this.getCompletedProjects(events);
      if (completedEvents.length === 0) return 0;
      
      const totalHints = completedEvents.reduce((total, e) => {
        return total + (e.data?.hintsUsed || 0);
      }, 0);
      
      return Math.round(totalHints / completedEvents.length * 10) / 10;
    },

    getTotalMoneySaved(events) {
      return events
        .filter(e => e.action === 'completed')
        .reduce((total, e) => total + (e.data?.moneySaved || 0), 0);
    },

    calculateLearningVelocity(events) {
      const completedEvents = this.getCompletedProjects(events);
      if (completedEvents.length < 2) return 0;
      
      const timeSpan = new Date(completedEvents[completedEvents.length - 1].timestamp) - 
                      new Date(completedEvents[0].timestamp);
      
      // Proyectos por semana
      const weeksSpan = timeSpan / (7 * 24 * 60 * 60 * 1000);
      return Math.round(completedEvents.length / weeksSpan * 10) / 10;
    },

    identifyStrongAreas(events) {
      // Proyectos completados con alta eficiencia
      return events
        .filter(e => e.action === 'completed' && (e.data?.efficiency || 0) > 80)
        .map(e => e.projectId);
    },

    identifyImprovementAreas(events) {
      // Proyectos con muchos hints o errores
      return events
        .filter(e => e.action === 'completed' && 
                    ((e.data?.hintsUsed || 0) > 3 || (e.data?.errorsCount || 0) > 5))
        .map(e => e.projectId);
    },

    /*
      ==========================================
      UTILIDADES Y HELPERS
      ==========================================
    */

    getTimeSpent() {
      if (!this.state.sessionStart) return 0;
      return Date.now() - this.state.sessionStart;
    },

    bindEvents() {
      // Detectar cierre de pestaña para guardar datos
      window.addEventListener('beforeunload', () => {
        this.saveAllData();
      });

      // Detectar inactividad
      let inactivityTimer;
      const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          this.trackEvent('session', 'inactive', {
            duration: this.config.sessionTimeout
          });
        }, this.config.sessionTimeout);
      };

      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
      });

      // Tracking de errores JavaScript
      window.addEventListener('error', (e) => {
        this.trackEvent('error', 'javascript_error', {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        });
      });

      // Tracking de promises rechazadas
      window.addEventListener('unhandledrejection', (e) => {
        this.trackEvent('error', 'unhandled_promise_rejection', {
          reason: e.reason?.toString() || 'Unknown'
        });
      });
    },

    /*
      ==========================================
      PERSISTENCIA DE DATOS
      ==========================================
    */

    saveSessionData() {
      const sessionData = {
        sessionId: this.state.sessionId,
        startTime: this.state.sessionStart,
        lastActivity: this.state.lastActivity
      };
      
      this.setStoredData('session', sessionData);
    },

    saveEventsData() {
      this.setStoredData('events', this.state.eventsBuffer);
    },

    saveAllData() {
      this.saveSessionData();
      this.saveEventsData();
      
      // Guardar insights generados
      const insights = this.generateLearningInsights();
      this.setStoredData('insights', insights);
    },

    loadStoredData() {
      const events = this.getStoredData('events');
      if (events && Array.isArray(events)) {
        this.state.eventsBuffer = events;
      }
    },

    updateGlobalProgress(projectId, metrics) {
      let progress = this.getStoredData('progress') || {};
      
      progress[projectId] = {
        ...progress[projectId],
        completed: true,
        completedAt: new Date().toISOString(),
        metrics
      };
      
      this.setStoredData('progress', progress);
    },

    /*
      ==========================================
      LOCAL STORAGE MANAGEMENT
      ==========================================
    */

    getStoredData(key) {
      try {
        const data = localStorage.getItem(`bug_academy_${key}`);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        this.log('⚠️ Error leyendo localStorage:', error);
        return null;
      }
    },

    setStoredData(key, data) {
      try {
        localStorage.setItem(`bug_academy_${key}`, JSON.stringify(data));
      } catch (error) {
        this.log('⚠️ Error escribiendo localStorage:', error);
      }
    },

    /*
      ==========================================
      API PÚBLICA PARA OTROS MÓDULOS
      ==========================================
    */

    // Método simple para otros módulos
    track(action, data = {}) {
      this.trackEvent('user', action, data);
    },

    // Obtener insights para mostrar en UI
    getInsights() {
      return this.generateLearningInsights();
    },

    // Obtener progreso actual
    getProgress() {
      return this.getStoredData('progress') || {};
    },

    // Resetear datos (para testing o nueva instalación)
    reset() {
      ['session', 'events', 'insights', 'progress'].forEach(key => {
        localStorage.removeItem(`bug_academy_${key}`);
      });
      
      this.state = {
        sessionId: null,
        sessionStart: null,
        lastActivity: null,
        eventsBuffer: [],
        currentProject: null,
        hintsUsed: 0,
        errorsCount: 0
      };
      
      this.log('🔄 Analytics data reset');
    },

    /*
      ==========================================
      DEBUGGING Y LOGGING
      ==========================================
    */

    log(...args) {
      if (this.config.debug) {
        console.log('[Analytics]', ...args);
      }
    },

    // Método para debugging - mostrar todos los datos
    debug() {
      return {
        config: this.config,
        state: this.state,
        insights: this.generateLearningInsights(),
        progress: this.getProgress(),
        eventsCount: this.state.eventsBuffer.length,
        sessionDuration: this.getTimeSpent()
      };
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
      window.Analytics.init();
    });
  } else {
    window.Analytics.init();
  }

  // Exponer método global para fácil acceso
  window.track = window.Analytics.track.bind(window.Analytics);

})();

/*
  ==========================================
  ANALYTICS SYSTEM COMPLETE
  ==========================================
  
  Este sistema de analytics proporciona:
  
  ✅ Privacy-First Analytics: 
  - Sin tracking externo o cookies
  - Datos almacenados localmente
  - Control total del usuario sobre sus datos
  
  ✅ Educational Metrics:
  - Tracking de progreso por proyecto
  - Métricas de eficiencia de aprendizaje
  - Cálculo de "dinero ahorrado" educativo
  - Identificación de áreas fuertes y de mejora
  
  ✅ Performance Monitoring:
  - Métricas de carga de página
  - Tiempo de respuesta de interacciones
  - Detección de problemas de performance
  
  ✅ Session Management:
  - Sesiones educativas inteligentes
  - Continuidad entre visitas
  - Detección de inactividad
  
  ✅ Error Tracking:
  - JavaScript errors automático
  - Promise rejections
  - Contexto educativo en errores
  
  ✅ Insights Generation:
  - Reportes automáticos de progreso
  - Velocidad de aprendizaje
  - Patrones de uso educativo
  
  Uso en otros módulos:
  
  // Tracking simple
  window.track('button_clicked', { button: 'start_project' });
  
  // Tracking de progreso educativo
  window.Analytics.trackProgress('calculadora', 'completed', { score: 95 });
  
  // Obtener insights para UI
  const insights = window.Analytics.getInsights();
  
  // Debug durante desarrollo
  console.log(window.Analytics.debug());
*/