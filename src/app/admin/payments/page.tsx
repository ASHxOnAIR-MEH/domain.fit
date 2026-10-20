'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Download, 
  Search, 
  RotateCcw,
  Sparkles,
  Smartphone,
  Building2,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { PaymentStatus } from '@/lib/types';

export default function AdminPaymentsPage() {
  const { transactions, refundPaymentTransaction, openCheckout, recordPaymentTransaction, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');

  // KPI Calculations
  const succeededTxs = transactions.filter((t) => t.status === 'succeeded');
  const refundedTxs = transactions.filter((t) => t.status === 'refunded');
  const failedTxs = transactions.filter((t) => t.status === 'failed');

  const totalCollected = succeededTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const totalRefunded = refundedTxs.reduce((sum, tx) => sum + tx.amount, 0);

  const filteredTxs = transactions.filter((tx) => {
    const matchesSearch =
      tx.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.razorpay_payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.razorpay_order_id && tx.razorpay_order_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefund = (txId: string) => {
    const confirmRefund = window.confirm(`Initiate full Razorpay refund for transaction ${txId}?`);
    if (confirmRefund) {
      refundPaymentTransaction(txId);
    }
  };

  const handleTestCheckout = () => {
    openCheckout({
      amount: 4999,
      itemName: 'Clinical Concierge VIP Plan (Quarterly Test)',
      itemType: 'membership',
      onSuccess: (tx) => {
        recordPaymentTransaction(tx);
      },
    });
  };

  return (
    <DashboardLayout
      title="Financial Transactions & Payment Gateways"
      subtitle="Monitor Razorpay payment logs, inspect real-time webhooks, and manage auditable refunds."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* KPI OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Revenue (Captured)</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
              ₹{totalCollected.toLocaleString('en-IN')}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>
              {succeededTxs.length} successful transactions
            </span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Refunds Processed</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
              ₹{totalRefunded.toLocaleString('en-IN')}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {refundedTxs.length} transactions refunded
            </span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gateway Provider</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#38BDF8', marginTop: '6px' }}>
              Razorpay Sandbox
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Webhook signature verification enabled
            </span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gateway Health</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
              100% Up
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
              Instant Settlement Ready
            </span>
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
          {/* Controls Bar */}
          <div 
            style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '16px' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search transaction, ID, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {(['all', 'succeeded', 'refunded', 'failed'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      backgroundColor: statusFilter === s ? 'var(--accent-primary)' : 'transparent',
                      color: statusFilter === s ? '#0B0D0C' : 'var(--text-secondary)',
                      fontWeight: statusFilter === s ? 700 : 500,
                      fontSize: '0.78rem',
                      textTransform: 'capitalize',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleTestCheckout}
                className="btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>Test Razorpay Gateway</span>
              </button>

              <button
                type="button"
                onClick={() => addToast('Transaction report exported as CSV.', 'success')}
                className="btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 24px' }}>Transaction ID</th>
                  <th style={{ padding: '16px 24px' }}>Customer</th>
                  <th style={{ padding: '16px 24px' }}>Item / Service</th>
                  <th style={{ padding: '16px 24px' }}>Amount</th>
                  <th style={{ padding: '16px 24px' }}>Payment Method</th>
                  <th style={{ padding: '16px 24px' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No payment transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <code style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>
                          {tx.razorpay_payment_id}
                        </code>
                        {tx.razorpay_order_id && (
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Order: {tx.razorpay_order_id}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 600, color: '#fff' }}>
                        {tx.user_name}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 600, color: '#fff', display: 'block' }}>{tx.item_name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {tx.item_type}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 800, color: tx.status === 'refunded' ? '#9CA3AF' : 'var(--accent-primary)' }}>
                        {tx.status === 'refunded' ? '-' : ''}₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {tx.payment_method}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor:
                              tx.status === 'succeeded'
                                ? 'rgba(52, 211, 153, 0.12)'
                                : tx.status === 'refunded'
                                ? 'rgba(245, 158, 11, 0.12)'
                                : 'rgba(239, 68, 68, 0.12)',
                            color:
                              tx.status === 'succeeded'
                                ? '#34D399'
                                : tx.status === 'refunded'
                                ? '#F59E0B'
                                : '#EF4444',
                            border: `1px solid ${
                              tx.status === 'succeeded'
                                ? 'rgba(52, 211, 153, 0.25)'
                                : tx.status === 'refunded'
                                ? 'rgba(245, 158, 11, 0.25)'
                                : 'rgba(239, 68, 68, 0.25)'
                            }`,
                            textTransform: 'uppercase',
                          }}
                        >
                          {tx.status === 'succeeded' && <CheckCircle2 size={12} />}
                          {tx.status === 'refunded' && <RotateCcw size={12} />}
                          {tx.status === 'failed' && <AlertCircle size={12} />}
                          <span>{tx.status}</span>
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {tx.status === 'succeeded' && (
                          <button
                            onClick={() => handleRefund(tx.razorpay_payment_id)}
                            className="btn-secondary btn-sm"
                            style={{ fontSize: '0.78rem', gap: '4px' }}
                          >
                            <RotateCcw size={13} />
                            <span>Refund</span>
                          </button>
                        )}
                        {tx.status === 'refunded' && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Refunded
                          </span>
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
    </DashboardLayout>
  );
}
