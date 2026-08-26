import React, { useState } from 'react';
import { Zap, Filter, Search, ShieldCheck, ShieldAlert, AlertTriangle, ShieldX, Eye, ArrowUpRight, Check, X, Info } from 'lucide-react';

export default function LiveTransactions({ transactions, onOverrideDecision, onOpenDetail }) {
  const [filterDecision, setFilterDecision] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => {
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

  const getBadgeStyle = (decision) => {
    switch (decision) {
      case 'ALLOW': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'STEP-UP': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'REVIEW': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'BLOCK': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return 'text-emerald-400';
    if (score < 60) return 'text-amber-400';
    if (score < 80) return 'text-purple-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Live Intercept Feed</h2>
          <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-full font-mono">
            {filtered.length} captured
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant, agent, item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'ALLOW', 'STEP-UP', 'REVIEW', 'BLOCK'].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDecision(d)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-all ${
                  filterDecision === d
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Intercept Stream Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Time & ID</th>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Merchant & Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4 text-center">Decision</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-mono">
                    No intercepted payment events match current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      <div>{new Date(tx.created_at).toLocaleTimeString()}</div>
                      <div className="text-[10px] text-slate-600">{tx.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {tx.agent_name}
                      <span className="block text-[10px] text-slate-400 font-mono">{tx.agent_id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{tx.merchant}</div>
                      <div className="text-[10px] text-slate-400">{tx.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className={`font-mono font-bold text-sm ${getRiskColor(tx.risk_score)}`}>
                        {tx.risk_score} <span className="text-[10px] text-slate-500">/100</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded border text-[11px] font-bold font-mono ${getBadgeStyle(tx.decision)}`}>
                        {tx.decision}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenDetail(tx)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" /> Details
                      </button>

                      {tx.decision === 'BLOCK' && (
                        <button
                          onClick={() => onOverrideDecision(tx.id, 'ALLOW')}
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded border border-emerald-500/40 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Override block and approve transaction"
                        >
                          <Check className="w-3 h-3" /> Override
                        </button>
                      )}
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
