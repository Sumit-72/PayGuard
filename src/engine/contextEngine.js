/**
 * PayGuard Context Engine & Anomaly Detector
 * Tracks real-time agent state, transaction velocity, and detects runaway retry loops.
 */

// In-memory agent call cache to track rapid call velocity
const agentCallLogs = new Map();

export function getContextState(agentId, payment) {
  const now = Date.now();
  const history = agentCallLogs.get(agentId) || [];

  // Filter logs within the last 30 seconds
  const recentLogs = history.filter(item => (now - item.timestamp) < 30000);
  
  // Update log
  recentLogs.push({
    timestamp: now,
    amount: payment.amount,
    merchant: payment.merchant,
    category: payment.category
  });
  agentCallLogs.set(agentId, recentLogs);

  // Check duplicate requests (same merchant and amount in last 15 seconds)
  const duplicateCalls = recentLogs.filter(
    item => item.merchant === payment.merchant && 
            item.amount === payment.amount && 
            (now - item.timestamp) < 15000
  );

  const isRetryStorm = duplicateCalls.length >= 3;

  return {
    recentAttemptCount: recentLogs.length,
    duplicateAttemptCount: duplicateCalls.length,
    isRetryStorm,
    timeOfDay: new Date().toLocaleTimeString(),
    sessionAgeDays: 14
  };
}

export function clearAgentContext(agentId) {
  agentCallLogs.delete(agentId);
}
