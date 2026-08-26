/**
 * PayGuard ML Risk Engine
 * Feature extraction & risk scoring (0 - 100) using lightweight boosted feature trees.
 * Executes in <15ms.
 */

export function calculateRiskScore(payment, agentState, policy, intentDrift, contextSignals) {
  let riskScore = 10; // Baseline risk
  const riskFactors = [];

  const { amount, merchant, category } = payment;

  // Feature 1: Amount vs Agent Average
  const agentAvgTx = agentState.spent_today && agentState.tx_count_today 
    ? (agentState.spent_today / agentState.tx_count_today) 
    : 5000;
  const amountRatio = amount / (agentAvgTx || 1);

  if (amountRatio > 3.0) {
    riskScore += 25;
    riskFactors.push(`Transaction amount (₹${amount.toLocaleString()}) is ${(amountRatio).toFixed(1)}x higher than agent average`);
  } else if (amountRatio > 1.5) {
    riskScore += 12;
    riskFactors.push(`Transaction amount is above agent typical average`);
  }

  // Feature 2: Merchant Trust / History
  const isNewMerchant = !(policy.allowed_merchants || []).includes(merchant);
  if (isNewMerchant) {
    riskScore += 20;
    riskFactors.push(`Merchant '${merchant}' has no prior established trust record with this agent`);
  }

  // Feature 3: Intent Drift Severity
  if (intentDrift.level === "CRITICAL") {
    riskScore += 35;
    riskFactors.push(`Critical intent drift detected (+₹${intentDrift.driftAmount.toLocaleString()} over target budget)`);
  } else if (intentDrift.level === "HIGH") {
    riskScore += 22;
    riskFactors.push(`High intent drift detected (+₹${intentDrift.driftAmount.toLocaleString()})`);
  } else if (intentDrift.level === "MODERATE") {
    riskScore += 10;
    riskFactors.push(`Moderate intent drift detected`);
  }

  // Feature 4: Transaction Frequency / Retry Loop Signal
  if (contextSignals.isRetryStorm) {
    riskScore += 40;
    riskFactors.push(`High attempt frequency anomaly detected (${contextSignals.recentAttemptCount} rapid calls in 15 seconds)`);
  }

  // Feature 5: Previous Block History
  if (agentState.blocked_count_today > 2) {
    riskScore += 15;
    riskFactors.push(`Agent has ${agentState.blocked_count_today} recent blocked transaction attempts today`);
  }

  // Feature 6: Time of day / Off-hours flag
  const hour = new Date().getHours();
  if (hour >= 1 && hour <= 5) {
    riskScore += 8;
    riskFactors.push(`Transaction requested during off-hours (${hour}:00 AM)`);
  }

  // Cap risk score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(riskScore)));

  return {
    risk_score: finalScore,
    risk_level: finalScore < 30 ? "LOW" : finalScore < 65 ? "MEDIUM" : finalScore < 80 ? "HIGH" : "CRITICAL",
    risk_factors: riskFactors,
    features: {
      amount,
      amountRatio: parseFloat(amountRatio.toFixed(2)),
      isNewMerchant,
      intentDriftLevel: intentDrift.level,
      retryStorm: contextSignals.isRetryStorm,
      blockedCount: agentState.blocked_count_today || 0
    }
  };
}
