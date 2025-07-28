/*
  ==========================================
  UTILITY FUNCTIONS - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Pure utility functions following Robert C. Martin's Clean Code principles,
  Kent C. Dodds' testing-focused development, and Martin Fowler's refactoring practices.
  
  "Functions should do one thing. They should do it well. They should do it only." - Robert C. Martin
  "Small functions are easier to test, easier to understand, and easier to reuse." - Kent Beck
  "The best code is no code at all. The second best is pure functions." - Kent C. Dodds
  
  Philosophy:
  1. Pure Functions - No side effects, predictable outputs
  2. Single Responsibility - Each function has one clear purpose
  3. Immutability - Original data is never modified
  4. Composability - Small functions combine into powerful operations
  5. Testability - Every function can be unit tested independently
  6. Educational Value - Code teaches best practices while functioning
*/

/**
 * @fileoverview Educational utility functions following software engineering excellence
 * Synthesizing wisdom from Ian Sommerville, Robert C. Martin, Kent C. Dodds, and Martin Fowler
 */

// ==========================================
// DATA VALIDATION & TYPE CHECKING
// Following Robert C. Martin's defensive programming principles
// ==========================================

/**
 * Validates if a value is a non-empty string
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a non-empty string
 * @example
 * isValidString("hello") // true
 * isValidString("") // false
 * isValidString(null) // false
 */
const isValidString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates if a value is a positive number
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a positive number
 * @example
 * isPositiveNumber(42) // true
 * isPositiveNumber(-5) // false
 * isPositiveNumber("10") // false
 */
const isPositiveNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Validates if a value is a valid learning stage
 * @param {*} stage - Stage to validate
 * @returns {boolean} True if stage is valid
 * @example
 * isValidStage("beginner") // true
 * isValidStage("invalid") // false
 */
const isValidStage = (stage) => {
  const validStages = ['beginner', 'intermediate', 'expert', 'master'];
  return isValidString(stage) && validStages.includes(stage.toLowerCase());
};

/**
 * Validates if an object has required properties
 * Following Kent C. Dodds' defensive coding practices
 * @param {Object} obj - Object to validate
 * @param {string[]} requiredProps - Array of required property names
 * @returns {boolean} True if object has all required properties
 * @example
 * hasRequiredProps({name: "John", age: 30}, ["name", "age"]) // true
 * hasRequiredProps({name: "John"}, ["name", "age"]) // false
 */
const hasRequiredProps = (obj, requiredProps) => {
  if (!obj || typeof obj !== 'object') return false;
  return requiredProps.every(prop => obj.hasOwnProperty(prop) && obj[prop] !== undefined);
};

// ==========================================
// MATHEMATICAL UTILITIES
// Following Jonas Schmedtmann's precision-focused approach
// ==========================================

/**
 * Safely adds two numbers with precision handling
 * Prevents floating-point arithmetic errors common in financial calculations
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} [precision=2] - Decimal places for result
 * @returns {number} Sum with specified precision
 * @example
 * safeAdd(0.1, 0.2) // 0.3 (not 0.30000000000000004)
 * safeAdd(1.005, 2.004, 3) // 3.009
 */
const safeAdd = (a, b, precision = 2) => {
  if (!isPositiveNumber(a) && a !== 0) throw new Error('First argument must be a number');
  if (!isPositiveNumber(b) && b !== 0) throw new Error('Second argument must be a number');
  
  const result = Number(a) + Number(b);
  return Number(result.toFixed(precision));
};

/**
 * Safely multiplies two numbers with precision handling
 * Critical for financial calculations to prevent precision loss
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} [precision=2] - Decimal places for result
 * @returns {number} Product with specified precision
 * @example
 * safeMultiply(0.1, 3) // 0.3 (not 0.30000000000000004)
 * safeMultiply(100.5, 0.15, 2) // 15.08
 */
const safeMultiply = (a, b, precision = 2) => {
  if (!isPositiveNumber(a) && a !== 0) throw new Error('First argument must be a number');
  if (!isPositiveNumber(b) && b !== 0) throw new Error('Second argument must be a number');
  
  const result = Number(a) * Number(b);
  return Number(result.toFixed(precision));
};

/**
 * Calculates percentage with safe precision
 * @param {number} value - Value to calculate percentage of
 * @param {number} total - Total value (100% reference)
 * @param {number} [precision=1] - Decimal places for result
 * @returns {number} Percentage with specified precision
 * @example
 * calculatePercentage(25, 100) // 25.0
 * calculatePercentage(1, 3, 2) // 33.33
 */
