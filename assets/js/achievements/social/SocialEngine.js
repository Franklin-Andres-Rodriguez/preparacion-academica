/* =====================================================
 * 📁 assets/js/achievements/social/SocialEngine.js
 * SINGLE RESPONSIBILITY: Social psychology and community features
 * ~200 lines focused ONLY on social aspects
 * ===================================================== */

/**
 * Social Engine - Community Psychology
 * 
 * Robert Cialdini's Social Proof Theory applied
 * This class ONLY handles social and community features
 */
class SocialEngine {
  constructor(configAdapter) {
    this.config = configAdapter;
    this.communityData = new Map();
    this.socialMetrics = new Map();
  }
  
  /**
   * Calculate social proof multiplier
   * Cialdini's Social Proof Theory: People follow similar others
   */
  calculateSocialProof(achievementRarity, communitySize) {
    if (!this.config.isFeatureEnabled('enableSocialFeatures')) {
      return 1.0;
    }
    
    const rarityMultipliers = {
      'common': 1.0,
      'uncommon': 1.3,
      'rare': 1.6,
      'legendary': 2.0
    };
    
    const rarityBoost = rarityMultipliers[achievementRarity] || 1.0;
    const communityFactor = Math.min(1.5, 1 + Math.log10(communitySize / 1000));
    
    return rarityBoost * communityFactor;
  }
  
  /**
   * Generate positive peer comparison
   * Carefully designed to motivate without discouraging
   */
  generatePeerComparison(userData, peerGroup) {
    const userPercentile = this.calculatePercentile(userData, peerGroup);
    const strengths = this.identifyStrengths(userData, peerGroup);
    const opportunities = this.identifyOpportunities(userData, peerGroup);
    
    return {
      percentileMessage: this.generatePositiveMessage(userPercentile),
      strengths: strengths,
      nextMilestone: this.findNextMilestone(userData, peerGroup),
      communityImpact: this.calculateCommunityImpact(userData)
    };
  }
  
  /**
   * Generate shareable content optimized for engagement
   */
  generateShareContent(achievement, userData) {
    const impactMessage = this.formatImpactMessage(achievement);
    const visualElements = this.generateVisualElements(achievement);
    
    return {
      headline: `🛡️ I just prevented a ${this.formatCurrency(achievement.cost_saved)} bug!`,
      description: `Mastered ${achievement.title} - another expensive coding mistake avoided.`,
      visual: visualElements,
      hashtags: ['#BugPrevention', '#CleanCode', '#SoftwareEngineering'],
      shareUrl: this.generateShareUrl(achievement, userData)
    };
  }
  
  // Helper methods focused on social psychology
  calculatePercentile(userData, peerGroup) {
    const betterThanCount = peerGroup.filter(peer => 
      userData.totalScore > peer.totalScore
    ).length;
    
    return Math.max(10, Math.floor((betterThanCount / peerGroup.length) * 100));
  }
  
  generatePositiveMessage(percentile) {
    if (percentile >= 80) return 'Top 20% performer! 🌟';
    if (percentile >= 60) return 'Above average - great progress! 📈';
    if (percentile >= 40) return 'Solid foundation - ready for growth! 🚀';
    return 'Great potential - exciting journey ahead! 🌱';
  }
  
  formatCurrency(amount) {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  }
}
