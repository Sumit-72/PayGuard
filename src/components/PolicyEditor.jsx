import React, { useState } from 'react';
import { FileText, Sparkles, Code2, CheckCircle2, AlertCircle, Play, Shield } from 'lucide-react';
import { parseNaturalLanguagePolicy } from '../engine/nlPolicyParser';

export default function PolicyEditor({ policy, onSavePolicy }) {
  const [nlPrompt, setNlPrompt] = useState(policy.raw_prompt || "Allow my shopping agent to spend up to ₹25,000/day. Purchases above ₹5,000 need my confirmation. Don't allow electronics from unknown merchants.");
  const [activeJson, setActiveJson] = useState(policy);
  const [yamlPreview, setYamlPreview] = useState(parseNaturalLanguagePolicy(nlPrompt).yaml);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testAmount, setTestAmount] = useState(7499);
  const [testMerchant, setTestMerchant] = useState("ABC Store");
  const [testCategory, setTestCategory] = useState("electronics");
  const [testResult, setTestResult] = useState(null);

  const handleGenerateFromNL = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguagePolicy(nlPrompt);
      const updatedPolicy = {
        ...activeJson,
        ...parsed.json,
        raw_prompt: nlPrompt
      };
      setActiveJson(updatedPolicy);
      setYamlPreview(parsed.yaml);
      setIsGenerating(false);
      onSavePolicy(updatedPolicy);
    }, 400);
  };

  const handleRunPolicyTest = () => {
    const passedTxLimit = testAmount <= activeJson.max_transaction;
    const passedMerchant = (activeJson.allowed_merchants || []).includes(testMerchant);
    const requiresConfirmation = testAmount > activeJson.requires_confirmation_above;

    let decision = "ALLOW";
    if (!passedTxLimit || !passedMerchant) decision = "BLOCK";
    else if (requiresConfirmation) decision = "STEP-UP";

    setTestResult({
      decision,
      passedTxLimit,
      passedMerchant,
      requiresConfirmation,
      reasons: [
        passedTxLimit ? `✓ Within transaction limit (₹${activeJson.max_transaction})` : `✗ Exceeds per-tx limit (₹${activeJson.max_transaction})`,
        passedMerchant ? `✓ Merchant '${testMerchant}' is approved` : `✗ Merchant '${testMerchant}' is outside approved list`,
        requiresConfirmation ? `⚡ Exceeds auto-approval limit (₹${activeJson.requires_confirmation_above}) → Requires OTP` : `✓ Within auto-approval limit`
      ]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Natural Language Policy Configuration</h2>
        </div>
        <p className="text-xs text-slate-300">
          User/merchant writes policy in plain English → LLM converts to structured, versioned JSON policy → deterministic engine enforces it forever after (no LLM in the loop at enforcement time).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Natural Language Prompt Input */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Natural-Language Prompt Input
            </label>
            <span className="text-[10px] text-slate-400 font-mono">ENFORCED DETERMINISTICALLY</span>
          </div>

          <textarea
            value={nlPrompt}
            onChange={(e) => setNlPrompt(e.target.value)}
            rows={4}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            placeholder="Describe policy in plain English..."
          />

          <button
            onClick={handleGenerateFromNL}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <span>Translating to JSON Policy...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Translate NL to Enforceable JSON Policy
              </>
            )}
          </button>

          {/* Active Rules Checklist */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Enforced Policy Parameters
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DAILY LIMIT</span>
                <span className="text-white font-bold">₹{activeJson.daily_limit?.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TRANSACTION LIMIT</span>
                <span className="text-white font-bold">₹{activeJson.max_transaction?.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">AUTO-APPROVAL THRESHOLD</span>
                <span className="text-amber-400 font-bold">₹{activeJson.requires_confirmation_above?.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">APPROVED MERCHANTS</span>
                <span className="text-emerald-400 font-bold">{activeJson.allowed_merchants?.length || 0} Vendors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Versioned JSON & YAML Preview (PDF Section 6.1) */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" /> Compiled Policy Spec (JSON & YAML)
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">READY FOR ENGINE</span>
          </div>

          <div className="bg-[#0B0F17] rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[320px]">
            <pre className="text-emerald-400 leading-relaxed">{yamlPreview}</pre>
          </div>

          {/* Instant Policy Test Harness */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-cyan-400" /> Instant Policy Evaluator Test Harness
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Merchant</label>
                <input
                  type="text"
                  value={testMerchant}
                  onChange={(e) => setTestMerchant(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleRunPolicyTest}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded font-mono"
                >
                  Test Policy
                </button>
              </div>
            </div>

            {testResult && (
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Result:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    testResult.decision === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400' :
                    testResult.decision === 'STEP-UP' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {testResult.decision}
                  </span>
                </div>
                {testResult.reasons.map((r, i) => (
                  <div key={i} className="text-[11px] text-slate-300">{r}</div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
