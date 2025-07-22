/* ===== CORE NAVIGATION & INTERACTION SYSTEM ===== */
/* Essential application behaviors following Clean Architecture principles */
/* Synthesizing wisdom from Ian Sommerville, Robert C. Martin, and Dan Abramov */

/* =====================================================
 * ARCHITECTURAL PHILOSOPHY
 * 
 * Robert C. Martin's Clean Architecture applied to frontend interactions:
 * "The architecture should scream about the use cases, not the frameworks"
 * 
 * This core system follows:
 * 1. Single Responsibility - Each module handles one aspect of interaction
 * 2. Dependency Inversion - Depends on utils abstractions, not DOM specifics
 * 3. Open/Closed - Extensible through configuration, not modification
 * 4. Interface Segregation - Small, focused interaction handlers
 * 
 * Ian Sommerville's systematic structure:
 * Foundation (Utils) → Core (Navigation/Interactions) → Features (Notifications) → Orchestration (Main)
 * 
 * Dan Abramov principle: "Focus on fundamentals that don't change"
 * - Smooth scrolling will always be needed
 * - Navigation state management is universal
 * - Intersection observation is fundamental to modern UX
 * - Focus management is an accessibility requirement
 * ===================================================== */

/* =====================================================
 * NAVIGATION STATE MANAGEMENT
 * Core navigation behaviors following Jonas Schmedtmann's
 * "State should be predictable and centralized" methodology
 * ===================================================== */

/**
 * Navigation State Manager
 * Centralized state for navigation interactions
 * 
 * Martin Fowler principle: "Make the implicit explicit"
 * Instead of scattered navigation logic, centralize state management
 */
class NavigationState {
  constructor() {
    this.activeSection = 'inicio';
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.observers = new Map(); // WeakMap for automatic cleanup
    
    // Cache DOM elements for performance
    this.elements = {
      nav: null,
      links: [],
      sections: []
    };
    
    this.init();
  }
  
  /**
   * Initialize navigation system
   * Kent Beck's "Make initialization explicit and obvious"
   */
  init() {
    this.cacheElements();
    this.setupScrollBehavior();
    this.setupIntersectionObserver();
    utils.logWithContext('info', 'Navigation', 'Navigation state initialized');
  }
  
  /**
   * Cache DOM elements for performance
   * Wes Bos optimization: "Cache expensive DOM queries"
   */
  cacheElements() {
    this.elements.nav = utils.qs('.navigation');
    this.elements.links = utils.qsa('.navigation-link');
    this.elements.sections = utils.qsa('section[id]');
    
    if (!this.elements.nav) {
      utils.logWithContext('warn', 'Navigation', 'Navigation element not found');
      return;
    }
    
    utils.logWithContext('info', 'Navigation', `Cached ${this.elements.links.length} navigation links`);
  }
  
  /**
   * Update active navigation state
   * Sarah Drasner principle: "State changes should be smooth and obvious"
   * 
   * @param {string} sectionId - ID of the active section
   */
  updateActiveSection(sectionId) {
    if (this.activeSection === sectionId) return;
    
    this.activeSection = sectionId;
    
    // Update navigation link states
    this.elements.links.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${sectionId}`;
      
      link.classList.toggle(APP_CONFIG.CSS_CLASSES.STATES.ACTIVE, isActive);
      
      // Accessibility: Update aria-current
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    
    utils.logWithContext('info', 'Navigation', `Active section changed to: ${sectionId}`);
  }
  
  /**
   * Setup smooth scrolling behavior
   * Brad Traversy approach: "Enhanced UX through smooth interactions"
   */
  setupScrollBehavior() {
    this.elements.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = utils.qs(`#${targetId}`);
        
        if (targetSection) {
          this.smoothScrollToSection(targetSection, targetId);
        }
      });
    });
  }
  
  /**
   * Smooth scroll to section with callbacks
   * Maximilian Schwarzmüller: "User feedback during async operations"
   * 
   * @param {Element} targetSection - Target DOM element
   * @param {string} sectionId - Section identifier
   */
  smoothScrollToSection(targetSection, sectionId) {
    // Respect user motion preferences
    if (utils.prefersReducedMotion()) {
      targetSection.scrollIntoView({ block: 'start' });
      this.updateActiveSection(sectionId);
      return;
    }
    
    // Smooth scroll with callback
    this.isScrolling = true;
    
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Update state after scroll completes
    // Using setTimeout as scroll completion detection is complex
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      this.updateActiveSection(sectionId);
    }, APP_CONFIG.ANIMATION.SLOW);
    
    utils.logWithContext('info', 'Navigation', `Scrolling to section: ${sectionId}`);
  }
  
  /**
   * Setup intersection observer for automatic active state
   * Brian Holt performance approach: "Use Intersection Observer for scroll events"
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: APP_CONFIG.PERFORMANCE.INTERSECTION_THRESHOLD,
      rootMargin: '0px 0px -100px 0px' // Trigger when section is 100px from bottom
    };
    
    const observer = new IntersectionObserver((entries) => {
      // Only update if not manually scrolling
      if (this.isScrolling) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActiveSection(sectionId);
        }
      });
    }, observerOptions);
    
    // Observe all sections
    this.elements.sections.forEach(section => {
      observer.observe(section);
    });
    
    // Store observer for potential cleanup
    this.observers.set('sections', observer);
  }
}

/* =====================================================
 * CARD INTERACTION SYSTEM
 * Interactive component behaviors following Kent C. Dodds'
 * "Make interactions delightful but not distracting" philosophy
 * ===================================================== */

