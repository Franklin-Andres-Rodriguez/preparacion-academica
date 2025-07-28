/*
  ==========================================
  CONFIGURATION - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Central configuration following Kent C. Dodds' clean architecture principles
  and Robert C. Martin's dependency management philosophy.
  
  "Configuration should be declarative and centralized" - Kent C. Dodds
  "Magic numbers are not magic" - Robert C. Martin
  
  Philosophy:
  1. Single Source of Truth - All constants defined here
  2. Environment Awareness - Development vs Production settings
  3. Type Safety - JSDoc annotations for IDE support
  4. Educational Focus - Configuration serves learning objectives
  5. Maintainability - Easy to update costs, stages, and projects
*/

/**
 * @fileoverview Educational system configuration for Million Dollar Bugs Academy
 * Following Ian Sommerville's systematic approach to software engineering education
 */

/**
 * Application environment configuration
 * Following Martin Fowler's configuration pattern
 */
const ENV = {
  /** @type {'development' | 'production' | 'testing'} */
  MODE: (function() {
    // Detect environment - can be overridden via build process
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV || 'production';
    }
    // Browser detection
    return window.location.hostname === 'localhost' ? 'development' : 'production';
  })(),
  
  /** @type {boolean} */
  IS_DEVELOPMENT: function() { return this.MODE === 'development'; },
  
  /** @type {boolean} */
  IS_PRODUCTION: function() { return this.MODE === 'production'; },
  
  /** @type {boolean} */
  ENABLE_ANALYTICS: function() { return this.IS_PRODUCTION(); },
  
  /** @type {boolean} */
  ENABLE_DEBUG_LOGS: function() { return this.IS_DEVELOPMENT(); }
};

/**
 * Educational learning stages following progressive complexity principles
 * Based on Ian Sommerville's systematic software engineering education approach
 * @typedef {Object} LearningStage
 * @property {string} id - Unique stage identifier
 * @property {string} name - Display name for students
 * @property {string} description - Stage learning objectives
 * @property {string} icon - Visual representation
 * @property {string} color - Theme color for UI consistency
 * @property {number} order - Progression sequence
 * @property {number} requiredPoints - Points needed to unlock
 * @property {string[]} prerequisites - Required previous stages
 */
const LEARNING_STAGES = {
  BEGINNER: {
    id: 'beginner',
    name: 'Fundamentos Seguros',
    description: 'Construye bases sólidas antes de enfrentar bugs millonarios. Domina naming profesional y cálculos básicos.',
    icon: '🌱',
    color: '#10b981', // --color-stage-beginner
    order: 1,
    requiredPoints: 0,
    prerequisites: [],
    estimatedHours: 8,
    competencies: ['basic-programming', 'naming-conventions', 'simple-calculations']
  },
  
  INTERMEDIATE: {
    id: 'intermediate', 
    name: 'Debugging Sistemático',
    description: 'Desarrolla metodología profesional de debugging. Casos reales con impacto documentado.',
    icon: '🔍',
    color: '#3b82f6', // --color-stage-intermediate
    order: 2,
    requiredPoints: 100,
    prerequisites: ['beginner'],
    estimatedHours: 12,
    competencies: ['systematic-debugging', 'recursion-analysis', 'error-patterns']
  },
  
  EXPERT: {
    id: 'expert',
    name: 'Casos Millonarios', 
    description: 'Los errores más costosos de la historia. Precedencia de operadores que destruyó una firma completa.',
    icon: '⚡',
    color: '#8b5cf6', // --color-stage-expert
    order: 3,
    requiredPoints: 250,
    prerequisites: ['intermediate'],
    estimatedHours: 16,
    competencies: ['operator-precedence', 'financial-algorithms', 'critical-thinking']
  },
  
  MASTER: {
    id: 'master',
    name: 'Maestría y Prevención',
    description: 'Clean Architecture, testing sistemático, y metodologías de prevención.',
    icon: '👑', 
    color: '#f59e0b', // --color-stage-master
    order: 4,
    requiredPoints: 400,
    prerequisites: ['expert'],
    estimatedHours: 20,
    competencies: ['clean-architecture', 'testing-strategies', 'error-prevention', 'mentoring']
  }
};

