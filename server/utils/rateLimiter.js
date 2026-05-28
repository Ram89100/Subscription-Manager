/**
 * Rate Limiter for Usage Logging
 * Prevents abuse by limiting logs per subscription per hour
 * 
 * Rules:
 * - Max 5 usage logs per subscription per hour
 * - Resets every hour
 */

class RateLimiter {
  constructor(maxLogsPerHour = 5) {
    this.maxLogsPerHour = maxLogsPerHour;
    this.logs = {}; // Structure: { subscriptionId: { hour: timestamp, count: int } }
  }

  /**
   * Check if usage can be logged
   * @param {number} subscriptionId - Subscription ID
   * @returns {boolean} True if allowed, false if rate limited
   */
  isAllowed(subscriptionId) {
    const now = new Date();
    const currentHour = Math.floor(now.getTime() / (1000 * 60 * 60)); // Current hour timestamp

    if (!this.logs[subscriptionId]) {
      this.logs[subscriptionId] = { hour: currentHour, count: 0 };
    }

    const record = this.logs[subscriptionId];

    // Check if we're in a new hour
    if (record.hour !== currentHour) {
      // Reset for new hour
      record.hour = currentHour;
      record.count = 0;
    }

    // Check if limit exceeded
    if (record.count >= this.maxLogsPerHour) {
      return false;
    }

    // Increment and allow
    record.count++;
    return true;
  }

  /**
   * Get remaining logs allowed for this hour
   * @param {number} subscriptionId - Subscription ID
   * @returns {number} Remaining logs allowed
   */
  getRemaining(subscriptionId) {
    const now = new Date();
    const currentHour = Math.floor(now.getTime() / (1000 * 60 * 60));

    if (!this.logs[subscriptionId]) {
      return this.maxLogsPerHour;
    }

    const record = this.logs[subscriptionId];

    // Check if we're in a new hour
    if (record.hour !== currentHour) {
      return this.maxLogsPerHour;
    }

    return Math.max(0, this.maxLogsPerHour - record.count);
  }

  /**
   * Get time until reset
   * @param {number} subscriptionId - Subscription ID
   * @returns {number} Milliseconds until next hour
   */
  getTimeUntilReset(subscriptionId) {
    const now = new Date();
    const nextHour = Math.ceil(now.getTime() / (1000 * 60 * 60)) * (1000 * 60 * 60);
    return nextHour - now.getTime();
  }

  /**
   * Reset all limits (for testing)
   */
  reset() {
    this.logs = {};
  }

  /**
   * Get stats for debugging
   */
  getStats() {
    return {
      maxLogsPerHour: this.maxLogsPerHour,
      trackedSubscriptions: Object.keys(this.logs).length,
      details: this.logs,
    };
  }
}

// Export singleton instance
module.exports = new RateLimiter(5); // Max 5 logs per subscription per hour