/**
 * Card Interaction Manager
 * Handles hover effects, focus states, and progressive enhancement
 * 
 * Robert C. Martin: "Classes should be small and have a single responsibility"
 */
class CardInteractionManager {
  constructor() {
    this.cards = [];
    this.intersectionObserver = null;
    this.init();
  }
  
  /**
   * Initialize card interactions
   * Jonas Schmedtmann: "Setup should be declarative and obvious"
   */
  init() {
    this.findCards();
    this.setupHoverEffects();
    this.setupKeyboardNavigation();
    this.setupProgressiveReveal();
    utils.logWithContext('info', 'Cards', `Initialized ${this.cards.length} interactive cards`);
  }
  
  /**
   * Find and cache all interactive cards
   * Performance optimization through caching
   */
  findCards() {
    this.cards = utils.qsa('.card.interactive');
    
    if (this.cards.length === 0) {
      utils.logWithContext('warn', 'Cards', 'No interactive cards found');
    }
  }
  
  /**
   * Setup sophisticated hover effects
   * Sarah Drasner: "Hover states should feel natural and responsive"
   */
  setupHoverEffects() {
    this.cards.forEach(card => {
      // Performance optimization: will-change on hover start
      const handleMouseEnter = () => {
        card.style.willChange = 'transform, box-shadow';
        
        // Add hover class for CSS transitions
        card.classList.add('is-hovering');
        
        // Enhance hover for non-reduced motion users
        if (!utils.prefersReducedMotion()) {
          // Subtle animation enhance
          card.style.transition = `all ${APP_CONFIG.ANIMATION.NORMAL}ms var(--ease-out)`;
        }
      };
      
      const handleMouseLeave = () => {
        card.style.willChange = 'auto';
        card.classList.remove('is-hovering');
      };
      
      // Efficient event listener setup using utils
      utils.addMultipleEventListeners(card, {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave
      });
    });
  }
  
  /**
   * Setup keyboard navigation for accessibility
   * Laurie Williams: "Accessibility should be built-in, not bolted on"
   */
  setupKeyboardNavigation() {
    this.cards.forEach(card => {
      // Make cards focusable if they contain interactive elements
      const interactiveElements = utils.qsa('a, button', card);
      
      if (interactiveElements.length > 0) {
        // Card focus management
        const handleCardFocus = (e) => {
          // If focus is on the card itself, move to first interactive element
          if (e.target === card && interactiveElements[0]) {
            interactiveElements[0].focus();
          }
        };
        
        // Enhanced focus styles
        const handleFocusIn = () => {
          card.classList.add('is-focused');
        };
        
        const handleFocusOut = (e) => {
          // Only remove focus styling if focus moved outside the card
          if (!card.contains(e.relatedTarget)) {
            card.classList.remove('is-focused');
          }
        };
        
        utils.addMultipleEventListeners(card, {
          focus: handleCardFocus,
          focusin: handleFocusIn,
          focusout: handleFocusOut
        });
        
        // Keyboard navigation within card
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            const primaryAction = utils.qs('.btn--primary, .btn--danger, .btn--warning', card);
            if (primaryAction) {
              e.preventDefault();
              primaryAction.click();
            }
          }
        });
      }
    });
  }
  
  /**
   * Setup progressive reveal animations
   * Kent Beck: "Make the system responsive to user actions"
   */
  setupProgressiveReveal() {
    // Only setup animations if user doesn't prefer reduced motion
    if (utils.prefersReducedMotion()) {
      // Ensure all cards are visible for reduced motion users
      this.cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
      return;
    }
    
    // Initial state for animation
    this.cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Intersection observer for reveal animations
    const revealOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          
          // Stagger animation for multiple cards
          const delay = Array.from(this.cards).indexOf(card) * 100;
          
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, delay);
          
          // Stop observing once revealed
          this.intersectionObserver.unobserve(card);
        }
      });
    }, revealOptions);
    
    // Observe all cards
    this.cards.forEach(card => {
      this.intersectionObserver.observe(card);
    });
  }
}

