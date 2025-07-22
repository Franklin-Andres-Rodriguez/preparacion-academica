/* ===== ADVANCED NOTIFICATION SYSTEM ===== */
/* Combining Sarah Drasner's animation expertise with Robert C. Martin's clean architecture */
/* Following Kent C. Dodds' component composition and Jonas Schmedtmann's theory-practice integration */

/* =====================================================
 * ARCHITECTURAL PHILOSOPHY - Synthesis of Educational Excellence
 * 
 * This notification system represents the convergence of:
 * 
 * 🎨 Sarah Drasner's Animation Principles:
 * "Animations should feel natural and enhance user experience, not distract from it"
 * - Purposeful motion with clear intent
 * - Performance-conscious using CSS transforms
 * - Accessibility-aware respecting user preferences
 * 
 * 🏗️ Robert C. Martin's Clean Architecture:
 * "Good software is written to be read by humans"
 * - Single Responsibility: Each notification type has one purpose
 * - Open/Closed: Extensible through configuration, not modification
 * - Dependency Inversion: Depends on utils abstractions
 * 
 * 🧪 Kent C. Dodds' Component Design:
 * "Make testing easy by making components predictable"
 * - Composable notification system
 * - Clear API contracts
 * - Error boundary handling
 * 
 * 📚 Jonas Schmedtmann's Theory-Practice Integration:
 * "Every feature should solve real problems with clear reasoning"
 * - Each function explains why it exists
 * - Theory → Practice → Application flow
 * - Real-world problem solving
 * ===================================================== */

/* =====================================================
 * NOTIFICATION CONFIGURATION SYSTEM
 * Centralized configuration following Ian Sommerville's systematic structure
 * Martin Fowler principle: "Configuration should be explicit and discoverable"
 * ===================================================== */

/**
 * Notification Type Definitions
 * 
 * THEORY: Different notification types communicate different semantic meanings
 * PRACTICE: Each type has distinct visual styling and behavior
 * APPLICATION: Used throughout the learning platform for user feedback
 */
const NOTIFICATION_TYPES = {
  SUCCESS: {
    name: 'success',
    icon: '✅',
    semanticColor: 'success',
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY,
    priority: 1, // Low priority - auto-dismiss
    soundEnabled: true
  },
  
  ERROR: {
    name: 'error', 
    icon: '❌',
    semanticColor: 'danger',
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY * 1.5, // Longer for errors
    priority: 3, // High priority - user attention needed
    soundEnabled: true,
    persistUntilInteraction: false // Changed to false for better UX
  },
  
  WARNING: {
    name: 'warning',
    icon: '⚠️',
    semanticColor: 'warning', 
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY,
    priority: 2, // Medium priority
    soundEnabled: false // Less aggressive than errors
  },
  
  INFO: {
    name: 'info',
    icon: 'ℹ️',
    semanticColor: 'info',
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY * 0.8, // Shorter for info
    priority: 1, // Low priority
    soundEnabled: false
  },
  
  // Special types for the learning platform
  BUG_DETECTED: {
    name: 'bug-detected',
    icon: '🐛',
    semanticColor: 'danger',
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY,
    priority: 2,
    soundEnabled: true,
    customClass: 'notification--bug'
  },
  
  ACHIEVEMENT_UNLOCKED: {
    name: 'achievement',
    icon: '🏆', 
    semanticColor: 'success',
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY * 2, // Longer for achievements
    priority: 2,
    soundEnabled: true,
    customClass: 'notification--achievement',
    celebratory: true // Triggers special animations
  },
  
  CODE_FIXED: {
    name: 'code-fixed',
    icon: '🔧',
    semanticColor: 'success', 
    duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY,
    priority: 2,
    soundEnabled: true,
    customClass: 'notification--code-fixed'
  }
};

/**
 * Animation Configuration
 * 
 * THEORY: Consistent motion language creates cohesive user experience
 * PRACTICE: Standardized easings and durations across all notifications
 * APPLICATION: Smooth, professional animations that don't distract from learning
 */
