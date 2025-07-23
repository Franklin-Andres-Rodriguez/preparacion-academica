/* =====================================================
 * 📁 assets/js/achievements/ui/AchievementUI.js
 * SINGLE RESPONSIBILITY: User interface and presentation
 * Clean separation of UI from business logic
 * ===================================================== */

/**
 * Achievement UI Manager - Presentation Layer
 * 
 * Sarah Drasner: "Animations should enhance, not distract"
 * This class ONLY handles UI presentation
 */
class AchievementUI {
  constructor(configAdapter) {
    this.config = configAdapter;
    this.animationQueue = [];
    this.isAnimating = false;
  }
  
  /**
   * Show achievement unlock with optimized psychology timing
   */
  showAchievementUnlock(achievement, engagementData) {
    const delay = this.calculateOptimalDelay(achievement.rarity);
    
    setTimeout(() => {
      this.createAchievementNotification(achievement, engagementData);
    }, delay);
  }
  
  createAchievementNotification(achievement, engagementData) {
    const notification = this.buildNotificationElement(achievement);
    this.addCelebrationAnimation(notification, achievement.rarity);
    this.addShareButtons(notification, achievement);
    
    // Show with entrance animation
    document.body.appendChild(notification);
    this.animateEntrance(notification);
    
    // Auto-hide after duration
    const duration = this.calculateDisplayDuration(achievement.rarity);
    setTimeout(() => {
      this.animateExit(notification);
    }, duration);
  }
  
  buildNotificationElement(achievement) {
    const element = document.createElement('div');
    element.className = `achievement-notification achievement--${achievement.rarity}`;
    element.innerHTML = `
      <div class="achievement__badge">
        <span class="achievement__icon">${achievement.reward.badge}</span>
      </div>
      <div class="achievement__content">
        <h3 class="achievement__title">${achievement.title}</h3>
        <p class="achievement__description">${achievement.description}</p>
        ${achievement.cost_saved ? `<div class="achievement__savings">$${this.formatNumber(achievement.cost_saved)} saved</div>` : ''}
      </div>
    `;
    
    return element;
  }
  
  generateProgressDashboard(userId, dashboardData) {
    const container = document.createElement('div');
    container.className = 'achievement-dashboard';
    
    // Progress rings
    const progressSection = this.createProgressRings(dashboardData.progressRings);
    container.appendChild(progressSection);
    
    // Achievement showcase
    const achievementSection = this.createAchievementShowcase(dashboardData.achievements);
    container.appendChild(achievementSection);
    
    // Social elements
    if (this.config.isFeatureEnabled('enableSocialFeatures')) {
      const socialSection = this.createSocialSection(dashboardData.social);
      container.appendChild(socialSection);
    }
    
    return container;
  }
  
  // Animation methods
  calculateOptimalDelay(rarity) {
    const baseDelay = 500; // Psychology research: 500ms optimal
    const rarityMultipliers = { 'common': 1, 'uncommon': 1.2, 'rare': 1.5, 'legendary': 2 };
    return baseDelay * (rarityMultipliers[rarity] || 1);
  }
  
  animateEntrance(element) {
    if (this.config.get('preferences.reducedMotion', false)) {
      element.style.opacity = '1';
      return;
    }
    
    element.style.transform = 'translateY(-50px) scale(0.8)';
    element.style.opacity = '0';
    
    requestAnimationFrame(() => {
      element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      element.style.transform = 'translateY(0) scale(1)';
      element.style.opacity = '1';
    });
  }
  
  formatNumber(number) {
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(0)}K`;
    return number.toString();
  }
}