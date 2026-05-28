const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authMiddleware = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET - Fetch all notifications for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { unreadOnly = false } = req.query;

    const whereClause = { user_id: userId };
    if (unreadOnly === 'true') {
      whereClause.read_status = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      take: 50, // Limit to last 50 notifications
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET - Fetch unread notifications count
router.get('/unread/count', async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await prisma.notification.count({
      where: {
        user_id: userId,
        read_status: false,
      },
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// PATCH - Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    // Verify notification belongs to user
    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        read_status: true,
        read_at: new Date(),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PATCH - Mark all notifications as read
router.patch('/read/all', async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.notification.updateMany({
      where: {
        user_id: userId,
        read_status: false,
      },
      data: {
        read_status: true,
        read_at: new Date(),
      },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// DELETE - Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    // Verify notification belongs to user
    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