const ANIMATION_CONFIG = {
  // Entry animations - Sarah Drasner's "announce presence gracefully"
  ENTRY: {
    SLIDE_IN: 'slideInFromRight',
    FADE_IN: 'fadeInScale', 
    BOUNCE_IN: 'bounceInFromTop' // For celebratory notifications
  },
  
  // Exit animations - "leave without disruption"
  EXIT: {
    SLIDE_OUT: 'slideOutToRight',
    FADE_OUT: 'fadeOutScale',
    DISSOLVE: 'dissolveUp' // For errors that auto-resolve
  },
  
  // Durations in milliseconds
  DURATION: {
    ENTRY: 350,    // Noticeable but not slow
    EXIT: 250,     // Quick exit
    HOVER: 150,    // Immediate feedback
    CELEBRATION: 800 // Special achievements
  },
  
  // Easing functions - Natural motion curves
  EASING: {
    ENTRY: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth entry
    EXIT: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',  // Quick exit
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' // Playful bounce
  }
};

/**
 * Accessibility Configuration
 * 
 * Laurie Williams principle: "Accessibility should be built-in, not bolted on"
 * Following WCAG 2.1 guidelines for user notifications
 */
const ACCESSIBILITY_CONFIG = {
  // ARIA live regions for screen readers
  LIVE_REGIONS: {
    POLITE: 'polite',    // For success, info notifications
    ASSERTIVE: 'assertive' // For errors, warnings
  },
  
  // Reduced motion alternatives
  REDUCED_MOTION: {
    disableAnimations: true,
    useSimpleFade: true,
    showInstantly: false // Still show, just without complex motion
  },
  
  // High contrast support
  HIGH_CONTRAST: {
    enhanceBorders: true,
    increaseFontWeight: true,
    useStrongColors: true
  },
  
  // Focus management
  FOCUS: {
    trapFocusForPersistent: true,
    returnFocusOnDismiss: true,
    skipToActionButton: true
  }
};

/* =====================================================
 * NOTIFICATION MANAGER CLASS
 * Core notification system following Clean Architecture principles
 * Robert C. Martin: "Classes should be small and have a single responsibility"
 * ===================================================== */

/**
 * Advanced Notification Manager
 * 
 * Manages the complete lifecycle of notifications following
 * Kent C. Dodds' component composition patterns
 */
class NotificationManager {
  constructor() {
    // State management following Jonas Schmedtmann's centralized state approach
    this.activeNotifications = new Map(); // Active notification tracking
    this.notificationQueue = [];           // Pending notifications
    this.container = null;                 // DOM container reference
    this.soundContext = null;             // Web Audio context for sounds
    this.reducedMotion = false;            // User motion preference
    this.maxConcurrent = 3;                // Maximum simultaneous notifications
    
    // Performance optimization caches
    this.elementCache = new Map();
    this.animationFrameIds = new Set();
    
    this.init();
  }
  
  /**
   * Initialize notification system
   * 
   * THEORY: Initialization should be explicit and handle all edge cases
   * PRACTICE: Create container, setup accessibility, detect user preferences
   * APPLICATION: Ready system for immediate use throughout the app
   */
  async init() {
    try {
      await utils.waitForDOM();
      
      this.detectUserPreferences();
      this.createNotificationContainer();
      this.setupAccessibilityFeatures();
      this.setupSoundSystem();
      this.bindGlobalEventListeners();
      
      utils.logWithContext('info', 'Notifications', '🔔 Notification system initialized successfully');
      
      // Signal ready state for other modules
      window.dispatchEvent(new CustomEvent('notificationSystemReady'));
      
    } catch (error) {
      utils.logWithContext('error', 'Notifications', 'Failed to initialize notification system', error);
      throw error;
    }
  }
  
