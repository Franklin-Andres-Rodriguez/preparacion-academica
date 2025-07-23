/* =====================================================
 * 📁 assets/js/orchestrator/ErrorRecovery.js
 * Single Responsibility: Error Handling & Recovery Strategies
 * ===================================================== */

/**
 * Error Recovery and Graceful Degradation
 * 
 * Wes Bos: "Defensive programming prevents crashes"
 * Kent C. Dodds: "Fail gracefully with useful feedback"
 */
export class ErrorRecovery {
  constructor(appState, config) {
    this.appState = appState;
    this.config = config;
    this.setupGlobalErrorHandling();
  }
  
  setupGlobalErrorHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });
    
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event);
    });
    
    utils.logWithContext('info', 'ErrorRecovery', 'Global error handling initialized');
  }
  
  handleUnhandledRejection(event) {
    this.appState.setState('performance.errorCount', 
      this.appState.getState('performance.errorCount') + 1
    );
    
    utils.logWithContext('error', 'ErrorRecovery', 'Unhandled promise rejection', event.reason);
    
    if (this.config.environment.isProduction) {
      event.preventDefault();
    }
    
    this.appState.emit('error:unhandledRejection', {
      reason: event.reason,
      timestamp: Date.now()
    });
  }
  
  handleGlobalError(event) {
    this.appState.setState('performance.errorCount', 
      this.appState.getState('performance.errorCount') + 1
    );
    
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now()
    };
    
    utils.logWithContext('error', 'ErrorRecovery', 'Global JavaScript error', errorInfo);
    
    this.appState.emit('error:globalError', errorInfo);
  }
  
  async attemptGracefulDegradation() {
    utils.logWithContext('info', 'ErrorRecovery', '🔄 Attempting graceful degradation...');
    
    try {
      this.provideBasicNavigation();
      this.provideBasicDemoFunctions();
      this.applyEmergencyStyles();
      
      utils.logWithContext('info', 'ErrorRecovery', '✅ Basic functionality restored');
      return true;
      
    } catch (error) {
      utils.logWithContext('error', 'ErrorRecovery', 'Graceful degradation failed', error);
      return false;
    }
  }
  
  provideBasicNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'auto' });
        }
      });
    });
  }
  
  provideBasicDemoFunctions() {
    if (!window.DEMO_CONFIG) {
      window.DEMO_CONFIG = {
        MESSAGES: {
          RUN: '🐛 Código ejecutado - Bug detectado en línea 23',
          FIX: '✅ ¡Excelente! Has corregido el error.',
          RESET: '🔄 Código reiniciado al estado original'
        }
      };
    }
    
    window.runCode = () => alert(window.DEMO_CONFIG.MESSAGES.RUN);
    window.fixCode = () => alert(window.DEMO_CONFIG.MESSAGES.FIX);
    window.resetCode = () => alert(window.DEMO_CONFIG.MESSAGES.RESET);
  }
  
  applyEmergencyStyles() {
    const emergencyCSS = `
      .disable-animations * {
        animation: none !important;
        transition: none !important;
      }
      
      .simple-navigation {
        /* Simplified navigation styles */
      }
      
      .high-contrast {
        filter: contrast(1.5);
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = emergencyCSS;
    document.head.appendChild(style);
  }
  
  async showEmergencyUI(error) {
    const emergencyHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: #ef4444; color: white; padding: 20px; border-radius: 8px; 
                  font-family: Arial, sans-serif; text-align: center; z-index: 9999;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2>⚠️ Error de Inicialización</h2>
        <p>La aplicación no se pudo cargar correctamente.</p>
        <details style="margin: 10px 0; text-align: left;">
          <summary style="cursor: pointer;">Detalles técnicos</summary>
          <pre style="font-size: 12px; margin-top: 10px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;">
${error.message || 'Error desconocido'}
          </pre>
        </details>
        <button onclick="window.location.reload()" 
                style="margin-top: 10px; padding: 10px 20px; background: white; 
                       color: #ef4444; border: none; border-radius: 4px; cursor: pointer;
                       font-weight: bold;">
          Recargar Página
        </button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', emergencyHTML);
  }
}
