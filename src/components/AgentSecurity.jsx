import React from 'react';
import { Lock, AlertOctagon, RotateCcw, Activity, ArrowRight, User, Cpu, Store } from 'lucide-react';

export default function AgentSecurity({ agents, onToggleAgentStatus, transactions }) {
  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="pg-surface p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <Lock className="w-4 h-4 text-guard-review shrink-0" />
          <h2 className="text-base font-bold text-ink-primary">Agent Security &amp; Transaction Graph</h2>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Per-agent behavior monitoring, anomaly detection (retry storms, unusual velocity), and real-time freeze controls.
        </p>
      </div>

      {/* ── Per-Agent Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSuspended = agent.status === 'suspended';
          const isHighRisk  = agent.risk_score > 60;

          return (
            <div
              key={agent.id}
              className={[
                'pg-surface p-5 space-y-4 transition-neo duration-neo',
                isSuspended
                  ? 'shadow-neo-block border border-guard-block/20'
                  : isHighRisk
                  ? 'shadow-neo-warn border border-guard-stepup/20'
                  : 'shadow-neo-allow border border-surface-border/60',
              ].join(' ')}
            >
              {/* Agent Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-neo bg-surface-overlay shadow-neo-sm flex items-center justify-center text-xl shrink-0">
                    {agent.avatar || '🤖'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-ink-primary truncate">{agent.name}</h3>
                    <span className="text-[10px] text-ink-muted font-mono">{agent.id}</span>
                  </div>
                </div>
                <span className={isSuspended ? 'pg-status-suspended shrink-0' : 'pg-status-active shrink-0'}>
                  {agent.status}
                </span>
              </div>

              {/* Stated Intent */}
              <div className="pg-inset p-3 rounded-neo space-y-1">
                <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-widest block">
                  Active Stated Intent
                </span>
                <p className="text-xs text-ink-secondary italic font-mono leading-relaxed">
                  "{agent.active_intent?.raw_text || 'No active intent'}"
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="pg-stat-cell rounded-neo">
                  <span className="pg-stat-label">Risk Score</span>
                  <span className={`pg-stat-value ${isHighRisk ? 'text-guard-block' : 'text-guard-allow'}`}>
                    {agent.risk_score}/100
                  </span>
                </div>
                <div className="pg-stat-cell rounded-neo">
                  <span className="pg-stat-label">Spent Today</span>
                  <span className="pg-stat-value">₹{agent.spent_today?.toLocaleString()}</span>
                </div>
                <div className="pg-stat-cell rounded-neo">
                  <span className="pg-stat-label">TX Today</span>
                  <span className="pg-stat-value">{agent.tx_count_today}</span>
                </div>
                <div className="pg-stat-cell rounded-neo">
                  <span className="pg-stat-label">Blocks Today</span>
                  <span className={`pg-stat-value ${agent.blocked_count_today > 0 ? 'text-guard-block' : 'text-ink-muted'}`}>
                    {agent.blocked_count_today}
                  </span>
                </div>
              </div>

              {/* Action: Freeze / Unfreeze */}
              <button
                onClick={() => onToggleAgentStatus(agent.id)}
                className={[
                  'w-full py-2 px-3 rounded-neo text-xs font-bold font-mono',
                  'flex items-center justify-center gap-2',
                  'transition-neo duration-neo select-none',
                  'active:shadow-neo-pressed active:translate-y-px',
                  'focus-visible:outline-none focus-visible:shadow-neo-focus',
                  isSuspended
                    ? 'bg-guard-allow/90 text-white shadow-neo-allow hover:bg-guard-allow'
                    : 'bg-guard-block/85 text-white shadow-neo-block hover:bg-guard-block',
                ].join(' ')}
              >
                {isSuspended ? (
                  <><RotateCcw className="w-3.5 h-3.5" /> Unfreeze &amp; Restore Agent</>
                ) : (
                  <><AlertOctagon className="w-3.5 h-3.5" /> Freeze Agent Execution</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Transaction Relationship Graph ── */}
      <div className="pg-surface p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="pg-section-header">
            <Activity className="w-4 h-4 text-brand-accent" />
            Transaction Relationship Graph
          </h3>
          <span className="text-[10px] font-mono text-ink-muted">User → Agent → Firewall → Gateway</span>
        </div>

        <div className="pg-inset p-5 rounded-neo-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* User Node */}
            <div className="flex flex-col items-center gap-2 pg-surface px-5 py-4 min-w-[120px]">
              <div className="w-9 h-9 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-accent" />
              </div>
              <span className="text-xs font-bold text-ink-primary">Human User</span>
              <span className="text-[10px] text-ink-muted font-mono">Owner Identity</span>
            </div>

            <ArrowRight className="w-4 h-4 text-ink-subtle hidden md:block shrink-0" />

            {/* Agent Node */}
            <div className="flex flex-col items-center gap-2 px-5 py-4 min-w-[140px]
                            rounded-neo-lg bg-brand/8 border border-brand/20 shadow-neo-brand">
              <div className="w-9 h-9 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-brand" />
              </div>
              <span className="text-xs font-bold text-ink-primary">ShoppingAgent</span>
              <span className="text-[10px] text-brand/80 font-mono">Autonomous Caller</span>
            </div>

            <ArrowRight className="w-4 h-4 text-ink-subtle hidden md:block shrink-0" />

            {/* PayGuard Node */}
            <div className="flex flex-col items-center gap-2 px-5 py-4 min-w-[160px]
                            rounded-neo-lg bg-guard-allow/8 border border-guard-allow/20 shadow-neo-allow">
              <div className="w-9 h-9 rounded-full bg-guard-allow/15 border border-guard-allow/30 flex items-center justify-center">
                <Lock className="w-4 h-4 text-guard-allow" />
              </div>
              <span className="text-xs font-bold text-guard-allow">PayGuard Control-Plane</span>
              <span className="text-[10px] text-guard-allow/70 font-mono">Intent &amp; Policy Firewall</span>
            </div>

            <ArrowRight className="w-4 h-4 text-ink-subtle hidden md:block shrink-0" />

            {/* Gateway Node */}
            <div className="flex flex-col items-center gap-2 pg-surface px-5 py-4 min-w-[120px]">
              <div className="w-9 h-9 rounded-full bg-guard-review/10 border border-guard-review/30 flex items-center justify-center">
                <Store className="w-4 h-4 text-guard-review" />
              </div>
              <span className="text-xs font-bold text-ink-primary">Razorpay Gateway</span>
              <span className="text-[10px] text-ink-muted font-mono">Merchant Execution</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
