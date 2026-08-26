import React from 'react';
import { Shield, Activity, FileText, Lock, PlayCircle, Code2, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onResetData, systemMetrics }) {
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'transactions', label: 'Live Intercept Feed', icon: Zap },
    { id: 'policies', label: 'Policy & Intent Engine', icon: FileText },
    { id: 'agents', label: 'Agent Security & Graph', icon: Lock },
    { id: 'simulator', label: 'Interactive Scenario Lab', icon: PlayCircle },
    { id: 'sdk', label: 'SDK Integration', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-indigo">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight text-white font-sans">
                Pay<span className="text-cyan-400">Guard</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
                v1.0-PRODUCTION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI Payment Firewall for Autonomous Agents
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* System Controls & Firewall Status */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-medium">FIREWALL ACTIVE (&lt;15ms)</span>
          </div>

          <button
            onClick={onResetData}
            title="Reset to default mock state"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
        </div>

      </div>
    </header>
  );
}
