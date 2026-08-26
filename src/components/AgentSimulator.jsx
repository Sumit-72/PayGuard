import React, { useState } from 'react';
import { PlayCircle, ShieldCheck, ShieldAlert, AlertTriangle, ShieldX, ArrowRight, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { predefinedScenarios } from '../data/scenarios';
import { payguard } from '../engine/payguardSDK';

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

    const targetAgent = agents.find(a => a.id === selectedScenario.agent_id) || agents[0];
    const payment = {
      amount: customAmount ? Number(customAmount) : selectedScenario.payment_request.amount,
      merchant: customMerchant || selectedScenario.payment_request.merchant,
      category: selectedScenario.payment_request.category,
      description: customDescription || selectedScenario.payment_request.description
    };

    const intent = targetAgent.active_intent;

    // Simulate Firewall Evaluation latency
    setTimeout(async () => {
      const response = await payguard.authorize({
        agent: targetAgent,
        policy,
        intent,
        payment
      });

      setIsExecuting(false);
      setLastResult(response);

      // Record transaction into live feed
      onNewTransaction(response.rawResult);

      // If STEP-UP, trigger interactive confirmation modal
      if (response.decision === 'STEP-UP') {
        onRequestStepUp(response.rawResult);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Interactive Agent Scenario Lab</h2>
        </div>
        <p className="text-xs text-slate-300">
          Simulate real agent payment requests to observe how PayGuard evaluates intent drift, hard policy rules, and retry storm anomalies in real-time.
        </p>
      </div>

      {/* Scenario Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {predefinedScenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-indigo-950/80 border-indigo-500 shadow-glow-indigo'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {sc.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{sc.subtitle}</span>
              </div>
              <h3 className="font-bold text-xs text-white mb-1">{sc.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2">{sc.description}</p>
            </button>
          );
        })}
      </div>

      {/* Scenario Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scenario Details & Parameter Controls */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Selected Test Parameters
            </h3>
            <span className="text-xs text-cyan-400 font-mono font-bold">{selectedScenario.title}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Agent:</span>
              <span className="text-white font-mono font-bold">{selectedScenario.agent_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">User Intent:</span>
              <span className="text-cyan-400 font-mono italic">"{selectedScenario.stated_intent}"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Why Gateways Fail:</span>
              <span className="text-slate-300 text-[11px] max-w-xs text-right">{selectedScenario.why_gateways_fail}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Requested Amount (₹)</label>
              <input
                type="number"
                placeholder={`Default: ₹${selectedScenario.payment_request.amount.toLocaleString()}`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Merchant Name</label>
              <input
                type="text"
                placeholder={`Default: ${selectedScenario.payment_request.merchant}`}
                value={customMerchant}
                onChange={(e) => setCustomMerchant(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Item Description</label>
              <input
                type="text"
                placeholder={`Default: ${selectedScenario.payment_request.description}`}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isExecuting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all font-mono"
          >
            {isExecuting ? (
              <span>Evaluating through PayGuard Engine...</span>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Intercept & Authorize Agent Request
              </>
            )}
          </button>
        </div>

        {/* Live Evaluation Output */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>PayGuard Firewall Output</span>
            {lastResult && <span className="text-[10px] font-mono text-emerald-400">{lastResult.latency_ms} ms</span>}
          </h3>

          {!lastResult && !isExecuting && (
            <div className="py-16 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              Click 'Intercept & Authorize' to run scenario through Policy + Risk + Context Engine.
            </div>
          )}

          {isExecuting && (
            <div className="py-16 text-center space-y-3 font-mono text-xs">
              <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-300">Checking Hard Policy Rules → Calculating Intent Drift → Risk Score...</p>
            </div>
          )}

          {lastResult && !isExecuting && (
            <div className="space-y-4 font-mono text-xs">
              
              {/* Decision Badge */}
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Final Decision:</span>
                <span className={`px-3 py-1 rounded text-sm font-bold border ${
                  lastResult.decision === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                  lastResult.decision === 'STEP-UP' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                  lastResult.decision === 'REVIEW' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' :
                  'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {lastResult.decision}
                </span>
              </div>

              {/* Risk Score & Latency */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
                  <span className="text-lg font-bold text-white">{lastResult.risk_score} / 100</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">LATENCY</span>
                  <span className="text-lg font-bold text-emerald-400">{lastResult.latency_ms} ms</span>
                </div>
              </div>

              {/* Decision Reasons */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Explainable Reasons:</span>
                {lastResult.reasons.map((r, i) => (
                  <div key={i} className="text-[11px] text-slate-200">{r}</div>
                ))}
              </div>

              {/* Gateway Handoff Button if ALLOW */}
              {lastResult.decision === 'ALLOW' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-emerald-400 text-[11px]">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Razorpay Test-Mode Gateway Handoff Ready
                  </div>
                  <p>Transaction cleared authorization firewall. Forwarded to gateway API.</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
