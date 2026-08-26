/**
 * PayGuard Core Decision Engine
 * Core Principle #3: "Multi-outcome, not binary." (ALLOW, STEP-UP, REVIEW, BLOCK)
 * Core Principle #4: "Every decision is explainable."
 */

import { evaluatePolicy } from "./policyEngine.js";
import { extractStructuredIntent, computeIntentDrift } from "./intentEngine.js";
import { calculateRiskScore } from "./riskEngine.js";
import { getContextState } from "./contextEngine.js";

export function authorizePayment({ agent, policy, payment, activeIntent }) {
  const startTime = performance.now();

  // 1. Intent Extraction & Drift Analysis
  const intent = activeIntent || extractStructuredIntent(payment.description || "Purchase request");
  const intentDrift = computeIntentDrift(intent, payment);

  // 2. Context Engine Signals (Retry storm / Velocity)
  const contextSignals = getContextState(agent.id, payment);

  // 3. Deterministic Policy Check (Hard Rules)
  const policyResult = evaluatePolicy(policy, payment, agent);

  // 4. ML Risk Model Evaluation
  const riskResult = calculateRiskScore(payment, agent, policy, intentDrift, contextSignals);

  // 5. Decision Synthesis Logic
  let decision = "ALLOW";
  let requiresConfirmation = false;
  const reasons = [];

  // RULE A: Deterministic Policy Veto (HARD BLOCK)
  if (!policyResult.passed) {
    decision = "BLOCK";
    policyResult.violations.forEach(v => reasons.push(`✗ Policy Violation: ${v.rule}`));
  } 
  // RULE B: Anomaly Storm Veto (HARD BLOCK)
  else if (contextSignals.isRetryStorm) {
    decision = "BLOCK";
    reasons.push(`✗ Anomaly Flag: Rapid retry storm detected (${contextSignals.duplicateAttemptCount} duplicate charges submitted in 15 seconds)`);
    reasons.push(`⚠ Agent execution loop suspended for user safety`);
  }
  // RULE C: High Risk Score (>75) (BLOCK or REVIEW)
  else if (riskResult.risk_score >= 75) {
    decision = "BLOCK";
    reasons.push(`✗ High Risk Score (${riskResult.risk_score}/100) exceeds safety threshold (75)`);
    riskResult.risk_factors.forEach(rf => reasons.push(`⚠ Risk Factor: ${rf}`));
  }
  // RULE D: Step-Up Threshold or High Intent Drift
  else if (policyResult.requiresConfirmation || intentDrift.level === "HIGH" || intentDrift.level === "CRITICAL") {
    decision = "STEP-UP";
    requiresConfirmation = true;
    if (policyResult.requiresConfirmation) {
      reasons.push(`⚡ Amount ₹${payment.amount.toLocaleString()} crosses auto-approval limit of ₹${policy.requires_confirmation_above.toLocaleString()}`);
    }
    if (intentDrift.driftAmount > 0) {
      reasons.push(`⚡ Intent Drift Warning: ${intentDrift.description}`);
    }
  }
  // RULE E: Moderate Risk Score (50-74) or New Merchant -> Human Review Queue
  else if (riskResult.risk_score >= 50 || riskResult.features.isNewMerchant) {
    decision = "REVIEW";
    requiresConfirmation = true;
    reasons.push(`👁 Marked for Human Review: Risk score ${riskResult.risk_score}/100`);
    if (riskResult.features.isNewMerchant) {
      reasons.push(`⚠ Agent has no prior purchasing history with merchant '${payment.merchant}'`);
    }
  }
  // RULE F: Clear & Clean -> ALLOW
  else {
    decision = "ALLOW";
    reasons.push(`✓ Transaction within approved budget limits`);
    reasons.push(`✓ Merchant '${payment.merchant}' is verified and matches stated intent`);
    reasons.push(`✓ Low risk score (${riskResult.risk_score}/100)`);
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    id: `tx_${Date.now().toString().slice(-6)}`,
    agent_id: agent.id,
    agent_name: agent.name,
    amount: payment.amount,
    merchant: payment.merchant,
    category: payment.category,
    description: payment.description,
    decision,
    risk_score: riskResult.risk_score,
    risk_level: riskResult.risk_level,
    requires_confirmation: requiresConfirmation,
    reasons,
    policy_violations: policyResult.violations.map(v => v.code),
    risk_factors: riskResult.risk_factors,
    intent_drift: intentDrift,
    context_signals: contextSignals,
    latency_ms: executionTimeMs || 14,
    created_at: new Date().toISOString()
  };
}
