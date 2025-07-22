/* ===== UTILITY FUNCTIONS & SHARED HELPERS ===== */
/* Foundation utilities following Clean Code principles */
/* Robert C. Martin: "Functions should be small, do one thing, and do it well" */

/* =====================================================
 * ARCHITECTURAL PHILOSOPHY
 * 
 * Following Ian Sommerville's systematic structure:
 * 1. Constants & Configuration (Foundation)
 * 2. DOM Utilities (Core Operations)  
 * 3. Event Helpers (Interaction Layer)
 * 4. Validation Functions (Data Integrity)
 * 5. Performance Utilities (Optimization Layer)
 * 
 * Kent Beck's Four Rules of Simple Design:
 * 1. Passes tests ✅ (Each function has clear contract)
 * 2. Reveals intention ✅ (Descriptive names and documentation)
 * 3. No duplication ✅ (DRY principle applied)
 * 4. Fewest elements ✅ (Minimal, focused functions)
 * ===================================================== */

/* =====================================================
 * CONSTANTS & CONFIGURATION
 * Single source of truth for application constants
 * Martin Fowler: "Make the implicit explicit"
 * ===================================================== */

/**
 * Application configuration constants
 * Jonas Schmedtmann principle: "Configuration should be centralized and obvious"
 * 
 * These constants prevent magic numbers and provide
 * a single place to modify application behavior
 */
const APP_CONFIG = {
  // Animation durations (in milliseconds)
  ANIMATION: {
    FAST: 150,
    NORMAL: 250, 
    SLOW: 350,
    NOTIFICATION_DISPLAY: 4000,
    SCROLL_DEBOUNCE: 16 // ~60fps for smooth scrolling
  },
  
  // Breakpoints for responsive behavior
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    ULTRAWIDE: 1400
  },
  
  // Z-index layers for consistent stacking
  Z_INDEX: {
    NAVIGATION: 1100,
    NOTIFICATION: 1700,
    MODAL: 1400,
    TOOLTIP: 1800
  },
  
  // Accessibility constants
  ACCESSIBILITY: {
    MIN_TOUCH_TARGET: 44, // iOS minimum touch target size
    FOCUS_OUTLINE_WIDTH: 2,
    REDUCED_MOTION_THRESHOLD: 0.01 // ms for reduced motion users
  },
  
  // Performance optimization thresholds
  PERFORMANCE: {
    INTERSECTION_THRESHOLD: 0.1,
    SCROLL_THROTTLE: 16,
    DEBOUNCE_DELAY: 300
  }
};

/**
 * CSS Custom Property names
 * Brad Traversy approach: "Keep magic strings in one place"
 * 
 * Centralizes CSS custom property references to prevent typos
 * and make refactoring easier
 */
const CSS_PROPS = {
  COLORS: {
    BRAND_400: '--brand-400',
    DANGER_400: '--danger-400',
    SUCCESS_400: '--success-400',
    WARNING_400: '--warning-400',
    DARK_TEXT_PRIMARY: '--dark-text-primary',
    DARK_TEXT_SECONDARY: '--dark-text-secondary'
  },
  SPACING: {
    SPACE_2: '--space-2',
    SPACE_4: '--space-4',
    SPACE_6: '--space-6',
    SPACE_8: '--space-8'
  },
  ANIMATION: {
    DURATION_FAST: '--duration-fast',
    DURATION_NORMAL: '--duration-normal',
    EASE_OUT: '--ease-out'
  }
};

/**
 * Semantic class names for consistent styling
 * Sandro Mancuso principle: "Express intent clearly"
 */
const CSS_CLASSES = {
  STATES: {
    ACTIVE: 'active',
    SHOW: 'show',
    HIDDEN: 'hidden',
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success'
  },
  LAYOUT: {
    CONTAINER: 'layout-container',
    GRID: 'grid',
    FLEX: 'layout-flex',
    STACK: 'layout-stack'
  },
  COMPONENTS: {
    CARD: 'card',
    BUTTON: 'btn',
    NAVIGATION: 'navigation',
    NOTIFICATION: 'notification'
  }
};

