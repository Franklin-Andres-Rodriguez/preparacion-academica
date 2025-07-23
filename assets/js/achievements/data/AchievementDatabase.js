/* =====================================================
 * 📁 assets/js/achievements/data/AchievementDatabase.js
 * SINGLE RESPONSIBILITY: Achievement data management
 * Clean separation of data from logic
 * ===================================================== */

/**
 * Achievement Database - Data Management Only
 * 
 * Martin Fowler: "Separate data from behavior"
 * This class ONLY manages achievement data
 */
class AchievementDatabase {
  constructor() {
    this.achievements = new Map();
    this.categories = new Map();
    this.initializeAchievements();
  }
  
  initializeAchievements() {
    // Mastery Achievements
    this.addAchievement({
      id: 'bug_spotter_bronze',
      title: '🔍 Bug Spotter',
      description: 'Identified your first expensive bug pattern',
      category: 'mastery',
      subcategory: 'bug_prevention',
      rarity: 'common',
      cost_saved: 180000,
      psychologicalTrigger: 'competency_recognition',
      conditionType: 'complete_case',
      condition: { caseId: 'naming' },
      reward: {
        badge: 'bronze_shield',
        socialShare: 'I just prevented a $180K bug! 🛡️'
      }
    });
    
    this.addAchievement({
      id: 'bug_hunter_silver',
      title: '🎯 Bug Hunter',
      description: 'Prevented 3 different expensive bug types',
      category: 'mastery',
      subcategory: 'bug_prevention',
      rarity: 'uncommon',
      cost_saved: 1080000,
      psychologicalTrigger: 'progression_momentum',
      conditionType: 'complete_count',
      condition: { count: 3 },
      reward: {
        badge: 'silver_crosshair',
        socialShare: 'I\'ve prevented over $1M in potential bugs! 🎯'
      }
    });
    
    // Speed Achievements
    this.addAchievement({
      id: 'speed_demon',
      title: '⚡ Speed Demon',
      description: 'Solved precedence case in under 5 minutes',
      category: 'efficiency',
      subcategory: 'speed',
      rarity: 'rare',
      psychologicalTrigger: 'flow_state_achievement',
      conditionType: 'speed_threshold',
      condition: { timeMs: 300000 }, // 5 minutes
      reward: {
        badge: 'lightning_bolt',
        bonus: '+50 XP speed bonus'
      }
    });
    
    // Discovery Achievements
    this.addAchievement({
      id: 'hidden_gems',
      title: '💎 Hidden Gems',
      description: 'Found secret developer messages in code comments',
      category: 'discovery',
      subcategory: 'easter_eggs',
      rarity: 'uncommon',
      psychologicalTrigger: 'curiosity_reward',
      conditionType: 'discovery_count',
      condition: { discoveryType: 'easter_egg', count: 1 },
      reward: {
        badge: 'diamond_magnifier',
        socialShare: 'I found hidden gems in the codebase! 💎'
      }
    });
  }
  
  addAchievement(achievementData) {
    this.achievements.set(achievementData.id, achievementData);
    
    // Add to category index
    const categoryKey = `${achievementData.category}_${achievementData.subcategory}`;
    if (!this.categories.has(categoryKey)) {
      this.categories.set(categoryKey, []);
    }
    this.categories.get(categoryKey).push(achievementData.id);
  }
  
  getAchievement(id) {
    return this.achievements.get(id);
  }
  
  getAllAchievements() {
    return Array.from(this.achievements.values());
  }
  
  getAchievementsByCategory(category, subcategory = null) {
    const categoryKey = subcategory ? `${category}_${subcategory}` : category;
    const achievementIds = this.categories.get(categoryKey) || [];
    return achievementIds.map(id => this.achievements.get(id));
  }
  
  getAchievementsByRarity(rarity) {
    return this.getAllAchievements().filter(a => a.rarity === rarity);
  }
}