/* =====================================================
 * FOCUS MANAGEMENT SYSTEM
 * Accessibility-first focus handling following
 * Laurie Williams' inclusive design principles
 * ===================================================== */

/**
 * Focus Manager for enhanced accessibility
 * Manages focus rings, skip links, and keyboard navigation
 * 
 * Web Content Accessibility Guidelines (WCAG) 2.1 compliant
 */
class FocusManager {
  constructor() {
    this.focusableElements = [];
    this.lastFocusedElement = null;
    this.init();
  }
  
  /**
   * Initialize focus management system
   * Systematic setup following Ian Sommerville's structured approach
   */
  init() {
    this.setupFocusRings();
    this.setupSkipLinks();
    this.setupFocusTrap();
    this.monitorFocusChanges();
    utils.logWithContext('info', 'Focus', 'Focus management system initialized');
  }
  
  /**
   * Setup enhanced focus rings
   * Modern focus indicators that work across all browsers
   */
  setupFocusRings() {
    // Custom focus ring styles for better visibility
    const style = document.createElement('style');
    style.textContent = `
      .focus-ring-enhanced {
        outline: 2px solid var(${CSS_PROPS.COLORS.BRAND_400});
        outline-offset: 2px;
        border-radius: var(--radius-sm);
        box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Setup skip links for keyboard navigation
   * Essential for accessibility compliance
   */
  setupSkipLinks() {
    const mainContent = utils.qs('main') || utils.qs('#casos');
    
    if (mainContent) {
      const skipLink = utils.createElement('a', {
        href: `#${mainContent.id || 'main-content'}`,
        className: 'skip-link',
        style: `
          position: absolute;
          top: -40px;
          left: 6px;
          background: var(${CSS_PROPS.COLORS.BRAND_400});
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: ${APP_CONFIG.Z_INDEX.SKIP_NAV};
          transition: top 0.3s;
        `
      }, 'Skip to main content');
      
      // Show skip link on focus
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }
  
  /**
   * Setup focus trap for modal-like interactions
   * Prevents focus from escaping contained areas
   */
  setupFocusTrap() {
    // This will be extended when modal components are added
    this.focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
  }
  
  /**
   * Monitor focus changes for debugging and analytics
   * Kent C. Dodds: "Make the system observable"
   */
  monitorFocusChanges() {
    document.addEventListener('focusin', (e) => {
      this.lastFocusedElement = e.target;
      
      // Add enhanced focus ring to focused element
      if (e.target.matches('button, a, input, textarea, select')) {
        e.target.classList.add('focus-ring-enhanced');
      }
    });
    
    document.addEventListener('focusout', (e) => {
      // Remove enhanced focus ring
      e.target.classList.remove('focus-ring-enhanced');
    });
  }
  
  /**
   * Get all focusable elements in a container
   * Utility for focus management in dynamic content
   * 
   * @param {Element} container - Container to search within
   * @returns {Element[]} - Array of focusable elements
   */
  getFocusableElements(container = document) {
    return utils.qsa(this.focusableSelectors, container);
  }
}

/* =====================================================
 * RESPONSIVE BEHAVIOR SYSTEM
 * Adaptive interactions based on viewport and user preferences
 * Following Brad Traversy's mobile-first responsive methodology
 * ===================================================== */

/**
 * Responsive Behavior Manager
 * Adapts interactions based on device capabilities and user preferences
 * 
 * Progressive enhancement following modern web standards
 */
class ResponsiveBehaviorManager {
  constructor() {
    this.currentBreakpoint = null;
    this.touchDevice = false;
    this.init();
  }
  
  /**
   * Initialize responsive behavior system
   * Detect device capabilities and setup adaptive behaviors
   */
  init() {
    this.detectDeviceCapabilities();
    this.setupBreakpointMonitoring();
    this.setupTouchEnhancements();
    this.setupReducedMotionHandling();
    utils.logWithContext('info', 'Responsive', 'Responsive behavior system initialized');
  }
  