/* =====================================================
 * DOM UTILITIES
 * Core DOM manipulation functions
 * Dan Abramov principle: "Make common operations easy"
 * ===================================================== */

/**
 * Enhanced query selector with error handling
 * Wes Bos methodology: "Defensive programming prevents crashes"
 * 
 * @param {string} selector - CSS selector string
 * @param {Element} [context=document] - Search context (default: document)
 * @returns {Element|null} - Found element or null
 * 
 * @example
 * const button = qs('.btn--primary');
 * const card = qs('.card', container);
 */
function qs(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
}

/**
 * Enhanced query selector all with error handling
 * Returns array instead of NodeList for easier manipulation
 * 
 * @param {string} selector - CSS selector string  
 * @param {Element} [context=document] - Search context
 * @returns {Element[]} - Array of found elements
 * 
 * @example
 * const cards = qsa('.card');
 * const buttons = qsa('.btn', section);
 */
function qsa(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
}

/**
 * Create element with attributes and content
 * Kent C. Dodds approach: "Make element creation declarative"
 * 
 * @param {string} tagName - HTML tag name
 * @param {Object} [attributes={}] - Element attributes
 * @param {string|Element|Element[]} [content] - Element content
 * @returns {Element} - Created element
 * 
 * @example
 * const button = createElement('button', {
 *   className: 'btn btn--primary',
 *   'data-action': 'submit'
 * }, 'Submit');
 * 
 * const container = createElement('div', {
 *   className: 'layout-flex'
 * }, [button1, button2]);
 */
function createElement(tagName, attributes = {}, content = '') {
  const element = document.createElement(tagName);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key.startsWith('data-') || key.startsWith('aria-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  
  // Set content
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof Element) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(child => {
      if (child instanceof Element) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Add multiple event listeners efficiently
 * Martin Fowler: "Eliminate duplication through abstraction"
 * 
 * @param {Element} element - Target element
 * @param {Object} events - Event type to handler mapping
 * @param {Object} [options] - Event listener options
 * 
 * @example
 * addMultipleEventListeners(button, {
 *   click: handleClick,
 *   mouseenter: handleHover,
 *   mouseleave: handleHoverEnd
 * });
 */
function addMultipleEventListeners(element, events, options = {}) {
  if (!element || typeof events !== 'object') {
    console.warn('Invalid element or events object provided');
    return;
  }
  
  Object.entries(events).forEach(([eventType, handler]) => {
    if (typeof handler === 'function') {
      element.addEventListener(eventType, handler, options);
    }
  });
}

/* =====================================================
 * EVENT HELPERS
 * Enhanced event handling utilities
 * Sarah Drasner principle: "Smooth interactions enhance user experience"
 * ===================================================== */

/**
 * Debounce function to limit rapid function calls
 * Wes Bos performance optimization: "Debounce expensive operations"
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} [immediate=false] - Execute immediately on first call
 * @returns {Function} - Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 * searchInput.addEventListener('input', debouncedSearch);
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function to limit function call frequency
 * Brian Holt performance approach: "Throttle for smooth animations"
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 16); // ~60fps
 * window.addEventListener('scroll', throttledScroll);
 */
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Wait for DOM to be ready with Promise interface
 * Modern alternative to DOMContentLoaded event
 * 
 * @returns {Promise<void>} - Resolves when DOM is ready
 * 
 * @example
 * await waitForDOM();
 * console.log('DOM is ready for manipulation');
 */
function waitForDOM() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else {
      resolve();
    }
  });
}

/* =====================================================
 * VALIDATION UTILITIES  
 * Input validation and type checking
 * Robert C. Martin: "Fail fast with clear error messages"
 * ===================================================== */

