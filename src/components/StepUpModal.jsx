import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, X } from 'lucide-react';

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

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
              STEP-UP REQUIRED
            </span>
            <h3 className="text-lg font-bold text-white mt-1">Human Confirmation Prompt</h3>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Requested Amount:</span>
            <span className="text-white font-bold">₹{transaction.amount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Merchant:</span>
            <span className="text-amber-400 font-bold">{transaction.merchant}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Agent Stated Intent:</span>
            <span className="text-slate-300 italic">"{transaction.intent_drift?.targetBudget ? `Budget ₹${transaction.intent_drift.targetBudget}` : 'Agent Task'}"</span>
          </div>
        </div>

        {/* Reason for Step-Up */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs space-y-1 font-mono">
          <span className="font-bold block">Why confirmation is required:</span>
          {transaction.reasons?.map((r, i) => (
            <div key={i}>• {r}</div>
          ))}
        </div>

        {/* OTP Input Simulation */}
        {!confirmed ? (
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold text-slate-300 block text-center uppercase tracking-wider font-mono">
              Enter 4-Digit Security Authorization Code
            </label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              ))}
            </div>

            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 font-mono transition-all"
            >
              {isSubmitting ? 'Verifying Code...' : 'Authorize Transaction'}
            </button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2 font-mono text-emerald-400">
            <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
            <div className="font-bold text-sm">Step-Up Authorization Granted!</div>
            <div className="text-xs text-slate-400">Forwarding charge to Razorpay gateway...</div>
          </div>
        )}

      </div>
    </div>
  );
}
