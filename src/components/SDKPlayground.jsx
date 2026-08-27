import React, { useState } from 'react';
import { Code2, Play, Copy, Check, Terminal } from 'lucide-react';
import { payguard } from '../engine/payguardSDK';

export default function SDKPlayground({ policy, agents }) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([
    '// PayGuard JavaScript SDK v1.0.4 initialized',
    '// Ready for agent authorization calls',
  ]);

  const sdkCodeSnippet = `import { payguard } from '@payguard/sdk';

// Intercept agent payment before reaching gateway
const result = await payguard.authorize({
  agent: "shopping-agent-pro",
  intent: "Buy a laptop under ₹70,000",
  payment: {
    amount: 68999,
    merchant: "ABC Electronics",
    category: "electronics",
    description: "Dell XPS 13 Purchase"
  }
});

if (result.decision === "ALLOW") {
  // Safe to execute gateway charge
  const paymentResult = await result.processGateway();
  console.log("Payment Executed via Razorpay:", paymentResult.payment_id);
} else if (result.decision === "STEP-UP") {
  // Trigger interactive human confirmation modal
  await requestUserConfirmation(result);
} else if (result.decision === "BLOCK") {
  // Policy or Intent violation — reject transaction
  throw new Error(\`PayGuard Blocked: \${result.reasons.join(", ")}\`);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sdkCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSDKCode = async () => {
    setIsRunning(true);
    setConsoleLogs((prev) => [...prev, '\n> Running payguard.authorize({...})...']);

    setTimeout(async () => {
      const response = await payguard.authorize({
        agent: agents[0],
        policy,
        intent: agents[0].active_intent,
        payment: {
          amount: 68999,
          merchant: 'ABC Store',
          category: 'electronics',
          description: 'Dell XPS 13 Purchase',
        },
      });

      const logs = [
        `[PayGuard SDK] Decision: ${response.decision} (Latency: ${response.latency_ms}ms)`,
        `[PayGuard SDK] Risk Score: ${response.risk_score}/100`,
        ...response.reasons.map((r) => `  └ ${r}`),
      ];

      if (response.decision === 'ALLOW') {
        const gwResult = await response.processGateway();
        logs.push(
          `[Razorpay Gateway] Payment Settled: ${gwResult.payment_id} (Status: ${gwResult.status})`
        );
      }

      setConsoleLogs((prev) => [...prev, ...logs]);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="pg-surface p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <Code2 className="w-4 h-4 text-brand-accent shrink-0" />
          <h2 className="text-base font-bold text-ink-primary">SDK Integration Lab</h2>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Drop-in accountability layer for autonomous money movement. Intercept agent tool calls before
          they hit Razorpay APIs — one line of middleware.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── SDK Snippet ── */}
        <div className="pg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">
              @payguard/sdk
            </h3>
            <button
              onClick={handleCopyCode}
              className="pg-btn-ghost text-xs gap-1.5 py-1 px-2.5 font-mono"
            >
              {copied
                ? <><Check className="w-3.5 h-3.5 text-guard-allow" /> Copied</>
                : <><Copy className="w-3.5 h-3.5" /> Copy</>
              }
            </button>
          </div>

          <div className="pg-code-block p-4 rounded-neo-lg h-[320px]">
            <pre className="text-brand-accent/85 leading-relaxed text-[11px]">{sdkCodeSnippet}</pre>
          </div>
        </div>

        {/* ── Console Output ── */}
        <div className="pg-surface p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-2 font-mono">
              <Terminal className="w-3.5 h-3.5 text-guard-allow" />
              Live Execution Output
            </h3>
            <button
              onClick={handleRunSDKCode}
              disabled={isRunning}
              className="pg-btn-primary text-xs gap-1.5 py-1.5 px-3"
            >
              {isRunning ? (
                <>
                  <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                <><Play className="w-3 h-3" /> Execute</>
              )}
            </button>
          </div>

          <div className="pg-code-block flex-1 p-4 rounded-neo-lg min-h-[300px] overflow-y-auto space-y-1">
            {consoleLogs.map((log, i) => (
              <div
                key={i}
                className={
                  log.startsWith('>')
                    ? 'text-brand-accent font-bold'
                    : log.includes('Razorpay')
                    ? 'text-guard-stepup font-bold'
                    : log.includes('[PayGuard SDK] Decision:')
                    ? 'text-ink-primary font-semibold'
                    : log.startsWith('//')
                    ? 'text-ink-muted italic'
                    : 'text-ink-secondary'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