  /**
   * Detect user preferences for adaptive behavior
   * 
   * Wes Bos principle: "Defensive programming prevents crashes"
   * Respects user accessibility needs and device capabilities
   */
  detectUserPreferences() {
    // Motion preferences - respect user choices
    this.reducedMotion = utils.prefersReducedMotion();
    
    // High contrast detection
    this.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Sound preferences (defaults to enabled, can be overridden)
    this.soundEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Touch device detection for interaction adjustments
    this.touchDevice = 'ontouchstart' in window;
    
    utils.logWithContext('info', 'Notifications', `User preferences: motion=${!this.reducedMotion}, contrast=${this.highContrast}, sound=${this.soundEnabled}`);
  }
  
  /**
   * Create notification container with proper positioning
   * 
   * THEORY: Notifications need consistent positioning that doesn't interfere with content
   * PRACTICE: Fixed positioning with high z-index, responsive to viewport changes
   * APPLICATION: Creates visual hierarchy that guides user attention
   */
  createNotificationContainer() {
    // Remove existing container if it exists (for re-initialization)
    const existingContainer = utils.qs('#notification-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    this.container = utils.createElement('div', {
      id: 'notification-container',
      className: 'notification-container',
      'aria-live': 'polite', // Default to polite, can be overridden per notification
      'aria-label': 'Notification messages',
      style: `
        position: fixed;
        top: var(--space-6);
        right: var(--space-6);
        z-index: ${APP_CONFIG.Z_INDEX.NOTIFICATION};
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        pointer-events: none;
        max-width: 400px;
        width: 100%;
      `
    });
    
    // Responsive positioning for mobile
    if (utils.getViewportSize().width <= APP_CONFIG.BREAKPOINTS.MOBILE) {
      this.container.style.left = 'var(--space-4)';
      this.container.style.right = 'var(--space-4)';
      this.container.style.maxWidth = 'none';
    }
    
