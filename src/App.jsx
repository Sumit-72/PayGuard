import React, { useState } from 'react';
import Header from './components/Header';
import OverviewDashboard from './components/OverviewDashboard';
import LiveTransactions from './components/LiveTransactions';
import PolicyEditor from './components/PolicyEditor';
import AgentSecurity from './components/AgentSecurity';
import AgentSimulator from './components/AgentSimulator';
import SDKPlayground from './components/SDKPlayground';
import StepUpModal from './components/StepUpModal';
import TransactionDetailModal from './components/TransactionDetailModal';

import { initialAgents, defaultPolicy, initialTransactions } from './data/mockInitialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState(initialAgents);
  const [policy, setPolicy] = useState(defaultPolicy);
  const [transactions, setTransactions] = useState(initialTransactions);

  const [stepUpTx, setStepUpTx] = useState(null);
  const [detailTx, setDetailTx] = useState(null);

  // Handle resetting data state
  const handleResetData = () => {
    setAgents(initialAgents);
    setPolicy(defaultPolicy);
    setTransactions(initialTransactions);
  };

  // Add new transaction from simulator
  const handleNewTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Update agent state
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === newTx.agent_id) {
          const isBlock = newTx.decision === 'BLOCK';
          return {
            ...a,
            spent_today: newTx.decision === 'ALLOW' ? (a.spent_today + newTx.amount) : a.spent_today,
            tx_count_today: a.tx_count_today + 1,
            blocked_count_today: isBlock ? (a.blocked_count_today + 1) : a.blocked_count_today
          };
        }
        return a;
      })
    );
  };

  // Override Blocked/Reviewed transaction
  const handleOverrideDecision = (txId, newDecision) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              decision: newDecision,
              reasons: [...t.reasons, `✓ Human Override: Manually approved by security reviewer`]
            }
          : t
      )
    );
  };

  // Toggle Agent Freeze / Active Status
  const handleToggleAgentStatus = (agentId) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
          : a
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        systemMetrics={{
          totalCount: transactions.length,
          activeAgents: agents.filter(a => a.status === 'active').length
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'overview' && (
          <OverviewDashboard
            transactions={transactions}
            agents={agents}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'transactions' && (
          <LiveTransactions
            transactions={transactions}
            onOverrideDecision={handleOverrideDecision}
            onOpenDetail={(tx) => setDetailTx(tx)}
          />
        )}

        {activeTab === 'policies' && (
          <PolicyEditor
            policy={policy}
            onSavePolicy={(updated) => setPolicy(updated)}
          />
        )}

        {activeTab === 'agents' && (
          <AgentSecurity
            agents={agents}
            onToggleAgentStatus={handleToggleAgentStatus}
            transactions={transactions}
          />
        )}

        {activeTab === 'simulator' && (
          <AgentSimulator
            policy={policy}
            agents={agents}
            onNewTransaction={handleNewTransaction}
            onRequestStepUp={(tx) => setStepUpTx(tx)}
          />
        )}

        {activeTab === 'sdk' && (
          <SDKPlayground
            policy={policy}
            agents={agents}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            PayGuard — Control-Plane Architecture for Autonomous Commerce
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Policy Engine</span>
            <span>•</span>
            <span>AI Risk & Intent Drift</span>
            <span>•</span>
            <span>Razorpay Integration</span>
          </div>
        </div>
      </footer>

      {/* Interactive Step-Up Confirmation Modal */}
      {stepUpTx && (
        <StepUpModal
          transaction={stepUpTx}
          onClose={() => setStepUpTx(null)}
          onConfirm={(txId) => handleOverrideDecision(txId, 'ALLOW')}
        />
      )}

      {/* Transaction Detail Inspector Modal */}
      {detailTx && (
        <TransactionDetailModal
          transaction={detailTx}
          onClose={() => setDetailTx(null)}
          onOverride={handleOverrideDecision}
        />
      )}

    </div>
  );
}