const calculatePercentage = (value, total, precision = 1) => {
  if (!isPositiveNumber(value) && value !== 0) throw new Error('Value must be a number');
  if (!isPositiveNumber(total)) throw new Error('Total must be a positive number');
  
  if (total === 0) return 0;
  const percentage = (Number(value) / Number(total)) * 100;
  return Number(percentage.toFixed(precision));
};

/**
 * Clamps a number between minimum and maximum values
 * Following Martin Fowler's boundary management patterns
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50, 0, 100) // 50
 */
const clamp = (value, min, max) => {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('All arguments must be numbers');
  }
  if (min > max) throw new Error('Minimum value cannot be greater than maximum value');
  
  return Math.min(Math.max(value, min), max);
};

// ==========================================
// STRING MANIPULATION
// Following Brad Traversy's practical utility approach
// ==========================================

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} String with first letter capitalized
 * @example
 * capitalize("hello world") // "Hello world"
 * capitalize("jAVASCRIPT") // "Javascript"
 */
const capitalize = (str) => {
  if (!isValidString(str)) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts string to title case
 * @param {string} str - String to convert
 * @returns {string} String in title case
 * @example
 * toTitleCase("hello world") // "Hello World"
 * toTitleCase("the quick BROWN fox") // "The Quick Brown Fox"
 */
const toTitleCase = (str) => {
  if (!isValidString(str)) return str;
  return str.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncates string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} [suffix='...'] - Suffix to add when truncated
 * @returns {string} Truncated string
 * @example
 * truncateString("This is a very long string", 10) // "This is a..."
 * truncateString("Short", 10) // "Short"
 */
const truncateString = (str, maxLength, suffix = '...') => {
  if (!isValidString(str)) return str;
  if (!isPositiveNumber(maxLength)) throw new Error('maxLength must be a positive number');
  
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Generates a URL-friendly slug from a string
 * Following web development best practices
 * @param {string} str - String to convert to slug
 * @returns {string} URL-friendly slug
 * @example
 * slugify("Hello World! How are you?") // "hello-world-how-are-you"
 * slugify("JavaScript & Node.js") // "javascript-nodejs"
 */
const slugify = (str) => {
  if (!isValidString(str)) return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// ==========================================
// ARRAY MANIPULATION
// Following functional programming principles from Martin Fowler
// ==========================================

/**
 * Safely gets an item from array by index
 * @param {Array} arr - Array to access
 * @param {number} index - Index to access
 * @param {*} [defaultValue=null] - Default value if index is invalid
 * @returns {*} Item at index or default value
 * @example
 * safeArrayAccess([1, 2, 3], 1) // 2
 * safeArrayAccess([1, 2, 3], 10, "default") // "default"
 */
const safeArrayAccess = (arr, index, defaultValue = null) => {
  if (!Array.isArray(arr)) return defaultValue;
  if (!Number.isInteger(index) || index < 0 || index >= arr.length) return defaultValue;
  return arr[index];
};

/**
 * Removes duplicates from array while preserving order
 * @param {Array} arr - Array to deduplicate
 * @returns {Array} Array with duplicates removed
 * @example
 * removeDuplicates([1, 2, 2, 3, 1, 4]) // [1, 2, 3, 4]
 * removeDuplicates(["a", "b", "a", "c"]) // ["a", "b", "c"]
 */
const removeDuplicates = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr)];
};

/**
 * Chunks array into smaller arrays of specified size
 * Following Martin Fowler's collection patterns
 * @param {Array} arr - Array to chunk
 * @param {number} size - Size of each chunk
 * @returns {Array} Array of chunks
 * @example
 * chunkArray([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunkArray(["a", "b", "c", "d"], 3) // [["a", "b", "c"], ["d"]]
 */
const chunkArray = (arr, size) => {
  if (!Array.isArray(arr)) return [];
  if (!isPositiveNumber(size)) throw new Error('Chunk size must be a positive number');
  
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Finds intersection of two arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Array containing elements present in both arrays
 * @example
 * arrayIntersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 * arrayIntersection(["a", "b"], ["b", "c"]) // ["b"]
 */
const arrayIntersection = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
  return arr1.filter(item => arr2.includes(item));
};

// ==========================================
// OBJECT MANIPULATION
// Following Kent C. Dodds' immutability principles
// ==========================================

