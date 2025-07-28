/*
  ==========================================
  INTERACTIVE COMPONENTS - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Progressive enhancement for educational UI components.
  Following Kent C. Dodds' component architecture principles.
  
  Archivo: assets/js/components.js
  
  "Progressive enhancement is about starting with a foundation that works everywhere" - Aaron Gustafson
  "The best interface is no interface" - Golden Krishna
  
  Architecture:
  1. Progressive Enhancement (Works without JS)
  2. Component Lifecycle Management
  3. Educational Interactions
  4. Accessibility Integration
  5. Performance Optimization
*/

(() => {
  'use strict';

  // Verificar dependencias
  if (typeof window.AppUtils === 'undefined') {
    console.warn('🎨 Components: AppUtils no disponible. Funcionalidad limitada.');
  }

  /*
    ==========================================
    COMPONENTS MANAGER
    ==========================================
  */
  
  window.Components = {
    // Registro de componentes inicializados
    initialized: new Set(),
    
    // Estado de componentes
    state: {
      mobileNavOpen: false,
      activeModals: [],
      activeTooltips: [],
      runningAnimations: new Set()
    },

    /*
      ==========================================
      INICIALIZACIÓN PRINCIPAL
      ==========================================
    */

    init() {
      console.log('🎨 Inicializando componentes UI interactivos...');
      
      try {
        // Componentes de navegación
        this.initNavigation();
        
        // Editor de código
        this.initCodeEditor();
        
        // Barras de progreso
        this.initProgressBars();
        
        // Sistema de notificaciones
        this.initNotifications();
        
        // Modales y overlays
        this.initModals();
        
        // Tooltips educativos
        this.initTooltips();
        
        // Animaciones y transiciones
        this.initAnimations();
        
        // Formularios interactivos
        this.initForms();
        
        console.log('✅ Componentes UI listos');
        
        // Notificar a analytics
        if (window.Analytics) {
          window.Analytics.trackEvent('components', 'initialized', {
            componentsCount: this.initialized.size
          });
        }
        
      } catch (error) {
        console.error('❌ Error inicializando componentes:', error);
      }
    },

    /*
      ==========================================
      NAVEGACIÓN INTERACTIVA
      ==========================================
    */

    initNavigation() {
      this.initMobileNavigation();
      this.initSmoothScrolling();
      this.initActiveNavigation();
      
      this.initialized.add('navigation');
    },

    initMobileNavigation() {
      const toggle = document.querySelector('[data-nav-toggle]');
      const menu = document.getElementById('nav-menu');
      
      if (!toggle || !menu) {
        console.warn('🔧 Navegación móvil: Elementos no encontrados');
        return;
      }

      // Evento de toggle
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileNav(toggle, menu);
      });

      // Cerrar al hacer click en un enlace
      menu.addEventListener('click', (e) => {
        if (e.target.closest('.nav__link')) {
          this.closeMobileNav(toggle, menu);
        }
      });

      // Cerrar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && this.state.mobileNavOpen) {
          this.closeMobileNav(toggle, menu);
        }
      });

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.mobileNavOpen) {
          this.closeMobileNav(toggle, menu);
          toggle.focus(); // Devolver foco al toggle
        }
      });

      console.log('📱 Navegación móvil inicializada');
    },

    toggleMobileNav(toggle, menu) {
      const isOpen = this.state.mobileNavOpen;
      
      if (isOpen) {
        this.closeMobileNav(toggle, menu);
      } else {
        this.openMobileNav(toggle, menu);
      }
    },

    openMobileNav(toggle, menu) {
      this.state.mobileNavOpen = true;
      
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      
      menu.classList.add('nav__list--open');
      
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      
      // Focus al primer enlace
      const firstLink = menu.querySelector('.nav__link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }

      // Analytics
      if (window.Analytics) {
        window.Analytics.track('navigation_opened');
      }
    },

    closeMobileNav(toggle, menu) {
      this.state.mobileNavOpen = false;
      
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
      
      menu.classList.remove('nav__list--open');
      
      // Restaurar scroll del body
      document.body.style.overflow = '';

      // Analytics
      if (window.Analytics) {
        window.Analytics.track('navigation_closed');
      }
    },

    initSmoothScrolling() {
      // Mejorar el smooth scrolling por defecto
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Scroll suave con offset para header fijo
          const headerHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Analytics de navegación
          if (window.Analytics) {
            window.Analytics.trackNavigation(window.location.hash, href, 'smooth_scroll');
          }
        }
      });
    },

    initActiveNavigation() {
      // Actualizar navegación activa basada en scroll
      const sections = document.querySelectorAll('[id]');
      const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
      
      if (sections.length === 0 || navLinks.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.updateActiveNavLink(entry.target.id);
          }
        });
      }, {
        rootMargin: '-20% 0px -80% 0px'
      });

      sections.forEach(section => observer.observe(section));
    },

    updateActiveNavLink(activeId) {
      const navLinks = document.querySelectorAll('.nav__link');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === `#${activeId}`;
        
        link.classList.toggle('nav__link--active', isActive);
        
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },

    /*
      ==========================================
      EDITOR DE CÓDIGO INTERACTIVO
      ==========================================
    */

    initCodeEditor() {
      const codeBlocks = document.querySelectorAll('pre code');
      
      codeBlocks.forEach(block => {
        this.enhanceCodeBlock(block);
      });
      
      this.initialized.add('codeEditor');
      console.log('💻 Editor de código inicializado');
    },

    enhanceCodeBlock(codeBlock) {
      // Hacer código focusable para accesibilidad
      if (!codeBlock.hasAttribute('tabindex')) {
        codeBlock.setAttribute('tabindex', '0');
      }

      // Botón de copy (si está disponible)
      if (navigator.clipboard) {
        this.addCopyButton(codeBlock);
      }

      // Highlighting de líneas al hover
      this.addLineHighlighting(codeBlock);

      // Eventos de teclado para accesibilidad
      codeBlock.addEventListener('keydown', (e) => {
        this.handleCodeKeydown(e, codeBlock);
      });
    },

    addCopyButton(codeBlock) {
      const container = codeBlock.closest('.code-editor') || codeBlock.parentElement;
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.innerHTML = '📋 Copiar';
      copyBtn.setAttribute('aria-label', 'Copiar código al portapapeles');
      
      copyBtn.addEventListener('click', async () => {
        try {
          const text = codeBlock.textContent;
          await navigator.clipboard.writeText(text);
          
          // Feedback visual
          copyBtn.innerHTML = '✅ Copiado';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copiar';
          }, 2000);

          // Analytics
          if (window.Analytics) {
            window.Analytics.track('code_copied', { length: text.length });
          }
          
        } catch (error) {
          copyBtn.innerHTML = '❌ Error';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copiar';
          }, 2000);
        }
      });
      
      container.style.position = 'relative';
      container.appendChild(copyBtn);
    },

    addLineHighlighting(codeBlock) {
      // Highlighting de líneas para mejor legibilidad
      codeBlock.addEventListener('mousemove', (e) => {
        const lines = codeBlock.textContent.split('\n');
        const rect = codeBlock.getBoundingClientRect();
        const lineHeight = parseInt(getComputedStyle(codeBlock).lineHeight);
        const lineIndex = Math.floor((e.clientY - rect.top) / lineHeight);
        
        // Resaltar línea actual (implementación visual opcional)
        this.highlightCodeLine(codeBlock, lineIndex);
      });
    },

    highlightCodeLine(codeBlock, lineIndex) {
      // Implementación opcional de highlighting de línea
      // Por ahora solo log para debugging
      if (window.AppConfig?.ENVIRONMENT === 'development') {
        console.log(`Línea ${lineIndex} resaltada en código`);
      }
    },

    handleCodeKeydown(e, codeBlock) {
      // Navegación mejorada por teclado en código
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          // Activar análisis de código o acción educativa
          this.analyzeCode(codeBlock);
          break;
          
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            // Copiar código
            this.copyCodeToClipboard(codeBlock);
          }
          break;
      }
    },

    analyzeCode(codeBlock) {
      // Análisis educativo del código
      const code = codeBlock.textContent;
      
      // Detectar patrones educativos
      const patterns = this.detectCodePatterns(code);
      
      if (patterns.length > 0) {
        this.showCodeAnalysis(codeBlock, patterns);
      }

      // Analytics
      if (window.Analytics) {
        window.Analytics.track('code_analyzed', { patterns: patterns.length });
      }
    },

    detectCodePatterns(code) {
      const patterns = [];
      
      // Detectar errores comunes que se enseñan
      if (code.includes('base + mult * fee')) {
        patterns.push({
          type: 'precedence_error',
          message: 'Error de precedencia: debería usar paréntesis (base + mult) * fee',
          severity: 'critical'
        });
      }
      
      if (code.includes('var ')) {
        patterns.push({
          type: 'var_usage',
          message: 'Recomendación: usar let/const en lugar de var',
          severity: 'warning'
        });
      }
      
      return patterns;
    },

    showCodeAnalysis(codeBlock, patterns) {
      // Mostrar análisis en un tooltip o modal
      const tooltip = this.createAnalysisTooltip(patterns);
      this.showTooltip(codeBlock, tooltip);
    },

    async copyCodeToClipboard(codeBlock) {
      if (!navigator.clipboard) return;
      
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
        this.showNotification('Código copiado al portapapeles', 'success');
      } catch (error) {
        this.showNotification('Error al copiar código', 'error');
      }
    },

    /*
      ==========================================
      BARRAS DE PROGRESO ANIMADAS
      ==========================================
    */

    initProgressBars() {
      const progressBars = document.querySelectorAll('.progress__fill');
      
      if (progressBars.length === 0) return;

      // Observer para animar cuando entren en viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateProgressBar(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });

      progressBars.forEach(bar => {
        observer.observe(bar);
      });
      
      this.initialized.add('progressBars');
      console.log('📊 Barras de progreso inicializadas');
    },

    animateProgressBar(progressBar) {
      const targetWidth = progressBar.dataset.progress || '0';
      const duration = parseInt(progressBar.dataset.duration) || 1000;
      
      // Animar desde 0 hasta el valor target
      progressBar.style.width = '0%';
      
      setTimeout(() => {
        progressBar.style.transition = `width ${duration}ms ease-out`;
        progressBar.style.width = targetWidth + '%';
        
        // Analytics del progreso mostrado
        if (window.Analytics) {
          window.Analytics.track('progress_animated', { 
            progress: targetWidth,
            duration 
          });
        }
      }, 100);
    },

    /*
      ==========================================
      SISTEMA DE NOTIFICACIONES
      ==========================================
    */

    initNotifications() {
      // Crear contenedor de notificaciones si no existe
      if (!document.getElementById('notifications-container')) {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }
      
      this.initialized.add('notifications');
      console.log('🔔 Sistema de notificaciones inicializado');
    },

    showNotification(message, type = 'info', duration = 5000) {
      const container = document.getElementById('notifications-container');
      if (!container) return;

      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.setAttribute('role', 'alert');
      
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      notification.innerHTML = `
        <span class="notification__icon">${icons[type] || icons.info}</span>
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Cerrar notificación">×</button>
      `;

      // Evento de cierre
      const closeBtn = notification.querySelector('.notification__close');
      closeBtn.addEventListener('click', () => {
        this.removeNotification(notification);
      });

      // Auto-remover después del duration
      const autoRemove = setTimeout(() => {
        this.removeNotification(notification);
      }, duration);

      // Cancelar auto-remover si el usuario hace hover
      notification.addEventListener('mouseenter', () => {
        clearTimeout(autoRemove);
      });

      notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
          this.removeNotification(notification);
        }, 1000);
      });

      container.appendChild(notification);

      // Animar entrada
      requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
      });

      // Analytics
      if (window.Analytics) {
        window.Analytics.track('notification_shown', { type, message });
      }
    },

    removeNotification(notification) {
      if (!notification.parentElement) return;
      
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 300);
    },

    /*
      ==========================================
      SISTEMA DE MODALES
      ==========================================
    */

    initModals() {
      // Delegar eventos para modales dinámicos
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-trigger]');
        if (trigger) {
          e.preventDefault();
          const modalId = trigger.dataset.modalTrigger;
          this.openModal(modalId);
        }

        const close = e.target.closest('[data-modal-close]');
        if (close) {
          e.preventDefault();
          this.closeModal(close.closest('.modal-overlay'));
        }
      });

      // Cerrar modal con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.activeModals.length > 0) {
          this.closeTopModal();
        }
      });
      
      this.initialized.add('modals');
      console.log('🪟 Sistema de modales inicializado');
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.warn(`Modal ${modalId} no encontrado`);
        return;
      }

      // Guardar elemento con foco actual
      const previousFocus = document.activeElement;
      
      modal.classList.add('modal-overlay--active');
      this.state.activeModals.push({ element: modal, previousFocus });
      
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      
      // Focus al modal
      setTimeout(() => {
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);

      // Analytics
      if (window.Analytics) {
        window.Analytics.track('modal_opened', { modalId });
      }
    },

    closeModal(modalElement) {
      if (!modalElement) return;
      
      modalElement.classList.remove('modal-overlay--active');
      
      // Encontrar y remover del estado
      const modalIndex = this.state.activeModals.findIndex(m => m.element === modalElement);
      if (modalIndex > -1) {
        const modalData = this.state.activeModals[modalIndex];
        this.state.activeModals.splice(modalIndex, 1);
        
        // Restaurar foco
        if (modalData.previousFocus) {
          modalData.previousFocus.focus();
        }
      }
      
      // Restaurar scroll si no hay más modales
      if (this.state.activeModals.length === 0) {
        document.body.style.overflow = '';
      }
    },

    closeTopModal() {
      if (this.state.activeModals.length > 0) {
        const topModal = this.state.activeModals[this.state.activeModals.length - 1];
        this.closeModal(topModal.element);
      }
    },

    /*
      ==========================================
      TOOLTIPS EDUCATIVOS
      ==========================================
    */

    initTooltips() {
      // Inicializar tooltips existentes
      const tooltips = document.querySelectorAll('[data-tooltip]');
      
      tooltips.forEach(element => {
        this.enhanceTooltip(element);
      });
      
      this.initialized.add('tooltips');
      console.log('💬 Tooltips educativos inicializados');
    },

    enhanceTooltip(element) {
      const tooltipText = element.dataset.tooltip;
      if (!tooltipText) return;

      let tooltipElement = null;
      let showTimeout, hideTimeout;

      const showTooltip = () => {
        clearTimeout(hideTimeout);
        
        if (tooltipElement) return;
        
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip__content';
        tooltipElement.textContent = tooltipText;
        tooltipElement.setAttribute('role', 'tooltip');
        
        document.body.appendChild(tooltipElement);
        
        // Posicionar tooltip
        this.positionTooltip(element, tooltipElement);
        
        // Mostrar con animación
        requestAnimationFrame(() => {
          tooltipElement.style.opacity = '1';
          tooltipElement.style.visibility = 'visible';
        });
      };

      const hideTooltip = () => {
        clearTimeout(showTimeout);
        
        if (tooltipElement) {
          tooltipElement.style.opacity = '0';
          tooltipElement.style.visibility = 'hidden';
          
          setTimeout(() => {
            if (tooltipElement && tooltipElement.parentElement) {
              tooltipElement.parentElement.removeChild(tooltipElement);
            }
            tooltipElement = null;
          }, 200);
        }
      };

      // Eventos para mostrar/ocultar
      element.addEventListener('mouseenter', () => {
        showTimeout = setTimeout(showTooltip, 500);
      });

      element.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(hideTooltip, 100);
      });

      element.addEventListener('focus', showTooltip);
      element.addEventListener('blur', hideTooltip);
    },

    positionTooltip(trigger, tooltip) {
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top = triggerRect.top - tooltipRect.height - 10;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      
      // Ajustar si se sale de la pantalla
      if (top < 10) {
        top = triggerRect.bottom + 10;
      }
      
      if (left < 10) {
        left = 10;
      } else if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      tooltip.style.position = 'fixed';
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      tooltip.style.zIndex = '1070';
    },

    createAnalysisTooltip(patterns) {
      const tooltip = document.createElement('div');
      tooltip.className = 'code-analysis-tooltip';
      
      const content = patterns.map(pattern => 
        `<div class="analysis-item analysis-item--${pattern.severity}">
          <strong>${pattern.type}:</strong> ${pattern.message}
        </div>`
      ).join('');
      
      tooltip.innerHTML = content;
      return tooltip;
    },

    showTooltip(element, tooltip) {
      document.body.appendChild(tooltip);
      this.positionTooltip(element, tooltip);
      
      setTimeout(() => {
        if (tooltip.parentElement) {
          tooltip.parentElement.removeChild(tooltip);
        }
      }, 5000);
    },

    /*
      ==========================================
      ANIMACIONES Y TRANSICIONES
      ==========================================
    */

    initAnimations() {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('🎬 Animaciones reducidas por preferencia del usuario');
        return;
      }

      this.initScrollAnimations();
      this.initHoverAnimations();
      
      this.initialized.add('animations');
      console.log('🎬 Animaciones inicializadas');
    },

    initScrollAnimations() {
      const animatedElements = document.querySelectorAll('[data-animate]');
      
      if (animatedElements.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerScrollAnimation(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(element => {
        observer.observe(element);
      });
    },

    triggerScrollAnimation(element) {
      const animationType = element.dataset.animate;
      const delay = parseInt(element.dataset.animateDelay) || 0;
      
      setTimeout(() => {
        element.classList.add(`animate--${animationType}`);
        this.state.runningAnimations.add(element);
        
        // Limpiar después de la animación
        element.addEventListener('animationend', () => {
          this.state.runningAnimations.delete(element);
        }, { once: true });
        
      }, delay);
    },

    initHoverAnimations() {
      // Mejorar animaciones de hover para elementos interactivos
      const interactiveElements = document.querySelectorAll('.btn, .card, .stage-card');
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          if (!element.classList.contains('animating')) {
            element.classList.add('hover-enhanced');
          }
        });
        
        element.addEventListener('mouseleave', () => {
          element.classList.remove('hover-enhanced');
        });
      });
    },

    /*
      ==========================================
      FORMULARIOS INTERACTIVOS
      ==========================================
    */

    initForms() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        this.enhanceForm(form);
      });
      
      this.initialized.add('forms');
      console.log('📝 Formularios interactivos inicializados');
    },

    enhanceForm(form) {
      // Validación en tiempo real
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });

      // Envío mejorado del formulario
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    },

    validateField(field) {
      const isValid = field.checkValidity();
      const errorElement = field.parentElement.querySelector('.form-message--error');
      
      if (!isValid) {
        field.classList.add('form-input--error');
        this.showFieldError(field, field.validationMessage);
      } else {
        field.classList.remove('form-input--error');
        if (errorElement) {
          errorElement.remove();
        }
      }
      
      return isValid;
    },

    showFieldError(field, message) {
      this.clearFieldError(field);
      
      const errorElement = document.createElement('div');
      errorElement.className = 'form-message form-message--error';
      errorElement.textContent = message;
      
      field.parentElement.appendChild(errorElement);
    },

    clearFieldError(field) {
      const errorElement = field.parentElement.querySelector('.form-message--error');
      if (errorElement) {
        errorElement.remove();
      }
      field.classList.remove('form-input--error');
    },

    validateForm(form) {
      const inputs = form.querySelectorAll('input, textarea, select');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    },

    /*
      ==========================================
      UTILIDADES Y API PÚBLICA
      ==========================================
    */

    // Método público para mostrar notificaciones
    notify(message, type = 'info', duration = 5000) {
      this.showNotification(message, type, duration);
    },

    // Método público para abrir modales
    modal(modalId) {
      this.openModal(modalId);
    },

    // Obtener estado de componentes
    getState() {
      return {
        ...this.state,
        initialized: Array.from(this.initialized)
      };
    },

    // Destruir componentes (para testing o reinicios)
    destroy() {
      // Cerrar todos los modales
      this.state.activeModals.forEach(modal => {
        this.closeModal(modal.element);
      });
      
      // Cerrar navegación móvil
      if (this.state.mobileNavOpen) {
        const toggle = document.querySelector('[data-nav-toggle]');
        const menu = document.getElementById('nav-menu');
        if (toggle && menu) {
          this.closeMobileNav(toggle, menu);
        }
      }
      
      // Limpiar estado
      this.state = {
        mobileNavOpen: false,
        activeModals: [],
        activeTooltips: [],
        runningAnimations: new Set()
      };
      
      this.initialized.clear();
      
      console.log('🧹 Componentes destruidos');
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
      window.Components.init();
    });
  } else {
    window.Components.init();
  }

  // Exponer métodos globales para fácil acceso
  window.notify = window.Components.notify.bind(window.Components);
  window.modal = window.Components.modal.bind(window.Components);

})();

/*
  ==========================================
  INTERACTIVE COMPONENTS COMPLETE
  ==========================================
  
  Este sistema de componentes proporciona:
  
  ✅ Progressive Enhancement:
  - Funciona completamente sin JavaScript
  - Mejora la experiencia cuando JS está disponible
  - Graceful degradation en caso de errores
  
  ✅ Educational Interactions:
  - Análisis de código en tiempo real
  - Tooltips educativos contextuales
  - Feedback inmediato para aprendizaje
  
  ✅ Accessibility First:
  - Navegación por teclado completa
  - ARIA labels y roles apropiados
  - Respeto por preferencias de usuario (motion, etc.)
  
  ✅ Performance Optimized:
  - Event delegation para componentes dinámicos
  - Intersection Observers para animaciones
  - Lazy initialization de componentes
  
  ✅ Mobile-First:
  - Navegación móvil completamente funcional
  - Touch-friendly interactions
  - Responsive behavior en todos los componentes
  
  Uso desde otros módulos:
  
  // Mostrar notificación
  window.notify('Proyecto completado!', 'success');
  
  // Abrir modal
  window.modal('achievement-modal');
  
  // Obtener estado de componentes
  const state = window.Components.getState();
*/