    document.body.appendChild(this.container);
  }
  
  /**
   * Setup accessibility features
   * 
   * Following WCAG 2.1 guidelines and Laurie Williams' inclusive design principles
   */
  setupAccessibilityFeatures() {
    // Create separate live regions for different priority levels
    const politeRegion = utils.createElement('div', {
      'aria-live': 'polite',
      'aria-label': 'Non-urgent notifications',
      className: 'sr-only' // Screen reader only
    });
    
    const assertiveRegion = utils.createElement('div', {
      'aria-live': 'assertive', 
      'aria-label': 'Urgent notifications',
      className: 'sr-only'
    });
    
    document.body.appendChild(politeRegion);
    document.body.appendChild(assertiveRegion);
    
    this.liveRegions = {
      polite: politeRegion,
      assertive: assertiveRegion
    };
  }
  
  /**
   * Setup sound system for audio feedback
   * 
   * THEORY: Audio feedback provides additional accessibility and user experience enhancement
   * PRACTICE: Web Audio API for precise control and performance
   * APPLICATION: Subtle audio cues for different notification types
   */
  setupSoundSystem() {
    if (!this.soundEnabled) return;
    
    try {
      // Create audio context lazily (user interaction required)
      this.initAudioContext = () => {
        if (!this.soundContext) {
          this.soundContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.soundContext;
      };
      
      // Simple sound generation using Web Audio API
      this.playNotificationSound = (type) => {
        if (!this.soundEnabled || this.reducedMotion) return;
        
        try {
          const audioContext = this.initAudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          // Different frequencies for different notification types
          const frequencies = {
            success: 800,    // Pleasant higher tone
            error: 400,      // Lower, more attention-grabbing
            warning: 600,    // Medium tone
            achievement: 1000 // Highest, most celebratory
          };
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime);
          oscillator.type = 'sine';
          
          // Short, subtle sound
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          
        } catch (error) {
          utils.logWithContext('warn', 'Notifications', 'Failed to play notification sound', error);
        }
      };
      
    } catch (error) {
      utils.logWithContext('warn', 'Notifications', 'Web Audio API not available', error);
      this.soundEnabled = false;
    }
  }
  
  /**
   * Bind global event listeners for system-wide behavior
   * 
   * Brad Traversy approach: "Handle edge cases proactively"
   */
  bindGlobalEventListeners() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
    
    // Handle resize for responsive positioning
    const handleResize = utils.debounce(() => {
      this.updateContainerPositioning();
    }, 150);
    
    window.addEventListener('resize', handleResize);
    
    // Handle preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.updateAllNotificationsForMotionPreference();
    });
  }
  
  /**
   * Show notification with full feature support
   * 
   * PUBLIC API - Main method for displaying notifications
   * 
   * @param {string} message - Notification message text
   * @param {string} type - Notification type (success, error, warning, info, etc.)
   * @param {Object} options - Additional configuration options
   * @returns {Promise<string>} - Notification ID for tracking/dismissal
   * 
   * EXAMPLE USAGE:
   * await notifications.show('Code executed successfully!', 'success');
   * await notifications.show('Bug detected in precedence', 'bug-detected', { persistent: true });
   */
  async show(message, type = 'info', options = {}) {
    try {
      // Validate inputs - Kent C. Dodds' defensive programming
      if (!message || typeof message !== 'string') {
        throw new Error('Notification message is required and must be a string');
      }
      
      if (!NOTIFICATION_TYPES[type.toUpperCase()]) {
        utils.logWithContext('warn', 'Notifications', `Unknown notification type: ${type}, falling back to info`);
        type = 'info';
      }
      
      const notificationConfig = NOTIFICATION_TYPES[type.toUpperCase()];
      const notificationId = this.generateNotificationId();
      
      // Create notification object
      const notification = {
        id: notificationId,
        message,
        type: notificationConfig.name,
        config: notificationConfig,
        options: {
          duration: options.duration || notificationConfig.duration,
          persistent: options.persistent || notificationConfig.persistUntilInteraction,
          actions: options.actions || [], // Array of action buttons
          data: options.data || null,      // Additional data payload
          onShow: options.onShow || null,  // Callback when shown
          onHide: options.onHide || null,  // Callback when hidden
          onAction: options.onAction || null, // Callback for action buttons
          ...options
        },
        timestamp: Date.now(),
        element: null,
        timeoutId: null,
        isVisible: false
      };
      
      // Queue or show immediately based on current notification count
      if (this.activeNotifications.size >= this.maxConcurrent) {
        this.notificationQueue.push(notification);
        utils.logWithContext('info', 'Notifications', `Notification queued: ${notificationId}`);
      } else {
        await this.displayNotification(notification);
      }
      
      return notificationId;
      
    } catch (error) {
      utils.logWithContext('error', 'Notifications', 'Failed to show notification', { message, type, error });
      throw error;
    }
  }
  
  /**
   * Display notification with full animation and accessibility support
   * 
   * THEORY: Notification display should be smooth, accessible, and informative
   * PRACTICE: Creates DOM element, applies animations, sets up interaction handlers
   * APPLICATION: Provides immediate feedback for user actions in the learning platform
   */
  async displayNotification(notification) {
    try {
      // Create notification element
      notification.element = this.createNotificationElement(notification);
      
      // Add to active notifications
      this.activeNotifications.set(notification.id, notification);
      
      // Append to container with initial hidden state
      notification.element.style.opacity = '0';
      notification.element.style.transform = 'translateX(100%)';
      this.container.appendChild(notification.element);
      
      // Trigger entry animation
      await this.animateNotificationEntry(notification);
      
      // Setup auto-dismiss if not persistent
      if (!notification.options.persistent) {
        this.scheduleAutoDismiss(notification);
      }
      
      // Play sound if enabled
      if (notification.config.soundEnabled) {
        this.playNotificationSound(notification.config.semanticColor);
      }
      
      // Update accessibility live region
      this.announceToScreenReader(notification);
      
      // Execute onShow callback
      if (notification.options.onShow) {
        notification.options.onShow(notification);
      }
      
      notification.isVisible = true;
      utils.logWithContext('info', 'Notifications', `Notification displayed: ${notification.id}`);
      
    } catch (error) {
      utils.logWithContext('error', 'Notifications', 'Failed to display notification', error);
      this.cleanupNotification(notification);
    }
  }
  
  /**
   * Create notification DOM element with full accessibility support
   * 
   * Following modern HTML5 semantic practices and ARIA guidelines
   */
  createNotificationElement(notification) {
    const { config, message, options } = notification;
    
    // Main notification container
    const element = utils.createElement('div', {
      className: `notification notification--${config.name} ${config.customClass || ''}`,
      role: 'alert', // ARIA role for important notifications
      'aria-live': config.priority >= 2 ? 'assertive' : 'polite',
      'data-notification-id': notification.id,
      'data-notification-type': config.name,
      style: `
        pointer-events: auto;
        background: var(--dark-surface);
        border: 1px solid var(--${config.semanticColor}-600);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        box-shadow: var(--shadow-xl);
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        min-width: 300px;
        max-width: 400px;
        position: relative;
        overflow: hidden;
        transition: all ${ANIMATION_CONFIG.DURATION.ENTRY}ms ${ANIMATION_CONFIG.EASING.ENTRY};
      `
    });
    
    // Add specialized styling for high contrast mode
    if (this.highContrast) {
      element.style.border = `2px solid var(--${config.semanticColor}-400)`;
      element.style.boxShadow = 'none';
    }
    
    // Icon container
    const iconContainer = utils.createElement('div', {
      className: 'notification-icon',
      'aria-hidden': 'true', // Decorative, message provides semantic meaning
      style: `
        font-size: var(--text-lg);
        flex-shrink: 0;
        margin-top: 2px;
      `
    }, config.icon);
    
    // Content container
    const content = utils.createElement('div', {
      className: 'notification-content',
      style: `
        flex: 1;
        min-width: 0;
      `
    });
    
    // Message text
    const messageElement = utils.createElement('div', {
      className: 'notification-message',
      style: `
        color: var(--dark-text-primary);
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: ${options.actions?.length ? 'var(--space-2)' : '0'};
      `
    }, message);
    
    content.appendChild(messageElement);
    
    // Action buttons if provided
    if (options.actions?.length) {
      const actionsContainer = utils.createElement('div', {
        className: 'notification-actions',
        style: `
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-3);
          flex-wrap: wrap;
        `
      });
      
      options.actions.forEach((action, index) => {
        const button = utils.createElement('button', {
          className: `btn btn--${action.style || 'ghost'}`,
          style: `
            font-size: var(--text-sm);
            padding: var(--space-2) var(--space-3);
            min-height: auto;
          `,
          'data-action-id': action.id || `action-${index}`
        }, action.label);
        
        button.addEventListener('click', (e) => {
          e.preventDefault();
          if (action.handler) {
            action.handler(notification, action);
          }
          if (options.onAction) {
            options.onAction(notification, action);
          }
          if (action.dismissOnClick !== false) {
            this.dismiss(notification.id);
          }
        });
        
        actionsContainer.appendChild(button);
      });
      
      content.appendChild(actionsContainer);
    }
    
    // Dismiss button (always present for accessibility)
    const dismissButton = utils.createElement('button', {
      className: 'notification-dismiss',
      'aria-label': 'Dismiss notification',
      style: `
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: none;
        border: none;
        color: var(--dark-text-secondary);
        font-size: var(--text-lg);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all ${ANIMATION_CONFIG.DURATION.HOVER}ms ease;
      `
    }, '×');
    
    // Dismiss button interactions
    dismissButton.addEventListener('click', () => this.dismiss(notification.id));
    dismissButton.addEventListener('mouseenter', () => {
      dismissButton.style.background = 'var(--dark-surface-hover)';
      dismissButton.style.color = 'var(--dark-text-primary)';
    });
    dismissButton.addEventListener('mouseleave', () => {
      dismissButton.style.background = 'none';
      dismissButton.style.color = 'var(--dark-text-secondary)';
    });
    
    // Progress bar for auto-dismiss notifications
    if (!options.persistent && options.duration > 0) {
      const progressBar = utils.createElement('div', {
        className: 'notification-progress',
        style: `
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--${config.semanticColor}-400);
          width: 100%;
          transform-origin: left;
          animation: notificationProgress ${options.duration}ms linear;
        `
      });
      
      element.appendChild(progressBar);
    }
    
    // Assemble final element
    element.appendChild(iconContainer);
    element.appendChild(content);
    element.appendChild(dismissButton);
    
    // Special handling for celebratory notifications
    if (config.celebratory) {
      this.addCelebratoryEffects(element);
    }
    
    return element;
  }
  
  /**
   * Animate notification entry with respect for user preferences
   * 
   * Sarah Drasner principle: "Animations should feel natural and purposeful"
   */
  async animateNotificationEntry(notification) {
    const element = notification.element;
    
    if (this.reducedMotion) {
      // Simple fade for reduced motion users
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
      return;
    }
    
    // Smooth slide-in animation
    await utils.nextFrame(); // Ensure DOM update
    
    const animation = element.animate([
      {
        opacity: '0',
        transform: 'translateX(100%) scale(0.9)',
        offset: 0
      },
      {
        opacity: '1',
        transform: 'translateX(0) scale(1)',
        offset: 1
      }
    ], {
      duration: ANIMATION_CONFIG.DURATION.ENTRY,
      easing: ANIMATION_CONFIG.EASING.ENTRY,
      fill: 'forwards'
    });
    
    // Track animation for cleanup
    this.animationFrameIds.add(animation);
    
    return new Promise(resolve => {
      animation.addEventListener('finish', () => {
        this.animationFrameIds.delete(animation);
        resolve();
      });
    });
  }
  
  /**
   * Dismiss notification with smooth exit animation
   * 
   * PUBLIC API - Programmatic notification dismissal
   * 
   * @param {string} notificationId - ID of notification to dismiss
   * @returns {Promise<void>} - Resolves when dismissal is complete
   */
  async dismiss(notificationId) {
    const notification = this.activeNotifications.get(notificationId);
    
    if (!notification) {
      utils.logWithContext('warn', 'Notifications', `Attempted to dismiss unknown notification: ${notificationId}`);
      return;
    }
    
    try {
      // Cancel auto-dismiss timer
      if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
      }
      
      // Execute onHide callback
      if (notification.options.onHide) {
        notification.options.onHide(notification);
      }
      
      // Animate exit
      await this.animateNotificationExit(notification);
      
      // Cleanup
      this.cleanupNotification(notification);
      
      // Process queue
      this.processNotificationQueue();
      
      utils.logWithContext('info', 'Notifications', `Notification dismissed: ${notificationId}`);
      
    } catch (error) {
      utils.logWithContext('error', 'Notifications', 'Failed to dismiss notification', error);
      // Force cleanup on error
      this.cleanupNotification(notification);
    }
  }
  
  /**
   * Animate notification exit
   * 
   * Different exit animations based on dismissal reason and user preferences
   */
  async animateNotificationExit(notification) {
    const element = notification.element;
    
    if (this.reducedMotion) {
      element.style.opacity = '0';
      return;
    }
    
    const animation = element.animate([
      {
        opacity: '1',
        transform: 'translateX(0) scale(1)',
        offset: 0
      },
      {
        opacity: '0',
        transform: 'translateX(100%) scale(0.9)',
        offset: 1
      }
    ], {
      duration: ANIMATION_CONFIG.DURATION.EXIT,
      easing: ANIMATION_CONFIG.EASING.EXIT,
      fill: 'forwards'
    });
    
    return new Promise(resolve => {
      animation.addEventListener('finish', resolve);
    });
  }
  
  /**
   * Cleanup notification resources
   * 
   * Wes Bos principle: "Clean up after yourself to prevent memory leaks"
   */
  cleanupNotification(notification) {
    // Remove from active notifications
    this.activeNotifications.delete(notification.id);
    
    // Remove DOM element
    if (notification.element && notification.element.parentNode) {
      notification.element.parentNode.removeChild(notification.element);
    }
    
    // Clear timers
    if (notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }
    
    // Clear element cache
    this.elementCache.delete(notification.id);
  }
  
  /**
   * Process notification queue
   * 
   * Show queued notifications when space becomes available
   */
  async processNotificationQueue() {
    if (this.notificationQueue.length === 0) return;
    if (this.activeNotifications.size >= this.maxConcurrent) return;
    
    const nextNotification = this.notificationQueue.shift();
    await this.displayNotification(nextNotification);
  }
  
  /**
   * Schedule auto-dismiss for non-persistent notifications
   */
  scheduleAutoDismiss(notification) {
    notification.timeoutId = setTimeout(() => {
      this.dismiss(notification.id);
    }, notification.options.duration);
  }
  
  /**
   * Announce notification to screen readers
   * 
   * Accessibility support following WCAG guidelines
   */
  announceToScreenReader(notification) {
    const region = notification.config.priority >= 2 ? 
      this.liveRegions.assertive : 
      this.liveRegions.polite;
    
    const announcement = `${notification.config.name} notification: ${notification.message}`;
    
    // Clear and set message for screen reader announcement
    region.textContent = '';
    setTimeout(() => {
      region.textContent = announcement;
    }, 100);
  }
  
  /**
   * Add celebratory effects for achievements
   * 
   * Sarah Drasner's creative animation techniques
   */
  addCelebratoryEffects(element) {
    if (this.reducedMotion) return;
    
    // Add confetti-like elements
    for (let i = 0; i < 6; i++) {
      const particle = utils.createElement('div', {
        style: `
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--brand-400);
          border-radius: 50%;
          pointer-events: none;
          animation: confetti 1s ease-out ${i * 0.1}s forwards;
        `
      });
      
      element.appendChild(particle);
    }
  }
  
  /**
   * Generate unique notification ID
   */
  generateNotificationId() {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /* ===== PUBLIC API METHODS ===== */
  
  /**
   * Convenience methods for common notification types
   * Kent C. Dodds approach: "Make common operations easy"
   */
  
  async success(message, options = {}) {
    return this.show(message, 'success', options);
  }
  
  async error(message, options = {}) {
    return this.show(message, 'error', options);
  }
  
  async warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }
  
  async info(message, options = {}) {
    return this.show(message, 'info', options);
  }
  
  async bugDetected(message, options = {}) {
    return this.show(message, 'bug-detected', options);
  }
  
  async achievementUnlocked(message, options = {}) {
    return this.show(message, 'achievement-unlocked', options);
  }
  
  async codeFixed(message, options = {}) {
    return this.show(message, 'code-fixed', options);
  }
  
  /**
   * Dismiss all notifications
   */
  async dismissAll() {
    const dismissPromises = Array.from(this.activeNotifications.keys())
      .map(id => this.dismiss(id));
    
    await Promise.all(dismissPromises);
    this.notificationQueue.length = 0; // Clear queue
  }
  
  /**
   * Get notification statistics
   * Useful for debugging and analytics
   */
  getStats() {
    return {
      active: this.activeNotifications.size,
      queued: this.notificationQueue.length,
      maxConcurrent: this.maxConcurrent,
      reducedMotion: this.reducedMotion,
      soundEnabled: this.soundEnabled
    };
  }
}