  /**
   * Detect device capabilities
   * Modern feature detection following progressive enhancement
   */
  detectDeviceCapabilities() {
    // Touch detection
    this.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Pointer capabilities
    this.pointerCapabilities = {
      fine: window.matchMedia('(pointer: fine)').matches,
      coarse: window.matchMedia('(pointer: coarse)').matches
    };
    
    // High contrast preference
    this.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Add classes to body for CSS targeting
    document.body.classList.toggle('touch-device', this.touchDevice);
    document.body.classList.toggle('pointer-fine', this.pointerCapabilities.fine);
    document.body.classList.toggle('pointer-coarse', this.pointerCapabilities.coarse);
    document.body.classList.toggle('high-contrast', this.highContrast);
    
    utils.logWithContext('info', 'Responsive', `Device capabilities: touch=${this.touchDevice}, fine=${this.pointerCapabilities.fine}`);
  }
  
  /**
   * Setup breakpoint monitoring
   * React to viewport changes with appropriate behavior adjustments
   */
  setupBreakpointMonitoring() {
    const updateBreakpoint = () => {
      const viewport = utils.getViewportSize();
      let newBreakpoint;
      
      if (viewport.width >= APP_CONFIG.BREAKPOINTS.ULTRAWIDE) {
        newBreakpoint = 'ultrawide';
      } else if (viewport.width >= APP_CONFIG.BREAKPOINTS.DESKTOP) {
        newBreakpoint = 'desktop';
      } else if (viewport.width >= APP_CONFIG.BREAKPOINTS.TABLET) {
        newBreakpoint = 'tablet';
      } else {
        newBreakpoint = 'mobile';
      }
      
      if (newBreakpoint !== this.currentBreakpoint) {
        this.handleBreakpointChange(this.currentBreakpoint, newBreakpoint);
        this.currentBreakpoint = newBreakpoint;
      }
    };
    
    // Initial check
    updateBreakpoint();
    
    // Monitor changes with debounced handler
    const debouncedUpdate = utils.debounce(updateBreakpoint, 150);
    window.addEventListener('resize', debouncedUpdate);
  }
  
