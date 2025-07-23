/* =====================================================
 * 📁 assets/js/achievements/core/AchievementEngine.js
 * SINGLE RESPONSIBILITY: Core achievement processing logic
 * ===================================================== */

/**
 * Core Achievement Engine - Single Responsibility
 * 
 * Robert C. Martin: "A class should have one reason to change"
 * This class ONLY handles achievement unlocking logic
 */
class AchievementEngine {
  constructor(configAdapter, achievementDatabase) {
    this.config = configAdapter;
    this.database = achievementDatabase;
    this.userProgress = new Map();
    this.eventEmitter = new EventEmitter();
  }
  
  /**
   * Process case completion and check for achievements
   * @param {string} userId - User identifier
   * @param {string} caseId - Completed case
   * @param {Object} completionData - Completion details
   * @returns {Array} Newly unlocked achievements
   */
  processCompletion(userId, caseId, completionData) {
    // Update user progress
    const userProgress = this.updateUserProgress(userId, caseId, completionData);
    
    // Check for new achievements
    const newAchievements = this.checkAchievements(userProgress);
    
    // Emit events for new achievements
    newAchievements.forEach(achievement => {
      this.eventEmitter.emit('achievement:unlocked', {
        userId, achievement, completionData
      });
    });
    
    return newAchievements;
  }
  
  updateUserProgress(userId, caseId, completionData) {
    let progress = this.userProgress.get(userId) || this.createUserProgress(userId);
    
    progress.completions.push({
      caseId,
      timestamp: Date.now(),
      ...completionData
    });
    
    progress.statistics = this.calculateStatistics(progress.completions);
    
    this.userProgress.set(userId, progress);
    return progress;
  }
  
  checkAchievements(userProgress) {
    const newAchievements = [];
    const allAchievements = this.database.getAllAchievements();
    
    allAchievements.forEach(achievement => {
      if (this.meetsCondition(achievement, userProgress) && 
          !userProgress.unlockedAchievements.has(achievement.id)) {
        
        newAchievements.push(achievement);
        userProgress.unlockedAchievements.add(achievement.id);
      }
    });
    
    return newAchievements;
  }
  
  meetsCondition(achievement, userProgress) {
    const conditionCheckers = {
      'complete_case': (condition, progress) => 
        progress.completions.some(c => c.caseId === condition.caseId),
      
      'complete_count': (condition, progress) => 
        progress.completions.length >= condition.count,
      
      'speed_threshold': (condition, progress) => 
        progress.completions.some(c => c.completionTime < condition.timeMs),
      
      'accuracy_threshold': (condition, progress) => 
        progress.statistics.accuracy >= condition.accuracy
    };
    
    const checker = conditionCheckers[achievement.conditionType];
    return checker ? checker(achievement.condition, userProgress) : false;
  }
  
  createUserProgress(userId) {
    return {
      userId,
      createdAt: Date.now(),
      completions: [],
      unlockedAchievements: new Set(),
      statistics: { accuracy: 0, averageTime: 0, totalSavings: 0 }
    };
  }
  
  calculateStatistics(completions) {
    if (completions.length === 0) return { accuracy: 0, averageTime: 0, totalSavings: 0 };
    
    const totalTime = completions.reduce((sum, c) => sum + c.completionTime, 0);
    const totalMistakes = completions.reduce((sum, c) => sum + (c.mistakes || 0), 0);
    const totalSavings = completions.reduce((sum, c) => sum + (c.costPrevented || 0), 0);
    
    return {
      accuracy: Math.max(0, 1 - (totalMistakes / completions.length) * 0.1),
      averageTime: totalTime / completions.length,
      totalSavings: totalSavings
    };
  }
  
  // Event system for loose coupling
  on(event, callback) { this.eventEmitter.on(event, callback); }
  emit(event, data) { this.eventEmitter.emit(event, data); }
}