/* =====================================================
 * DEMO INTEGRATION FUNCTIONS
 * Integration with the learning platform's interactive demo system
 * Brad Traversy approach: "Make everything work together seamlessly"
 * ===================================================== */

/**
 * Demo notification functions
 * 
 * These functions integrate with the existing demo system
 * (runCode, fixCode, resetCode) to provide contextual feedback
 */

/**
 * Enhanced demo functions with notification integration
 * 
 * THEORY: User feedback should be immediate and contextually relevant
 * PRACTICE: Each demo action triggers appropriate notification type
 * APPLICATION: Enhances the learning experience with clear feedback
 */
async function showDemoNotification(type, context = {}) {
  const messages = {
    run: DEMO_CONFIG.MESSAGES.RUN,
    fix: DEMO_CONFIG.MESSAGES.FIX, 
    reset: DEMO_CONFIG.MESSAGES.RESET
  };
  
  const notificationTypes = {
    run: 'bug-detected',
    fix: 'code-fixed',
    reset: 'info'
  };
  
  if (window.notifications) {
    await window.notifications.show(
      messages[type] || 'Demo action completed',
      notificationTypes[type] || 'info',
      {
        data: context,
        duration: APP_CONFIG.ANIMATION.NOTIFICATION_DISPLAY
      }
    );
  }
}

