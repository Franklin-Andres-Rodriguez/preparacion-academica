/*
  ==========================================
  APPLICATION CONFIGURATION - MILLION DOLLAR BUGS ACADEMY
  ==========================================
  
  Centralized configuration management following Single Responsibility Principle.
  Manages environment-specific settings, feature flags, and educational parameters.
  
  Archivo: assets/js/config.js
  
  "Configuration is about decisions made before the program runs" - Martin Fowler
  "Make it easy to change your mind" - Kent Beck
  
  Architecture:
  1. Environment Detection & Management
  2. Feature Flag System
  3. Educational Content Configuration  
  4. API & External Services
  5. Performance & UX Settings
  6. Security & Compliance
*/

(() => {
  'use strict';

  /*
    ==========================================
    CONFIGURATION CONTROLLER
    ==========================================
  */

  window.AppConfig = {
    /*
      ==========================================
      ENVIRONMENT MANAGEMENT
      ==========================================
    */

    environments: {
      development: {
        api: {
          baseUrl: 'http://localhost:3000',
          timeout: 10000,
          retries: 2,
        },
        debug: {
          enabled: true,
          verbose: true,
          showPerformance: true,
          mockData: true,
        },
        features: {
          analytics: false,
          errorReporting: false,
          serviceWorker: false,
          offlineMode: false,
        },
        education: {
          skipIntros: true,
          fastAnimations: true,
          showSolutions: true,
          unlockAllLevels: true,
        },
      },

      staging: {
        api: {
          baseUrl: 'https://staging-api.million-dollar-bugs.academy',
          timeout: 8000,
          retries: 3,
        },
        debug: {
          enabled: true,
          verbose: false,
          showPerformance: true,
          mockData: false,
        },
        features: {
          analytics: true,
          errorReporting: true,
          serviceWorker: true,
          offlineMode: true,
        },
        education: {
          skipIntros: false,
          fastAnimations: false,
          showSolutions: false,
          unlockAllLevels: false,
        },
      },

      production: {
        api: {
          baseUrl: 'https://api.million-dollar-bugs.academy',
          timeout: 5000,
          retries: 3,
        },
        debug: {
          enabled: false,
          verbose: false,
          showPerformance: false,
          mockData: false,
        },
        features: {
          analytics: true,
          errorReporting: true,
          serviceWorker: true,
          offlineMode: true,
        },
        education: {
          skipIntros: false,
          fastAnimations: false,
          showSolutions: false,
          unlockAllLevels: false,
        },
      },
    },

    /*
      ==========================================
      EDUCATIONAL CONFIGURATION - Ian Sommerville's progressive complexity
      ==========================================
    */

    education: {
      // Roadmap Structure
      roadmap: {
        stages: [
          {
            id: 'foundations',
            name: 'Fundamentos Seguros',
            icon: '🌱',
            difficulty: 'beginner',
            requiredScore: 0,
            projects: ['calculator-interest', 'naming-conventions'],
            estimatedHours: 8,
            preventionValue: 180000,
          },
          {
            id: 'debugging',
            name: 'Debugging Sistemático',
            icon: '🔍',
            difficulty: 'intermediate',
            requiredScore: 80,
            projects: ['recursion-overflow', 'comma-operator'],
            estimatedHours: 12,
            preventionValue: 500000,
          },
          {
            id: 'millionaire',
            name: 'Casos Millonarios',
            icon: '⚡',
            difficulty: 'expert',
            requiredScore: 160,
            projects: ['precedence-disaster', 'integer-overflow'],
            estimatedHours: 16,
            preventionValue: 2300000,
          },
          {
            id: 'mastery',
            name: 'Maestría',
            icon: '👑',
            difficulty: 'master',
            requiredScore: 240,
            projects: ['clean-architecture', 'prevention-system'],
            estimatedHours: 20,
            preventionValue: 'career_security',
          },
        ],

        // Bug Categories (Robert C. Martin's classification)
        bugTypes: {
          logic: {
            name: 'Errores de Lógica',
            description: 'Precedencia, condiciones, algoritmos',
            icon: '🧠',
            severity: 'high',
            examples: ['precedence-disaster', 'boolean-trap'],
          },
          memory: {
            name: 'Gestión de Memoria',
            description: 'Leaks, overflows, referencias',
            icon: '💾',
            severity: 'critical',
            examples: ['buffer-overflow', 'memory-leak'],
          },
          concurrency: {
            name: 'Concurrencia',
            description: 'Race conditions, deadlocks',
            icon: '⚡',
            severity: 'critical',
            examples: ['race-condition', 'deadlock'],
          },
          integration: {
            name: 'Integración',
            description: 'APIs, bases de datos, servicios',
            icon: '🔗',
            severity: 'medium',
            examples: ['api-timeout', 'data-inconsistency'],
          },
        },

        // Assessment Criteria (Kent Beck's Simple Design)
        assessmentCriteria: {
          correctness: {
            weight: 0.4,
            description: 'Solución funciona correctamente',
            rubric: ['no_solution', 'partial', 'working', 'optimal'],
          },
          readability: {
            weight: 0.3,
            description: 'Código limpio y comprensible',
            rubric: ['unclear', 'basic', 'clean', 'exemplary'],
          },
          maintainability: {
            weight: 0.2,
            description: 'Fácil de modificar y extender',
            rubric: ['brittle', 'basic', 'flexible', 'robust'],
          },
          efficiency: {
            weight: 0.1,
            description: 'Performance y recursos',
            rubric: ['inefficient', 'acceptable', 'good', 'optimal'],
          },
        },
      },

      // Learning Methodology (Shriram Krishnamurthi's scaffolding)
      methodology: {
        scaffolding: {
          preRequisites: true,
          progressiveDisclosure: true,
          immediateFeedback: true,
          reflectiveQuestions: true,
        },

        learningLoop: [
          'understand_context', // Por qué es importante
          'analyze_problem', // Qué salió mal
          'identify_pattern', // Cómo reconocerlo
          'apply_solution', // Cómo solucionarlo
          'practice_prevention', // Cómo prevenirlo
          'reflect_learning', // Qué aprendimos
        ],

        cognitiveLoad: {
          maxSimultaneousConcepts: 3,
          contextSwitchingDelay: 2000,
          reinforcementCycles: 3,
        },
      },
    },

    /*
      ==========================================
      USER EXPERIENCE CONFIGURATION  
      ==========================================
    */

    ux: {
      // Performance Budget (Martin Kleppmann's efficiency)
      performance: {
        budgets: {
          initialLoad: 3000, // 3 seconds max
          routeTransition: 300, // 300ms max
          codeExecution: 100, // 100ms max
          memoryUsage: 100, // 100MB max
        },

        optimizations: {
          lazyLoading: true,
          codesplitting: true,
          imageOptimization: true,
          cachingStrategy: 'stale-while-revalidate',
        },
      },

      // Accessibility (Inclusive Design)
      accessibility: {
        colorContrast: 'WCAG_AAA',
        focusManagement: true,
        screenReaderSupport: true,
        keyboardNavigation: true,
        reducedMotion: 'respect-preference',
        fontSize: {
          min: 16,
          max: 24,
          default: 18,
        },
      },

      // Animation & Transitions (Sarah Drasner's approach)
      animations: {
        duration: {
          short: 150,
          medium: 300,
          long: 500,
        },
        easing: {
          standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
          accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
          decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        },
        respectsReducedMotion: true,
      },
    },

    /*
      ==========================================
      TECHNICAL CONFIGURATION
      ==========================================
    */

    technical: {
      // Code Editor Settings (Kent C. Dodds' preferences)
      codeEditor: {
        theme: 'vs-dark',
        fontSize: 14,
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        tabSize: 2,
        wordWrap: true,
        minimap: true,
        lineNumbers: true,
        syntaxHighlighting: true,
        errorHighlighting: true,
        autoComplete: true,
        formatOnSave: true,
      },

      // Testing Configuration (Kent Beck's TDD)
      testing: {
        framework: 'jest',
        coverage: {
          threshold: 80,
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
        automatedTesting: true,
        continuousIntegration: true,
      },

      // Security Settings
      security: {
        contentSecurityPolicy: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
          'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
          'font-src': ["'self'", 'fonts.gstatic.com'],
        },
        sanitization: {
          userInput: true,
          htmlOutput: true,
          sqlQueries: true,
        },
      },
    },

    /*
      ==========================================
      FEATURE FLAGS SYSTEM - Martin Fowler's Canary Releases
      ==========================================
    */

    features: {
      // Core Features
      core: {
        roadmapProgression: true,
        codeEditor: true,
        solutionValidation: true,
        progressTracking: true,
      },

      // Experimental Features
      experimental: {
        aiCodeReview: false,
        collaborativeCoding: false,
        liveDebugging: false,
        adaptiveLearning: false,
      },

      // Premium Features
      premium: {
        expertMentoring: false,
        customProjects: false,
        advancedAnalytics: false,
        prioritySupport: false,
      },

      // Regional Features
      regional: {
        multiLanguageSupport: true,
        localizedContent: true,
        regionalPricing: false,
        culturalAdaptation: false,
      },
    },

    /*
      ==========================================
      MONITORING & ANALYTICS
      ==========================================
    */

    monitoring: {
      // Error Reporting
      errorReporting: {
        provider: 'sentry',
        dsn: null, // Set per environment
        sampleRate: 1.0,
        beforeSend: 'filterSensitiveData',
      },

      // Performance Monitoring
      performance: {
        metricsCollection: true,
        userTimingAPI: true,
        resourceTiming: true,
        navigationTiming: true,
        webVitals: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'],
      },

      // Learning Analytics (Educational Data Mining)
      learningAnalytics: {
        progressTracking: true,
        timeSpentAnalysis: true,
        errorPatternAnalysis: true,
        learningPathOptimization: true,
        competencyMapping: true,
      },
    },

    /*
      ==========================================
      INITIALIZATION & RUNTIME
      ==========================================
    */

    // Current environment detection
    currentEnvironment: null,

    // Runtime configuration
    runtime: {},

    /*
      ==========================================
      PUBLIC API
      ==========================================
    */

    init() {
      this.detectEnvironment();
      this.loadEnvironmentConfig();
      this.validateConfiguration();
      this.setupFeatureFlags();
      this.log('✅ AppConfig initialized');
    },

    detectEnvironment() {
      const hostname = window.location.hostname;
      const port = window.location.port;

      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        port === '3000'
      ) {
        this.currentEnvironment = 'development';
      } else if (hostname.includes('staging') || hostname.includes('dev')) {
        this.currentEnvironment = 'staging';
      } else {
        this.currentEnvironment = 'production';
      }

      this.log(`🌍 Environment detected: ${this.currentEnvironment}`);
    },

    loadEnvironmentConfig() {
      const envConfig = this.environments[this.currentEnvironment];

      if (!envConfig) {
        throw new Error(
          `Configuration not found for environment: ${this.currentEnvironment}`
        );
      }

      // Deep merge environment configuration
      this.runtime = this.deepMerge({}, envConfig);

      // Apply overrides from URL parameters (development only)
      if (this.currentEnvironment === 'development') {
        this.applyUrlOverrides();
      }

      this.log('⚙️ Environment configuration loaded');
    },

    applyUrlOverrides() {
      const urlParams = new URLSearchParams(window.location.search);

      // Debug overrides
      if (urlParams.has('debug')) {
        this.runtime.debug.enabled = urlParams.get('debug') === 'true';
      }

      // Feature overrides
      if (urlParams.has('skip-intro')) {
        this.runtime.education.skipIntros =
          urlParams.get('skip-intro') === 'true';
      }

      if (urlParams.has('unlock-all')) {
        this.runtime.education.unlockAllLevels =
          urlParams.get('unlock-all') === 'true';
      }

      this.log('🔧 URL overrides applied');
    },

    validateConfiguration() {
      const required = ['api', 'debug', 'features', 'education'];
      const missing = required.filter((key) => !this.runtime[key]);

      if (missing.length > 0) {
        throw new Error(
          `Required configuration missing: ${missing.join(', ')}`
        );
      }

      // Validate API configuration
      if (!this.runtime.api.baseUrl) {
        throw new Error('API base URL is required');
      }

      this.log('✅ Configuration validated');
    },

    setupFeatureFlags() {
      // Merge feature flags with environment-specific overrides
      this.runtime.features = this.deepMerge(
        this.features,
        this.runtime.features || {}
      );

      // Apply A/B testing logic if needed
      this.applyFeatureExperiments();

      this.log('🚩 Feature flags configured');
    },

    applyFeatureExperiments() {
      // Simple A/B test for experimental features
      const userId = this.getUserId();
      const userGroup = this.hashUserId(userId) % 100;

      // 10% of users get experimental AI code review
      if (userGroup < 10) {
        this.runtime.features.experimental.aiCodeReview = true;
      }

      // 5% of users get collaborative coding
      if (userGroup < 5) {
        this.runtime.features.experimental.collaborativeCoding = true;
      }
    },

    /*
      ==========================================
      UTILITY METHODS
      ==========================================
    */

    get(path, defaultValue = null) {
      return this.getNestedValue(this.runtime, path, defaultValue);
    },

    set(path, value) {
      this.setNestedValue(this.runtime, path, value);
    },

    isFeatureEnabled(featurePath) {
      return this.get(`features.${featurePath}`, false);
    },

    getApiUrl(endpoint = '') {
      const baseUrl = this.get('api.baseUrl', '');
      return `${baseUrl}${endpoint}`;
    },

    getEducationConfig(path = '') {
      const base = this.get('education', {});
      return path ? this.getNestedValue(base, path) : base;
    },

    isDevelopment() {
      return this.currentEnvironment === 'development';
    },

    isProduction() {
      return this.currentEnvironment === 'production';
    },

    isDebugEnabled() {
      return this.get('debug.enabled', false);
    },

    // Configuration updates (runtime)
    updateFeature(feature, enabled) {
      this.set(`features.${feature}`, enabled);
      this.log(`🚩 Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`);
    },

    /*
      ==========================================
      HELPER METHODS
      ==========================================
    */

    deepMerge(target, source) {
      const result = { ...target };

      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }

      return result;
    },

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

    setNestedValue(obj, path, value) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      let current = obj;

      for (const key of keys) {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }

      current[lastKey] = value;
    },

    getUserId() {
      // Get or create user ID for experiments
      let userId = localStorage.getItem('mdb_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('mdb_user_id', userId);
      }
      return userId;
    },

    hashUserId(userId) {
      // Simple hash function for consistent A/B testing
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    },

    log(...args) {
      if (this.isDebugEnabled()) {
        console.log('[AppConfig]', ...args);
      }
    },
  };

  // Auto-initialize if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.AppConfig.init();
    });
  } else {
    window.AppConfig.init();
  }
})();