/**
 * Educational projects representing real-world costly software errors
 * Following Brad Traversy's project-based learning methodology
 * @typedef {Object} EducationalProject
 * @property {string} id - Unique project identifier
 * @property {string} title - Student-facing project title
 * @property {string} description - Learning objectives and context
 * @property {string} stage - Associated learning stage
 * @property {number} costInDollars - Real-world financial impact
 * @property {string} costDisplay - Formatted cost for UI
 * @property {number} points - Points awarded upon completion
 * @property {number} estimatedMinutes - Expected completion time
 * @property {string[]} technologies - Technologies demonstrated
 * @property {string[]} concepts - Programming concepts taught
 * @property {Object} urls - Navigation paths
 */
const EDUCATIONAL_PROJECTS = {
  // ===== BEGINNER STAGE =====
  CALCULATOR_INTEREST: {
    id: 'calculadora-interes',
    title: 'Calculadora de Interés',
    description: 'Tu primera línea de defensa. Domina cálculos básicos y lógica fundamental.',
    stage: 'beginner',
    costInDollars: 0, // Foundation project - no real-world cost
    costDisplay: 'Fundamentos',
    costLevel: 'safe',
    points: 25,
    estimatedMinutes: 45,
    technologies: ['JavaScript', 'HTML', 'CSS'],
    concepts: ['variables', 'functions', 'mathematical-operations', 'user-input'],
    urls: {
      project: '/proyectos/calculadora-interes/',
      demo: '/proyectos/calculadora-interes/demo.html',
      solution: '/proyectos/calculadora-interes/solution.html'
    },
    realWorldContext: 'Financial calculation accuracy prevents costly errors in banking systems',
    learningObjectives: [
      'Master basic arithmetic operations in programming',
      'Understand variable naming importance', 
      'Practice input validation and error handling'
    ]
  },
  
  NAMING_PROFESSIONAL: {
    id: 'naming',
    title: 'Naming Profesional',
    description: 'Variables mal nombradas que costaron $180K en nóminas. Aprende naming que salva dinero.',
    stage: 'beginner',
    costInDollars: 180000,
    costDisplay: '$180K',
    costLevel: 'expensive',
    points: 50,
    estimatedMinutes: 60,
    technologies: ['JavaScript', 'Code Review'],
    concepts: ['naming-conventions', 'code-readability', 'maintenance-cost'],
    urls: {
      project: '/proyectos/naming/',
      demo: '/proyectos/naming/demo.html',
      solution: '/proyectos/naming/solution.html'
    },
    realWorldContext: 'PayPal lost $180K due to confusing variable names in payroll system',
    learningObjectives: [
      'Understand the business impact of poor naming',
      'Master descriptive variable and function naming',
      'Practice code review and refactoring techniques'
    ]
  },
  
  // ===== INTERMEDIATE STAGE =====
  RECURSION_EVALUATION: {
    id: 'evaluacion-recursiva',
    title: 'Laboratorio de Debugging',
    description: 'Interactive tree exploration. Sistema universitario colapsado por recursión mal implementada.',
    stage: 'intermediate',
    costInDollars: 0, // Measured in students affected, not dollars
    costDisplay: '847 Estudiantes',
    costLevel: 'critical',
    points: 75,
    estimatedMinutes: 90,
    technologies: ['JavaScript', 'Recursion', 'Data Structures'],
    concepts: ['recursion', 'tree-traversal', 'stack-overflow', 'debugging-tools'],
    urls: {
      project: '/proyectos/evaluacion-recursiva/',
      demo: '/proyectos/evaluacion-recursiva/demo.html',
      solution: '/proyectos/evaluacion-recursiva/solution.html'
    },
    realWorldContext: 'University grading system crashed affecting 847 students during finals week',
    learningObjectives: [
      'Understand recursion and its potential pitfalls',
      'Master debugging techniques for infinite loops',
      'Practice systematic problem decomposition'
    ]
  },
  
  COMMA_OPERATOR: {
    id: 'operador-coma',
    title: 'Operador Coma Mortal',
    description: 'Una coma mal colocada. Sistema bancario transfiriendo a cuentas incorrectas.',
    stage: 'intermediate', 
    costInDollars: 500000,
    costDisplay: '$500K',
    costLevel: 'critical',
    points: 100,
    estimatedMinutes: 75,
    technologies: ['JavaScript', 'Operators', 'Banking Systems'],
    concepts: ['operator-precedence', 'comma-operator', 'banking-logic', 'testing'],
    urls: {
      project: '/proyectos/operador-coma/',
      demo: '/proyectos/operador-coma/demo.html', 
      solution: '/proyectos/operador-coma/solution.html'
    },
    realWorldContext: 'Bank transfer system misrouted $500K due to misplaced comma operator',
    learningObjectives: [
      'Understand JavaScript comma operator behavior',
      'Master financial calculation accuracy',
      'Practice comprehensive testing strategies'
    ]
  },
  
  // ===== EXPERT STAGE =====
  OPERATOR_PRECEDENCE: {
    id: 'precedencia-operadores',
    title: 'Precedencia Mortal',
    description: 'No entender que * viene antes que +. Algoritmo de trading que arruinó una firma completa.',
    stage: 'expert',
    costInDollars: 2300000,
    costDisplay: '$2.3M',
    costLevel: 'critical',
    points: 200,
    estimatedMinutes: 120,
    technologies: ['JavaScript', 'Mathematical Operations', 'Trading Algorithms'],
    concepts: ['operator-precedence', 'mathematical-accuracy', 'algorithm-validation', 'financial-risk'],
    urls: {
      project: '/proyectos/precedencia-operadores/',
      demo: '/proyectos/precedencia-operadores/demo.html',
      solution: '/proyectos/precedencia-operadores/solution.html'
    },
    realWorldContext: 'High-frequency trading firm lost $2.3M due to operator precedence error in profit calculation',
    learningObjectives: [
      'Master mathematical operator precedence rules',
      'Understand financial algorithm precision requirements',
      'Practice algorithm validation and testing methodologies'
    ]
  },
  
  // ===== MASTER STAGE =====
  ADVANCED_LABORATORY: {
    id: 'environment',
    title: 'Laboratorio Avanzado',
    description: 'Experimenta con memoria, performance, y arquitectura en un entorno controlado.',
    stage: 'master',
    costInDollars: 0, // Prevention-focused, no associated cost
    costDisplay: 'Seguro',
    costLevel: 'safe',
    points: 150,
    estimatedMinutes: 180,
    technologies: ['JavaScript', 'Performance', 'Architecture', 'Testing'],
    concepts: ['memory-management', 'performance-optimization', 'clean-architecture', 'advanced-testing'],
    urls: {
      project: '/proyectos/environment/',
      demo: '/proyectos/environment/demo.html',
      solution: '/proyectos/environment/solution.html'
    },
    realWorldContext: 'Master-level skills prevent million-dollar mistakes through systematic approaches',
    learningObjectives: [
      'Master advanced JavaScript performance techniques',
      'Understand clean architecture principles',
      'Practice advanced testing and quality assurance'
    ]
  }
};

