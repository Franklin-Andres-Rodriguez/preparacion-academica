/*
  ==========================================
  APPLICATION UTILITIES - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Utility library following Single Responsibility and DRY principles.
  Provides reusable functions for DOM manipulation, data processing, validation, and debugging.
  
  Archivo: assets/js/utils.js
  
  "The secret of getting ahead is getting started" - Mark Twain
  "Code reuse is the Holy Grail of software engineering" - Douglas Crockford
  "Every function should do one thing and do it well" - Robert C. Martin
  
  Architecture:
  1. DOM Utilities (Martin Fowler's separation of concerns)
  2. Data Processing (Martin Kleppmann's systematic approach)  
  3. Validation & Sanitization (Security-first design)
  4. Educational Tools (Ian Sommerville's learning scaffolds)
  5. Performance Utilities (Kent C. Dodds' optimization patterns)
  6. Debugging Helpers (Brian Holt's transparent development)
*/

(() => {
  'use strict';

  /*
    ==========================================
    UTILITIES CONTROLLER
    ==========================================
  */

  window.AppUtils = {
    /*
      ==========================================
      DOM UTILITIES - Following Kent C. Dodds' patterns
      ==========================================
    */

    dom: {
      // Safe element selection with error handling
      $(selector, context = document) {
        try {
          const element = context.querySelector(selector);
          if (!element && window.AppConfig?.isDebugEnabled()) {
            console.warn(`[AppUtils.dom] Element not found: ${selector}`);
          }
          return element;
        } catch (error) {
          console.error(`[AppUtils.dom] Invalid selector: ${selector}`, error);
          return null;
        }
      },

      // Select multiple elements with validation
      $$(selector, context = document) {
        try {
          return Array.from(context.querySelectorAll(selector));
        } catch (error) {
          console.error(
            `[AppUtils.dom] Invalid selector for multiple: ${selector}`,
            error
          );
          return [];
        }
      },

      // Create element with attributes and content (React-like approach)
      createElement(tag, attributes = {}, ...children) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
          if (key === 'className') {
            element.className = value;
          } else if (key === 'textContent') {
            element.textContent = value;
          } else if (key === 'innerHTML') {
            // Sanitize before setting innerHTML
            element.innerHTML = this.sanitizeHtml(value);
          } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
          } else if (key.startsWith('aria-')) {
            element.setAttribute(key, value);
          } else if (key === 'role') {
            element.setAttribute('role', value);
          } else {
            element[key] = value;
          }
        });

        children.forEach((child) => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            element.appendChild(child);
          }
        });

        return element;
      },

      // Safe HTML sanitization (preventing XSS)
      sanitizeHtml(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = htmlString;
        return tempDiv.innerHTML;
      },

      // Add/remove classes with animation support
      addClass(element, className, animationDuration = 0) {
        if (!element || !className) return;

        element.classList.add(className);

        if (animationDuration > 0) {
          setTimeout(() => {
            element.classList.add(`${className}--animated`);
          }, 10);
        }
      },

      removeClass(element, className, animationDuration = 0) {
        if (!element || !className) return;

        if (animationDuration > 0) {
          element.classList.add(`${className}--removing`);
          setTimeout(() => {
            element.classList.remove(className, `${className}--removing`);
          }, animationDuration);
        } else {
          element.classList.remove(className);
        }
      },

      // Toggle visibility with accessibility
      toggleVisibility(element, visible = null) {
        if (!element) return;

        const isVisible =
          visible !== null ? visible : element.style.display === 'none';

        element.style.display = isVisible ? '' : 'none';
        element.setAttribute('aria-hidden', (!isVisible).toString());

        return isVisible;
      },

      // Smooth scroll with reduced motion respect
      smoothScrollTo(target, options = {}) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';

        element.scrollIntoView({
          behavior,
          block: options.block || 'start',
          inline: options.inline || 'nearest',
        });
      },

      // Debounced event listener (performance optimization)
      addDebouncedListener(element, event, handler, delay = 250) {
        if (!element || !event || !handler) return;

        const debouncedHandler = this.debounce(handler, delay);
        element.addEventListener(event, debouncedHandler);

        return () => element.removeEventListener(event, debouncedHandler);
      },

      // Intersection Observer wrapper for lazy loading
      observeIntersection(elements, callback, options = {}) {
        if (!('IntersectionObserver' in window)) {
          // Fallback for browsers without support
          elements.forEach(callback);
          return;
        }

        const observer = new IntersectionObserver(callback, {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '50px',
        });

        elements.forEach((el) => observer.observe(el));
        return observer;
      },
    },

    /*
      ==========================================
      DATA PROCESSING - Martin Kleppmann's systematic approach
      ==========================================
    */

    data: {
      // Deep clone (avoiding JSON limitations)
      deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array)
          return obj.map((item) => this.deepClone(item));
        if (obj instanceof Object) {
          const cloned = {};
          Object.keys(obj).forEach((key) => {
            cloned[key] = this.deepClone(obj[key]);
          });
          return cloned;
        }
      },

      // Deep merge objects (immutable)
      deepMerge(target, ...sources) {
        if (!sources.length) return target;

        const result = this.deepClone(target);

        sources.forEach((source) => {
          if (source && typeof source === 'object') {
            Object.keys(source).forEach((key) => {
              if (
                source[key] &&
                typeof source[key] === 'object' &&
                !Array.isArray(source[key])
              ) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
              } else {
                result[key] = source[key];
              }
            });
          }
        });

        return result;
      },

      // Array utilities following functional programming principles
      groupBy(array, keyFn) {
        if (!Array.isArray(array)) return {};

        return array.reduce((groups, item) => {
          const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
          groups[key] = groups[key] || [];
          groups[key].push(item);
          return groups;
        }, {});
      },

      sortBy(array, keyFn, direction = 'asc') {
        if (!Array.isArray(array)) return [];

        return [...array].sort((a, b) => {
          const aVal = typeof keyFn === 'function' ? keyFn(a) : a[keyFn];
          const bVal = typeof keyFn === 'function' ? keyFn(b) : b[keyFn];

          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      },

      unique(array, keyFn = null) {
        if (!Array.isArray(array)) return [];

        if (keyFn) {
          const seen = new Set();
          return array.filter((item) => {
            const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }

        return [...new Set(array)];
      },

      // Statistical utilities for learning analytics
      calculateStats(numbers) {
        if (!Array.isArray(numbers) || numbers.length === 0) {
          return { count: 0, sum: 0, mean: 0, median: 0, min: 0, max: 0 };
        }

        const sorted = [...numbers].sort((a, b) => a - b);
        const count = numbers.length;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        const mean = sum / count;
        const median =
          count % 2 === 0
            ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
            : sorted[Math.floor(count / 2)];

        return {
          count,
          sum,
          mean: Math.round(mean * 100) / 100,
          median,
          min: sorted[0],
          max: sorted[sorted.length - 1],
          range: sorted[sorted.length - 1] - sorted[0],
        };
      },

      // Get nested object value safely
      getNestedValue(obj, path, defaultValue = null) {
        const keys = path.split('.');
        let result = obj;

        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key];
          } else {
            return defaultValue;
          }
        }

        return result;
      },
    },

    /*
      ==========================================
      VALIDATION & SANITIZATION - Security-first design
      ==========================================
    */

    validate: {
      // Type checking utilities
      isString(value) {
        return typeof value === 'string';
      },
      isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
      },
      isBoolean(value) {
        return typeof value === 'boolean';
      },
      isArray(value) {
        return Array.isArray(value);
      },
      isObject(value) {
        return (
          value !== null && typeof value === 'object' && !Array.isArray(value)
        );
      },
      isFunction(value) {
        return typeof value === 'function';
      },
      isDate(value) {
        return value instanceof Date && !isNaN(value);
      },

      // Educational content validation
      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.isString(email) && emailRegex.test(email);
      },

      isValidUrl(url) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },

      // Code validation for educational exercises
      isValidJavaScript(code) {
        try {
          new Function(code);
          return { valid: true, error: null };
        } catch (error) {
          return { valid: false, error: error.message };
        }
      },

      // Range validation for educational parameters
      isInRange(value, min, max) {
        return this.isNumber(value) && value >= min && value <= max;
      },

      // Educational content sanitization
      sanitizeUserInput(input, options = {}) {
        if (!this.isString(input)) return '';

        let sanitized = input.trim();

        if (options.maxLength) {
          sanitized = sanitized.substring(0, options.maxLength);
        }

        if (options.removeHtml) {
          sanitized = sanitized.replace(/<[^>]*>/g, '');
        }

        if (options.removeScripts) {
          sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
        }

        return sanitized;
      },
    },

    /*
      ==========================================
      EDUCATIONAL TOOLS - Ian Sommerville's learning scaffolds
      ==========================================
    */

    education: {
      // Progress calculation with competency mapping
      calculateProgress(completed, total, weights = null) {
        if (
          !this.validate.isNumber(completed) ||
          !this.validate.isNumber(total) ||
          total === 0
        ) {
          return { percentage: 0, level: 'beginner', completedItems: 0 };
        }

        const percentage = Math.round((completed / total) * 100);

        let level = 'beginner';
        if (percentage >= 80) level = 'expert';
        else if (percentage >= 60) level = 'intermediate';
        else if (percentage >= 30) level = 'developing';

        return {
          percentage: Math.min(percentage, 100),
          level,
          completedItems: completed,
          totalItems: total,
          remaining: total - completed,
        };
      },

      // Learning analytics following educational data mining principles
      calculateLearningVelocity(sessions) {
        if (!this.validate.isArray(sessions) || sessions.length < 2) {
          return {
            velocity: 0,
            trend: 'insufficient_data',
            recommendation: 'complete_more_sessions',
          };
        }

        const recentSessions = sessions.slice(-5); // Last 5 sessions
        const timeSpent = recentSessions.map((s) => s.duration || 0);
        const progress = recentSessions.map((s) => s.progress || 0);

        const avgTime = timeSpent.reduce((a, b) => a + b, 0) / timeSpent.length;
        const avgProgress =
          progress.reduce((a, b) => a + b, 0) / progress.length;

        const velocity = avgProgress / Math.max(avgTime, 1); // Progress per minute

        let trend = 'stable';
        let recommendation = 'continue_current_pace';

        if (velocity > 2) {
          trend = 'accelerating';
          recommendation = 'consider_advanced_topics';
        } else if (velocity < 0.5) {
          trend = 'slowing';
          recommendation = 'review_fundamentals';
        }

        return {
          velocity: Math.round(velocity * 100) / 100,
          trend,
          recommendation,
          avgSessionTime: Math.round(avgTime),
          avgProgress: Math.round(avgProgress),
        };
      },

      // Competency assessment (Bloom's Taxonomy integration)
      assessCompetency(responses, correctAnswers, bloomsLevels = []) {
        if (
          !this.validate.isArray(responses) ||
          !this.validate.isArray(correctAnswers)
        ) {
          return { score: 0, competencyLevel: 'novice', feedback: [] };
        }

        const results = responses.map((response, index) => ({
          correct: response === correctAnswers[index],
          bloomsLevel: bloomsLevels[index] || 'remember',
          response,
          expected: correctAnswers[index],
        }));

        const totalScore = results.filter((r) => r.correct).length;
        const percentage = (totalScore / responses.length) * 100;

        // Competency levels based on educational psychology
        let competencyLevel = 'novice';
        if (percentage >= 90) competencyLevel = 'expert';
        else if (percentage >= 75) competencyLevel = 'proficient';
        else if (percentage >= 60) competencyLevel = 'developing';
        else if (percentage >= 40) competencyLevel = 'beginning';

        const feedback = this.generateLearningFeedback(results, percentage);

        return {
          score: totalScore,
          percentage: Math.round(percentage),
          competencyLevel,
          feedback,
          bloomsAnalysis: this.analyzeBloomsLevels(results),
        };
      },

      generateLearningFeedback(results, percentage) {
        const feedback = [];

        if (percentage >= 90) {
          feedback.push(
            '🎉 Excelente dominio! Considera avanzar al siguiente nivel.'
          );
        } else if (percentage >= 75) {
          feedback.push('👍 Buen progreso. Refina algunos conceptos clave.');
        } else if (percentage >= 60) {
          feedback.push(
            '📚 En desarrollo. Practica más los conceptos fundamentales.'
          );
        } else {
          feedback.push('🔄 Necesitas más práctica. Revisa el material base.');
        }

        // Specific feedback based on error patterns
        const incorrectAnswers = results.filter((r) => !r.correct);
        if (incorrectAnswers.length > 0) {
          const bloomsErrors = this.data.groupBy(
            incorrectAnswers,
            'bloomsLevel'
          );
          Object.keys(bloomsErrors).forEach((level) => {
            feedback.push(
              `💡 Refuerza habilidades de ${level}: ${bloomsErrors[level].length} errores`
            );
          });
        }

        return feedback;
      },

      analyzeBloomsLevels(results) {
        const bloomsLevels = [
          'remember',
          'understand',
          'apply',
          'analyze',
          'evaluate',
          'create',
        ];
        const analysis = {};

        bloomsLevels.forEach((level) => {
          const levelResults = results.filter((r) => r.bloomsLevel === level);
          if (levelResults.length > 0) {
            const correct = levelResults.filter((r) => r.correct).length;
            analysis[level] = {
              total: levelResults.length,
              correct,
              percentage: Math.round((correct / levelResults.length) * 100),
            };
          }
        });

        return analysis;
      },
    },

    /*
      ==========================================
      PERFORMANCE UTILITIES - Kent C. Dodds' optimization patterns
      ==========================================
    */

    performance: {
      // Debouncing for performance optimization
      debounce(func, delay) {
        let timeoutId;
        return function (...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
      },

      // Throttling for scroll/resize events
      throttle(func, limit) {
        let inThrottle;
        return function (...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
          }
        };
      },

      // Memoization for expensive calculations
      memoize(func, keyGenerator = null) {
        const cache = new Map();

        return function (...args) {
          const key = keyGenerator ? keyGenerator(args) : JSON.stringify(args);

          if (cache.has(key)) {
            return cache.get(key);
          }

          const result = func.apply(this, args);
          cache.set(key, result);
          return result;
        };
      },

      // Performance measurement wrapper
      measurePerformance(name, func) {
        return function (...args) {
          const start = performance.now();
          const result = func.apply(this, args);
          const end = performance.now();

          if (window.AppConfig?.isDebugEnabled()) {
            console.log(`[Performance] ${name}: ${Math.round(end - start)}ms`);
          }

          return result;
        };
      },

      // Memory-efficient pagination
      createPaginator(items, pageSize = 10) {
        const totalPages = Math.ceil(items.length / pageSize);

        return {
          totalItems: items.length,
          totalPages,
          pageSize,

          getPage(pageNumber) {
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            return {
              items: items.slice(startIndex, endIndex),
              pageNumber,
              hasNext: pageNumber < totalPages,
              hasPrevious: pageNumber > 1,
              isFirst: pageNumber === 1,
              isLast: pageNumber === totalPages,
            };
          },
        };
      },
    },

    /*
      ==========================================
      DEBUGGING HELPERS - Brian Holt's transparent development
      ==========================================
    */

    debug: {
      // Comprehensive logging system
      log(level, ...args) {
        if (!window.AppConfig?.isDebugEnabled()) return;

        const timestamp = new Date().toISOString().substring(11, 23);
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        switch (level) {
          case 'error':
            console.error(prefix, ...args);
            break;
          case 'warn':
            console.warn(prefix, ...args);
            break;
          case 'info':
            console.info(prefix, ...args);
            break;
          default:
            console.log(prefix, ...args);
        }
      },

      // Object inspection helper
      inspect(obj, maxDepth = 3, currentDepth = 0) {
        if (currentDepth >= maxDepth) return '[Max Depth Reached]';
        if (obj === null) return 'null';
        if (obj === undefined) return 'undefined';

        const type = typeof obj;

        if (type === 'function') {
          return `[Function: ${obj.name || 'anonymous'}]`;
        }

        if (type !== 'object') {
          return obj;
        }

        if (Array.isArray(obj)) {
          return obj.map((item) =>
            this.inspect(item, maxDepth, currentDepth + 1)
          );
        }

        const inspected = {};
        Object.keys(obj).forEach((key) => {
          inspected[key] = this.inspect(obj[key], maxDepth, currentDepth + 1);
        });

        return inspected;
      },

      // Performance monitoring for debugging
      startTimer(label) {
        const timers = this.timers || (this.timers = new Map());
        timers.set(label, performance.now());
      },

      endTimer(label) {
        const timers = this.timers || (this.timers = new Map());
        const start = timers.get(label);

        if (start) {
          const duration = performance.now() - start;
          this.log('debug', `Timer [${label}]: ${Math.round(duration)}ms`);
          timers.delete(label);
          return duration;
        }

        this.log('warn', `Timer [${label}] not found`);
        return null;
      },

      // Memory usage monitoring
      getMemoryUsage() {
        if ('memory' in performance) {
          const memory = performance.memory;
          return {
            used: Math.round(memory.usedJSHeapSize / 1048576), // MB
            total: Math.round(memory.totalJSHeapSize / 1048576), // MB
            limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
          };
        }
        return { message: 'Memory API not supported' };
      },
    },

    /*
      ==========================================
      FORMAT & DISPLAY UTILITIES
      ==========================================
    */

    format: {
      // Educational formatting for different contexts
      currency(amount, currency = 'USD') {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency,
        }).format(amount);
      },

      number(num, decimals = 0) {
        return new Intl.NumberFormat('es-ES', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(num);
      },

      percentage(value, decimals = 1) {
        return new Intl.NumberFormat('es-ES', {
          style: 'percent',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value / 100);
      },

      date(date, options = {}) {
        const defaultOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        return new Intl.DateTimeFormat('es-ES', {
          ...defaultOptions,
          ...options,
        }).format(date);
      },

      duration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
          return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
          return `${minutes}m ${seconds % 60}s`;
        } else {
          return `${seconds}s`;
        }
      },

      // Code formatting for educational content
      highlightSyntax(code, language = 'javascript') {
        // Simplified syntax highlighting for educational purposes
        const keywords = [
          'function',
          'const',
          'let',
          'var',
          'if',
          'else',
          'for',
          'while',
          'return',
          'class',
          'extends',
        ];
        let highlighted = code;

        keywords.forEach((keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          highlighted = highlighted.replace(
            regex,
            `<span class="syntax-keyword">${keyword}</span>`
          );
        });

        return highlighted;
      },
    },

    /*
      ==========================================
      STORAGE UTILITIES
      ==========================================
    */

    storage: {
      // Safe localStorage wrapper with error handling
      set(key, value, expiry = null) {
        try {
          const item = {
            value,
            timestamp: Date.now(),
            expiry: expiry ? Date.now() + expiry : null,
          };

          localStorage.setItem(`mdb_${key}`, JSON.stringify(item));
          return true;
        } catch (error) {
          console.warn('[AppUtils.storage] Failed to set item:', error);
          return false;
        }
      },

      get(key, defaultValue = null) {
        try {
          const item = localStorage.getItem(`mdb_${key}`);
          if (!item) return defaultValue;

          const parsed = JSON.parse(item);

          // Check expiry
          if (parsed.expiry && Date.now() > parsed.expiry) {
            this.remove(key);
            return defaultValue;
          }

          return parsed.value;
        } catch (error) {
          console.warn('[AppUtils.storage] Failed to get item:', error);
          return defaultValue;
        }
      },

      remove(key) {
        try {
          localStorage.removeItem(`mdb_${key}`);
          return true;
        } catch (error) {
          console.warn('[AppUtils.storage] Failed to remove item:', error);
          return false;
        }
      },

      clear() {
        try {
          const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith('mdb_')
          );
          keys.forEach((key) => localStorage.removeItem(key));
          return true;
        } catch (error) {
          console.warn('[AppUtils.storage] Failed to clear storage:', error);
          return false;
        }
      },
    },

    /*
      ==========================================
      INITIALIZATION
      ==========================================
    */

    init() {
      // Initialize utility systems
      this.debug.log('info', 'AppUtils initialized');

      // Set up performance monitoring if enabled
      if (window.AppConfig?.isDebugEnabled()) {
        this.setupPerformanceMonitoring();
      }

      return this;
    },

    setupPerformanceMonitoring() {
      // Monitor long tasks
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 50) {
                // Long task > 50ms
                this.debug.log(
                  'warn',
                  `Long task detected: ${Math.round(entry.duration)}ms`
                );
              }
            });
          });

          observer.observe({ entryTypes: ['longtask'] });
        } catch (error) {
          this.debug.log('warn', 'Performance monitoring setup failed:', error);
        }
      }
    },
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.AppUtils.init();
    });
  } else {
    window.AppUtils.init();
  }
})();
