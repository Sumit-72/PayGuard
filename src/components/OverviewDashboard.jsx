import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Lock, ShieldX, TrendingUp, Cpu, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function OverviewDashboard({ transactions, agents, setActiveTab, onSimulateQuickTx }) {
  // Aggregate Metrics
  const totalCount = transactions.length;
  const allowCount = transactions.filter(t => t.decision === 'ALLOW').length;
  const stepUpCount = transactions.filter(t => t.decision === 'STEP-UP').length;
  const reviewCount = transactions.filter(t => t.decision === 'REVIEW').length;
  const blockCount = transactions.filter(t => t.decision === 'BLOCK').length;

  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const allowedVolume = transactions.filter(t => t.decision === 'ALLOW').reduce((acc, t) => acc + t.amount, 0);
  const blockedVolume = transactions.filter(t => t.decision === 'BLOCK').reduce((acc, t) => acc + t.amount, 0);

  const decisionData = [
    { name: 'Allow', value: allowCount, color: '#10B981' },
    { name: 'Step-Up', value: stepUpCount, color: '#F59E0B' },
    { name: 'Review', value: reviewCount, color: '#8B5CF6' },
    { name: 'Block', value: blockCount, color: '#EF4444' },
  ];

  const categoryVolumeData = [
    { category: 'Electronics', allowed: 1500, blocked: 24999 },
    { category: 'Travel', allowed: 7800, blocked: 8300 },
    { category: 'Office Supplies', allowed: 12500, blocked: 50000 },
    { category: 'Software', allowed: 4200, blocked: 0 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Strategic Positioning Header Banner (PDF Page 1 & 2) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/60 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              CONTROL-PLANE ARCHITECTURE FOR AUTONOMOUS COMMERCE
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              PayGuard AI Payment Firewall
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Traditional gateways ask: <span className="text-cyan-400 italic font-mono">"Is this caller who they claim to be?"</span><br />
              PayGuard asks: <span className="text-emerald-400 font-semibold italic font-mono">"Is this specific payment action, right now, actually authorized by what the user intended?"</span>
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 max-w-md w-full">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ecosystem Layering</div>
            <div className="text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400"><span className="text-slate-300">Agent Studio:</span> Makes agent capable</div>
              <div className="flex justify-between text-slate-400"><span className="text-slate-300">Vulcan ML:</span> Makes transaction smart</div>
              <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <span>PayGuard:</span> Makes agent accountable
              </div>
            </div>
          </div>
        </div>

        {/* System Flow Pipeline (PDF Page 2 Diagram) */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">STEP 1</span>
            <span className="text-xs font-bold text-slate-200">USER INTENT</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">"Buy laptop &lt;₹70k"</span>
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-600">→</div>
          <div className="bg-indigo-950/70 p-3 rounded-lg border border-indigo-500/40 shadow-glow-indigo">
            <span className="text-[10px] text-indigo-300 block font-mono">STEP 2</span>
            <span className="text-xs font-bold text-indigo-300">PAYGUARD FIREWALL</span>
            <span className="text-[10px] text-cyan-400 block mt-0.5 font-mono">Policy + ML Risk + Intent</span>
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-600">→</div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">STEP 3</span>
            <span className="text-xs font-bold text-emerald-400">RAZORPAY GATEWAY</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Executes Charge</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Protected Volume</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ₹{totalVolume.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>✓ ₹{allowedVolume.toLocaleString()} Allowed</span>
          </p>
        </div>

        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Prevented Loss (Blocked)</span>
            <ShieldX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            ₹{blockedVolume.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-400 font-mono">
            {blockCount} unauthorized or drift attempts blocked
          </p>
        </div>

        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Interceptions</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalCount} <span className="text-sm font-normal text-slate-400">Txns</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Avg decision latency: <span className="text-emerald-400">14.2 ms</span>
          </p>
        </div>

        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Managed Agents</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {agents.length} <span className="text-sm font-normal text-slate-400">Agents</span>
          </div>
          <p className="text-[11px] text-purple-400 font-mono">
            {agents.filter(a => a.status === 'active').length} Active / {agents.filter(a => a.status === 'suspended').length} Suspended
          </p>
        </div>

      </div>

      {/* 4 Decision Tiers Overview (PDF Section 6.4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              ALLOW
            </span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{allowCount}</span>
          </div>
          <p className="text-xs text-slate-300">Within budget, known merchant, low risk score (&lt;30)</p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4 border-l-amber-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
              STEP-UP
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono">{stepUpCount}</span>
          </div>
          <p className="text-xs text-slate-300">Crosses threshold or intent drift → Interactive OTP confirmation</p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4 border-l-purple-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono">
              REVIEW
            </span>
            <span className="text-lg font-bold text-purple-400 font-mono">{reviewCount}</span>
          </div>
          <p className="text-xs text-slate-300">Unusual merchant or risk 50–74 → Sent to Human Queue</p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4 border-l-rose-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono">
              BLOCK
            </span>
            <span className="text-lg font-bold text-rose-400 font-mono">{blockCount}</span>
          </div>
          <p className="text-xs text-slate-300">Hard policy violation, retry storm or risk &gt;75 → Rejected</p>
        </div>

      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Decision Breakdown Donut */}
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Decision Outcome Ratio</span>
            <span className="text-xs text-slate-400 font-mono">Live Stream</span>
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={decisionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {decisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {decisionData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-400">{d.name}:</span>
                <span className="text-white font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="glass-panel rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Protected Category Breakdown</h3>
            <button 
              onClick={() => setActiveTab('simulator')} 
              className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
            >
              Run Test Scenario <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="category" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="allowed" name="Allowed (₹)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="blocked" name="Blocked/Prevented (₹)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