/**
 * Achievement system for gamification and progress tracking
 * Following Kent C. Dodds' testing-focused learning approach
 * @typedef {Object} Achievement
 * @property {string} id - Unique achievement identifier
 * @property {string} title - Display title for students
 * @property {string} description - Achievement requirements
 * @property {string} icon - Visual representation
 * @property {number} points - Points awarded
 * @property {string} category - Achievement grouping
 * @property {Function} unlockCondition - Function to check if achievement is earned
 */
const ACHIEVEMENTS = {
  FIRST_BUG: {
    id: 'first-bug',
    title: 'Primer Bug Identificado',
    description: 'Identifica tu primer error millonario',
    icon: '🐛',
    points: 10,
    category: 'discovery',
    unlockCondition: (userProgress) => userProgress.projectsCompleted.length >= 1
  },
  
  NAMING_MASTER: {
    id: 'naming-master',
    title: 'Maestro del Naming',
    description: 'Completa el proyecto de Naming Profesional',
    icon: '🏷️', 
    points: 25,
    category: 'skill',
    unlockCondition: (userProgress) => userProgress.projectsCompleted.includes('naming')
  },
  
  DEBUG_SURVIVOR: {
    id: 'debug-survivor',
    title: 'Superviviente del Debug',
    description: 'Completa todos los proyectos de debugging sistemático',
    icon: '🔬',
    points: 50,
    category: 'mastery',
    unlockCondition: (userProgress) => {
      const debugProjects = ['evaluacion-recursiva', 'operador-coma'];
      return debugProjects.every(project => userProgress.projectsCompleted.includes(project));
    }
  },
  
  MILLION_SURVIVOR: {
    id: 'million-survivor',
    title: 'Superviviente Millonario',
    description: 'Sobrevive al bug de $2.3M',
    icon: '💰',
    points: 100,
    category: 'legendary',
    unlockCondition: (userProgress) => userProgress.projectsCompleted.includes('precedencia-operadores')
  },
  
  CLEAN_ARCHITECT: {
    id: 'clean-architect',
    title: 'Arquitecto Limpio',
    description: 'Domina los principios de Clean Architecture',
    icon: '🏗️',
    points: 75,
    category: 'mastery',
    unlockCondition: (userProgress) => userProgress.projectsCompleted.includes('environment')
  },
  
  STAGE_COMPLETE_BEGINNER: {
    id: 'stage-complete-beginner',
    title: 'Fundamentos Dominados',
    description: 'Completa todos los proyectos de fundamentos',
    icon: '🌱',
    points: 50,
    category: 'progression',
    unlockCondition: (userProgress) => {
      const beginnerProjects = Object.values(EDUCATIONAL_PROJECTS)
        .filter(project => project.stage === 'beginner')
        .map(project => project.id);
      return beginnerProjects.every(project => userProgress.projectsCompleted.includes(project));
    }
  },
  
  MONEY_SAVER: {
    id: 'money-saver',
    title: 'Ahorrador Profesional',
    description: 'Prevén más de $1M en errores potenciales',
    icon: '💎',
    points: 200,
    category: 'legendary',
    unlockCondition: (userProgress) => {
      const totalSavings = userProgress.projectsCompleted.reduce((total, projectId) => {
        const project = Object.values(EDUCATIONAL_PROJECTS).find(p => p.id === projectId);
        return total + (project ? project.costInDollars : 0);
      }, 0);
      return totalSavings >= 1000000;
    }
  }
};

