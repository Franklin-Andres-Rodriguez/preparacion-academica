// ========================================
// 🔬 LABORATORIO INTERACTIVO - FUNCIONALIDAD PRINCIPAL
// ========================================
// Archivo: assets/js/laboratory.js
// Funciones para el laboratorio interactivo del bug de $2.3M

// ========================================
// 📝 CÓDIGO ORIGINAL Y ESTADOS
// ========================================

const LAB_CODE_STATES = {
  original: `// 💀 Bug que costó $2.3M - Precedencia de Operadores
function calculateTradeProfit(baseAmount, multiplier, fee) {
  // ❌ ERROR: Precedencia incorrecta
  return baseAmount + multiplier * fee;  
  
  // ✅ CORRECTO: 
  // return (baseAmount + multiplier) * fee;
}

// Simulación del bug real
const result = calculateTradeProfit(1000, 0.05, 100);
console.log('Resultado:', result);
console.log('¿Esperabas este resultado?');`,

  fixed: `// ✅ Bug CORREGIDO - Precedencia de Operadores
function calculateTradeProfit(baseAmount, multiplier, fee) {
  // ✅ CORRECTO: Paréntesis fuerzan la precedencia
  return (baseAmount + multiplier) * fee;
}

// Simulación del código corregido
const result = calculateTradeProfit(1000, 0.05, 100);
console.log('Resultado CORREGIDO:', result);
console.log('Ahora el cálculo es correcto!');`
};

// ========================================
// 🎯 FUNCIONES PRINCIPALES DEL LABORATORIO
// ========================================

/**
 * 🚀 Ejecuta el código actual y muestra los resultados
 */
function runCode() {
  console.log('🔥 EJECUTANDO CÓDIGO DEL LABORATORIO...');
  
  try {
    // Obtener el código actual del editor
    const codeElement = document.querySelector('.editor-content pre code');
    const currentCode = codeElement.textContent;
    
    // Limpiar output anterior
    clearOutput();
    
    // Determinar si es la versión con bug o corregida
    const isBuggyVersion = currentCode.includes('baseAmount + multiplier * fee');
    
    // Simular ejecución paso a paso
    if (isBuggyVersion) {
      executeWithBug();
    } else {
      executeFixed();
    }
    
    // Mostrar notificación de ejecución
    showNotification('🔥 Código ejecutado! Ve los resultados abajo.', 'info');
    
    // Tracking para analytics (si existe)
    if (typeof trackLabInteraction === 'function') {
      trackLabInteraction('code_executed', { version: isBuggyVersion ? 'buggy' : 'fixed' });
    }
    
  } catch (error) {
    console.error('❌ Error al ejecutar código:', error);
    showNotification('❌ Error al ejecutar el código', 'error');
  }
}

/**
 * 🔧 Corrige el código automáticamente
 */
function fixCode() {
  console.log('🔧 APLICANDO CORRECCIÓN...');
  
  try {
    // Obtener elementos del DOM
    const codeElement = document.querySelector('.editor-content pre code');
    
    // Aplicar el código corregido
    codeElement.textContent = LAB_CODE_STATES.fixed;
    
    // Limpiar output y mostrar versión corregida
    clearOutput();
    executeFixed();
    
    // Efectos visuales de corrección
    codeElement.style.backgroundColor = 'var(--success-50, #f0fdf4)';
    setTimeout(() => {
      codeElement.style.backgroundColor = '';
    }, 2000);
    
    // Mostrar notificación de éxito
    showNotification('✅ ¡Código corregido! El bug de $2.3M ha sido eliminado.', 'success');
    
    // Tracking para analytics
    if (typeof trackLabInteraction === 'function') {
      trackLabInteraction('code_fixed', { bug_type: 'operator_precedence' });
    }
    
    // Trigger achievement si existe el sistema
    if (typeof triggerAchievement === 'function') {
      triggerAchievement('lab_bug_fixed', {
        bugType: 'precedence',
        costPrevented: 2300000
      });
    }
    
  } catch (error) {
    console.error('❌ Error al corregir código:', error);
    showNotification('❌ Error al aplicar la corrección', 'error');
  }
}

/**
 * ↺ Resetea el código a su estado original con bug
 */
function resetCode() {
  console.log('↺ RESETEANDO CÓDIGO...');
  
  try {
    // Obtener elementos del DOM
    const codeElement = document.querySelector('.editor-content pre code');
    
    // Restaurar código original
    codeElement.textContent = LAB_CODE_STATES.original;
    
    // Limpiar output y mostrar estado inicial
    clearOutput();
    executeWithBug();
    
    // Efectos visuales de reset
    codeElement.style.backgroundColor = 'var(--warning-50, #fffbeb)';
    setTimeout(() => {
      codeElement.style.backgroundColor = '';
    }, 1500);
    
    // Mostrar notificación
    showNotification('↺ Código reseteado al estado original con bug', 'warning');
    
    // Tracking para analytics
    if (typeof trackLabInteraction === 'function') {
      trackLabInteraction('code_reset', { bug_type: 'operator_precedence' });
    }
    
  } catch (error) {
    console.error('❌ Error al resetear código:', error);
    showNotification('❌ Error al resetear el código', 'error');
  }
}

// ========================================
// 🔬 FUNCIONES DE SIMULACIÓN DE EJECUCIÓN
// ========================================

/**
 * Simula la ejecución del código con bug
 */
