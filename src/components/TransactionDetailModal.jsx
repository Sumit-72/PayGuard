import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, ShieldX, Check, Settings2 } from 'lucide-react';

export default function TransactionDetailModal({ transaction, onClose, onOverride }) {
  if (!transaction) return null;

  const isBlock = transaction.decision === 'BLOCK';
  const isAllow = transaction.decision === 'ALLOW';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-mono">PAYGUARD DECISION INSPECTOR</span>
            <h3 className="text-lg font-bold text-white font-mono">{transaction.id}</h3>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-bold font-mono border ${
            isAllow ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
            transaction.decision === 'STEP-UP' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
            transaction.decision === 'REVIEW' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' :
            'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}>
            {transaction.decision}
          </span>
        </div>

        {/* Key Transaction Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">AMOUNT</span>
            <span className="text-white font-bold text-base">₹{transaction.amount?.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">MERCHANT</span>
            <span className="text-cyan-400 font-bold text-sm">{transaction.merchant}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-slate-500 text-[10px] block">RISK SCORE</span>
            <span className={`font-bold text-base ${transaction.risk_score > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {transaction.risk_score} / 100
            </span>
          </div>
        </div>

        {/* Structured Explanation UI Copy (PDF Section 15.2 Example) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Firewall Decision Breakdown (Explainable Reason)
          </div>

          <div className="space-y-1.5 text-slate-200">
            {transaction.reasons?.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {transaction.intent_drift && (
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <span className="text-indigo-400 font-bold block">User Intent Check:</span>
              <div>Original Task Budget: ₹{transaction.intent_drift.targetBudget?.toLocaleString() || '70,000'}</div>
              <div>Projected Session Spend: ₹{transaction.intent_drift.projectedTotal?.toLocaleString()}</div>
              {transaction.intent_drift.driftAmount > 0 && (
                <div className="text-amber-400 font-bold">
                  Intent Drift: +₹{transaction.intent_drift.driftAmount.toLocaleString()} ({transaction.intent_drift.level})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Latency & Audit Metadata */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Agent ID: {transaction.agent_id}</span>
          <span>Decision Latency: {transaction.latency_ms || 14} ms</span>
        </div>

        {/* Override / Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl font-bold"
          >
            Close Inspector
          </button>
          {isBlock && (
            <button
              onClick={() => {
                onOverride(transaction.id, 'ALLOW');
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded-xl font-bold flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" /> Override & Authorize
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
