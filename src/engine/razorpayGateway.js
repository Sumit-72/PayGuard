/**
 * Razorpay Test-Mode Gateway Simulator
 * Demonstrates the handoff between PayGuard decision plane and Razorpay Payment Gateway.
 */

export function executeRazorpayPayment(transactionDetails) {
  const isSuccess = Math.random() > 0.05; // 95% gateway processing success
  const razorpayPaymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
  const orderId = `order_${Math.random().toString(36).substr(2, 9)}`;

  if (isSuccess) {
    return {
      status: "SUCCESS",
      gateway: "Razorpay Test Mode",
      payment_id: razorpayPaymentId,
      order_id: orderId,
      amount: transactionDetails.amount,
      currency: "INR",
      method: "upi_autopay",
      settled_at: new Date().toISOString(),
      receipt_url: `https://dashboard.razorpay.com/app/payments/${razorpayPaymentId}`
    };
  } else {
    return {
      status: "GATEWAY_FAILED",
      error_code: "BAD_REQUEST_ERROR",
      error_description: "Bank server timeout during gateway handoff"
    };
  }
}