function executeWithBug() {
  const outputContainer = document.querySelector('.output-content');
  
  // Cálculo con bug: 1000 + 0.05 * 100 = 1000 + 5 = 1005
  const buggyResult = 1000 + 0.05 * 100;
  const expectedResult = (1000 + 0.05) * 100;
  const financialLoss = 2300000;
  
  outputContainer.innerHTML = `
    <div class="output-line">
      <span class="output-label">🔥 Resultado (CON BUG):</span>
      <span class="output-value error">${buggyResult}</span>
    </div>
    <div class="output-line">
      <span class="output-label">✅ Resultado Esperado:</span>
      <span class="output-value">${expectedResult.toLocaleString()}</span>
    </div>
    <div class="output-line">
      <span class="output-label">💸 Pérdida Financiera:</span>
      <span class="output-value critical">$${financialLoss.toLocaleString()}</span>
    </div>
    <div class="output-line">
      <span class="output-label">🧮 Explicación:</span>
      <span class="output-value">1000 + (0.05 * 100) = 1000 + 5 = 1005</span>
    </div>
    <div class="output-line">
      <span class="output-label">🎯 Debería ser:</span>
      <span class="output-value">(1000 + 0.05) * 100 = 1000.05 * 100 = 100,005</span>
    </div>
  `;
  
  // Añadir clase de estado con bug
  outputContainer.parentElement.className = 'demo-output state-buggy';
}

/**
 * Simula la ejecución del código corregido
 */
function executeFixed() {
  const outputContainer = document.querySelector('.output-content');
  
  // Cálculo corregido: (1000 + 0.05) * 100 = 100,005
  const fixedResult = (1000 + 0.05) * 100;
  const moneySaved = 2300000;
  
  outputContainer.innerHTML = `
    <div class="output-line">
      <span class="output-label">✅ Resultado (CORREGIDO):</span>
      <span class="output-value success">${fixedResult.toLocaleString()}</span>
    </div>
    <div class="output-line">
      <span class="output-label">🎯 Cálculo Correcto:</span>
      <span class="output-value">(1000 + 0.05) * 100 = ${fixedResult.toLocaleString()}</span>
    </div>
    <div class="output-line">
      <span class="output-label">💰 Dinero Ahorrado:</span>
      <span class="output-value success">$${moneySaved.toLocaleString()}</span>
    </div>
    <div class="output-line">
      <span class="output-label">🏆 Estado:</span>
      <span class="output-value success">¡Bug Eliminado!</span>
    </div>
    <div class="output-line">
      <span class="output-label">📚 Lección:</span>
      <span class="output-value">Los paréntesis fuerzan el orden de evaluación</span>
    </div>
  `;
  
  // Añadir clase de estado corregido
  outputContainer.parentElement.className = 'demo-output state-fixed';
}

/**
 * Limpia el output del laboratorio
 */
function clearOutput() {
  const outputContainer = document.querySelector('.output-content');
  outputContainer.innerHTML = '<div class="output-line"><span class="output-label">🔄 Ejecutando...</span></div>';
  
  // Resetear clase de estado
  outputContainer.parentElement.className = 'demo-output';
}

// ========================================
// 🔔 SISTEMA DE NOTIFICACIONES PARA LAB
// ========================================

/**
 * Muestra notificaciones específicas del laboratorio
 */
function showNotification(message, type = 'info') {
  // Verificar si existe el sistema de notificaciones global
  if (typeof showGlobalNotification === 'function') {
    showGlobalNotification(message, type);
    return;
  }
  
  // Sistema de notificación local para el laboratorio
  const notification = document.getElementById('notification');
  
  if (!notification) {
    console.warn('Sistema de notificaciones no encontrado');
    return;
  }
  
  // Configurar el contenido
  const iconMap = {
    info: '🔥',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  const icon = notification.querySelector('.notification-icon');
  const text = notification.querySelector('.notification-text');
  
  if (icon) icon.textContent = iconMap[type] || '🔥';
  if (text) text.textContent = message;
  
  // Configurar clases CSS
  notification.className = `notification notification--${type} notification--visible`;
  
  // Auto-hide después de 4 segundos
  setTimeout(() => {
    notification.classList.remove('notification--visible');
  }, 4000);
}

// ========================================
// 🚀 INICIALIZACIÓN DEL LABORATORIO
// ========================================

/**
 * Inicializa el laboratorio interactivo cuando el DOM está listo
 */
function initializeLaboratory() {
  console.log('🔬 Inicializando Laboratorio Interactivo...');
  
  // Verificar que los elementos necesarios existen
  const requiredElements = [
    '.editor-content pre code',
    '.output-content',
    '.demo-output'
  ];
  
  const missingElements = requiredElements.filter(selector => 
    !document.querySelector(selector)
  );
  
  if (missingElements.length > 0) {
    console.error('❌ Elementos del laboratorio faltantes:', missingElements);
    return false;
  }
  
  // Ejecutar estado inicial
  executeWithBug();
  
  // Añadir event listeners adicionales si es necesario
  addKeyboardShortcuts();
  
  console.log('✅ Laboratorio Interactivo inicializado correctamente');
  return true;
}

/**
 * Añade atajos de teclado para el laboratorio
 */
function addKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Enter: Ejecutar código
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
    
    // Ctrl/Cmd + R: Reset código
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      resetCode();
    }
    
    // Ctrl/Cmd + F: Fix código
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      fixCode();
    }
  });
}

// ========================================
// 🎯 AUTO-INICIALIZACIÓN
// ========================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLaboratory);
} else {
  initializeLaboratory();
}

// Exportar funciones para uso global
window.runCode = runCode;
window.fixCode = fixCode;
window.resetCode = resetCode;

console.log('🔬 Laboratorio Interactivo cargado y listo para usar');