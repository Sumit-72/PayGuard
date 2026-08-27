import React, { useState } from 'react';
import { FileText, Sparkles, Code2, Play } from 'lucide-react';
import { parseNaturalLanguagePolicy } from '../engine/nlPolicyParser';

export default function PolicyEditor({ policy, onSavePolicy }) {
  const [nlPrompt, setNlPrompt] = useState(
    policy.raw_prompt ||
    "Allow my shopping agent to spend up to ₹25,000/day. Purchases above ₹5,000 need my confirmation. Don't allow electronics from unknown merchants."
  );
  const [activeJson, setActiveJson] = useState(policy);
  const [yamlPreview, setYamlPreview] = useState(parseNaturalLanguagePolicy(nlPrompt).yaml);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testAmount, setTestAmount] = useState(7499);
  const [testMerchant, setTestMerchant] = useState('ABC Store');
  const [testResult, setTestResult] = useState(null);

  const handleGenerateFromNL = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguagePolicy(nlPrompt);
      const updatedPolicy = { ...activeJson, ...parsed.json, raw_prompt: nlPrompt };
      setActiveJson(updatedPolicy);
      setYamlPreview(parsed.yaml);
      setIsGenerating(false);
      onSavePolicy(updatedPolicy);
    }, 400);
  };

  const handleRunPolicyTest = () => {
    const passedTxLimit       = testAmount <= activeJson.max_transaction;
    const passedMerchant      = (activeJson.allowed_merchants || []).includes(testMerchant);
    const requiresConfirmation = testAmount > activeJson.requires_confirmation_above;

    let decision = 'ALLOW';
    if (!passedTxLimit || !passedMerchant) decision = 'BLOCK';
    else if (requiresConfirmation) decision = 'STEP-UP';

    setTestResult({
      decision,
      reasons: [
        passedTxLimit
          ? `✓ Within transaction limit (₹${activeJson.max_transaction?.toLocaleString()})`
          : `✗ Exceeds per-tx limit (₹${activeJson.max_transaction?.toLocaleString()})`,
        passedMerchant
          ? `✓ Merchant '${testMerchant}' is approved`
          : `✗ Merchant '${testMerchant}' is outside approved list`,
        requiresConfirmation
          ? `⚡ Exceeds auto-approval limit (₹${activeJson.requires_confirmation_above?.toLocaleString()}) — OTP required`
          : `✓ Within auto-approval limit`,
      ],
    });
  };

  const decisionResultClass = testResult
    ? testResult.decision === 'ALLOW'   ? 'pg-badge-allow'
    : testResult.decision === 'STEP-UP' ? 'pg-badge-stepup'
    :                                      'pg-badge-block'
    : '';

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="pg-surface p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <FileText className="w-4 h-4 text-brand shrink-0" />
          <h2 className="text-base font-bold text-ink-primary">Natural Language Policy Engine</h2>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Write policy in plain English → parsed to structured, versioned JSON → deterministically enforced at runtime.
          <span className="text-ink-muted font-mono"> No LLM in the enforcement loop.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Left: NL Input + Policy Summary ── */}
        <div className="pg-surface p-5 space-y-4">

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              Natural Language Input
            </label>
            <span className="text-[10px] text-ink-muted font-mono">DETERMINISTIC ENFORCEMENT</span>
          </div>

          <textarea
            value={nlPrompt}
            onChange={(e) => setNlPrompt(e.target.value)}
            rows={4}
            className="pg-textarea text-xs"
            placeholder="Describe your policy in plain English…"
          />

          <button
            onClick={handleGenerateFromNL}
            disabled={isGenerating}
            className="pg-btn-primary w-full py-2.5 text-xs"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                Parsing to JSON Policy…
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Translate to Enforceable JSON Policy
              </>
            )}
          </button>

          {/* Active Policy Parameters */}
          <div className="pt-1 space-y-3">
            <h3 className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">
              Active Policy Parameters
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="pg-stat-cell">
                <span className="pg-stat-label">Daily Limit</span>
                <span className="pg-stat-value text-ink-primary">
                  ₹{activeJson.daily_limit?.toLocaleString()}
                </span>
              </div>
              <div className="pg-stat-cell">
                <span className="pg-stat-label">Per-Tx Limit</span>
                <span className="pg-stat-value text-ink-primary">
                  ₹{activeJson.max_transaction?.toLocaleString()}
                </span>
              </div>
              <div className="pg-stat-cell">
                <span className="pg-stat-label">Auto-Approval Below</span>
                <span className="pg-stat-value text-guard-stepup">
                  ₹{activeJson.requires_confirmation_above?.toLocaleString()}
                </span>
              </div>
              <div className="pg-stat-cell">
                <span className="pg-stat-label">Approved Vendors</span>
                <span className="pg-stat-value text-guard-allow">
                  {activeJson.allowed_merchants?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: YAML Preview + Test Harness ── */}
        <div className="pg-surface p-5 space-y-4">

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-guard-allow" />
              Compiled Policy Spec
            </label>
            <span className="text-[10px] text-guard-allow font-mono font-bold">READY FOR ENGINE</span>
          </div>

          <div className="pg-code-block p-4 max-h-56 rounded-neo-lg">
            <pre className="text-guard-allow/90 leading-relaxed text-[11px]">{yamlPreview}</pre>
          </div>

          {/* ── Instant Test Harness ── */}
          <div className="pt-1 space-y-3">
            <h3 className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest flex items-center gap-1.5">
              <Play className="w-3 h-3 text-brand-accent" />
              Instant Policy Evaluator
            </h3>

            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-1">
                <label className="text-[10px] text-ink-muted font-mono block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="pg-input-mono text-xs py-1.5"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] text-ink-muted font-mono block mb-1">Merchant</label>
                <input
                  type="text"
                  value={testMerchant}
                  onChange={(e) => setTestMerchant(e.target.value)}
                  className="pg-input-mono text-xs py-1.5"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={handleRunPolicyTest}
                  className="pg-btn-primary w-full py-1.5 text-xs"
                >
                  Test
                </button>
              </div>
            </div>

            {testResult && (
              <div className="pg-inset p-3 space-y-2 rounded-neo">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-ink-muted font-mono uppercase tracking-wider">Result</span>
                  <span className={`pg-badge ${decisionResultClass}`}>{testResult.decision}</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {testResult.reasons.map((r, i) => (
                    <div
                      key={i}
                      className={r.startsWith('✓') ? 'text-guard-allow' : r.startsWith('✗') ? 'text-guard-block' : 'text-guard-stepup'}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