/* =====================================================
 * CSS ANIMATIONS INJECTION
 * Dynamic CSS for notification animations
 * Sarah Drasner technique: "Inject styles when needed for performance"
 * ===================================================== */

/**
 * Inject notification animation styles
 * 
 * Creates CSS animations dynamically to avoid loading unused styles
 */
function injectNotificationStyles() {
  const styleId = 'notification-animations';
  
  // Avoid duplicate injection
  if (document.getElementById(styleId)) return;
  
  const styles = `
    @keyframes notificationProgress {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
    
    @keyframes confetti {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(-30px) rotate(180deg);
        opacity: 0;
      }
    }
    
    .notification:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2xl);
    }
    
    .notification--achievement {
      background: linear-gradient(135deg, var(--dark-surface) 0%, rgba(168, 85, 247, 0.1) 100%);
      border-color: var(--brand-400);
      animation: achievementGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes achievementGlow {
      0% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
      100% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5); }
    }
    
    .notification--bug {
      border-left: 4px solid var(--danger-400);
    }
    
    .notification--code-fixed {
      border-left: 4px solid var(--success-400);
    }
    
    /* Reduced motion alternatives */
    @media (prefers-reduced-motion: reduce) {
      .notification {
        animation: none !important;
      }
      
      .notification-progress {
        animation: none !important;
      }
      
      .notification--achievement {
        animation: none !important;
      }
    }
    
    /* High contrast enhancements */
    @media (prefers-contrast: high) {
      .notification {
        border-width: 2px;
        font-weight: 600;
      }
    }
    
    /* Mobile responsiveness */
    @media (max-width: ${APP_CONFIG.BREAKPOINTS.MOBILE}px) {
      .notification-container {
        left: var(--space-4) !important;
        right: var(--space-4) !important;
        max-width: none !important;
      }
      
      .notification {
        min-width: auto;
        max-width: none;
      }
      
      .notification-actions {
        flex-direction: column;
      }
    }
  `;
  
  const styleElement = utils.createElement('style', { id: styleId });
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

/* =====================================================
 * GLOBAL FUNCTIONS FOR BACKWARD COMPATIBILITY
 * Maintains compatibility with existing demo system
 * Robert C. Martin: "Keep interfaces stable while improving implementation"
 * ===================================================== */

/**
 * Enhanced global demo functions
 * 
 * These replace the original functions from the monolithic file
 * while maintaining the same API for backward compatibility
 */
window.runCode = async function() {
  await showDemoNotification('run');
};

window.fixCode = async function() {
  await showDemoNotification('fix');
};

window.resetCode = async function() {
  await showDemoNotification('reset');
};

/* =====================================================
 * MODULE INITIALIZATION & EXPORT
 * Initialize notification system and make it globally available
 * ===================================================== */

// Inject styles when module loads
injectNotificationStyles();

// Create global notification manager instance
const notificationManager = new NotificationManager();

// Global availability for other modules
window.notifications = notificationManager;
window.showDemoNotification = showDemoNotification;

// Convenience API for direct access
window.notificationAPI = {
  show: (message, type, options) => notificationManager.show(message, type, options),
  success: (message, options) => notificationManager.success(message, options),
  error: (message, options) => notificationManager.error(message, options),
  warning: (message, options) => notificationManager.warning(message, options),
  info: (message, options) => notificationManager.info(message, options),
  dismiss: (id) => notificationManager.dismiss(id),
  dismissAll: () => notificationManager.dismissAll(),
  stats: () => notificationManager.getStats()
};

// Log successful module loading
utils.logWithContext('info', 'Notifications', '🔔 Advanced notification system loaded and ready');