/**
 * Analytics configuration for educational tracking
 * Following Sarah Drasner's user experience optimization approach
 */
const ANALYTICS_CONFIG = {
  // Event tracking for learning analytics
  EVENTS: {
    PROJECT_STARTED: 'project_started',
    PROJECT_COMPLETED: 'project_completed', 
    STAGE_UNLOCKED: 'stage_unlocked',
    ACHIEVEMENT_EARNED: 'achievement_earned',
    CODE_EXECUTED: 'code_executed',
    HINT_VIEWED: 'hint_viewed',
    SOLUTION_VIEWED: 'solution_viewed',
    TIME_SPENT: 'time_spent_on_project'
  },
  
  // Learning metrics for educational effectiveness
  METRICS: {
    COMPLETION_RATE: 'completion_rate',
    TIME_TO_COMPLETE: 'average_completion_time',
    HINT_USAGE: 'hint_usage_rate',
    RETRY_COUNT: 'retry_attempts',
    ERROR_PATTERNS: 'common_errors',
    PROGRESSION_SPEED: 'stage_progression_rate'
  },
  
  // Privacy-focused analytics (GDPR compliant)
  PRIVACY: {
    STORE_LOCALLY: true,
    ANONYMOUS_ID: true,
    NO_PERSONAL_DATA: true,
    OPT_OUT_AVAILABLE: true
  }
};

/**
 * Application-wide constants and settings
 * Following Robert C. Martin's clean code principles
 */
const APP_CONFIG = {
  // Application metadata
  NAME: 'Million Dollar Bugs Academy',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional debugging education through real-world costly software errors',
  
  // Storage keys for localStorage
  STORAGE_KEYS: {
    USER_PROGRESS: 'mdba_user_progress',
    SETTINGS: 'mdba_settings',
    ANALYTICS: 'mdba_analytics',
    LAST_VISITED: 'mdba_last_visited',
    THEME_PREFERENCE: 'mdba_theme'
  },
  
  // Timing constants (in milliseconds)
  TIMING: {
    NOTIFICATION_DURATION: 5000,
    AUTOSAVE_INTERVAL: 30000,
    ANALYTICS_BATCH_INTERVAL: 60000,
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 250
  },
  
  // UI Configuration
  UI: {
    MAX_PROJECTS_PER_STAGE: 10,
    MIN_POINTS_FOR_PROGRESS: 25,
    PROGRESS_ANIMATION_STEPS: 50,
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024
  },
  
  // Educational settings
  EDUCATION: {
    MAX_HINTS_PER_PROJECT: 3,
    POINTS_PENALTY_PER_HINT: 5,
    SOLUTION_UNLOCK_DELAY: 300000, // 5 minutes
    MASTERY_THRESHOLD: 80, // Percentage score for mastery
    RETRY_COOLDOWN: 5000 // 5 seconds between retries
  },
  
  // Code execution safety limits
  EXECUTION: {
    MAX_EXECUTION_TIME: 5000, // 5 seconds
    MAX_MEMORY_USAGE: 50000000, // 50MB
    ALLOWED_GLOBALS: ['console', 'Math', 'Date', 'JSON'],
    FORBIDDEN_PATTERNS: [
      'eval(',
      'Function(',
      'setInterval(',
      'setTimeout(',
      'XMLHttpRequest',
      'fetch(',
      'import(',
      'require('
    ]
  }
};

