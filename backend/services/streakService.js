const APPRECIATION_MESSAGES = [
  "🎉 Great job! You successfully completed this recipe.",
  "👨‍🍳 Chef Level Up! Your dedication makes every dish better.",
  "🔥 Amazing work! You stayed till the end and finished cooking.",
  "🏆 Recipe Completed! Keep exploring and cooking new dishes.",
  "✨ Fantastic effort! Your meal is ready and your cooking skills are growing."
];

/**
 * Evaluates cooking badges dynamically based on the current streak count
 * @param {number} streak - The user's active streak count
 * @returns {Array} Matching achievement badges
 */
const getStreakBadges = (streak) => {
  const badges = [];
  if (streak >= 1) {
    badges.push({ id: '1', name: 'Getting Started', icon: '🔥', days: 1, desc: '1 Day Streak - Getting Started' });
  }
  if (streak >= 3) {
    badges.push({ id: '3', name: 'Consistent Cook', icon: '🔥', days: 3, desc: '3 Day Streak - Consistent Cook' });
  }
  if (streak >= 7) {
    badges.push({ id: '7', name: 'Dedicated Chef', icon: '🔥', days: 7, desc: '7 Day Streak - Dedicated Chef' });
  }
  if (streak >= 15) {
    badges.push({ id: '15', name: 'Kitchen Expert', icon: '🔥', days: 15, desc: '15 Day Streak - Kitchen Expert' });
  }
  if (streak >= 30) {
    badges.push({ id: '30', name: 'Cooking Champion', icon: '🔥', days: 30, desc: '30 Day Streak - Cooking Champion' });
  }
  return badges;
};

/**
 * Gets a random appreciation message
 * @returns {string} Appreciation message
 */
const getRandomAppreciationMessage = () => {
  const randomIndex = Math.floor(Math.random() * APPRECIATION_MESSAGES.length);
  return APPRECIATION_MESSAGES[randomIndex];
};

module.exports = {
  getStreakBadges,
  getRandomAppreciationMessage
};
