import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function StepUpModal({ transaction, onClose, onConfirm }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!transaction) return null;

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-advance focus
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmed(true);
      setTimeout(() => {
        onConfirm(transaction.id);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      {/* Backdrop dismiss */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-surface-raised shadow-neo-lg border border-guard-stepup/25 rounded-neo-xl max-w-md w-full p-6 space-y-5">

        {/* Close */}
        <button
          onClick={onClose}
          className="pg-btn-icon absolute right-4 top-4"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-neo bg-guard-stepup/10 border border-guard-stepup/25 shadow-neo-warn flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-guard-stepup" />
          </div>
          <div>
            <span className="pg-badge pg-badge-stepup">STEP-UP REQUIRED</span>
            <h3 className="text-base font-bold text-ink-primary mt-1">Human Confirmation Prompt</h3>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="pg-inset p-4 rounded-neo space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-ink-muted">Amount:</span>
            <span className="text-ink-primary font-bold">₹{transaction.amount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Merchant:</span>
            <span className="text-guard-stepup font-bold">{transaction.merchant}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Agent Intent:</span>
            <span className="text-ink-secondary italic text-right max-w-[55%]">
              "{transaction.intent_drift?.targetBudget
                ? `Budget ₹${transaction.intent_drift.targetBudget.toLocaleString()}`
                : 'Agent Task'}"
            </span>
          </div>
        </div>

        {/* Reason for Step-Up */}
        <div className="p-3 bg-guard-stepup/8 border border-guard-stepup/20 rounded-neo space-y-1.5 font-mono text-xs">
          <span className="font-bold text-guard-stepup block text-[10px] uppercase tracking-wider">
            Why confirmation is required
          </span>
          {transaction.reasons?.map((r, i) => (
            <div key={i} className="text-guard-stepup/80">• {r}</div>
          ))}
        </div>

        {/* OTP or Confirmed State */}
        {!confirmed ? (
          <div className="space-y-4 pt-1">
            <label className="text-[10px] font-bold font-mono text-ink-muted uppercase tracking-widest block text-center">
              Enter 4-Digit Authorization Code
            </label>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={[
                    'w-12 h-12 text-center text-xl font-bold font-mono',
                    'bg-surface-base shadow-neo-inset rounded-neo',
                    'border border-surface-border/60',
                    'text-ink-primary caret-guard-stepup',
                    'transition-neo duration-neo',
                    'focus:outline-none focus:border-guard-stepup/50 focus:shadow-neo-focus',
                  ].join(' ')}
                />
              ))}
            </div>

            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="pg-btn-warn w-full py-3 text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-surface-base/30 border-t-surface-base rounded-full animate-spin" />
                  Verifying Code…
                </>
              ) : (
                'Authorize Transaction'
              )}
            </button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-guard-allow mx-auto" />
            <div className="font-bold text-sm text-guard-allow font-mono">
              Authorization Granted
            </div>
            <div className="text-xs text-ink-muted font-mono">
              Forwarding charge to Razorpay gateway…
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