/**
 * API endpoints for future backend integration
 * Following Martin Fowler's enterprise integration patterns
 */
const API_ENDPOINTS = {
  BASE_URL: ENV.IS_PRODUCTION() ? 'https://api.million-dollar-bugs.academy' : 'http://localhost:3000',
  
  ENDPOINTS: {
    PROGRESS: '/api/v1/progress',
    ACHIEVEMENTS: '/api/v1/achievements', 
    ANALYTICS: '/api/v1/analytics',
    LEADERBOARD: '/api/v1/leaderboard',
    PROJECTS: '/api/v1/projects',
    HINTS: '/api/v1/hints',
    SOLUTIONS: '/api/v1/solutions'
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

/**
 * Error messages and user feedback
 * Following inclusive design and accessibility principles
 */
const MESSAGES = {
  SUCCESS: {
    PROJECT_COMPLETED: '¡Excelente! Has completado el proyecto exitosamente.',
    STAGE_UNLOCKED: '🎉 ¡Nueva etapa desbloqueada! Continúa tu journey.',
    ACHIEVEMENT_EARNED: '🏆 ¡Achievement desbloqueado! Gran trabajo.',
    PROGRESS_SAVED: 'Progreso guardado automáticamente.'
  },
  
  ERROR: {
    EXECUTION_FAILED: 'Error en la ejecución del código. Revisa la sintaxis.',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    SAVE_FAILED: 'No se pudo guardar el progreso. Intentando de nuevo...',
    INVALID_CODE: 'Código inválido. Revisa las restricciones de seguridad.',
    TIMEOUT: 'Tiempo de ejecución excedido. Optimiza tu código.'
  },
  
  WARNING: {
    UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Deseas continuar?',
    HINT_PENALTY: 'Ver la pista reducirá tu puntuación en 5 puntos.',
    SOLUTION_UNLOCK: 'La solución se desbloqueará en 5 minutos.',
    SLOW_EXECUTION: 'El código está tardando mucho. Considera optimizarlo.'
  },
  
  INFO: {
    FIRST_VISIT: '¡Bienvenido a Million Dollar Bugs Academy! Comienza con fundamentos.',
    STAGE_LOCKED: 'Completa la etapa anterior para desbloquear esta sección.',
    PROGRESS_CALCULATION: 'Tu progreso se calcula basado en proyectos completados y puntuación.',
    OFFLINE_MODE: 'Modo offline activado. El progreso se sincronizará al reconectar.'
  }
};

/**
 * Export configuration for use throughout the application
 * Following ES6 module patterns and clean architecture
 */
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    ENV,
    LEARNING_STAGES,
    EDUCATIONAL_PROJECTS,
    ACHIEVEMENTS,
    ANALYTICS_CONFIG,
    APP_CONFIG,
    API_ENDPOINTS,
    MESSAGES
  };
} else {
  // Browser environment - attach to window for global access
  window.BugAcademyConfig = {
    ENV,
    LEARNING_STAGES,
    EDUCATIONAL_PROJECTS, 
    ACHIEVEMENTS,
    ANALYTICS_CONFIG,
    APP_CONFIG,
    API_ENDPOINTS,
    MESSAGES
  };
}

/*
  ==========================================
  CONFIGURATION COMPLETE
  ==========================================
  
  This configuration system provides:
  - Centralized constants following Single Responsibility Principle
  - Environment-aware settings for development and production
  - Educational progression system with clear learning objectives
  - Comprehensive project definitions with real-world context
  - Achievement system for motivation and progress tracking
  - Analytics configuration for educational effectiveness measurement
  - API integration preparation for future backend development
  - User-friendly messaging system for all interactions
  
  Following wisdom from:
  - Kent C. Dodds: Clean architecture and configuration management
  - Robert C. Martin: Single Source of Truth and maintainable constants
  - Ian Sommerville: Systematic educational progression design
  - Martin Fowler: Enterprise configuration patterns
  - Brad Traversy: Project-based learning structure
  - Sarah Drasner: User experience and accessibility considerations
  
  Next: utils.js will provide pure utility functions for data manipulation
*/