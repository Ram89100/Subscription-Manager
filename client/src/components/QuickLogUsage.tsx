import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { type Subscription } from '../services/api';
import '../styles/QuickLogUsage.css';

const API_BASE_URL = 'http://localhost:3001/api';

interface QuickLogUsageProps {
  subscriptions: Subscription[];
}

export default function QuickLogUsage({ subscriptions: initialSubscriptions }: QuickLogUsageProps) {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logging, setLogging] = useState<number | null>(null); // Track which sub is logging
  const [rateLimits, setRateLimits] = useState<Record<number, { remaining: number; maxPerHour: number }>>({}); // Track rate limits per subscription

  // Update subscriptions when props change
  useEffect(() => {
    setSubscriptions(initialSubscriptions);
    
    // Initialize rate limits for NEW subscriptions only (don't reset existing ones)
    setRateLimits((prevLimits) => {
      const newLimits = { ...prevLimits };
      initialSubscriptions.forEach((sub) => {
        // Only initialize if not already set
        if (!(sub.id in newLimits)) {
          newLimits[sub.id] = { remaining: 5, maxPerHour: 5 };
        }
      });
      return newLimits;
    });
  }, [initialSubscriptions]);

  /**
   * Log usage for a subscription
   */
  const handleLogUsage = async (subscriptionId:number, serviceName:string) => {
    setLogging(subscriptionId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/log-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityType: 'manual_log',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 429) {
          // Rate limited
          setError(
            `⏱️ Rate limit reached for ${serviceName}. ${errorData.message}`
          );
        } else {
          setError(errorData.error || 'Failed to log usage');
        }
        return;
      }

      const data = await response.json();

      // Update rate limits
      setRateLimits((prev) => ({
        ...prev,
        [subscriptionId]: {
          remaining: data.rateLimit.remaining,
          maxPerHour: data.rateLimit.maxPerHour,
        },
      }));

      // Show success message
      setSuccess(`✅ ${data.message}`);

      // Auto-hide success after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err:any) {
      setError(`❌ Error logging usage: ${err.message}`);
    } finally {
      setLogging(null);
    }
  };

  const getRateLimitColor = (remaining: number) => {
    if (remaining >= 3) return '#4caf50'; // Green
    if (remaining >= 1) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <div className="quick-log-container">
      <div className="quick-log-header">
        <h3>⚡ Quick Log Usage</h3>
        <p className="subtitle">Mark services as used to track activity (Max 5 per hour each)</p>
      </div>

      {/* Status Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Subscriptions Grid */}
      {subscriptions.length > 0 ? (
        <div className="subscriptions-grid">
          {subscriptions.map((sub) => {
            const limit = rateLimits[sub.id] || { remaining: 5, maxPerHour: 5 };
            const isLimited = limit.remaining === 0;

            return (
              <div key={sub.id} className="subscription-card">
                <div className="service-info">
                  <h4>{sub.service?.name || 'Unknown Service'}</h4>
                  <p className="category">
                    {sub.service?.category?.name || 'No category'}
                  </p>
                </div>

                <div className="rate-limit-display">
                  <div className="limit-text">
                    <span
                      className="remaining-count"
                      style={{ color: getRateLimitColor(limit.remaining) }}
                    >
                      {limit.remaining}/{limit.maxPerHour}
                    </span>
                    <span className="limit-label">Uses left/hour</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(limit.remaining / limit.maxPerHour) * 100}%`,
                        backgroundColor: getRateLimitColor(limit.remaining),
                      }}
                    ></div>
                  </div>
                </div>

                <div className="last-used">
                  {sub.last_used_at ? (
                    <>
                      <small>Last used:</small>
                      <p>{new Date(sub.last_used_at).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <small className="never-used">Never logged</small>
                  )}
                </div>

                <button
                  className="btn-log-usage"
                  onClick={() => handleLogUsage(sub.id, sub.service?.name)}
                  disabled={logging === sub.id || isLimited}
                  title={
                    isLimited
                      ? `Rate limit reached. Reset in next hour`
                      : `Log usage for ${sub.service?.name}`
                  }
                >
                  {logging === sub.id ? (
                    <>
                      <span className="spinner"></span>
                      Logging...
                    </>
                  ) : isLimited ? (
                    '⏸️ Limit reached'
                  ) : (
                    '✓ Mark as Used'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-subscriptions">
          <p>📝 No active subscriptions. Add a subscription first!</p>
        </div>
      )}
    </div>
  );
}
