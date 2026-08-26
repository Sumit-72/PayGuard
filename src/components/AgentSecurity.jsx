import React from 'react';
import { Lock, ShieldAlert, ShieldCheck, AlertOctagon, RotateCcw, Activity, ArrowRight, User, Cpu, Store } from 'lucide-react';

export default function AgentSecurity({ agents, onToggleAgentStatus, transactions }) {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Agent Security & Transaction Graph</h2>
        </div>
        <p className="text-xs text-slate-300">
          Per-agent behavior monitoring, anomaly flags (e.g. "27 attempts today vs normal 1–3/day → possible retry loop → agent temporarily suspended"), and freeze/unfreeze controls.
        </p>
      </div>

      {/* Per-Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const isSuspended = agent.status === 'suspended';
          const isHighRisk = agent.risk_score > 60;

          return (
            <div
              key={agent.id}
              className={`glass-panel rounded-xl p-5 space-y-4 border transition-all ${
                isSuspended
                  ? 'border-rose-500/50 bg-rose-950/20'
                  : isHighRisk
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Agent Title & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                    {agent.avatar || '🤖'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{agent.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{agent.id}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                    isSuspended
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              {/* Stated Intent */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Active Stated Intent
                </span>
                <p className="text-slate-200 italic font-mono">
                  "{agent.active_intent?.raw_text || 'No active intent'}"
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
                  <span className={`font-bold ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {agent.risk_score}/100
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">SPENT TODAY</span>
                  <span className="font-bold text-white">₹{agent.spent_today?.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TX TODAY</span>
                  <span className="font-bold text-white">{agent.tx_count_today}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">BLOCKS TODAY</span>
                  <span className={`font-bold ${agent.blocked_count_today > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {agent.blocked_count_today}
                  </span>
                </div>
              </div>

              {/* Action Button: Freeze / Unfreeze */}
              <button
                onClick={() => onToggleAgentStatus(agent.id)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 ${
                  isSuspended
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-rose-600/80 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                }`}
              >
                {isSuspended ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" /> Unfreeze & Restore Agent
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-3.5 h-3.5" /> Freeze Agent Execution
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

      {/* Transaction Relationship Graph Visualizer (PDF Section 6.7) */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Transaction Relationship Graph Visualizer
          </h3>
          <span className="text-xs font-mono text-slate-400">User → Agent → Merchant → Gateway</span>
        </div>

        <div className="p-6 bg-[#0B0F17] rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* User Node */}
            <div className="flex flex-col items-center gap-2 bg-slate-900 p-4 rounded-xl border border-slate-700 min-w-[120px]">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Human User</span>
              <span className="text-[10px] text-slate-400 font-mono">Owner Identity</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />

            {/* Agent Node */}
            <div className="flex flex-col items-center gap-2 bg-indigo-950/80 p-4 rounded-xl border border-indigo-500/40 shadow-glow-indigo min-w-[140px]">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">ShoppingAgent</span>
              <span className="text-[10px] text-indigo-300 font-mono">Autonomous Caller</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />

            {/* PayGuard Node */}
            <div className="flex flex-col items-center gap-2 bg-emerald-950/80 p-4 rounded-xl border border-emerald-500/40 shadow-glow-emerald min-w-[160px]">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-300">PayGuard Control-Plane</span>
              <span className="text-[10px] text-emerald-400 font-mono">Intent & Policy Firewall</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />

            {/* Gateway / Merchant Node */}
            <div className="flex flex-col items-center gap-2 bg-slate-900 p-4 rounded-xl border border-slate-700 min-w-[120px]">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-300">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Razorpay Gateway</span>
              <span className="text-[10px] text-slate-400 font-mono">ABC Store (Merchant)</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
