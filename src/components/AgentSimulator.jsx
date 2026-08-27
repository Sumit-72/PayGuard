import React, { useState } from 'react';
import { PlayCircle, Zap, CheckCircle2 } from 'lucide-react';
import { predefinedScenarios } from '../data/scenarios';
import { payguard } from '../engine/payguardSDK';

function decisionBadgeClass(decision) {
  switch (decision) {
    case 'ALLOW':   return 'pg-badge-allow';
    case 'STEP-UP': return 'pg-badge-stepup';
    case 'REVIEW':  return 'pg-badge-review';
    case 'BLOCK':   return 'pg-badge-block';
    default:        return 'pg-badge bg-surface-overlay text-ink-secondary border-surface-border';
  }
}

export default function AgentSimulator({ policy, agents, onNewTransaction, onRequestStepUp }) {
  const [selectedScenario, setSelectedScenario] = useState(predefinedScenarios[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [customMerchant, setCustomMerchant] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSelectScenario = (sc) => {
    setSelectedScenario(sc);
    setCustomAmount('');
    setCustomMerchant('');
    setCustomDescription('');
    setLastResult(null);
  };

  const handleRunSimulation = async () => {
    setIsExecuting(true);
    setLastResult(null);

    const targetAgent = agents.find((a) => a.id === selectedScenario.agent_id) || agents[0];
    const payment = {
      amount:      customAmount ? Number(customAmount) : selectedScenario.payment_request.amount,
      merchant:    customMerchant || selectedScenario.payment_request.merchant,
      category:    selectedScenario.payment_request.category,
      description: customDescription || selectedScenario.payment_request.description,
    };
    const intent = targetAgent.active_intent;

    setTimeout(async () => {
      const response = await payguard.authorize({ agent: targetAgent, policy, intent, payment });
      setIsExecuting(false);
      setLastResult(response);
      onNewTransaction(response.rawResult);
      if (response.decision === 'STEP-UP') {
        onRequestStepUp(response.rawResult);
      }
    }, 600);
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="pg-surface p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <PlayCircle className="w-4 h-4 text-brand-accent shrink-0" />
          <h2 className="text-base font-bold text-ink-primary">Interactive Scenario Lab</h2>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Simulate real agent payment requests to observe how PayGuard evaluates intent drift, hard policy violations,
          and anomaly detection in real-time.
        </p>
      </div>

      {/* ── Scenario Selector ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {predefinedScenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={[
                'text-left p-4 rounded-neo-lg border transition-neo duration-neo',
                'focus-visible:outline-none focus-visible:shadow-neo-focus',
                'active:shadow-neo-pressed active:translate-y-px select-none',
                isSelected
                  ? 'bg-brand/8 border-brand/30 shadow-neo-brand'
                  : 'pg-surface hover:border-surface-border hover:bg-surface-overlay',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20 tracking-wider uppercase">
                  {sc.badge}
                </span>
                <span className="text-[10px] text-ink-muted font-mono">{sc.subtitle}</span>
              </div>
              <h3 className={`font-bold text-xs mb-1.5 ${isSelected ? 'text-brand' : 'text-ink-primary'}`}>
                {sc.title}
              </h3>
              <p className="text-[11px] text-ink-secondary leading-snug line-clamp-2">{sc.description}</p>
            </button>
          );
        })}
      </div>

      {/* ── Execution Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left: Parameters */}
        <div className="pg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider">Test Parameters</h3>
            <span className="text-xs text-brand-accent font-mono font-semibold">{selectedScenario.title}</span>
          </div>

          {/* Scenario context */}
          <div className="pg-inset p-3 rounded-neo space-y-2 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted shrink-0">Agent:</span>
              <span className="text-ink-primary font-mono font-semibold text-right">{selectedScenario.agent_name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted shrink-0">Intent:</span>
              <span className="text-brand-accent font-mono italic text-right">"{selectedScenario.stated_intent}"</span>
            </div>
            <div className="flex flex-col gap-1 pt-1 border-t border-surface-border/40">
              <span className="text-ink-muted text-[10px]">Why gateways fail here:</span>
              <span className="text-ink-secondary text-[11px] leading-snug">{selectedScenario.why_gateways_fail}</span>
            </div>
          </div>

          {/* Custom overrides */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-ink-muted font-mono block mb-1 uppercase tracking-wide">
                Amount (₹) — Default: ₹{selectedScenario.payment_request.amount.toLocaleString()}
              </label>
              <input
                type="number"
                placeholder={`₹${selectedScenario.payment_request.amount.toLocaleString()}`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pg-input-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-ink-muted font-mono block mb-1 uppercase tracking-wide">
                Merchant — Default: {selectedScenario.payment_request.merchant}
              </label>
              <input
                type="text"
                placeholder={selectedScenario.payment_request.merchant}
                value={customMerchant}
                onChange={(e) => setCustomMerchant(e.target.value)}
                className="pg-input-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-ink-muted font-mono block mb-1 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                placeholder={selectedScenario.payment_request.description}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="pg-input-mono text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isExecuting}
            className="pg-btn-primary w-full py-2.5 text-xs"
          >
            {isExecuting ? (
              <>
                <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                Evaluating through PayGuard Engine…
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Intercept &amp; Authorize Request
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="pg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider">Firewall Output</h3>
            {lastResult && (
              <span className="text-[10px] font-mono text-guard-allow">
                {lastResult.latency_ms} ms
              </span>
            )}
          </div>

          {/* Empty state */}
          {!lastResult && !isExecuting && (
            <div className="pg-inset rounded-neo-lg py-14 text-center">
              <PlayCircle className="w-7 h-7 text-ink-subtle mx-auto mb-3" />
              <p className="text-xs text-ink-muted font-mono">
                Run a scenario to see the firewall evaluation.
              </p>
            </div>
          )}

          {/* Loading */}
          {isExecuting && (
            <div className="pg-inset rounded-neo-lg py-14 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto" />
              <p className="text-xs text-brand font-mono">
                Policy Check → Intent Drift → Risk Score…
              </p>
            </div>
          )}

          {/* Results */}
          {lastResult && !isExecuting && (
            <div className="space-y-3 font-mono text-xs">

              {/* Decision */}
              <div className="pg-inset p-3 rounded-neo flex items-center justify-between">
                <span className="text-ink-muted uppercase tracking-wider text-[10px]">Final Decision</span>
                <span className={`pg-badge text-sm ${decisionBadgeClass(lastResult.decision)}`}>
                  {lastResult.decision}
                </span>
              </div>

              {/* Risk & Latency */}
              <div className="grid grid-cols-2 gap-2">
                <div className="pg-stat-cell rounded-neo text-center">
                  <span className="pg-stat-label text-center">Risk Score</span>
                  <span className="pg-stat-value text-ink-primary text-base">
                    {lastResult.risk_score}<span className="text-ink-muted text-xs"> /100</span>
                  </span>
                </div>
                <div className="pg-stat-cell rounded-neo text-center">
                  <span className="pg-stat-label text-center">Latency</span>
                  <span className="pg-stat-value text-guard-allow text-base">
                    {lastResult.latency_ms}<span className="text-ink-muted text-xs"> ms</span>
                  </span>
                </div>
              </div>

              {/* Reasons */}
              <div className="pg-inset p-3 rounded-neo space-y-1.5">
                <span className="text-[9px] text-ink-muted uppercase tracking-widest block">Explainable Reasons</span>
                {lastResult.reasons.map((r, i) => (
                  <div key={i} className="text-[11px] text-ink-secondary">{r}</div>
                ))}
              </div>

              {/* Gateway handoff */}
              {lastResult.decision === 'ALLOW' && (
                <div className="p-3 bg-guard-allow/8 border border-guard-allow/20 rounded-neo space-y-1 text-guard-allow">
                  <div className="font-bold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Razorpay Gateway Handoff Ready
                  </div>
                  <p className="text-[10px] text-guard-allow/70">
                    Cleared authorization firewall. Forwarded to gateway API.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
