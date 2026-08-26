/**
 * PayGuard Deterministic Policy Engine
 * Core Principle #2: "LLMs interpret; deterministic code enforces."
 * Evaluates payment requests strictly using pure, auditable, non-AI logic.
 */

export function evaluatePolicy(policy, payment, agentState) {
  const violations = [];
  const warnings = [];

  const { amount, merchant, category } = payment;

  // 1. Transaction Limit Check
  if (policy.max_transaction && amount > policy.max_transaction) {
    violations.push({
      code: "TRANSACTION_LIMIT_EXCEEDED",
      rule: `Amount ₹${amount.toLocaleString()} exceeds per-transaction limit of ₹${policy.max_transaction.toLocaleString()}`,
      severity: "CRITICAL"
    });
  }

  // 2. Daily Spend Limit Check
  const projectedDailyTotal = (agentState.spent_today || 0) + amount;
  if (policy.daily_limit && projectedDailyTotal > policy.daily_limit) {
    violations.push({
      code: "DAILY_LIMIT_EXCEEDED",
      rule: `Projected daily spend ₹${projectedDailyTotal.toLocaleString()} exceeds daily budget cap ₹${policy.daily_limit.toLocaleString()}`,
      severity: "CRITICAL"
    });
  }

  // 3. Blocked Category Check
  if (policy.blocked_categories && policy.blocked_categories.includes(category)) {
    violations.push({
      code: "BLOCKED_CATEGORY",
      rule: `Category '${category}' is explicitly blocked in policy`,
      severity: "CRITICAL"
    });
  }

  // 4. Allowed Category Check (if specified)
  if (policy.allowed_categories && policy.allowed_categories.length > 0) {
    if (!policy.allowed_categories.includes(category)) {
      violations.push({
        code: "UNAPPROVED_CATEGORY",
        rule: `Category '${category}' is not in allowed list [${policy.allowed_categories.join(", ")}]`,
        severity: "HIGH"
      });
    }
  }

  // 5. Blocked Merchant Check
  if (policy.blocked_merchants && policy.blocked_merchants.includes(merchant)) {
    violations.push({
      code: "BLOCKED_MERCHANT",
      rule: `Merchant '${merchant}' is on the explicit blocklist`,
      severity: "CRITICAL"
    });
  }

  // 6. Allowed Merchant Check (if non-empty)
  if (policy.allowed_merchants && policy.allowed_merchants.length > 0) {
    if (!policy.allowed_merchants.includes(merchant)) {
      violations.push({
        code: "UNAPPROVED_MERCHANT",
        rule: `Merchant '${merchant}' is not in approved merchant list [${policy.allowed_merchants.join(", ")}]`,
        severity: "HIGH"
      });
    }
  }

  // 7. Auto-approval threshold check (Soft warning -> triggers Step-Up or Review)
  let requiresConfirmation = false;
  if (policy.requires_confirmation_above && amount > policy.requires_confirmation_above) {
    requiresConfirmation = true;
    warnings.push({
      code: "REQUIRES_CONFIRMATION",
      rule: `Amount ₹${amount.toLocaleString()} exceeds auto-approval threshold ₹${policy.requires_confirmation_above.toLocaleString()}`,
      severity: "MEDIUM"
    });
  }

  return {
    passed: violations.length === 0,
    violations,
    warnings,
    requiresConfirmation
  };
}
