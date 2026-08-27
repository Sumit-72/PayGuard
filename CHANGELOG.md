# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-08-26

### Added

- **Neomorphic Design System** — Full Tailwind CSS design system using custom shadow tokens (`neo`, `neo-sm`, `neo-lg`, `neo-inset`, `neo-pressed`, `neo-focus`), color tokens (`surface.*`, `brand.*`, `guard.*`, `ink.*`), and border-radius tokens. Implemented as `@layer components` primitives (`pg-surface`, `pg-inset`, `pg-btn-primary`, `pg-btn-ghost`, `pg-btn-danger`, `pg-btn-allow`, `pg-btn-warn`, `pg-btn-icon`, `pg-input`, `pg-input-mono`, `pg-textarea`, `pg-badge-*`, `pg-stat-cell`, `pg-code-block`).
- **Interactive button states** — All buttons now have `active:shadow-neo-pressed`, `focus-visible:shadow-neo-focus`, `hover:*`, and `disabled:*` states.
- **Mobile navigation drawer** — Header now includes a collapsible mobile nav drawer replacing the horizontally-scrolling nav bar on small screens.
- **Accessible navigation** — `aria-current="page"` on active nav tabs, `aria-label` on icon-only buttons.
- **Custom recharts tooltip** — Chart tooltips in OverviewDashboard match the design system instead of using raw hex values.
- **Proper empty states** — LiveTransactions and AgentSimulator now display icon-driven empty state panels.
- **Spinner loading states** — PolicyEditor translate button, AgentSimulator execute button, SDKPlayground run button all show inline spinners.
- **OTP keyboard navigation** — StepUpModal OTP inputs now support Backspace to focus previous input.
- **`.env.example`** — Template file for future environment variable configuration.
- **`.gitignore`** — Expanded to cover node_modules, dist, .env, IDE files, OS files, and framework cache.
- **`README.md`** — Full project-specific README with overview, features, architecture, installation, and development guide.

### Changed

- **`index.css`** — Replaced raw glassmorphism CSS classes (`glass-panel`, `glass-card`) with Tailwind `@layer components` primitives using design tokens. Removed decorative radial gradients from body background.
- **`tailwind.config.js`** — Added `neo-focus` shadow token and `neo-review` status accent shadow.
- **`index.html`** — Body class updated from arbitrary `bg-[#0B0F17]` to `bg-surface-base`. Added OG meta tags and `theme-color`.
- **All components** — Removed phantom `shadow-glow-indigo` / `shadow-glow-emerald` class references. Replaced arbitrary hex values and raw `glass-*` classes with design system tokens throughout.
- **Header** — Compact single-row layout, no gradient logo, proper system token usage.
- **OverviewDashboard** — Hero banner redesigned to be intentional and non-gradient-heavy. Icon badge cells for metrics.
- **AgentSecurity** — Agent cards use `neo-allow`/`neo-block`/`neo-warn` accent shadows based on agent status.
- **Modals** — Both modals use `bg-surface-raised shadow-neo-lg` base surface.

### Fixed

- Removed undefined CSS class references (`shadow-glow-indigo`, `shadow-glow-emerald`, `animate-in`, `zoom-in-95`) that caused silent styling failures.
- Table horizontal overflow now uses `min-w-[700px]` with `scrollbar-stable` utility instead of uncontrolled overflow.
- Agent cards on mobile now stack properly in a single column.
