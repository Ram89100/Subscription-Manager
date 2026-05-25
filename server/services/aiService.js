const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generates AI spending insights for a user
 * @param {number} userId - User ID
 * @returns {Promise<string>} Generated insight text
 */
const generateSpendingInsights = async (userId) => {
  try {
    console.log(`🤖 Generating AI insights for user ${userId}...`);
    
    // Fetch user's subscription data
    const subscriptions = await prisma.subscription.findMany({
      where: { user_id: userId },
      include: {
        service: { include: { category: true } },
        usage_logs: {
          orderBy: { used_at: 'desc' },
          take: 10,
        },
      },
    });

    if (subscriptions.length === 0) {
      return "You don't have any active subscriptions yet. Start tracking to get insights!";
    }

    // Calculate spending metrics
    const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

    // Group by category
    const spendingByCategory = {};
    subscriptions.forEach((sub) => {
      const categoryName = sub.service.category.name;
      spendingByCategory[categoryName] =
        (spendingByCategory[categoryName] || 0) + sub.price;
    });

    // Identify unused services (no usage in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const unusedServices = subscriptions
      .filter((sub) => {
        const lastUsage = sub.usage_logs[0]?.used_at;
        return !lastUsage || lastUsage < thirtyDaysAgo;
      })
      .map((sub) => ({
        name: sub.service.name,
        price: sub.price,
        lastUsed: sub.usage_logs[0]?.used_at,
      }));

    // Prepare data for LLM
    const dataForLLM = {
      totalMonthlySpend: totalMonthlySpend.toFixed(2),
      subscriptionCount: subscriptions.length,
      activeSubscriptions: subscriptions
        .filter((s) => s.status === 'ACTIVE')
        .map((s) => ({
          name: s.service.name,
          price: s.price,
          category: s.service.category.name,
          renewalDate: s.renewal_date,
          autoRenew: s.auto_renew,
        })),
      spendingByCategory: Object.entries(spendingByCategory).map(([category, amount]) => ({
        category,
        amount: amount.toFixed(2),
      })),
      unusedServices: unusedServices.slice(0, 5), // Top 5 unused
    };

    // Call Gemini API
    const systemPrompt = `You are a personal finance advisor specializing in subscription management. 
Analyze the user's subscription data and provide 3-4 concise, actionable insights in bullet points.
Focus on:
1. Spending patterns and categories
2. Unused or rarely-used services
3. Potential savings opportunities
4. Budget recommendations

Be specific with numbers and service names. Keep each insight to 1-2 sentences. Format as bullet points.`;

    const userPrompt = `Analyze my subscription data and provide smart spending insights:

Total Monthly Spend: ₹${dataForLLM.totalMonthlySpend}
Active Subscriptions: ${dataForLLM.subscriptionCount}

Active Subscriptions:
${dataForLLM.activeSubscriptions.map((s) => `- ${s.name}: ₹${s.price}/month (${s.category})`).join('\n')}

Spending by Category:
${dataForLLM.spendingByCategory.map((c) => `- ${c.category}: ₹${c.amount}`).join('\n')}

Unused Services (Not used in 30 days):
${
  dataForLLM.unusedServices.length > 0
    ? dataForLLM.unusedServices.map((s) => `- ${s.name}: ₹${s.price}/month`).join('\n')
    : '- None (all services are being used)'
}

Please provide specific, actionable insights to help me optimize my spending.`;

    const combinedPrompt = `${systemPrompt}\n\nUser Request:\n${userPrompt}`;
    
    const result = await model.generateContent(combinedPrompt);
    const insightText = result.response.text();

    console.log('✅ AI insight generated successfully');

    // Store insight in database
    const aiInsight = await prisma.aiInsight.create({
      data: {
        user_id: userId,
        insight_text: insightText,
        insight_type: 'spending_analysis',
        severity: 'info',
        actionable: true,
      },
    });

    // Also create a notification for the user
    await prisma.notification.create({
      data: {
        user_id: userId,
        type: 'AI_SUGGESTION',
        message: '🤖 New AI spending insights available!',
        related_subscription_id: null,
      },
    });

    return aiInsight;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
};

/**
 * Get recent insights for a user
 * @param {number} userId - User ID
 * @param {number} limit - Number of insights to fetch
 * @returns {Promise<Array>} Array of AI insights
 */
const getUserInsights = async (userId, limit = 10) => {
  try {
    const insights = await prisma.aiInsight.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
    return insights;
  } catch (error) {
    console.error('❌ Error fetching insights:', error);
    throw new Error(`Failed to fetch insights: ${error.message}`);
  }
};

/**
 * Dismiss an insight
 * @param {number} insightId - Insight ID
 * @param {number} userId - User ID (for verification)
 * @returns {Promise<Object>} Updated insight
 */
const dismissInsight = async (insightId, userId) => {
  try {
    const insight = await prisma.aiInsight.findUnique({
      where: { id: insightId },
    });

    if (!insight || insight.user_id !== userId) {
      throw new Error('Insight not found');
    }

    const updated = await prisma.aiInsight.update({
      where: { id: insightId },
      data: { dismissed_at: new Date() },
    });

    return updated;
  } catch (error) {
    console.error('❌ Error dismissing insight:', error);
    throw new Error(`Failed to dismiss insight: ${error.message}`);
  }
};

module.exports = {
  generateSpendingInsights,
  getUserInsights,
  dismissInsight,
};