/**
 * Deep clones an object or array
 * @param {*} obj - Object to clone
 * @returns {*} Deep clone of the object
 * @example
 * deepClone({a: {b: 1}}) // {a: {b: 1}} (new object)
 * deepClone([1, [2, 3]]) // [1, [2, 3]] (new array)
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
};

/**
 * Safely gets nested property from object
 * @param {Object} obj - Object to access
 * @param {string} path - Dot-notation path to property
 * @param {*} [defaultValue=undefined] - Default value if path doesn't exist
 * @returns {*} Value at path or default value
 * @example
 * getNestedProperty({user: {name: "John"}}, "user.name") // "John"
 * getNestedProperty({}, "user.name", "Unknown") // "Unknown"
 */
const getNestedProperty = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  if (!isValidString(path)) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
};

/**
 * Sets nested property in object immutably
 * @param {Object} obj - Object to update
 * @param {string} path - Dot-notation path to property
 * @param {*} value - Value to set
 * @returns {Object} New object with updated property
 * @example
 * setNestedProperty({}, "user.name", "John") // {user: {name: "John"}}
 * setNestedProperty({user: {age: 30}}, "user.name", "John") // {user: {age: 30, name: "John"}}
 */
const setNestedProperty = (obj, path, value) => {
  if (!obj || typeof obj !== 'object') throw new Error('Object must be a valid object');
  if (!isValidString(path)) throw new Error('Path must be a non-empty string');
  
  const clone = deepClone(obj);
  const keys = path.split('.');
  let current = clone;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return clone;
};

/**
 * Merges objects deeply without mutating originals
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects to merge
 * @returns {Object} New merged object
 * @example
 * deepMerge({a: 1}, {b: 2}, {c: 3}) // {a: 1, b: 2, c: 3}
 * deepMerge({a: {x: 1}}, {a: {y: 2}}) // {a: {x: 1, y: 2}}
 */
const deepMerge = (target, ...sources) => {
  if (!target || typeof target !== 'object') return {};
  
  let result = deepClone(target);
  
  sources.forEach(source => {
    if (source && typeof source === 'object') {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      });
    }
  });
  
  return result;
};

// ==========================================
// DATE & TIME UTILITIES
// Following Wes Bos's practical JavaScript approach
// ==========================================

/**
 * Formats date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} [locale='es-ES'] - Locale for formatting
 * @returns {string} Formatted date string
 * @example
 * formatDate(new Date()) // "27 de julio de 2025"
 * formatDate("2025-07-27") // "27 de julio de 2025"
 */
const formatDate = (date, locale = 'es-ES') => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Gets time difference in human-readable format
 * @param {Date|string|number} date - Date to compare
 * @param {Date|string|number} [baseDate=now] - Base date for comparison
 * @returns {string} Human-readable time difference
 * @example
 * getTimeAgo(new Date(Date.now() - 3600000)) // "hace 1 hora"
 * getTimeAgo("2025-07-26") // "hace 1 día"
 */
const getTimeAgo = (date, baseDate = new Date()) => {
  const dateObj = new Date(date);
  const baseObj = new Date(baseDate);
  
  if (isNaN(dateObj.getTime()) || isNaN(baseObj.getTime())) return 'Fecha inválida';
  
  const diffMs = baseObj.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffMinutes > 0) return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  return 'hace un momento';
};

/**
 * Calculates duration between two dates
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date
 * @returns {Object} Duration object with days, hours, minutes, seconds
 * @example
 * calculateDuration("2025-07-27T10:00:00", "2025-07-27T12:30:00")
 * // {days: 0, hours: 2, minutes: 30, seconds: 0}
 */
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  const diffMs = Math.abs(end.getTime() - start.getTime());
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

// ==========================================
// EDUCATIONAL SPECIFIC UTILITIES
// Following Ian Sommerville's systematic software engineering approach
// ==========================================

/**
 * Calculates learning progress based on completed projects
 * @param {string[]} completedProjects - Array of completed project IDs
 * @param {Object} allProjects - Object containing all available projects
 * @returns {Object} Progress statistics
 * @example
 * calculateProgress(["naming", "calculadora-interes"], EDUCATIONAL_PROJECTS)
 * // {percentage: 33.3, completedCount: 2, totalCount: 6, stage: "beginner"}
 */
