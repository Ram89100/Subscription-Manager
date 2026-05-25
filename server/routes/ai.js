const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authMiddleware = require('../middleware/authMiddleware');
const {
  generateSpendingInsights,
  getUserInsights,
  dismissInsight,
} = require('../services/aiService');

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * POST /api/ai/generate-insights
 * Generate new AI spending insights for the user
 */
router.post('/generate-insights', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user has subscriptions
    const subscriptionCount = await prisma.subscription.count({
      where: { user_id: userId },
    });

    if (subscriptionCount === 0) {
      return res.status(400).json({
        error: 'No subscriptions found. Add subscriptions first to get insights!',
      });
    }

    // Generate insights
    const insight = await generateSpendingInsights(userId);

    res.status(201).json({
      success: true,
      message: 'AI insights generated successfully',
      insight,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate insights',
    });
  }
});

/**
 * GET /api/ai/insights
 * Fetch recent AI insights for the user
 */
router.get('/insights', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.query;

    const insights = await getUserInsights(userId, parseInt(limit));

    res.json({
      success: true,
      count: insights.length,
      insights,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch insights',
    });
  }
});

/**
 * GET /api/ai/insights/active
 * Fetch active (not dismissed) AI insights
 */
router.get('/insights/active', async (req, res) => {
  try {
    const userId = req.user.userId;

    const activeInsights = await prisma.aiInsight.findMany({
      where: {
        user_id: userId,
        dismissed_at: null,
      },
      orderBy: { created_at: 'desc' },
      take: 5,
    });

    res.json({
      success: true,
      count: activeInsights.length,
      insights: activeInsights,
    });
  } catch (error) {
    console.error('Error fetching active insights:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch active insights',
    });
  }
});

/**
 * PATCH /api/ai/insights/:id/dismiss
 * Dismiss an insight
 */
router.patch('/insights/:id/dismiss', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const updated = await dismissInsight(parseInt(id), userId);

    res.json({
      success: true,
      message: 'Insight dismissed',
      insight: updated,
    });
  } catch (error) {
    console.error('Error dismissing insight:', error);
    res.status(500).json({
      error: error.message || 'Failed to dismiss insight',
    });
  }
});

/**
 * DELETE /api/ai/insights/:id
 * Delete an insight permanently
 */
router.delete('/insights/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Verify insight belongs to user
    const insight = await prisma.aiInsight.findUnique({
      where: { id: parseInt(id) },
    });

    if (!insight || insight.user_id !== userId) {
      return res.status(404).json({ error: 'Insight not found' });
    }

    await prisma.aiInsight.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting insight:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete insight',
    });
  }
});

/**
 * GET /api/ai/health
 * Check if AI service is configured
 */
router.get('/health', async (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  res.json({
    status: hasApiKey ? 'configured' : 'not-configured',
    openaiConfigured: hasApiKey,
  });
});

module.exports = router;
