/* =====================================================
 * 📁 assets/js/achievements/utils/EventEmitter.js
 * SINGLE RESPONSIBILITY: Event system for loose coupling
 * ===================================================== */

class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Event callback error for ${event}:`, error);
      }
    });
  }
  
  off(event, callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}
