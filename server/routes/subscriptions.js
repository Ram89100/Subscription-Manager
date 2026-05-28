const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimiter = require('../utils/rateLimiter');

const prisma = new PrismaClient();
const router = express.Router();


router.use(authMiddleware);


router.get('/', async (req, res) => {
  const userId = req.user.userId;
  const subscriptions = await prisma.subscription.findMany({
    where: { user_id: userId },
    include: { service: { include: { category: true } } },
  });
  res.json(subscriptions);
});


router.post('/', async (req, res) => {
  const userId = req.user.userId;
  const { serviceId, price, renewalDate } = req.body;
  const newSubscription = await prisma.subscription.create({
    data: {
      price: parseFloat(price),
      renewal_date: new Date(renewalDate),
      service_id: parseInt(serviceId),
      user_id: userId,
    },
    include: { service: { include: { category: true } } },
  });
  res.status(201).json(newSubscription);
});


router.delete('/:id', async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {

    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subscription || subscription.user_id !== userId) {
    
      return res.status(404).json({ error: "Subscription not found." });
    }

    await prisma.subscription.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: "Could not delete subscription." });
  }
});


router.put('/:id', async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { price, renewal_date } = req.body;

  try {
    // Verify the subscription belongs to the user
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subscription || subscription.user_id !== userId) {
      return res.status(404).json({ error: "Subscription not found." });
    }

    // Prepare update data
    const updateData = {};
    if (price !== undefined) {
      updateData.price = parseFloat(price);
    }
    if (renewal_date !== undefined) {
      updateData.renewal_date = new Date(renewal_date);
    }
    console.log("date", renewal_date);
    

    // Update the subscription
    const updated = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { service: { include: { category: true } } },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Could not update subscription." });
  }
});

/**
 * POST /:id/log-usage
 * Log usage for a subscription with rate limiting (max 5 logs per hour)
 */
router.post('/:id/log-usage', async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { durationMinutes = null, activityType = 'manual_log' } = req.body;

  try {
    // Verify subscription exists and belongs to user
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
      include: { service: true },
    });

    if (!subscription || subscription.user_id !== userId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(subscription.id)) {
      const remaining = rateLimiter.getRemaining(subscription.id);
      const timeUntilReset = rateLimiter.getTimeUntilReset(subscription.id);
      
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `You can only log usage 5 times per hour. Try again in ${Math.ceil(timeUntilReset / 1000 / 60)} minutes.`,
        remaining: 0,
        resetIn: Math.ceil(timeUntilReset / 1000 / 60),
      });
    }

    // Create usage log entry
    const usageLog = await prisma.usageLog.create({
      data: {
        subscription_id: subscription.id,
        used_at: new Date(),
        duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
        activity_type: activityType,
      },
    });

    // Update subscription's last_used_at
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { last_used_at: new Date() },
    });

    const remaining = rateLimiter.getRemaining(subscription.id);

    res.status(201).json({
      success: true,
      message: `✅ Logged usage for ${subscription.service.name}`,
      usageLog,
      rateLimit: {
        remaining,
        maxPerHour: 5,
      },
    });
  } catch (error) {
    console.error('Error logging usage:', error);
    res.status(500).json({ error: 'Failed to log usage' });
  }
});

/**
 * GET /:id/usage-logs
 * Get all usage logs for a subscription
 */
router.get('/:id/usage-logs', async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { limit = 20, days = 30 } = req.query;

  try {
    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subscription || subscription.user_id !== userId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        subscription_id: subscription.id,
        used_at: {
          gte: startDate,
        },
      },
      orderBy: { used_at: 'desc' },
      take: parseInt(limit),
    });

    const stats = {
      totalLogs: usageLogs.length,
      dateRange: `Last ${days} days`,
      logs: usageLogs,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching usage logs:', error);
    res.status(500).json({ error: 'Failed to fetch usage logs' });
  }
});

module.exports = router;
