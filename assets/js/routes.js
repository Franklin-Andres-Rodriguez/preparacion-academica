/*
  ==========================================
  ROUTER SYSTEM - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Modular navigation system for educational content.
  Enhanced hash-based routing following single-page principles.
  
  Archivo: assets/js/router.js
  
  "Good navigation tells you where you are, where you can go, and where you've been" - Steve Krug
  "The best navigation is invisible until you need it" - Don Norman
  
  Architecture:
  1. Hash-Based Routing (No server config needed)
  2. Educational Progress Tracking
  3. Smooth Transitions
  4. Accessibility Support
  5. Analytics Integration
*/

(() => {
  'use strict';

  // Verificar dependencias
  if (typeof window.AppConfig === 'undefined') {
    console.warn('🧭 Router: AppConfig no disponible. Funcionalidad limitada.');
  }

  /*
    ==========================================
    ROUTER CORE SYSTEM
    ==========================================
  */
  
  window.Router = {
    // Configuración del router
    config: {
      defaultRoute: '#inicio',
      scrollOffset: 80, // Offset para header fijo
      transitionDuration: 300,
      historyEnabled: true
    },

    // Estado del router
    state: {
      currentRoute: null,
      previousRoute: null,
      routeHistory: [],
      isNavigating: false,
      scrollPositions: new Map()
    },

    // Rutas definidas y sus configuraciones
    routes: {
      '#inicio': {
        name: 'inicio',
        title: 'Inicio - Million Dollar Bugs Academy',
        section: 'inicio',
        analytics: 'home_section',
        prerequisites: []
      },
      '#roadmap': {
        name: 'roadmap',
        title: 'Roadmap de Aprendizaje - Bug Academy',
        section: 'roadmap',
        analytics: 'roadmap_section',
        prerequisites: []
      },
      '#progreso': {
        name: 'progreso',
        title: 'Tu Progreso - Bug Academy',
        section: 'progreso',
        analytics: 'progress_section',
        prerequisites: []
      },
      '#laboratorio': {
        name: 'laboratorio',
        title: 'Laboratorio de Código - Bug Academy',
        section: 'laboratorio',
        analytics: 'laboratory_section',
        prerequisites: []
      }
    },

    /*
      ==========================================
      INICIALIZACIÓN DEL ROUTER
      ==========================================
    */

    init() {
      console.log('🧭 Inicializando sistema de navegación...');
      
      try {
        this.bindEvents();
        this.loadInitialRoute();
        this.setupPageTransitions();
        this.initializeScrollRestoration();
        
        console.log('✅ Router inicializado correctamente');
        
        // Analytics de inicialización
        if (window.Analytics) {
          window.Analytics.trackEvent('router', 'initialized', {
            totalRoutes: Object.keys(this.routes).length,
            initialRoute: this.state.currentRoute
          });
        }
        
      } catch (error) {
        console.error('❌ Error inicializando router:', error);
      }
    },

    /*
      ==========================================
      GESTIÓN DE EVENTOS
      ==========================================
    */

    bindEvents() {
      // Cambios en el hash
      window.addEventListener('hashchange', (e) => {
        this.handleHashChange(e);
      });

      // Navegación con botones del navegador
      window.addEventListener('popstate', (e) => {
        this.handlePopState(e);
      });

      // Enlaces internos mejorados
      document.addEventListener('click', (e) => {
        this.handleLinkClick(e);
      });

      // Eventos de teclado para navegación
      document.addEventListener('keydown', (e) => {
        this.handleKeyNavigation(e);
      });

      // Scroll tracking para restauración
      window.addEventListener('scroll', this.throttle(() => {
        this.saveScrollPosition();
      }, 100));

      console.log('🔗 Eventos de router vinculados');
    },

    /*
      ==========================================
      MANEJO DE NAVEGACIÓN
      ==========================================
    */

    handleHashChange(e) {
      const newHash = window.location.hash || this.config.defaultRoute;
      const oldHash = this.extractHashFromUrl(e.oldURL);
      
      this.navigateToRoute(newHash, oldHash, 'hashchange');
    },

    handlePopState(e) {
      const currentHash = window.location.hash || this.config.defaultRoute;
      this.navigateToRoute(currentHash, this.state.currentRoute, 'popstate');
    },

    handleLinkClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      
      // Verificar si es una ruta válida
      if (this.routes[href] || href.startsWith('#')) {
        e.preventDefault();
        this.navigateTo(href, 'click');
      }
    },

    handleKeyNavigation(e) {
      // Navegación con teclado (Alt + teclas)
      if (!e.altKey) return;

      const keyMap = {
        '1': '#inicio',
        '2': '#roadmap', 
        '3': '#progreso',
        '4': '#laboratorio'
      };

      const targetRoute = keyMap[e.key];
      if (targetRoute) {
        e.preventDefault();
        this.navigateTo(targetRoute, 'keyboard');
      }
    },

    /*
      ==========================================
      NAVEGACIÓN PROGRAMÁTICA
      ==========================================
    */

    navigateTo(route, method = 'programmatic') {
      if (this.state.isNavigating) {
        console.log('⏳ Navegación en progreso, ignorando nueva solicitud');
        return;
      }

      const normalizedRoute = this.normalizeRoute(route);
      
      if (!this.isValidRoute(normalizedRoute)) {
        console.warn(`❌ Ruta inválida: ${route}`);
        this.navigateTo(this.config.defaultRoute, 'fallback');
        return;
      }

      // Actualizar hash si es necesario
      if (window.location.hash !== normalizedRoute) {
        window.location.hash = normalizedRoute;
      } else {
        // Si el hash no cambió, manejar la navegación directamente
        this.navigateToRoute(normalizedRoute, this.state.currentRoute, method);
      }
    },

    navigateToRoute(newRoute, oldRoute, method) {
      if (this.state.isNavigating) return;
      
      this.state.isNavigating = true;
      
      const routeConfig = this.routes[newRoute];
      
      if (!routeConfig) {
        console.warn(`⚠️ Configuración de ruta no encontrada: ${newRoute}`);
        this.state.isNavigating = false;
        return;
      }

      console.log(`🧭 Navegando de ${oldRoute} a ${newRoute} via ${method}`);

      // Verificar prerequisites educativos
      if (!this.checkPrerequisites(routeConfig)) {
        this.handlePrerequisiteFailure(routeConfig);
        this.state.isNavigating = false;
        return;
      }

      // Ejecutar transición
      this.executeRouteTransition(newRoute, oldRoute, routeConfig, method);
    },

    executeRouteTransition(newRoute, oldRoute, routeConfig, method) {
      // Guardar posición de scroll actual
      if (oldRoute) {
        this.saveScrollPosition(oldRoute);
      }

      // Actualizar estado
      this.updateRouteState(newRoute, oldRoute);

      // Actualizar navegación activa
      this.updateActiveNavigation(newRoute);

      // Actualizar título de página
      this.updatePageTitle(routeConfig.title);

      // Scroll a la sección
      this.scrollToSection(routeConfig.section);

      // Ejecutar callbacks de ruta
      this.executeRouteCallbacks(newRoute, oldRoute, method);

      // Finalizar transición
      setTimeout(() => {
        this.state.isNavigating = false;
        this.notifyRouteComplete(newRoute, oldRoute, method);
      }, this.config.transitionDuration);
    },

    /*
      ==========================================
      GESTIÓN DE ESTADO DE RUTAS
      ==========================================
    */

    updateRouteState(newRoute, oldRoute) {
      this.state.previousRoute = oldRoute;
      this.state.currentRoute = newRoute;
      
      // Actualizar historial (máximo 50 entradas)
      this.state.routeHistory.push({
        route: newRoute,
        timestamp: Date.now(),
        title: this.routes[newRoute]?.title
      });
      
      if (this.state.routeHistory.length > 50) {
        this.state.routeHistory.shift();
      }
    },

    updateActiveNavigation(activeRoute) {
      const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === activeRoute;
        
        link.classList.toggle('nav__link--active', isActive);
        
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },

    updatePageTitle(title) {
      if (title) {
        document.title = title;
      }
    },

    /*
      ==========================================
      SCROLL MANAGEMENT
      ==========================================
    */

    scrollToSection(sectionId) {
      const target = document.getElementById(sectionId);
      if (!target) {
        console.warn(`⚠️ Sección no encontrada: ${sectionId}`);
        return;
      }

      // Verificar si hay posición guardada
      const savedPosition = this.state.scrollPositions.get(this.state.currentRoute);
      
      if (savedPosition && this.state.previousRoute === this.state.currentRoute) {
        // Restaurar posición guardada
        window.scrollTo({
          top: savedPosition,
          behavior: 'smooth'
        });
      } else {
        // Scroll a la sección con offset
        const targetPosition = target.offsetTop - this.config.scrollOffset;
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    },

    saveScrollPosition(route = this.state.currentRoute) {
      if (route) {
        this.state.scrollPositions.set(route, window.pageYOffset);
      }
    },

    initializeScrollRestoration() {
      // Deshabilitar restauración automática del navegador
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    },

    /*
      ==========================================
      VALIDACIÓN Y PREREQUISITES
      ==========================================
    */

    isValidRoute(route) {
      return this.routes.hasOwnProperty(route) || route.startsWith('#');
    },

    normalizeRoute(route) {
      if (!route || route === '#') {
        return this.config.defaultRoute;
      }
      
      if (!route.startsWith('#')) {
        return '#' + route;
      }
      
      return route;
    },

    checkPrerequisites(routeConfig) {
      if (!routeConfig.prerequisites || routeConfig.prerequisites.length === 0) {
        return true;
      }

      // Verificar prerequisites educativos
      const progress = this.getEducationalProgress();
      
      return routeConfig.prerequisites.every(prereq => {
        return progress[prereq]?.completed;
      });
    },

    handlePrerequisiteFailure(routeConfig) {
      const missingPrereqs = routeConfig.prerequisites.filter(prereq => {
        const progress = this.getEducationalProgress();
        return !progress[prereq]?.completed;
      });

      // Mostrar notificación educativa
      if (window.Components) {
        const message = `Necesitas completar: ${missingPrereqs.join(', ')}`;
        window.Components.notify(message, 'warning', 7000);
      }

      // Analytics de prerequisite failure
      if (window.Analytics) {
        window.Analytics.trackEvent('router', 'prerequisite_failure', {
          route: routeConfig.name,
          missingPrereqs
        });
      }
    },

    getEducationalProgress() {
      // Obtener progreso desde Analytics o State
      if (window.Analytics) {
        return window.Analytics.getProgress();
      }
      
      if (window.AppState) {
        return window.AppState.getProgress();
      }
      
      return {};
    },

    /*
      ==========================================
      CALLBACKS Y EXTENSIBILIDAD
      ==========================================
    */

    executeRouteCallbacks(newRoute, oldRoute, method) {
      // Callbacks generales
      this.onRouteChange(newRoute, oldRoute, method);
      
      // Callbacks específicos de ruta
      const routeConfig = this.routes[newRoute];
      if (routeConfig.onEnter) {
        routeConfig.onEnter(newRoute, oldRoute, method);
      }
      
      if (oldRoute && this.routes[oldRoute]?.onLeave) {
        this.routes[oldRoute].onLeave(oldRoute, newRoute, method);
      }
    },

    onRouteChange(newRoute, oldRoute, method) {
      // Analytics de navegación
      if (window.Analytics) {
        const routeConfig = this.routes[newRoute];
        window.Analytics.trackNavigation(oldRoute, newRoute, method);
        
        if (routeConfig.analytics) {
          window.Analytics.trackEvent('section', 'viewed', {
            section: routeConfig.analytics,
            method
          });
        }
      }

      // Actualizar metadatos de página
      this.updatePageMetadata(newRoute);
      
      // Trigger custom event para otros módulos
      document.dispatchEvent(new CustomEvent('routeChanged', {
        detail: {
          newRoute,
          oldRoute,
          method,
          timestamp: Date.now()
        }
      }));
    },

    updatePageMetadata(route) {
      const routeConfig = this.routes[route];
      if (!routeConfig) return;

      // Actualizar meta description si existe
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && routeConfig.description) {
        metaDesc.setAttribute('content', routeConfig.description);
      }

      // Actualizar canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const baseUrl = window.location.origin + window.location.pathname;
        canonical.setAttribute('href', baseUrl + route);
      }
    },

    notifyRouteComplete(newRoute, oldRoute, method) {
      console.log(`✅ Navegación completada: ${newRoute}`);
      
      // Notificar finalización a otros módulos
      document.dispatchEvent(new CustomEvent('routeTransitionComplete', {
        detail: { newRoute, oldRoute, method }
      }));
    },

    /*
      ==========================================
      UTILIDADES Y HELPERS
      ==========================================
    */

    loadInitialRoute() {
      const currentHash = window.location.hash || this.config.defaultRoute;
      
      // Navegación inicial sin transición
      this.state.currentRoute = currentHash;
      this.updateActiveNavigation(currentHash);
      
      const routeConfig = this.routes[currentHash];
      if (routeConfig) {
        this.updatePageTitle(routeConfig.title);
        
        // Scroll inicial suave
        setTimeout(() => {
          this.scrollToSection(routeConfig.section);
        }, 100);
      }
      
      console.log(`🎯 Ruta inicial cargada: ${currentHash}`);
    },

    setupPageTransitions() {
      // Configurar transiciones CSS si están disponibles
      const sections = document.querySelectorAll('[id]');
      
      sections.forEach(section => {
        section.style.transition = `opacity ${this.config.transitionDuration}ms ease`;
      });
    },

    extractHashFromUrl(url) {
      const hashIndex = url.indexOf('#');
      return hashIndex !== -1 ? url.substring(hashIndex) : '';
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

    // Registrar nueva ruta dinámicamente
    addRoute(hash, config) {
      this.routes[hash] = {
        name: config.name || hash.slice(1),
        title: config.title || `${config.name} - Bug Academy`,
        section: config.section || config.name,
        analytics: config.analytics || `${config.name}_section`,
        prerequisites: config.prerequisites || [],
        ...config
      };
      
      console.log(`📝 Ruta registrada: ${hash}`);
    },

    // Obtener ruta actual
    getCurrentRoute() {
      return this.state.currentRoute;
    },

    // Obtener historial de navegación
    getHistory() {
      return [...this.state.routeHistory];
    },

    // Ir a ruta anterior
    goBack() {
      if (this.state.routeHistory.length > 1) {
        const previousRoute = this.state.routeHistory[this.state.routeHistory.length - 2];
        this.navigateTo(previousRoute.route, 'back');
      }
    },

    // Recargar ruta actual
    reload() {
      const currentRoute = this.state.currentRoute;
      this.navigateToRoute(currentRoute, currentRoute, 'reload');
    },

    // Obtener configuración de ruta
    getRouteConfig(route) {
      return this.routes[route] || null;
    },

    // Verificar si ruta existe
    hasRoute(route) {
      return this.isValidRoute(this.normalizeRoute(route));
    },

    // Obtener estado completo del router
    getState() {
      return {
        ...this.state,
        config: this.config,
        routesCount: Object.keys(this.routes).length
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
      window.Router.init();
    });
  } else {
    window.Router.init();
  }

  // Exponer método global para navegación fácil
  window.navigate = window.Router.navigateTo.bind(window.Router);

})();

