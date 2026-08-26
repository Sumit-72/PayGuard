/**
 * PayGuard Intent & Drift Engine
 * Extracts structured intent from natural language task requests
 * Tracks cumulative session spend drift vs stated original user intent.
 */

export function extractStructuredIntent(rawText) {
  const textLower = rawText.toLowerCase();
  
  // Extract budget limit if present (e.g., "under ₹70,000" or "below 25000")
  let maxAmount = 50000;
  const rupeeMatch = textLower.match(/(?:under|below|max|upto|up to)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (rupeeMatch) {
    maxAmount = parseInt(rupeeMatch[1].replace(/,/g, ''), 10);
  }

  // Category detection
  let category = "general";
  if (/laptop|computer|electronics|gadget|phone|accessories/i.test(textLower)) category = "electronics";
  else if (/flight|hotel|ticket|travel|booking|indigo|delhi/i.test(textLower)) category = "travel";
  else if (/grocery|food|supplies|supermarket/i.test(textLower)) category = "groceries";
  else if (/office|paper|stationery|license|software/i.test(textLower)) category = "office_supplies";

  return {
    raw_text: rawText,
    category,
    max_amount: maxAmount,
    destination: "Verified Merchants",
    confidence: 0.95,
    extracted_at: new Date().toISOString()
  };
}

export function computeIntentDrift(activeIntent, currentPayment, agentHistory = []) {
  if (!activeIntent || !activeIntent.max_amount) {
    return { driftAmount: 0, driftRatio: 0, level: "LOW" };
  }

  // Cumulative spend under this session/intent
  const currentAccumulated = activeIntent.accumulated_spend || 0;
  const projectedTotal = currentAccumulated + currentPayment.amount;

  const targetBudget = activeIntent.max_amount;
  const driftAmount = Math.max(0, projectedTotal - targetBudget);
  const driftRatio = driftAmount / targetBudget;

  let level = "LOW";
  if (driftAmount > 0 && driftRatio <= 0.1) level = "MODERATE";
  else if (driftRatio > 0.1 && driftRatio <= 0.25) level = "HIGH";
  else if (driftRatio > 0.25) level = "CRITICAL";

  return {
    targetBudget,
    currentAccumulated,
    newAmount: currentPayment.amount,
    projectedTotal,
    driftAmount,
    driftRatio,
    level,
    description: driftAmount > 0 
      ? `Projected spend ₹${projectedTotal.toLocaleString()} exceeds original task budget ₹${targetBudget.toLocaleString()} by +₹${driftAmount.toLocaleString()} (${(driftRatio * 100).toFixed(1)}% drift)`
      : `Spend ₹${projectedTotal.toLocaleString()} is within declared task budget ₹${targetBudget.toLocaleString()}`
  };
}
