/**
 * PayGuard Natural Language Policy Engine
 * Section 6.1 of Specification: Converts English policies to structured versioned JSON policy.
 */

export function parseNaturalLanguagePolicy(promptText) {
  const textLower = promptText.toLowerCase();

  // Extract daily limit
  let dailyLimit = 25000;
  const dailyMatch = textLower.match(/(?:daily|per day|day)\s*(?:limit|cap|budget|up to)?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i) ||
                     textLower.match(/(?:up to|spend max)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)\s*\/(?:day|daily)/i);
  if (dailyMatch) {
    dailyLimit = parseInt(dailyMatch[1].replace(/,/g, ''), 10);
  }

  // Extract per-transaction limit or confirmation threshold
  let confirmationAbove = 5000;
  const confirmMatch = textLower.match(/(?:above|over|exceeding)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:need|require|ask)/i);
  if (confirmMatch) {
    confirmationAbove = parseInt(confirmMatch[1].replace(/,/g, ''), 10);
  }

  let maxTransaction = Math.min(dailyLimit, confirmationAbove * 2);
  const txMatch = textLower.match(/(?:single|max per transaction|tx limit)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (txMatch) {
    maxTransaction = parseInt(txMatch[1].replace(/,/g, ''), 10);
  }

  // Categories parsing
  const blockedCategories = [];
  if (textLower.includes("electronics from unknown") || textLower.includes("unknown electronics")) {
    blockedCategories.push("electronics_unknown_merchant");
  }
  if (textLower.includes("gambling") || textLower.includes("casino")) blockedCategories.push("gambling");
  if (textLower.includes("crypto")) blockedCategories.push("crypto");
  if (textLower.includes("alcohol") || textLower.includes("liquor")) blockedCategories.push("alcohol");

  const allowedCategories = ["electronics", "groceries", "travel", "books", "office_supplies"];

  const structuredPolicy = {
    daily_limit: dailyLimit,
    max_transaction: maxTransaction,
    requires_confirmation_above: confirmationAbove,
    allowed_categories: allowedCategories,
    blocked_categories: blockedCategories,
    allowed_merchants: ["Amazon", "Flipkart", "Croma", "MakeMyTrip", "ABC Store"],
    blocked_merchants: ["XYZ Electronics", "Unverified Gateway"],
    geography: ["India"],
    parsed_at: new Date().toISOString()
  };

  const yamlFormat = `agent:
  name: ShoppingAgent
permissions:
  spending:
    max_per_transaction: ${maxTransaction}
    max_daily: ${dailyLimit}
  categories:
    allowed: [${allowedCategories.slice(0, 3).join(", ")}]
    blocked: [${blockedCategories.length ? blockedCategories.join(", ") : "gambling, crypto"}]
  merchants:
    allowed: [amazon, flipkart, croma, abctech]
  geography:
    allowed: [India]
  approval:
    above: ${confirmationAbove}
    require: user_confirmation`;

  return {
    promptText,
    json: structuredPolicy,
    yaml: yamlFormat
  };
}
