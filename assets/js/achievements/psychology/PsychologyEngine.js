/* =====================================================
 * 📁 assets/js/achievements/psychology/PsychologyEngine.js
 * SINGLE RESPONSIBILITY: Behavioral psychology calculations
 * ~250 lines focused ONLY on psychology
 * ===================================================== */

/**
 * Psychology Engine - Behavioral Optimization
 * 
 * Dan Abramov: "Focus on fundamentals that don't change"
 * Psychology principles are fundamental and stable
 */
class PsychologyEngine {
  constructor(configAdapter) {
    this.config = configAdapter;
    this.userPsychData = new Map();
    
    // Research-based psychological constants
    this.PSYCHOLOGY_CONSTANTS = {
      VARIABLE_RATIO_OPTIMAL: 3.7,
      DOPAMINE_PEAK_DELAY: 500,
      FLOW_ZONE_THRESHOLD: 0.85,
      SOCIAL_PROOF_MULTIPLIER: 1.4
    };
  }
  
  /**
   * Calculate dopamine optimization score
   * Variable Ratio Reinforcement (B.F. Skinner's most powerful principle)
   */
  calculateDopamineScore(userId, achievementTrigger, completionHistory) {
    if (!this.config.isFeatureEnabled('enablePsychologyOptimization')) {
      return 5.0; // Baseline score
    }
    
    const userPatterns = this.getUserPsychData(userId);
    const unpredictability = this.calculateUnpredictability(completionHistory);
    const triggerBoost = this.getTriggerBoost(achievementTrigger);
    const noveltyFactor = this.calculateNoveltyFactor(userPatterns, achievementTrigger);
    
    const score = unpredictability * triggerBoost * noveltyFactor;
    
    // Update user patterns for future calculations
    this.updateUserPsychData(userId, achievementTrigger, score);
    
    return Math.min(10, Math.max(1, score));
  }
  
  /**
   * Calculate Flow State indicators
   * Csikszentmihalyi's Flow Theory application
   */
  calculateFlowState(userSkillLevel, challengeDifficulty) {
    const skillLevel = this.normalizeLevel(userSkillLevel);
    const difficultyLevel = this.normalizeLevel(challengeDifficulty);
    
    const challengeSkillRatio = difficultyLevel / skillLevel;
    const optimalRatio = 1.15; // 15% challenge excess for optimal flow
    
    const flowScore = Math.max(0, 1 - Math.abs(challengeSkillRatio - optimalRatio));
    
    let flowState;
    if (challengeSkillRatio < 0.7) flowState = 'boredom';
    else if (challengeSkillRatio > 1.5) flowState = 'anxiety';
    else if (flowScore > this.PSYCHOLOGY_CONSTANTS.FLOW_ZONE_THRESHOLD) flowState = 'flow';
    else flowState = 'learning';
    
    return { flowScore, flowState, challengeSkillRatio };
  }
  
  /**
   * Predict engagement based on psychology patterns
   */
  predictEngagement(userId, achievementData) {
    const userData = this.userPsychData.get(userId) || this.createUserPsychData(userId);
    const recentTrend = this.calculateEngagementTrend(userData.engagementHistory);
    const achievementImpact = this.calculateAchievementImpact(achievementData);
    
    const predictedScore = recentTrend.average + (achievementImpact * 0.4);
    
    return {
      predictedScore: Math.min(10, Math.max(1, predictedScore)),
      confidence: this.calculateConfidence(userData.engagementHistory.length),
      trend: recentTrend.direction
    };
  }
  
  // Helper methods - keep this class focused on psychology
  calculateUnpredictability(history) {
    if (history.length < 3) return this.PSYCHOLOGY_CONSTANTS.VARIABLE_RATIO_OPTIMAL;
    
    const intervals = history.slice(1).map((item, i) => item.timestamp - history[i].timestamp);
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) / intervals.length;
    
    return Math.min(10, Math.sqrt(variance) / mean * this.PSYCHOLOGY_CONSTANTS.VARIABLE_RATIO_OPTIMAL);
  }
  
  getTriggerBoost(trigger) {
    const boosts = {
      'competency_recognition': 1.8,
      'progression_momentum': 1.6,
      'mastery_achievement': 2.2,
      'flow_state_achievement': 1.9,
      'social_recognition': 1.7
    };
    return boosts[trigger] || 1.0;
  }
  
  getUserPsychData(userId) {
    return this.userPsychData.get(userId) || this.createUserPsychData(userId);
  }
  
  createUserPsychData(userId) {
    const data = {
      userId,
      triggerHistory: new Map(),
      engagementHistory: [],
      flowStateHistory: [],
      lastUpdate: Date.now()
    };
    this.userPsychData.set(userId, data);
    return data;
  }
  
  updateUserPsychData(userId, trigger, score) {
    const data = this.getUserPsychData(userId);
    data.triggerHistory.set(trigger, (data.triggerHistory.get(trigger) || 0) + 1);
    data.engagementHistory.push({ trigger, score, timestamp: Date.now() });
    
    // Keep history manageable
    if (data.engagementHistory.length > 50) {
      data.engagementHistory = data.engagementHistory.slice(-25);
    }
  }
}
