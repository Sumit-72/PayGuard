/**
 * PayGuard JavaScript/TypeScript SDK Simulator
 * SDK-first framing as documented in PDF Section 11:
 * 
 * const result = await payguard.authorize({
 *   agent: "shopping-agent",
 *   intent: "Buy a laptop under ₹70,000",
 *   payment: { amount: 68999, merchant: "ABC Electronics", category: "electronics" }
 * });
 * if (result.decision === "ALLOW") await razorpay.pay();
 * if (result.decision === "STEP-UP") await requestUserConfirmation();
 * if (result.decision === "BLOCK") throw new Error(result.reason);
 */

import { authorizePayment } from "./decisionEngine.js";
import { executeRazorpayPayment } from "./razorpayGateway.js";

class PayGuardSDK {
  constructor(apiKey = "pg_live_88329910a") {
    this.apiKey = apiKey;
    this.version = "1.0.4-production";
  }

  async authorize({ agent, policy, intent, payment }) {
    // Simulate lightweight network roundtrip (<25ms)
    await new Promise(r => setTimeout(r, 20));

    const result = authorizePayment({
      agent,
      policy,
      payment,
      activeIntent: intent
    });

    return {
      success: true,
      decision: result.decision,
      risk_score: result.risk_score,
      requires_confirmation: result.requires_confirmation,
      reasons: result.reasons,
      latency_ms: result.latency_ms,
      rawResult: result,
      
      // Helper method attached to SDK response
      processGateway: async () => {
        if (result.decision === "ALLOW") {
          return executeRazorpayPayment(payment);
        } else {
          throw new Error(`Cannot execute Razorpay payment: PayGuard returned decision '${result.decision}'`);
        }
      }
    };
  }
}

export const payguard = new PayGuardSDK();
