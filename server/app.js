const express = require('express'); 
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const subscriptionRoutes = require('./routes/subscriptions'); 
const serviceRoutes = require('./routes/services'); 
const { PrismaClient } = require('./generated/prisma'); 

const prisma = new PrismaClient(); 
const app = express(); 

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/services', serviceRoutes);

app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Root path
app.get('/', (req, res) => {
  res.json({ message: 'Subscription Manager API is running' });
});

// 404 error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
