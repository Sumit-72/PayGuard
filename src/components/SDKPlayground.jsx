import React, { useState } from 'react';
import { Code2, Play, Copy, Check, Terminal } from 'lucide-react';
import { payguard } from '../engine/payguardSDK';

export default function SDKPlayground({ policy, agents }) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([
    '// PayGuard JavaScript SDK v1.0.4 initialized',
    '// Ready for agent authorization calls'
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
  throw new Error(\`PayGuard Blocked Payment: \${result.reasons.join(", ")}\`);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sdkCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSDKCode = async () => {
    setIsRunning(true);
    setConsoleLogs(prev => [...prev, '\n> Running payguard.authorize({...})...']);

    setTimeout(async () => {
      const response = await payguard.authorize({
        agent: agents[0],
        policy,
        intent: agents[0].active_intent,
        payment: {
          amount: 68999,
          merchant: "ABC Store",
          category: "electronics",
          description: "Dell XPS 13 Purchase"
        }
      });

      const logs = [
        `[PayGuard SDK] Decision: ${response.decision} (Latency: ${response.latency_ms}ms)`,
        `[PayGuard SDK] Risk Score: ${response.risk_score}/100`,
        ...response.reasons.map(r => `  └ ${r}`)
      ];

      if (response.decision === "ALLOW") {
        const gwResult = await response.processGateway();
        logs.push(`[Razorpay Gateway] Payment Settled: ${gwResult.payment_id} (Status: ${gwResult.status})`);
      }

      setConsoleLogs(prev => [...prev, ...logs]);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">SDK-First Integration Lab</h2>
        </div>
        <p className="text-xs text-slate-300">
          Drop-in accountability layer for autonomous money movement. Intercept agent tool calls before hitting Razorpay APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: SDK Integration Snippet */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              @payguard/sdk integration
            </h3>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          <div className="bg-[#0B0F17] rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre className="text-cyan-300 leading-relaxed">{sdkCodeSnippet}</pre>
          </div>
        </div>

        {/* Right Column: SDK Console Output */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" /> Interactive Execution Output
            </h3>
            <button
              onClick={handleRunSDKCode}
              disabled={isRunning}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <Play className="w-3.5 h-3.5" /> Execute SDK Call
            </button>
          </div>

          <div className="bg-[#0B0F17] flex-1 min-h-[300px] rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1.5">
            {consoleLogs.map((log, index) => (
              <div key={index} className={log.startsWith('>') ? 'text-cyan-400 font-bold' : log.includes('Razorpay') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
