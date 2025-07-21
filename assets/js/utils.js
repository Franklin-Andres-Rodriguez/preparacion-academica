/**
 * UTILS - Core Utilities Module
 * Siguiendo principios de Robert C. Martin (Clean Code) + Martin Fowler (Refactoring)
 * Single Responsibility: Utilidades generales reutilizables
 */

// ===== NAMESPACE GLOBAL =====
window.BugsMillion = window.BugsMillion || {};

// ===== CORE UTILITIES =====
const Utils = {
  
  // === DEBOUNCE - Performance optimization ===
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // === THROTTLE - Rate limiting ===
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // === STORAGE - Local storage with error handling ===
  storage: {
    set: (key, value) => {
      try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.warn('Storage.set failed:', error);
        return false;
      }
    },

    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn('Storage.get failed:', error);
        return defaultValue;
      }
    },

    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn('Storage.remove failed:', error);
        return false;
      }
    },

    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.warn('Storage.clear failed:', error);
        return false;
      }
    }
  },

  // === DOM UTILITIES ===
  dom: {
    // Selector seguro con error handling
    select: (selector, parent = document) => {
      try {
        return parent.querySelector(selector);
      } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
      }
    },

    selectAll: (selector, parent = document) => {
      try {
        return Array.from(parent.querySelectorAll(selector));
      } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return [];
      }
    },

    // Crear elemento con propiedades
    create: (tag, props = {}, children = []) => {
      const element = document.createElement(tag);
      
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'textContent') {
          element.textContent = value;
        } else if (key === 'innerHTML') {
          element.innerHTML = value;
        } else if (key.startsWith('data-')) {
          element.setAttribute(key, value);
        } else {
          element[key] = value;
        }
      });

      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Element) {
          element.appendChild(child);
        }
      });

      return element;
    },

    // Verificar si elemento está visible
    isVisible: (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },

    // Obtener posición del elemento
    getPosition: (element) => {
      if (!element) return { top: 0, left: 0 };
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
      };
    }
  },

  // === NUMBER FORMATTING ===
  format: {
    // Formatear dinero (para mostrar pérdidas)
    money: (amount, currency = 'USD') => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      } catch (error) {
        return `$${amount.toLocaleString()}`;
      }
    },

    // Formatear porcentajes
    percentage: (value, decimals = 1) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(value / 100);
      } catch (error) {
        return `${value.toFixed(decimals)}%`;
      }
    },

    // Formatear números grandes
    compactNumber: (value) => {
      try {
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(value);
      } catch (error) {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
      }
    }
  },

  // === DATE/TIME UTILITIES ===
  time: {
    // Formatear timestamp
    formatDate: (date, options = {}) => {
      const defaults = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      try {
        return new Intl.DateTimeFormat('es-ES', { ...defaults, ...options }).format(new Date(date));
      } catch (error) {
        return new Date(date).toLocaleDateString();
      }
    },

    // Tiempo relativo (hace X tiempo)
    timeAgo: (date) => {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) return 'hace un momento';
      if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
      if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
      if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
      
      return Utils.time.formatDate(date);
    },

    // Generar timestamp único
    timestamp: () => Date.now(),

    // Sleep promise (para testing/demos)
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms))
  },

  // === VALIDATION UTILITIES ===
  validate: {
    email: (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    },

    url: (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    notEmpty: (value) => {
      return value !== null && value !== undefined && value !== '';
    },

    isNumber: (value) => {
      return !isNaN(value) && !isNaN(parseFloat(value));
    },

    range: (value, min, max) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= min && num <= max;
    }
  },

  // === ARRAY UTILITIES ===
  array: {
    // Eliminar duplicados
    unique: (arr, key = null) => {
      if (!key) return [...new Set(arr)];
      
      const seen = new Set();
      return arr.filter(item => {
        const val = item[key];
        return seen.has(val) ? false : seen.add(val);
      });
    },

    // Agrupar por propiedad
    groupBy: (arr, key) => {
      return arr.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
      }, {});
    },

    // Ordenar por propiedad
    sortBy: (arr, key, direction = 'asc') => {
      return [...arr].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (direction === 'desc') {
          return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });
    },

    // Paginar array
    paginate: (arr, page = 1, limit = 10) => {
      const start = (page - 1) * limit;
      const end = start + limit;
      return {
        data: arr.slice(start, end),
        totalPages: Math.ceil(arr.length / limit),
        currentPage: page,
        hasNext: end < arr.length,
        hasPrev: page > 1
      };
    }
  },

  // === URL/QUERY UTILITIES ===
  url: {
    // Obtener parámetros de URL
    getParams: (url = window.location.href) => {
      try {
        const urlObj = new URL(url);
        const params = {};
        urlObj.searchParams.forEach((value, key) => {
          params[key] = value;
        });
        return params;
      } catch (error) {
        return {};
      }
    },

    // Actualizar parámetro de URL
    updateParam: (key, value) => {
      if (!window.history?.replaceState) return;
      
      const url = new URL(window.location);
      if (value === null || value === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
      
      window.history.replaceState({}, '', url);
    },

    // Construir query string
    buildQuery: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    }
  },

  // === PERFORMANCE UTILITIES ===
  perf: {
    // Medir performance de función
    measure: async (fn, label = 'function') => {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      console.log(`${label} took ${end - start} milliseconds`);
      return result;
    },

    // Crear una única instancia (singleton pattern)
    once: (fn) => {
      let called = false;
      let result;
      return (...args) => {
        if (!called) {
          called = true;
          result = fn(...args);
        }
        return result;
      };
    },

    // Memoización simple
    memoize: (fn) => {
      const cache = new Map();
      return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
          return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
      };
    }
  },

  // === RANDOM UTILITIES ===
  random: {
    // Número random en rango
    number: (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Elemento random de array
    element: (arr) => {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    // ID único simple
    id: (prefix = 'id') => {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Color hex random
    color: () => {
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
  },

  // === EVENT UTILITIES ===
  events: {
    // Event listener con cleanup automático
    listen: (element, event, handler, options = {}) => {
      if (!element) return null;
      
      element.addEventListener(event, handler, options);
      
      return () => {
        element.removeEventListener(event, handler, options);
      };
    },

    // Event listener una sola vez
    once: (element, event, handler, options = {}) => {
      return Utils.events.listen(element, event, handler, { ...options, once: true });
    },

    // Evento personalizado
    emit: (element, eventName, detail = {}) => {
      if (!element) return false;
      
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true
      });
      
      return element.dispatchEvent(event);
    }
  },

  // === FEATURE DETECTION ===
  support: {
    localStorage: (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),

    webgl: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),

    serviceWorker: 'serviceWorker' in navigator,
    
    intersectionObserver: 'IntersectionObserver' in window,
    
    webAnimations: 'animate' in document.createElement('div')
  },

  // === ERROR HANDLING ===
  error: {
    // Wrapper para try-catch
    safe: (fn, fallback = null) => {
      try {
        return fn();
      } catch (error) {
        console.warn('Safe execution failed:', error);
        return fallback;
      }
    },

    // Async wrapper
    safeAsync: async (fn, fallback = null) => {
      try {
        return await fn();
      } catch (error) {
        console.warn('Safe async execution failed:', error);
        return fallback;
      }
    },

    // Log de errores con contexto
    log: (error, context = {}) => {
      console.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
  }
};

// ===== EXPORT TO GLOBAL NAMESPACE =====
window.BugsMillion.Utils = Utils;

// ===== INITIALIZATION LOG =====
console.log('🛠️ Utils module loaded:', {
  features: Object.keys(Utils),
  support: Utils.support
});