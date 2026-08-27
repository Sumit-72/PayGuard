import React, { useState } from 'react';
import {
  Shield, Activity, FileText, Lock, PlayCircle,
  Code2, RefreshCw, Zap, Menu, X
} from 'lucide-react';

const navTabs = [
  { id: 'overview',      label: 'Overview',              icon: Activity    },
  { id: 'transactions',  label: 'Intercept Feed',        icon: Zap         },
  { id: 'policies',      label: 'Policy Engine',         icon: FileText    },
  { id: 'agents',        label: 'Agent Security',        icon: Lock        },
  { id: 'simulator',     label: 'Scenario Lab',          icon: PlayCircle  },
  { id: 'sdk',           label: 'SDK Integration',       icon: Code2       },
];

export default function Header({ activeTab, setActiveTab, onResetData, systemMetrics }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileNavOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-base/90 backdrop-blur-xl border-b border-surface-border/70">
      {/* ── Main Row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-neo bg-surface-raised shadow-neo-sm flex items-center justify-center">
            <Shield className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-ink-primary">
                Pay<span className="text-brand-accent">Guard</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold font-mono bg-brand/10 text-brand border border-brand/25 rounded tracking-widest">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-ink-muted font-mono -mt-0.5 hidden lg:block">
              AI Payment Firewall
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-0.5 bg-surface-raised shadow-neo-sm rounded-neo border border-surface-border/50 p-1"
          aria-label="Main navigation"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium',
                  'transition-neo duration-neo whitespace-nowrap',
                  'focus-visible:outline-none focus-visible:shadow-neo-focus',
                  'active:shadow-neo-pressed active:translate-y-px select-none',
                  isActive
                    ? 'bg-brand text-white shadow-neo-brand font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay',
                ].join(' ')}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Firewall Status — only on wide screens */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-neo bg-surface-raised shadow-neo-sm border border-surface-border/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-guard-allow opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-guard-allow" />
            </span>
            <span className="text-[10px] font-mono font-semibold text-guard-allow tracking-wider">
              ACTIVE
            </span>
            <span className="text-[10px] font-mono text-ink-muted">&lt;15ms</span>
          </div>

          {/* Reset State */}
          <button
            onClick={onResetData}
            title="Reset to default mock state"
            className="pg-btn-ghost text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="pg-btn-icon md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Nav Drawer ── */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-surface-border/60 bg-surface-raised px-4 py-3">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-neo text-sm font-medium text-left',
                    'transition-neo duration-neo',
                    'focus-visible:outline-none focus-visible:shadow-neo-focus',
                    'active:shadow-neo-pressed select-none',
                    isActive
                      ? 'bg-brand/10 text-brand font-semibold border border-brand/20'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
