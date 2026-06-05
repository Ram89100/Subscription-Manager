import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/AIInsights.css';

const API_BASE_URL = 'http://localhost:3001/api';

export default function AIInsights() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<{ id: string; insight_text: string; insight_type: string; created_at: Date }[] >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing insights on component mount
  useEffect(() => {
    if (token) {
      fetchActiveInsights();
    }
  }, [token]);

  /**
   * Fetch active (not dismissed) insights
   */
  const fetchActiveInsights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/insights/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    }
  };

  /**
   * Generate new AI insights
   */
  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate insights');
      }

      const data = await response.json();
      setSuccess('✅ AI insights generated successfully!');

      // Refresh insights list
      await fetchActiveInsights();

      // Auto-hide success message
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dismiss an insight
   */
  const handleDismissInsight = async (insightId:string) => {
    try {
      const response = await fetch(`/api/ai/insights/${insightId}/dismiss`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // Remove from UI
        setInsights(insights.filter((i) => i.id !== insightId));
      }
    } catch (err) {
      console.error('Failed to dismiss insight:', err);
    }
  };

  return (
    <div className="ai-insights-container">
      <div className="ai-insights-header">
        <h2>🤖 Smart Spending Insights</h2>
        <button
          className="btn-generate"
          onClick={handleGenerateInsights}
          disabled={loading}
        >
          {loading ? '⏳ Generating...' : '👉 Generate Insights'}
        </button>
      </div>

      {/* Status Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Insights List */}
      <div className="insights-list">
        {insights.length > 0 ? (
          insights.map((insight) => (
            <div key={insight.id} className="insight-card">
              <div className="insight-header">
                <span className="insight-type">
                  {insight.insight_type === 'spending_analysis' ? '💰' : '💡'} Smart Insight
                </span>
                <button
                  className="btn-dismiss"
                  onClick={() => handleDismissInsight(insight.id)}
                  title="Dismiss this insight"
                >
                  ✕
                </button>
              </div>

              <div className="insight-content">
                {insight.insight_text.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <div className="insight-meta">
                <small>{new Date(insight.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="no-insights">
            <p>📊 No insights yet. Click "Generate Insights" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
