/**
 * PWA Service Worker Registration
 * Registers service worker for offline functionality
 */

class PWAManager {
  static async init() {
    if (!('serviceWorker' in navigator)) {
      console.warn('🚫 Service Workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('✅ SW registered:', registration.scope);
      
      // Optional: Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('🔄 SW update found');
      });
      
    } catch (error) {
      console.error('❌ SW registration failed:', error);
    }
  }
}

// Auto-initialize when DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', PWAManager.init);
} else {
  PWAManager.init();
}