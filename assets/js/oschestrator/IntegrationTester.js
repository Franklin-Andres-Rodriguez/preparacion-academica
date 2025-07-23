/* =====================================================
 * 📁 assets/js/orchestrator/IntegrationTester.js
 * Single Responsibility: System Integration Testing
 * ===================================================== */

/**
 * Integration Testing System
 * 
 * Kent C. Dodds: "Test the most important user interactions"
 * Martin Fowler: "Integration tests verify system collaboration"
 */
export class IntegrationTester {
  constructor(appState, config) {
    this.appState = appState;
    this.config = config;
    this.testResults = new Map();
  }
  
  async runAllTests() {
    utils.logWithContext('info', 'IntegrationTester', '🧪 Running integration tests...');
    
    const tests = [
      { name: 'core-utilities', fn: this.testCoreUtilities },
      { name: 'navigation-system', fn: this.testNavigationSystem },
      { name: 'notification-system', fn: this.testNotificationSystem },
      { name: 'responsive-system', fn: this.testResponsiveSystem },
      { name: 'accessibility-features', fn: this.testAccessibilityFeatures }
    ];
    
    const results = {
      passed: 0,
      failed: 0,
      total: tests.length,
      details: []
    };
    
    for (const test of tests) {
      try {
        await test.fn.call(this);
        results.passed++;
        results.details.push({ name: test.name, status: 'passed' });
        utils.logWithContext('debug', 'IntegrationTester', `✅ ${test.name} test passed`);
      } catch (error) {
        results.failed++;
        results.details.push({ name: test.name, status: 'failed', error: error.message });
        utils.logWithContext('warn', 'IntegrationTester', `❌ ${test.name} test failed`, error);
      }
    }
    
    this.testResults.set('full-suite', results);
    
    utils.logWithContext('info', 'IntegrationTester', 
      `🧪 Integration tests completed: ${results.passed}/${results.total} passed`);
    
    return results;
  }
  
  async testCoreUtilities() {
    if (!window.utils) throw new Error('Utils not available');
    
    const testElement = utils.qs('body');
    if (!testElement) throw new Error('DOM utilities not working');
    
    const debouncedFn = utils.debounce(() => {}, 100);
    if (typeof debouncedFn !== 'function') throw new Error('Debounce utility not working');
    
    return true;
  }
  
  async testNavigationSystem() {
    if (!window.coreAPI) throw new Error('Core API not available');
    
    const navigation = window.coreAPI.getNavigation();
    if (!navigation) throw new Error('Navigation system not available');
    
    const navElement = utils.qs('.navigation');
    if (!navElement) throw new Error('Navigation element not found');
    
    return true;
  }
  
  async testNotificationSystem() {
    if (!window.notifications) return true; // Optional system
    
    if (typeof window.notifications.show !== 'function') {
      throw new Error('Notification API not complete');
    }
    
    return true;
  }
  
  async testResponsiveSystem() {
    const viewport = utils.getViewportSize();
    if (!viewport || typeof viewport.width !== 'number') {
      throw new Error('Responsive utilities not working');
    }
    
    return true;
  }
  
  async testAccessibilityFeatures() {
    const reducedMotion = utils.prefersReducedMotion();
    if (typeof reducedMotion !== 'boolean') {
      throw new Error('Motion preference detection not working');
    }
    
    const focusableElements = utils.qsa('a, button, input, textarea, select');
    if (!Array.isArray(focusableElements)) {
      throw new Error('Focus management utilities not working');
    }
    
    return true;
  }
  
  getTestResults() {
    return Object.fromEntries(this.testResults);
  }
}