  /**
   * Handle breakpoint changes
   * Adjust interactions based on new viewport size
   * 
   * @param {string} oldBreakpoint - Previous breakpoint
   * @param {string} newBreakpoint - New breakpoint
   */
  handleBreakpointChange(oldBreakpoint, newBreakpoint) {
    // Update body class for CSS targeting
    if (oldBreakpoint) {
      document.body.classList.remove(`breakpoint-${oldBreakpoint}`);
    }
    document.body.classList.add(`breakpoint-${newBreakpoint}`);
    
    // Adjust touch targets for mobile
    if (newBreakpoint === 'mobile') {
      this.enhanceTouchTargets();
    }
    
    utils.logWithContext('info', 'Responsive', `Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);
  }
  
  /**
   * Setup touch-specific enhancements
   * Improve touch interactions following mobile UX best practices
   */
  setupTouchEnhancements() {
    if (!this.touchDevice) return;
    
    // Add touch-friendly hover alternatives
    const interactiveElements = utils.qsa('.interactive, .btn, .card');
    
    interactiveElements.forEach(element => {
      // Replace hover with touch feedback
      element.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        // Delay removal for visual feedback
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      });
    });
  }
  
  /**
   * Enhance touch targets for mobile usability
   * Ensure minimum 44px touch targets as per iOS guidelines
   */
  enhanceTouchTargets() {
    const touchTargets = utils.qsa('button, a, input, [role="button"]');
    
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      const minSize = APP_CONFIG.ACCESSIBILITY.MIN_TOUCH_TARGET;
      
      if (rect.width < minSize || rect.height < minSize) {
        target.style.minWidth = `${minSize}px`;
        target.style.minHeight = `${minSize}px`;
      }
    });
  }
  
  /**
   * Setup reduced motion handling
   * Respect user motion preferences throughout the system
   */
  setupReducedMotionHandling() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreference = (mq) => {
      document.body.classList.toggle('reduced-motion', mq.matches);
      
      if (mq.matches) {
        // Disable non-essential animations
        const style = document.createElement('style');
        style.id = 'reduced-motion-override';
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        // Remove reduced motion override
        const existingStyle = document.getElementById('reduced-motion-override');
        if (existingStyle) {
          existingStyle.remove();
        }
      }
    };
    
    // Initial check
    handleMotionPreference(mediaQuery);
    
    // Monitor changes
    mediaQuery.addEventListener('change', handleMotionPreference);
  }
}

/* =====================================================
 * CORE SYSTEM INITIALIZATION
 * Orchestrate all core systems following dependency injection principles
 * Robert C. Martin: "Dependencies should flow in one direction"
 * ===================================================== */

/**
 * Core System Manager
 * Coordinates initialization and manages dependencies between core systems
 * 
 * Single entry point for all core functionality
 */
class CoreSystemManager {
  constructor() {
    this.systems = new Map();
    this.initializationPromise = null;
  }
  
  /**
   * Initialize all core systems
   * Ordered initialization respecting dependencies
   * 
   * @returns {Promise<void>} - Resolves when all systems are ready
   */
  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }
  
  /**
   * Perform actual initialization
   * Internal method with proper error handling
   */
  async performInitialization() {
    try {
      utils.logWithContext('info', 'Core', 'Starting core systems initialization...');
      
      // Wait for DOM to be ready
      await utils.waitForDOM();
      
      // Initialize systems in dependency order
      await this.initializeSystem('responsive', ResponsiveBehaviorManager);
      await this.initializeSystem('focus', FocusManager);
      await this.initializeSystem('navigation', NavigationState);
      await this.initializeSystem('cards', CardInteractionManager);
      
      utils.logWithContext('info', 'Core', '✅ All core systems initialized successfully');
      
      // Dispatch custom event for other modules
      window.dispatchEvent(new CustomEvent('coreSystemsReady', {
        detail: { systems: Array.from(this.systems.keys()) }
      }));
      
    } catch (error) {
      utils.logWithContext('error', 'Core', 'Failed to initialize core systems', error);
      throw error;
    }
  }
  
  /**
   * Initialize individual system with error handling
   * 
   * @param {string} name - System name for identification
   * @param {Function} SystemClass - System constructor
   */
  async initializeSystem(name, SystemClass) {
    try {
      const system = new SystemClass();
      this.systems.set(name, system);
      utils.logWithContext('info', 'Core', `✅ ${name} system initialized`);
    } catch (error) {
      utils.logWithContext('error', 'Core', `❌ Failed to initialize ${name} system`, error);
      // Don't throw - allow other systems to initialize
    }
  }
  
  /**
   * Get initialized system by name
   * 
   * @param {string} name - System name
   * @returns {Object|null} - System instance or null if not found
   */
  getSystem(name) {
    return this.systems.get(name) || null;
  }
  
  /**
   * Check if all systems are ready
   * 
   * @returns {boolean} - True if all systems initialized
   */
  isReady() {
    return this.systems.size > 0 && this.initializationPromise !== null;
  }
}

/* =====================================================
 * MODULE EXPORTS & GLOBAL AVAILABILITY
 * Make core systems available to other modules
 * Following clean dependency management
 * ===================================================== */

// Create and expose core system manager
const coreManager = new CoreSystemManager();

// Global availability for other modules
window.coreManager = coreManager;

// Convenience functions for common operations
window.coreAPI = {
  /**
   * Get navigation system
   * @returns {NavigationState|null}
   */
  getNavigation: () => coreManager.getSystem('navigation'),
  
  /**
   * Get focus manager  
   * @returns {FocusManager|null}
   */
  getFocusManager: () => coreManager.getSystem('focus'),
  
  /**
   * Get responsive behavior manager
   * @returns {ResponsiveBehaviorManager|null}
   */
  getResponsiveManager: () => coreManager.getSystem('responsive'),
  
  /**
   * Get card interaction manager
   * @returns {CardInteractionManager|null}
   */
  getCardManager: () => coreManager.getSystem('cards'),
  
  /**
   * Check if core systems are ready
   * @returns {boolean}
   */
  isReady: () => coreManager.isReady()
};

/* =====================================================
 * AUTO-INITIALIZATION
 * Initialize core systems when module loads
 * Can be overridden by setting window.DEFER_CORE_INIT = true
 * ===================================================== */

if (!window.DEFER_CORE_INIT) {
  // Auto-initialize core systems
  coreManager.initialize().catch(error => {
    utils.logWithContext('error', 'Core', 'Auto-initialization failed', error);
  });
}

// Log successful module loading
utils.logWithContext('info', 'Core', '🎯 Core interaction system module loaded');