const calculateProgress = (completedProjects, allProjects) => {
  if (!Array.isArray(completedProjects)) return { percentage: 0, completedCount: 0, totalCount: 0, stage: null };
  if (!allProjects || typeof allProjects !== 'object') return { percentage: 0, completedCount: 0, totalCount: 0, stage: null };
  
  const projectArray = Object.values(allProjects);
  const totalCount = projectArray.length;
  const completedCount = completedProjects.length;
  const percentage = calculatePercentage(completedCount, totalCount, 1);
  
  // Determine current stage based on completed projects
  const stages = ['beginner', 'intermediate', 'expert', 'master'];
  let currentStage = null;
  
  for (const stage of stages) {
    const stageProjects = projectArray.filter(project => project.stage === stage);
    const completedInStage = completedProjects.filter(projectId => 
      stageProjects.some(project => project.id === projectId)
    );
    
    if (completedInStage.length === stageProjects.length && stageProjects.length > 0) {
      currentStage = stage;
    } else if (completedInStage.length > 0) {
      currentStage = stage;
      break;
    }
  }
  
  return {
    percentage,
    completedCount,
    totalCount,
    currentStage,
    nextStage: currentStage ? getNextStage(currentStage) : 'beginner'
  };
};

/**
 * Gets the next learning stage
 * @param {string} currentStage - Current learning stage
 * @returns {string|null} Next stage or null if at master level
 * @example
 * getNextStage("beginner") // "intermediate"
 * getNextStage("master") // null
 */
const getNextStage = (currentStage) => {
  const stages = ['beginner', 'intermediate', 'expert', 'master'];
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex === -1 || currentIndex === stages.length - 1) return null;
  return stages[currentIndex + 1];
};

/**
 * Calculates total money saved from completed projects
 * @param {string[]} completedProjects - Array of completed project IDs
 * @param {Object} allProjects - Object containing all available projects
 * @returns {number} Total dollars saved
 * @example
 * calculateMoneySaved(["naming", "operador-coma"], EDUCATIONAL_PROJECTS) // 680000
 */
const calculateMoneySaved = (completedProjects, allProjects) => {
  if (!Array.isArray(completedProjects)) return 0;
  if (!allProjects || typeof allProjects !== 'object') return 0;
  
  return completedProjects.reduce((total, projectId) => {
    const project = Object.values(allProjects).find(p => p.id === projectId);
    return total + (project ? project.costInDollars : 0);
  }, 0);
};

/**
 * Formats monetary amounts for display
 * @param {number} amount - Amount to format
 * @param {string} [currency='USD'] - Currency code
 * @param {string} [locale='en-US'] - Locale for formatting
 * @returns {string} Formatted monetary amount
 * @example
 * formatMoney(2300000) // "$2,300,000"
 * formatMoney(180000) // "$180,000"
 */
