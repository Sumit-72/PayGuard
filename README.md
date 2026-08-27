# PayGuard

**AI Payment Firewall for Autonomous Agents**

PayGuard is an intent-aware authorization control plane that sits between AI agents and payment gateways. It answers a fundamentally different question than traditional fraud systems:

> Traditional gateways ask: *"Is this caller who they claim to be?"*
> PayGuard asks: *"Is this specific payment action, right now, actually authorized by what the user intended?"*

This is a fully interactive dashboard and SDK demonstration built to showcase the PayGuard architecture — policy enforcement, intent drift detection, risk scoring, agent behavior monitoring, and human-in-the-loop step-up flows.

---

## Features

| Feature | Description |
|---|---|
| **Policy Engine** | Natural language → structured JSON policy via NLP parser. Deterministic enforcement at runtime (no LLM in the loop). |
| **Intent Drift Detection** | Compares accumulated session spend against the user's stated budget. Flags and escalates scope creep automatically. |
| **Risk Scoring** | Per-transaction composite risk score (0–100) factoring merchant trust, category, velocity, and intent alignment. |
| **4-Tier Decision System** | `ALLOW` → `STEP-UP` → `REVIEW` → `BLOCK`. Each tier has a defined escalation path. |
| **Agent Security Monitor** | Per-agent spending velocity, retry storm detection, freeze/unfreeze controls. |
| **Interactive Scenario Lab** | 4 predefined attack/edge-case scenarios (intent drift, retry storm, prompt injection, legitimate purchase) with custom parameter overrides. |
| **Step-Up OTP Flow** | Human confirmation modal triggered on threshold-crossing transactions. |
| **Transaction Inspector** | Full decision breakdown with explainable reasons, intent drift analysis, and manual override capability. |
| **SDK Integration Demo** | Live JavaScript SDK call with real-time console output and Razorpay gateway handoff simulation. |
| **Responsive UI** | Fully responsive across mobile (375px), tablet (768px), laptop (1280px), and large desktop (1440px+). |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 (neomorphic design system) |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Inter (UI), JetBrains Mono (code/data) |
| Language | JavaScript (ESM) |

---

## Architecture

```
PayGuard/
├── index.html                    # App entry — SEO meta, fonts, body token classes
├── tailwind.config.js            # Design system: neo shadow tokens, color palette, typography
├── src/
│   ├── index.css                 # @layer components: pg-surface, pg-btn-*, pg-badge-*, pg-input, etc.
│   ├── main.jsx                  # React root mount
│   ├── App.jsx                   # Root component — state management, tab routing, modal orchestration
│   ├── components/
│   │   ├── Header.jsx            # Sticky nav with desktop tabs + mobile drawer
│   │   ├── OverviewDashboard.jsx # Metrics, charts, decision tier summary
│   │   ├── LiveTransactions.jsx  # Filterable intercept feed table
│   │   ├── PolicyEditor.jsx      # NL policy input, YAML preview, instant test harness
│   │   ├── AgentSecurity.jsx     # Per-agent monitoring cards + transaction graph
│   │   ├── AgentSimulator.jsx    # Scenario selector + real-time evaluation output
│   │   ├── SDKPlayground.jsx     # SDK snippet + live console execution
│   │   ├── StepUpModal.jsx       # OTP confirmation modal for STEP-UP transactions
│   │   └── TransactionDetailModal.jsx  # Full decision inspector modal
│   ├── engine/
│   │   ├── decisionEngine.js     # Core 4-tier decision logic
│   │   ├── riskEngine.js         # Risk score calculation
│   │   ├── intentEngine.js       # Intent drift detection
│   │   ├── policyEngine.js       # Policy rule evaluation
│   │   ├── contextEngine.js      # Per-agent context aggregation
│   │   ├── nlPolicyParser.js     # Natural language → JSON/YAML policy parser
│   │   ├── payguardSDK.js        # SDK surface (payguard.authorize())
│   │   └── razorpayGateway.js    # Gateway handoff simulation
│   └── data/
│       ├── mockInitialData.js    # Initial agents, policy, and transactions
│       └── scenarios.js          # Predefined scenario definitions
```

### Design System

The `tailwind.config.js` defines a complete neomorphic design token system:

- **Shadows**: `shadow-neo-sm`, `shadow-neo`, `shadow-neo-lg`, `shadow-neo-inset`, `shadow-neo-pressed`, `shadow-neo-focus`, `shadow-neo-brand/allow/block/warn/review`
- **Colors**: `surface-*` (5 depth levels), `brand-*`, `guard-*` (allow/stepup/review/block), `ink-*` (text hierarchy)
- **Border Radius**: `rounded-neo`, `rounded-neo-lg`, `rounded-neo-xl`
- **Transitions**: `transition-neo`, `duration-neo`, `ease-neo`

Component primitives are defined in `src/index.css` as `@layer components`:

```
pg-surface          — raised card surface
pg-inset            — recessed panel  
pg-code-block       — code/terminal display
pg-btn-primary      — primary action (brand blue)
pg-btn-ghost        — secondary/utility
pg-btn-danger       — destructive action
pg-btn-allow        — confirm/approve (green)
pg-btn-warn         — step-up (amber, dark text)
pg-btn-icon         — icon-only small button
pg-input            — standard text input
pg-input-mono       — monospace input
pg-textarea         — multiline input
pg-badge-allow/stepup/review/block  — decision status pills
pg-status-active/suspended          — agent status pills
pg-stat-cell/label/value            — metric display cells
```

---

## Installation

**Prerequisites**: Node.js 18+, npm 9+

```bash
# Clone the repository
git clone https://github.com/your-username/PayGuard.git
cd PayGuard

# Install dependencies
npm install

# Copy environment variable template (optional — no env vars required for local dev)
cp .env.example .env.local
```

---

## Development

```bash
# Start development server (Vite HMR)
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Build

```bash
# Production build (output to dist/)
npm run build

# Preview the production build locally
npm run preview
```

---

## Environment Variables

No environment variables are required to run PayGuard in development. All data is mocked client-side.

See [`.env.example`](.env.example) for documentation of future integration variables (Razorpay, PayGuard API).

---

## Navigation

| Tab | Route Key | Description |
|---|---|---|
| Overview | `overview` | System metrics, decision ratio chart, category breakdown |
| Intercept Feed | `transactions` | Filterable live transaction table with override actions |
| Policy Engine | `policies` | NL policy editor, compiled YAML, instant test harness |
| Agent Security | `agents` | Per-agent monitoring cards, freeze controls, graph |
| Scenario Lab | `simulator` | Predefined test scenarios with real engine evaluation |
| SDK Integration | `sdk` | JavaScript SDK snippet + interactive console |

---

## Screenshots

> _Screenshots coming soon. Run `npm run dev` to see the dashboard live._

---

## Future Improvements

- **Backend API integration** — Replace mock engine with a real policy evaluation microservice
- **Razorpay live mode** — Real payment gateway handoff using Razorpay Orders API
- **Persistent storage** — IndexedDB or API-backed transaction history
- **Multi-tenant policy management** — Organization-level policy namespacing
- **Webhook event stream** — Real-time transaction feed via WebSocket
- **Audit log export** — CSV/JSON export of the intercept feed
- **Policy version history** — Immutable audit trail of policy changes with diff view
- **Agent trust scoring** — ML-based trust evolution over time

---

## License

MIT License — see [LICENSE](LICENSE) for details.