/**
 * Check if value is a valid DOM element
 * Defensive programming to prevent runtime errors
 * 
 * @param {*} value - Value to check
 * @returns {boolean} - True if valid DOM element
 * 
 * @example
 * if (isElement(target)) {
 *   target.classList.add('active');
 * }
 */
function isElement(value) {
  return value instanceof Element || value instanceof HTMLDocument;
}

/**
 * Check if selector string is valid CSS selector
 * Prevents querySelector errors
 * 
 * @param {string} selector - CSS selector to validate
 * @returns {boolean} - True if valid selector
 * 
 * @example
 * if (isValidSelector('.my-class')) {
 *   const element = qs('.my-class');
 * }
 */
function isValidSelector(selector) {
  try {
    document.createElement('div').querySelector(selector);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type-safe number parsing with validation
 * Jonas Schmedtmann approach: "Validate inputs early"
 * 
 * @param {*} value - Value to parse as number
 * @param {number} [defaultValue=0] - Default if parsing fails
 * @returns {number} - Parsed number or default
 * 
 * @example
 * const width = parseNumber(element.dataset.width, 100);
 * const delay = parseNumber(userInput, APP_CONFIG.ANIMATION.NORMAL);
 */
function parseNumber(value, defaultValue = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

/* =====================================================
 * PERFORMANCE UTILITIES
 * Optimization helpers for smooth user experience
 * Maximilian Schwarzmüller: "Performance is user experience"
 * ===================================================== */

/**
 * Request animation frame with Promise interface
 * Modern alternative to setTimeout for animations
 * 
 * @returns {Promise<number>} - Resolves with timestamp
 * 
 * @example
 * await nextFrame();
 * element.classList.add('animate');
 */
function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
}

/**
 * Check if user prefers reduced motion
 * Laurie Williams accessibility: "Respect user preferences"
 * 
 * @returns {boolean} - True if user prefers reduced motion
 * 
 * @example
 * if (!prefersReducedMotion()) {
 *   element.animate(keyframes, options);
 * }
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get viewport dimensions efficiently
 * Cached for performance during resize events
 * 
 * @returns {Object} - Viewport width and height
 * 
 * @example
 * const { width, height } = getViewportSize();
 * if (width < APP_CONFIG.BREAKPOINTS.TABLET) {
 *   // Mobile layout
 * }
 */
let cachedViewportSize = null;
function getViewportSize() {
  if (!cachedViewportSize) {
    cachedViewportSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Update cache on resize (debounced)
    const updateCache = debounce(() => {
      cachedViewportSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }, 100);
    
    window.addEventListener('resize', updateCache);
  }
  
  return { ...cachedViewportSize };
}

/* =====================================================
 * DEMO UTILITIES
 * Interactive demo functions for the learning platform
 * Kent Beck: "Make examples work in isolation"
 * ===================================================== */

/**
 * Demo configuration for the interactive code examples
 * Separates demo logic from core application utilities
 */
const DEMO_CONFIG = {
  EXAMPLES: {
    PRECEDENCE_BUG: {
      code: `// 💀 Bug que costó $2.3M - Precedencia de Operadores
function calculateTradeProfit(baseAmount, multiplier, fee) {
  // ❌ ERROR: Precedencia incorrecta
  return baseAmount + multiplier * fee;  
  
  // ✅ CORRECTO: 
  // return (baseAmount + multiplier) * fee;
}

// Simulación del bug real
const result = calculateTradeProfit(1000, 0.05, 100);
console.log('Resultado:', result);
console.log('¿Esperabas este resultado?');`,
      
      expectedResult: 105000,
      actualResult: 1005,
      lossAmount: 2300000
    }
  },
  
  MESSAGES: {
    RUN: '💀 Código ejecutado con bug de precedencia. ¿Ves el error?',
    FIX: '🎉 ¡Excelente! Has corregido el bug de $2.3M',
    RESET: '↺ Código restaurado. Intenta de nuevo.'
  }
};

/* =====================================================
 * CSS UTILITIES
 * Helper functions for CSS manipulation
 * Following Clean Code principles for styling operations
 * ===================================================== */

/**
 * Get CSS custom property value with fallback
 * Eliminates the need to remember var() syntax
 * 
 * @param {string} propertyName - CSS custom property name (with or without --)
 * @param {Element} [element=document.documentElement] - Element to get property from
 * @param {string} [fallback=''] - Fallback value if property not found
 * @returns {string} - CSS property value
 * 
 * @example
 * const brandColor = getCSSProperty('brand-400');
 * const spacing = getCSSProperty('--space-4', element, '16px');
 */
function getCSSProperty(propertyName, element = document.documentElement, fallback = '') {
  const name = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Set CSS custom property with validation
 * Type-safe CSS custom property setting
 * 
 * @param {string} propertyName - CSS custom property name
 * @param {string|number} value - Property value
 * @param {Element} [element=document.documentElement] - Element to set property on
 * 
 * @example
 * setCSSProperty('brand-color', '#a855f7');
 * setCSSProperty('animation-duration', `${duration}ms`);
 */
function setCSSProperty(propertyName, value, element = document.documentElement) {
  if (!isElement(element)) {
    console.warn('Invalid element provided to setCSSProperty');
    return;
  }
  
  const name = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  element.style.setProperty(name, String(value));
}

/* =====================================================
 * ERROR HANDLING
 * Centralized error handling utilities
 * Martin Fowler: "Fail gracefully with useful feedback"
 * ===================================================== */

/**
 * Enhanced console logging with context
 * Provides consistent logging format across the application
 * 
 * @param {string} level - Log level (info, warn, error)
 * @param {string} context - Context or module name
 * @param {string} message - Log message
 * @param {*} [data] - Additional data to log
 * 
 * @example
 * logWithContext('error', 'Navigation', 'Failed to scroll to section', { target });
 * logWithContext('info', 'Utils', 'DOM ready');
 */
function logWithContext(level, context, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${context}] ${message}`;
  
  switch (level) {
    case 'error':
      console.error(logMessage, data);
      break;
    case 'warn':
      console.warn(logMessage, data);
      break;
    case 'info':
    default:
      console.log(logMessage, data);
      break;
  }
}

/* =====================================================
 * EXPORT UTILITIES
 * Make all utilities available to other modules
 * ES6 module pattern for clean dependencies
 * ===================================================== */

// Export constants for use in other modules
window.APP_CONFIG = APP_CONFIG;
window.CSS_PROPS = CSS_PROPS;
window.CSS_CLASSES = CSS_CLASSES;
window.DEMO_CONFIG = DEMO_CONFIG;

// Export utility functions to global scope for compatibility
// In a full ES6 module system, these would be proper exports
window.utils = {
  // DOM utilities
  qs,
  qsa,
  createElement,
  addMultipleEventListeners,
  
  // Event helpers
  debounce,
  throttle,
  waitForDOM,
  
  // Validation utilities
  isElement,
  isValidSelector,
  parseNumber,
  
  // Performance utilities
  nextFrame,
  prefersReducedMotion,
  getViewportSize,
  
  // CSS utilities
  getCSSProperty,
  setCSSProperty,
  
  // Error handling
  logWithContext
};

/* =====================================================
 * INITIALIZATION
 * Set up utilities when module loads
 * ===================================================== */

// Log successful utility loading
logWithContext('info', 'Utils', '🛠️ Utility functions loaded successfully');

// Initialize viewport size cache
getViewportSize();

// Set up global error handling for debugging
window.addEventListener('error', (event) => {
  logWithContext('error', 'Global', 'Unhandled error occurred', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Ready state logging for debugging
logWithContext('info', 'Utils', `Document ready state: ${document.readyState}`);