const formatMoney = (amount, currency = 'USD', locale = 'en-US') => {
  if (!isPositiveNumber(amount) && amount !== 0) return '$0';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// ==========================================
// PERFORMANCE & DEBUGGING UTILITIES
// Following Kent C. Dodds' performance-conscious development
// ==========================================

/**
 * Debounces a function to prevent excessive calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 * debouncedSearch("query"); // Will only execute after 300ms of inactivity
 */
const debounce = (func, delay) => {
  if (typeof func !== 'function') throw new Error('First argument must be a function');
  if (!isPositiveNumber(delay)) throw new Error('Delay must be a positive number');
  
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttles a function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 * @example
 * const throttledScroll = throttle(onScrollFunction, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
const throttle = (func, limit) => {
  if (typeof func !== 'function') throw new Error('First argument must be a function');
  if (!isPositiveNumber(limit)) throw new Error('Limit must be a positive number');
  
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Measures execution time of a function
 * @param {Function} func - Function to measure
 * @param {...*} args - Arguments to pass to the function
 * @returns {Object} Result and execution time
 * @example
 * measureExecutionTime(expensiveFunction, arg1, arg2)
 * // {result: "function result", executionTime: 150.23}
 */
const measureExecutionTime = (func, ...args) => {
  if (typeof func !== 'function') throw new Error('First argument must be a function');
  
  const startTime = performance.now();
  const result = func(...args);
  const endTime = performance.now();
  const executionTime = Number((endTime - startTime).toFixed(2));
  
  return { result, executionTime };
};

// ==========================================
// ERROR HANDLING UTILITIES
// Following Robert C. Martin's error handling principles
// ==========================================

/**
 * Creates a standardized error object
 * @param {string} message - Error message
 * @param {string} [code='GENERAL_ERROR'] - Error code
 * @param {*} [details=null] - Additional error details
 * @returns {Object} Standardized error object
 * @example
 * createError("Invalid input", "VALIDATION_ERROR", {field: "email"})
 * // {message: "Invalid input", code: "VALIDATION_ERROR", details: {field: "email"}, timestamp: Date}
 */
const createError = (message, code = 'GENERAL_ERROR', details = null) => {
  return {
    message: isValidString(message) ? message : 'Unknown error occurred',
    code: isValidString(code) ? code.toUpperCase() : 'GENERAL_ERROR',
    details: details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Safely executes a function with error handling
 * @param {Function} func - Function to execute
 * @param {*} [defaultValue=null] - Default value if function throws
 * @param {...*} args - Arguments to pass to the function
 * @returns {*} Function result or default value
 * @example
 * safeExecute(JSON.parse, {}, '{"valid": "json"}') // {valid: "json"}
 * safeExecute(JSON.parse, {}, 'invalid json') // {}
 */
const safeExecute = (func, defaultValue = null, ...args) => {
  if (typeof func !== 'function') return defaultValue;
  
  try {
    return func(...args);
  } catch (error) {
    console.warn('Safe execution caught error:', error.message);
    return defaultValue;
  }
};

// ==========================================
// EXPORT UTILITIES
// Following ES6 module patterns and clean architecture
// ==========================================

/**
 * Browser environment - attach utilities to window for global access
 * Following Martin Fowler's configuration patterns
 */
if (typeof window !== 'undefined') {
  window.BugAcademyUtils = {
    // Validation
    isValidString,
    isPositiveNumber,
    isValidStage,
    hasRequiredProps,
    
    // Mathematics
    safeAdd,
    safeMultiply,
    calculatePercentage,
    clamp,
    
    // Strings
    capitalize,
    toTitleCase,
    truncateString,
    slugify,
    
    // Arrays
    safeArrayAccess,
    removeDuplicates,
    chunkArray,
    arrayIntersection,
    
    // Objects
    deepClone,
    getNestedProperty,
    setNestedProperty,
    deepMerge,
    
    // Dates
    formatDate,
    getTimeAgo,
    calculateDuration,
    
    // Educational
    calculateProgress,
    getNextStage,
    calculateMoneySaved,
    formatMoney,
    
    // Performance
    debounce,
    throttle,
    measureExecutionTime,
    
    // Error Handling
    createError,
    safeExecute
  };
}

/**
 * Node.js environment - standard module exports
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Validation utilities
    isValidString,
    isPositiveNumber,
    isValidStage,
    hasRequiredProps,
    
    // Mathematical utilities
    safeAdd,
    safeMultiply,
    calculatePercentage,
    clamp,
    
    // String utilities
    capitalize,
    toTitleCase,
    truncateString,
    slugify,
    
    // Array utilities
    safeArrayAccess,
    removeDuplicates,
    chunkArray,
    arrayIntersection,
    
    // Object utilities
    deepClone,
    getNestedProperty,
    setNestedProperty,
    deepMerge,
    
    // Date utilities
    formatDate,
    getTimeAgo,
    calculateDuration,
    
    // Educational utilities
    calculateProgress,
    getNextStage,
    calculateMoneySaved,
    formatMoney,
    
    // Performance utilities
    debounce,
    throttle,
    measureExecutionTime,
    
    // Error handling utilities
    createError,
    safeExecute
  };
}

/*
  ==========================================
  UTILITY SYSTEM COMPLETE
  ==========================================
  
  This utility library demonstrates:
  - Pure Functions: No side effects, predictable outputs for reliable testing
  - Single Responsibility: Each function has one clear, well-defined purpose
  - Immutability: Original data is never modified, new objects/arrays returned
  - Composability: Small, focused functions combine into powerful operations
  - Error Handling: Defensive programming with clear error messages
  - Performance: Efficient algorithms with debouncing and throttling support
  - Educational Value: Code structure teaches best practices while functioning
  - Type Safety: JSDoc annotations for IDE support and self-documentation
  
  Following collective wisdom from:
  - Robert C. Martin: Clean Code principles and Single Responsibility
  - Kent C. Dodds: Pure functions, testing-focused development
  - Martin Fowler: Refactoring patterns and evolutionary design
  - Kent Beck: Simple Design rules and defensive programming
  - Jonas Schmedtmann: Theory-practice integration and precision
  - Brad Traversy: Practical utility patterns for real projects
  - Ian Sommerville: Systematic software engineering education
  - Sarah Drasner: Performance-conscious and accessible development
  
  Next: state.js will provide learning progress management and persistence
*/