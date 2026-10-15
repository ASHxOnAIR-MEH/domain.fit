'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { TrendingUp, CreditCard, ShieldCheck, RefreshCw, CheckCircle2, Download, Search } from 'lucide-react';

export default function AdminPaymentsPage() {
  const { transactions, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const totalCollected = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const filteredTxs = transactions.filter(
    (tx) =>
      tx.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.razorpay_payment_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefund = (txId: string) => {
    addToast(`Refund initiated for transaction ${txId}. Processed in test mode.`, 'info');
  };

  return (
    <DashboardLayout
      title="Financial Transactions & Payment Gateways"
      subtitle="Monitor Razorpay payment logs, manage refunds, and inspect test mode reconciliation."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* KPI OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Revenue</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
              ₹{totalCollected.toLocaleString()}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>100% captured</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gateway Provider</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
              Razorpay Sandbox
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Test Environment Active</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dispute & Chargeback Rate</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
              0.00%
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optimal compliance</span>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search transaction ref or athlete..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <button
              onClick={() => addToast('Transaction report exported as CSV.', 'success')}
              className="btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 24px' }}>Transaction ID</th>
                  <th style={{ padding: '16px 24px' }}>Customer</th>
                  <th style={{ padding: '16px 24px' }}>Item Description</th>
                  <th style={{ padding: '16px 24px' }}>Amount</th>
                  <th style={{ padding: '16px 24px' }}>Method</th>
                  <th style={{ padding: '16px 24px' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <code style={{ color: 'var(--accent-primary)', fontSize: '0.82rem' }}>{tx.razorpay_payment_id}</code>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#fff' }}>
                      {tx.user_name}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {tx.item_name}
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {tx.payment_method}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-gray" style={{ color: 'var(--status-success)' }}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRefund(tx.razorpay_payment_id)}
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        Refund
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
