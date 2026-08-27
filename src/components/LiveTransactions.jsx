import React, { useState } from 'react';
import { Zap, Search, Eye, Check } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────

function decisionBadgeClass(decision) {
  switch (decision) {
    case 'ALLOW':   return 'pg-badge-allow';
    case 'STEP-UP': return 'pg-badge-stepup';
    case 'REVIEW':  return 'pg-badge-review';
    case 'BLOCK':   return 'pg-badge-block';
    default:        return 'pg-badge bg-surface-overlay text-ink-secondary border-surface-border';
  }
}

function riskColor(score) {
  if (score < 30) return 'text-guard-allow';
  if (score < 60) return 'text-guard-stepup';
  if (score < 80) return 'text-guard-review';
  return 'text-guard-block';
}

const FILTER_OPTIONS = ['ALL', 'ALLOW', 'STEP-UP', 'REVIEW', 'BLOCK'];

export default function LiveTransactions({ transactions, onOverrideDecision, onOpenDetail }) {
  const [filterDecision, setFilterDecision] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter((t) => {
    if (filterDecision !== 'ALL' && t.decision !== filterDecision) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        t.merchant.toLowerCase().includes(term) ||
        t.agent_name.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">

      {/* ── Header & Controls ── */}
      <div className="pg-surface p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Title */}
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-brand-accent shrink-0" />
            <h2 className="text-base font-bold text-ink-primary">Live Intercept Feed</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-surface-overlay text-ink-muted rounded border border-surface-border/50">
              {filtered.length}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search agent, merchant…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pg-input pl-8 py-1.5 text-xs"
              />
            </div>

            {/* Decision filter pills */}
            <div className="flex items-center gap-0.5 bg-surface-raised shadow-neo-sm rounded-neo border border-surface-border/50 p-1">
              {FILTER_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDecision(d)}
                  className={[
                    'px-2.5 py-1 rounded-[7px] text-[11px] font-mono font-semibold',
                    'transition-neo duration-neo select-none',
                    'focus-visible:outline-none focus-visible:shadow-neo-focus',
                    'active:shadow-neo-pressed active:translate-y-px',
                    filterDecision === d
                      ? 'bg-brand text-white shadow-neo-brand'
                      : 'text-ink-muted hover:text-ink-primary hover:bg-surface-overlay',
                  ].join(' ')}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Intercept Table ── */}
      <div className="pg-surface overflow-hidden">
        <div className="overflow-x-auto scrollbar-stable">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-surface-overlay border-b border-surface-border/60">
              <tr className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">
                <th className="py-3 px-4">Time / ID</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-center">Risk</th>
                <th className="py-3 px-4 text-center">Decision</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="space-y-2">
                      <Zap className="w-6 h-6 text-ink-subtle mx-auto" />
                      <p className="text-sm text-ink-muted font-mono">
                        No intercepted events match the current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-surface-overlay/50 transition-colors duration-100"
                  >
                    {/* Time + ID */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-xs text-ink-secondary">
                        {new Date(tx.created_at).toLocaleTimeString()}
                      </div>
                      <div className="text-[10px] text-ink-subtle mt-0.5">{tx.id}</div>
                    </td>

                    {/* Agent */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-ink-primary">{tx.agent_name}</div>
                      <div className="text-[10px] text-ink-muted font-mono mt-0.5">{tx.agent_id}</div>
                    </td>

                    {/* Merchant */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-ink-primary">{tx.merchant}</div>
                      <div className="text-[10px] text-ink-secondary mt-0.5">{tx.description}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-sm font-bold text-ink-primary">
                        ₹{tx.amount.toLocaleString()}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`text-sm font-bold ${riskColor(tx.risk_score)}`}>
                        {tx.risk_score}
                      </span>
                      <span className="text-[10px] text-ink-subtle"> /100</span>
                    </td>

                    {/* Decision */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`pg-badge ${decisionBadgeClass(tx.decision)}`}>
                        {tx.decision}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDetail(tx)}
                          className="pg-btn-ghost text-[11px] gap-1 py-1 px-2 font-mono"
                        >
                          <Eye className="w-3 h-3 text-brand-accent" />
                          Details
                        </button>

                        {tx.decision === 'BLOCK' && (
                          <button
                            onClick={() => onOverrideDecision(tx.id, 'ALLOW')}
                            title="Override block and approve transaction"
                            className="inline-flex items-center gap-1 px-2 py-1
                                       bg-guard-allow/10 hover:bg-guard-allow/20
                                       text-guard-allow rounded-neo border border-guard-allow/25
                                       font-mono text-[11px] font-semibold
                                       transition-neo duration-neo
                                       active:shadow-neo-pressed
                                       focus-visible:outline-none focus-visible:shadow-neo-focus"
                          >
                            <Check className="w-3 h-3" />
                            Override
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
