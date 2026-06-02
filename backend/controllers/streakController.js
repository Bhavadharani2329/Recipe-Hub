const User = require('../models/User');
const CompletedRecipe = require('../models/CompletedRecipe');
const streakService = require('../services/streakService');

// @desc    Log completed recipe & update streak metrics
// @route   POST /api/streaks/complete
// @access  Private
exports.completeRecipe = async (req, res) => {
  const { recipeId, recipeTitle } = req.body;

  try {
    if (!recipeId || !recipeTitle) {
      return res.status(400).json({ error: 'Please provide recipeId and recipeTitle' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = new Date();
    let streakIncremented = false;
    let streakReset = false;
    let oldStreak = user.currentStreak;

    // Log the completed session
    await CompletedRecipe.create({
      userId: user._id,
      recipeId: String(recipeId),
      recipeTitle
    });

    if (!user.lastCompletedDate) {
      // First cooking completion
      user.currentStreak = 1;
      streakIncremented = true;
    } else {
      const d1 = new Date(user.lastCompletedDate);
      d1.setHours(0, 0, 0, 0);
      
      const d2 = new Date(today);
      d2.setHours(0, 0, 0, 0);

      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive calendar day
        user.currentStreak += 1;
        streakIncremented = true;
      } else if (diffDays > 1) {
        // Skipped a calendar day, reset streak to 1
        user.currentStreak = 1;
        streakReset = true;
      }
      // Note: if diffDays === 0, they completed another recipe on the same day.
      // The current streak remains the same (doesn't increment or reset).
    }

    // Update longest streak records
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    // Always update last completion timestamp
    user.lastCompletedDate = today;
    await user.save();

    // Select random appreciation message using service
    const appreciationMessage = streakService.getRandomAppreciationMessage();

    // Evaluate badges dynamically using service based on current streak
    const badges = streakService.getStreakBadges(user.currentStreak);

    // Return completion details to the frontend
    res.json({
      message: 'Cooking session completed!',
      appreciationMessage,
      streakIncremented,
      streakReset,
      stats: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastCompletedDate: user.lastCompletedDate,
        oldStreak
      },
      badges
    });
  } catch (error) {
    console.error('Error completing cooking session:', error);
    res.status(500).json({ error: 'Server error processing cooking completion' });
  }
};

// @desc    Get user's cooking streak history
// @route   GET /api/streaks/history
// @access  Private
exports.getStreakHistory = async (req, res) => {
  try {
    const completions = await CompletedRecipe.find({ userId: req.user.id }).sort({ completedAt: -1 });
    res.json(completions);
  } catch (error) {
    console.error('Error fetching completions:', error);
    res.status(500).json({ error: 'Server error fetching cooking history' });
  }
};
