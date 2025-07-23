/* =====================================================
 * 📁 assets/js/achievements/index.js
 * ORCHESTRATOR: Coordinates all modules (Dependency Injection)
 * ===================================================== */

/**
 * Achievement System Orchestrator
 * 
 * Robert C. Martin: "Dependencies should be injected, not created"
 * This class coordinates modules without implementing business logic
 */
class AchievementSystemOrchestrator {
  constructor(configAdapter) {
    // Dependency injection - each module has single responsibility
    this.config = configAdapter;
    this.database = new AchievementDatabase();
    this.psychologyEngine = new PsychologyEngine(configAdapter);
    this.socialEngine = new SocialEngine(configAdapter);
    this.achievementEngine = new AchievementEngine(configAdapter, this.database);
    this.ui = new AchievementUI(configAdapter);
    
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    // Listen for achievement unlocks and handle UI
    this.achievementEngine.on('achievement:unlocked', (data) => {
      const psychData = this.psychologyEngine.calculateDopamineScore(
        data.userId, data.achievement.psychologicalTrigger, []
      );
      
      this.ui.showAchievementUnlock(data.achievement, { dopamine_score: psychData });
      
      if (this.config.isFeatureEnabled('enableSocialFeatures')) {
        const shareContent = this.socialEngine.generateShareContent(data.achievement, data);
        // Handle social sharing
      }
    });
  }
  
  // Public API - delegates to appropriate modules
  processCompletion(userId, caseId, completionData) {
    return this.achievementEngine.processCompletion(userId, caseId, completionData);
  }
  
  getDashboard(userId) {
    const userProgress = this.achievementEngine.userProgress.get(userId);
    if (!userProgress) return null;
    
    const psychData = this.psychologyEngine.predictEngagement(userId, {});
    const socialData = this.socialEngine.generatePeerComparison(userProgress, []);
    
    return {
      progress: userProgress,
      psychology: psychData,
      social: socialData
    };
  }
  
  initialize(coreAPI, notificationSystem) {
    // Connect with existing systems
    if (coreAPI) {
      coreAPI.onCaseCompletion((caseId, completionData) => {
        this.processCompletion(completionData.userId, caseId, completionData);
      });
    }
    
    return true;
  }
}

/* =====================================================
 * FINAL INTEGRATION - Clean & Minimal
 * ===================================================== */

// Export the clean, modular system
export {
  AchievementSystemOrchestrator,
  AchievementEngine,
  PsychologyEngine,
  SocialEngine,
  AchievementDatabase,
  AchievementUI
};

// Auto-initialize with dependency injection
let achievementSystem = null;

async function initializeAchievementSystem(configAdapter, coreAPI) {
  if (!achievementSystem) {
    achievementSystem = new AchievementSystemOrchestrator(configAdapter);
    await achievementSystem.initialize(coreAPI, window.notifications);
    
    // Global access
    window.achievementSystem = achievementSystem;
    
    utils.logWithContext('info', 'Achievements', '🏆 Clean modular achievement system ready');
  }
  
  return achievementSystem;
}

export default initializeAchievementSystem;
