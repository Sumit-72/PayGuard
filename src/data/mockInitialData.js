export const initialAgents = [
  {
    id: "agent_shopping_01",
    name: "ShoppingAgent Pro",
    status: "active",
    type: "Commerce Assistant",
    risk_score: 12,
    daily_limit: 50000,
    spent_today: 16100,
    tx_count_today: 3,
    blocked_count_today: 1,
    trust_level: "High",
    created_at: "2026-01-10",
    avatar: "🛍️",
    active_intent: {
      raw_text: "Buy a laptop under ₹70,000",
      category: "electronics",
      max_amount: 70000,
      destination: "Approved Tech Stores",
      confidence: 0.96,
      accumulated_spend: 16100,
      items: [
        { name: "Flight to Delhi", amount: 7800, timestamp: "10:15 AM" },
        { name: "Seat Selection", amount: 2500, timestamp: "10:17 AM" },
        { name: "Baggage", amount: 1800, timestamp: "10:18 AM" },
        { name: "Insurance", amount: 4000, timestamp: "10:19 AM" }
      ]
    }
  },
  {
    id: "agent_travel_02",
    name: "TravelPlanner Bot",
    status: "active",
    type: "Booking Agent",
    risk_score: 28,
    daily_limit: 100000,
    spent_today: 34500,
    tx_count_today: 5,
    blocked_count_today: 0,
    trust_level: "Medium",
    created_at: "2026-02-01",
    avatar: "✈️",
    active_intent: {
      raw_text: "Book flights to Delhi under ₹10,000 and hotel under ₹25,000",
      category: "travel",
      max_amount: 35000,
      destination: "MakeMyTrip / Indigo",
      confidence: 0.94,
      accumulated_spend: 34500,
      items: []
    }
  },
  {
    id: "agent_procure_03",
    name: "AutoProcure Enterprise",
    status: "suspended",
    type: "Enterprise Procurement",
    risk_score: 87,
    daily_limit: 250000,
    spent_today: 180000,
    tx_count_today: 27,
    blocked_count_today: 14,
    trust_level: "Suspicious",
    created_at: "2026-03-12",
    avatar: "🤖",
    active_intent: {
      raw_text: "Procure office supplies and software licenses",
      category: "office_supplies",
      max_amount: 50000,
      destination: "Enterprise Vendors",
      confidence: 0.88,
      accumulated_spend: 180000,
      items: []
    }
  }
];

export const defaultPolicy = {
  id: "pol_def_001",
  agent_id: "agent_shopping_01",
  name: "Standard Shopping Policy",
  max_transaction: 10000,
  daily_limit: 25000,
  requires_confirmation_above: 5000,
  allowed_categories: ["electronics", "groceries", "travel", "books"],
  blocked_categories: ["gambling", "crypto", "alcohol", "electronics_unknown_merchant"],
  allowed_merchants: ["Amazon", "Flipkart", "ABC Store", "MakeMyTrip", "Croma"],
  blocked_merchants: ["XYZ Electronics", "Unverified Gateway", "CryptoX"],
  geography: ["India"],
  raw_prompt: "Allow my shopping agent to spend up to ₹25,000/day. Purchases above ₹5,000 need my confirmation. Don't allow electronics from unknown merchants."
};

export const initialTransactions = [
  {
    id: "tx_1001",
    agent_id: "agent_shopping_01",
    agent_name: "ShoppingAgent Pro",
    merchant: "ABC Store",
    merchant_id: "mch_abc",
    amount: 1500,
    category: "electronics",
    description: "Laptop USB-C Hub & Cables",
    intent: "Buy laptop under ₹70,000",
    risk_score: 12,
    decision: "ALLOW",
    requires_confirmation: false,
    reasons: ["Within transaction budget limit", "Merchant on approved list", "Matches declared intent"],
    policy_violations: [],
    created_at: "2026-08-22T19:45:00Z"
  },
  {
    id: "tx_1002",
    agent_id: "agent_shopping_01",
    agent_name: "ShoppingAgent Pro",
    merchant: "MakeMyTrip",
    merchant_id: "mch_mmt",
    amount: 7800,
    category: "travel",
    description: "Flight to Delhi (Economy)",
    intent: "Flight to Delhi ≤ ₹8,000",
    risk_score: 22,
    decision: "STEP-UP",
    requires_confirmation: true,
    reasons: ["Amount ₹7,800 exceeds auto-approval threshold ₹5,000"],
    policy_violations: ["auto_approval_threshold_exceeded"],
    created_at: "2026-08-22T19:50:12Z"
  },
  {
    id: "tx_1003",
    agent_id: "agent_shopping_01",
    agent_name: "ShoppingAgent Pro",
    merchant: "Indigo Air",
    merchant_id: "mch_indigo",
    amount: 8300,
    category: "travel",
    description: "Flight + Baggage + Insurance bundle",
    intent: "Flight to Delhi ≤ ₹8,000",
    risk_score: 64,
    decision: "REVIEW",
    requires_confirmation: true,
    reasons: ["Accumulated session spend ₹16,100 causes high intent-drift (+₹8,100 over original target)", "Requires human reviewer authorization"],
    policy_violations: ["high_intent_drift"],
    created_at: "2026-08-22T19:58:30Z"
  },
  {
    id: "tx_1004",
    agent_id: "agent_procure_03",
    agent_name: "AutoProcure Enterprise",
    merchant: "XYZ Electronics",
    merchant_id: "mch_xyz",
    amount: 24999,
    category: "electronics",
    description: "Unverified Hardware Purchase",
    intent: "Procure office supplies",
    risk_score: 87,
    decision: "BLOCK",
    requires_confirmation: false,
    reasons: ["Transaction amount ₹24,999 exceeds per-transaction limit ₹10,000", "Merchant 'XYZ Electronics' is outside approved list", "Agent has zero prior purchase history with this merchant"],
    policy_violations: ["transaction_limit_exceeded", "unapproved_merchant"],
    created_at: "2026-08-22T20:02:15Z"
  }
];
