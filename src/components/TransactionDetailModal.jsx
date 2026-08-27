import React from 'react';
import { X, Check } from 'lucide-react';

function decisionBadgeClass(decision) {
  switch (decision) {
    case 'ALLOW':   return 'pg-badge-allow';
    case 'STEP-UP': return 'pg-badge-stepup';
    case 'REVIEW':  return 'pg-badge-review';
    case 'BLOCK':   return 'pg-badge-block';
    default:        return 'pg-badge bg-surface-overlay text-ink-secondary border-surface-border';
  }
}

export default function TransactionDetailModal({ transaction, onClose, onOverride }) {
  if (!transaction) return null;

  const isBlock = transaction.decision === 'BLOCK';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      {/* Backdrop dismiss */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-surface-raised shadow-neo-lg border border-surface-border/60 rounded-neo-xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="pg-btn-icon absolute right-4 top-4"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pr-8">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-ink-muted uppercase tracking-widest block">
              PayGuard Decision Inspector
            </span>
            <h3 className="text-base font-bold text-ink-primary font-mono mt-0.5 truncate">
              {transaction.id}
            </h3>
          </div>
          <span className={`pg-badge shrink-0 ${decisionBadgeClass(transaction.decision)}`}>
            {transaction.decision}
          </span>
        </div>

        <div className="pg-divider" />

        {/* Key Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="pg-stat-cell rounded-neo">
            <span className="pg-stat-label">Amount</span>
            <span className="pg-stat-value text-base text-ink-primary">
              ₹{transaction.amount?.toLocaleString()}
            </span>
          </div>
          <div className="pg-stat-cell rounded-neo">
            <span className="pg-stat-label">Merchant</span>
            <span className="pg-stat-value text-brand-accent">{transaction.merchant}</span>
          </div>
          <div className="pg-stat-cell rounded-neo col-span-2 sm:col-span-1">
            <span className="pg-stat-label">Risk Score</span>
            <span className={`pg-stat-value text-base ${transaction.risk_score > 60 ? 'text-guard-block' : 'text-guard-allow'}`}>
              {transaction.risk_score}<span className="text-ink-muted text-xs"> /100</span>
            </span>
          </div>
        </div>

        {/* Decision Breakdown */}
        <div className="pg-inset p-4 rounded-neo-lg space-y-3 font-mono text-xs">
          <span className="text-[9px] font-bold text-ink-muted uppercase tracking-widest block">
            Firewall Decision Breakdown
          </span>
          <div className="space-y-1.5 text-ink-secondary">
            {transaction.reasons?.map((reason, i) => (
              <div key={i} className="flex items-start gap-2 leading-snug">
                <span className="shrink-0 mt-0.5">
                  {reason.startsWith('✓') ? '✓' : reason.startsWith('✗') ? '✗' : '•'}
                </span>
                <span>{reason.replace(/^[✓✗•]\s*/, '')}</span>
              </div>
            ))}
          </div>

          {/* Intent Drift */}
          {transaction.intent_drift && (
            <div className="pt-3 border-t border-surface-border/50 space-y-1.5">
              <span className="text-brand text-[10px] font-bold uppercase tracking-wider block">
                User Intent Analysis
              </span>
              <div className="text-ink-secondary space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Original Budget:</span>
                  <span>₹{transaction.intent_drift.targetBudget?.toLocaleString() || '70,000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Session Spend:</span>
                  <span>₹{transaction.intent_drift.projectedTotal?.toLocaleString()}</span>
                </div>
                {transaction.intent_drift.driftAmount > 0 && (
                  <div className="flex justify-between text-guard-stepup font-bold">
                    <span>Intent Drift:</span>
                    <span>
                      +₹{transaction.intent_drift.driftAmount.toLocaleString()} ({transaction.intent_drift.level})
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Audit Metadata */}
        <div className="flex justify-between text-[10px] text-ink-muted font-mono">
          <span>Agent: {transaction.agent_id}</span>
          <span>Latency: {transaction.latency_ms || 14} ms</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1 border-t border-surface-border/50">
          <button onClick={onClose} className="pg-btn-ghost text-xs">
            Close Inspector
          </button>
          {isBlock && (
            <button
              onClick={() => {
                onOverride(transaction.id, 'ALLOW');
                onClose();
              }}
              className="pg-btn-allow text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Override &amp; Authorize
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