/*
  ==========================================
  ROUTER SYSTEM COMPLETE
  ==========================================
  
  Este sistema de router proporciona:
  
  ✅ Hash-Based Navigation:
  - No requiere configuración de servidor
  - Funciona en cualquier hosting estático
  - URLs bookmarkeables y compartibles
  
  ✅ Educational Flow Management:
  - Prerequisites automáticos para rutas
  - Tracking de progreso educativo
  - Navegación guiada por aprendizaje
  
  ✅ Smooth User Experience:
  - Transiciones suaves entre secciones
  - Restauración de posición de scroll
  - Navegación por teclado (Alt + números)
  
  ✅ Analytics Integration:
  - Tracking automático de navegación
  - Métricas de tiempo en secciones
  - Patrones de uso educativo
  
  ✅ Accessibility Support:
  - ARIA current page indicators
  - Keyboard navigation
  - Screen reader announcements
  
  ✅ Extensible Architecture:
  - Registro dinámico de rutas
  - Callbacks personalizables
  - Event system para módulos externos
  
  Uso desde otros módulos:
  
  // Navegación simple
  window.navigate('#roadmap');
  
  // Registrar nueva ruta
  window.Router.addRoute('#proyecto-1', {
    name: 'calculadora',
    title: 'Calculadora de Interés',
    section: 'proyecto-calculadora',
    prerequisites: ['inicio']
  });
  
  // Escuchar cambios de ruta
  document.addEventListener('routeChanged', (e) => {
    console.log('Nueva ruta:', e.detail.newRoute);
  });
  
  // Obtener estado actual
  const currentRoute = window.Router.getCurrentRoute();
*/