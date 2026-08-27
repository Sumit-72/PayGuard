import React from 'react';
import {
  ShieldCheck, ShieldX, Cpu, Lock, Zap,
  ArrowRight, TrendingUp, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// ── Decision color map ────────────────────────────────────────────────
const DECISION_CONFIG = [
  { name: 'Allow',   key: 'allow',   color: '#10b981', bg: 'bg-guard-allow/10',   text: 'text-guard-allow',   border: 'border-guard-allow/25'   },
  { name: 'Step-Up', key: 'stepup',  color: '#f59e0b', bg: 'bg-guard-stepup/10',  text: 'text-guard-stepup',  border: 'border-guard-stepup/25'  },
  { name: 'Review',  key: 'review',  color: '#8b5cf6', bg: 'bg-guard-review/10',  text: 'text-guard-review',  border: 'border-guard-review/25'  },
  { name: 'Block',   key: 'block',   color: '#ef4444', bg: 'bg-guard-block/10',   text: 'text-guard-block',   border: 'border-guard-block/25'   },
];

const CATEGORY_DATA = [
  { category: 'Electronics',    allowed: 1500,  blocked: 24999 },
  { category: 'Travel',         allowed: 7800,  blocked: 8300  },
  { category: 'Office Supplies',allowed: 12500, blocked: 50000 },
  { category: 'Software',       allowed: 4200,  blocked: 0     },
];

// Custom recharts tooltip — matches design system
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised border border-surface-border shadow-neo-sm rounded-neo px-3 py-2 text-xs font-mono">
      {label && <div className="text-ink-secondary mb-1">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-ink-secondary">{p.name}:</span>
          <span className="text-ink-primary font-semibold">
            {typeof p.value === 'number' && p.value > 1000
              ? `₹${p.value.toLocaleString()}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function OverviewDashboard({ transactions, agents, setActiveTab }) {
  // Aggregate Metrics
  const totalCount    = transactions.length;
  const allowCount    = transactions.filter(t => t.decision === 'ALLOW').length;
  const stepUpCount   = transactions.filter(t => t.decision === 'STEP-UP').length;
  const reviewCount   = transactions.filter(t => t.decision === 'REVIEW').length;
  const blockCount    = transactions.filter(t => t.decision === 'BLOCK').length;
  const totalVolume   = transactions.reduce((acc, t) => acc + t.amount, 0);
  const allowedVolume = transactions.filter(t => t.decision === 'ALLOW').reduce((acc, t) => acc + t.amount, 0);
  const blockedVolume = transactions.filter(t => t.decision === 'BLOCK').reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: 'Allow',   value: allowCount,  color: '#10b981' },
    { name: 'Step-Up', value: stepUpCount, color: '#f59e0b' },
    { name: 'Review',  value: reviewCount, color: '#8b5cf6' },
    { name: 'Block',   value: blockCount,  color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Strategic Positioning Banner ─────────────────────────────── */}
      <div className="pg-surface p-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">

          {/* Left: title + tagline */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-neo bg-brand/8 border border-brand/20">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span className="text-[10px] font-mono font-bold text-brand tracking-widest uppercase">
                Control-Plane for Autonomous Commerce
              </span>
            </div>

            <h2 className="text-2xl font-bold text-ink-primary tracking-tight">
              PayGuard AI Payment Firewall
            </h2>

            <div className="space-y-1.5 text-sm text-ink-secondary leading-relaxed">
              <p>
                Traditional gateways ask:{' '}
                <span className="font-mono text-brand-accent italic">
                  "Is this caller who they claim to be?"
                </span>
              </p>
              <p>
                PayGuard asks:{' '}
                <span className="font-mono text-guard-allow italic font-semibold">
                  "Is this specific payment action actually authorized by what the user intended?"
                </span>
              </p>
            </div>
          </div>

          {/* Right: ecosystem layering */}
          <div className="pg-inset p-4 rounded-neo-lg w-full lg:w-72 shrink-0 space-y-3">
            <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest block">
              Ecosystem Layering
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-ink-secondary">
                <span className="text-ink-primary">Agent Studio</span>
                <span>Makes agent capable</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span className="text-ink-primary">Vulcan ML</span>
                <span>Makes transaction smart</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-surface-border/50">
                <span className="text-guard-allow font-bold">PayGuard</span>
                <span className="text-guard-allow text-[11px]">Makes agent accountable</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Flow Pipeline */}
        <div className="mt-6 pt-5 border-t border-surface-border/50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center text-xs">

            <div className="pg-inset px-3 py-2.5 rounded-neo">
              <span className="text-[9px] font-mono text-ink-muted uppercase tracking-widest block mb-1">Step 1</span>
              <span className="font-bold text-ink-primary">USER INTENT</span>
              <span className="text-[10px] text-ink-secondary block mt-0.5 font-mono">"Buy laptop &lt;₹70k"</span>
            </div>

            <div className="hidden md:flex justify-center text-ink-subtle">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="px-3 py-2.5 rounded-neo bg-brand/8 border border-brand/20 shadow-neo-brand">
              <span className="text-[9px] font-mono text-brand uppercase tracking-widest block mb-1">Step 2</span>
              <span className="font-bold text-brand">PAYGUARD FIREWALL</span>
              <span className="text-[10px] text-brand-accent block mt-0.5 font-mono">Policy + Risk + Intent</span>
            </div>

            <div className="hidden md:flex justify-center text-ink-subtle">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="pg-inset px-3 py-2.5 rounded-neo">
              <span className="text-[9px] font-mono text-ink-muted uppercase tracking-widest block mb-1">Step 3</span>
              <span className="font-bold text-guard-allow">RAZORPAY GATEWAY</span>
              <span className="text-[10px] text-ink-secondary block mt-0.5 font-mono">Executes Charge</span>
            </div>

          </div>
        </div>
      </div>

      {/* ── Top Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="pg-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Protected Volume</span>
            <div className="w-7 h-7 rounded-neo bg-surface-overlay shadow-neo-sm flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-brand-accent" />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-primary font-mono">
            ₹{totalVolume.toLocaleString()}
          </div>
          <p className="text-[11px] text-guard-allow font-mono">
            ✓ ₹{allowedVolume.toLocaleString()} cleared
          </p>
        </div>

        <div className="pg-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Prevented Loss</span>
            <div className="w-7 h-7 rounded-neo bg-surface-overlay shadow-neo-sm flex items-center justify-center">
              <ShieldX className="w-3.5 h-3.5 text-guard-block" />
            </div>
          </div>
          <div className="text-2xl font-bold text-guard-block font-mono">
            ₹{blockedVolume.toLocaleString()}
          </div>
          <p className="text-[11px] text-guard-block font-mono">
            {blockCount} unauthorized attempt{blockCount !== 1 ? 's' : ''} blocked
          </p>
        </div>

        <div className="pg-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Total Interceptions</span>
            <div className="w-7 h-7 rounded-neo bg-surface-overlay shadow-neo-sm flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-brand" />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-primary font-mono">
            {totalCount}
            <span className="text-sm font-normal text-ink-secondary ml-1">txns</span>
          </div>
          <p className="text-[11px] text-ink-secondary font-mono">
            Avg latency: <span className="text-guard-allow">14.2 ms</span>
          </p>
        </div>

        <div className="pg-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Managed Agents</span>
            <div className="w-7 h-7 rounded-neo bg-surface-overlay shadow-neo-sm flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-guard-review" />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-primary font-mono">
            {agents.length}
            <span className="text-sm font-normal text-ink-secondary ml-1">agents</span>
          </div>
          <p className="text-[11px] text-guard-review font-mono">
            {agents.filter(a => a.status === 'active').length} active
            {agents.filter(a => a.status === 'suspended').length > 0 && (
              <span className="text-guard-block">
                {' '}/ {agents.filter(a => a.status === 'suspended').length} suspended
              </span>
            )}
          </p>
        </div>

      </div>

      {/* ── Decision Tier Overview ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'ALLOW', count: allowCount,
            color: 'text-guard-allow', border: 'border-l-guard-allow',
            bg: 'bg-guard-allow/5',
            desc: 'Within budget, known merchant, risk score < 30'
          },
          {
            label: 'STEP-UP', count: stepUpCount,
            color: 'text-guard-stepup', border: 'border-l-guard-stepup',
            bg: 'bg-guard-stepup/5',
            desc: 'Threshold crossed or intent drift — OTP required'
          },
          {
            label: 'REVIEW', count: reviewCount,
            color: 'text-guard-review', border: 'border-l-guard-review',
            bg: 'bg-guard-review/5',
            desc: 'Unusual merchant or risk 50–74 — human queue'
          },
          {
            label: 'BLOCK', count: blockCount,
            color: 'text-guard-block', border: 'border-l-guard-block',
            bg: 'bg-guard-block/5',
            desc: 'Hard policy violation or risk > 75 — rejected'
          },
        ].map(({ label, count, color, border, bg, desc }) => (
          <div
            key={label}
            className={`pg-surface p-4 border-l-2 ${border} ${bg} space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className={`pg-badge ${
                label === 'ALLOW'   ? 'pg-badge-allow'   :
                label === 'STEP-UP' ? 'pg-badge-stepup'  :
                label === 'REVIEW'  ? 'pg-badge-review'  :
                                      'pg-badge-block'
              }`}>{label}</span>
              <span className={`text-xl font-bold font-mono ${color}`}>{count}</span>
            </div>
            <p className="text-xs text-ink-secondary leading-snug">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Analytics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Decision Breakdown Donut */}
        <div className="pg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary">Decision Ratio</h3>
            <span className="text-[10px] text-ink-muted font-mono">Live</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={46} outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-ink-secondary">{d.name}:</span>
                <span className="text-ink-primary font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Volume Bar Chart */}
        <div className="pg-surface p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary">Category Breakdown</h3>
            <button
              onClick={() => setActiveTab('simulator')}
              className="pg-btn-ghost text-xs gap-1 py-1 px-2"
            >
              Run Scenario <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#4b5e7e"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#4b5e7e"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="allowed" name="Allowed (₹)" fill="#10b981" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="blocked" name="Blocked (₹)" fill="#ef4444" radius={[3, 3, 0, 0]} opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
