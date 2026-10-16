'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Coins,
  Settings,
  ShieldAlert,
  RotateCcw,
  Sliders,
  PlusCircle,
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Gift,
  Dumbbell,
  Stethoscope,
  TrendingUp,
  X,
  ShieldCheck,
} from 'lucide-react';
import { FitCoinSettings } from '@/lib/types';

export default function AdminFitCoinPage() {
  const {
    currentUser,
    allProfiles,
    fitcoinSettings,
    updateFitcoinSetting,
    fitcoinTransactions,
    referrals,
    auditLogs,
    adminAdjustFitcoins,
    adminReverseFitcoinTransaction,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'settings' | 'ledger' | 'adjust' | 'audit'>('settings');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Manual Adjustment Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(allProfiles[0]?.id || '');
  const [adjustAmount, setAdjustAmount] = useState<number>(25);
  const [adjustReason, setAdjustReason] = useState('');

  // Reversal Modal State
  const [reverseModalOpen, setReverseModalOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState('');
  const [reversalReason, setReversalReason] = useState('');

  // Metrics calculations
  const totalIssued = fitcoinTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const workoutCoins = fitcoinTransactions
    .filter((tx) => tx.transaction_type === 'workout_reward')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const referralCoins = fitcoinTransactions
    .filter((tx) => tx.transaction_type.startsWith('referral_'))
    .reduce((acc, tx) => acc + tx.amount, 0);

  const trainerCoins = fitcoinTransactions
    .filter((tx) => tx.transaction_type === 'trainer_session_reward')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const adjustmentCoins = fitcoinTransactions
    .filter((tx) => tx.transaction_type === 'admin_adjustment')
    .reduce((acc, tx) => acc + tx.amount, 0);

  // Handle setting updates
  const handleToggle = <K extends keyof FitCoinSettings>(key: K, currentVal: any) => {
    if (typeof currentVal === 'object' && 'enabled' in currentVal) {
      updateFitcoinSetting(key, { ...currentVal, enabled: !currentVal.enabled });
    } else if (typeof currentVal === 'object' && 'value' in currentVal) {
      updateFitcoinSetting(key, { ...currentVal, value: !currentVal.value });
    }
  };

  const handleAmountChange = <K extends keyof FitCoinSettings>(key: K, currentVal: any, newAmt: number) => {
    updateFitcoinSetting(key, { ...currentVal, amount: newAmt });
  };

  // Submit manual adjustment
  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason.trim()) {
      addToast('A valid justification reason is required for audit compliance', 'error');
      return;
    }
    const res = adminAdjustFitcoins(selectedUser, Number(adjustAmount), adjustReason);
    if (res.success) {
      setAdjustModalOpen(false);
      setAdjustReason('');
    } else {
      addToast(res.error || 'Failed to adjust', 'error');
    }
  };

  // Submit transaction reversal
  const handleReversalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalReason.trim()) {
      addToast('A valid audit reason is required to reverse transactions', 'error');
      return;
    }
    const res = adminReverseFitcoinTransaction(selectedTxId, reversalReason);
    if (res.success) {
      setReverseModalOpen(false);
      setReversalReason('');
    } else {
      addToast(res.error || 'Failed to reverse transaction', 'error');
    }
  };

  // Filter transactions
  const filteredTransactions = fitcoinTransactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.transaction_type === filterType;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.source_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.idempotency_key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportLedgerCsv = () => {
    const headers = ['ID', 'Date', 'User', 'Type', 'Amount', 'Source', 'Description', 'Initiated By'];
    const rows = fitcoinTransactions.map((tx) => [
      tx.id,
      tx.created_at,
      tx.user_name || tx.user_id,
      tx.transaction_type,
      tx.amount,
      tx.source_reference,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.creator_name || tx.created_by,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `domainfit_fitcoin_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('FitCoin ledger exported to CSV successfully!', 'success');
  };

  return (
    <DashboardLayout
      title="FitCoin Economic Governance & Ledger"
      subtitle="Configure reward policies, inspect live ledger transactions, approve adjustments, and audit system events."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Issued FitCoins</span>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: 'var(--accent-primary)', marginTop: '4px' }}>
              {totalIssued.toLocaleString()} 🪙
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>Verified in immutable ledger</span>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Workout Rewards</span>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: '#60A5FA', marginTop: '4px' }}>
              {workoutCoins.toLocaleString()} 🪙
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From assigned movements</span>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Referral Bonuses</span>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: '#EC4899', marginTop: '4px' }}>
              {referralCoins.toLocaleString()} 🪙
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{referrals.length} Total referrals</span>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Trainer Session Awards</span>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: '#FBBF24', marginTop: '4px' }}>
              {trainerCoins.toLocaleString()} 🪙
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Capped at {fitcoinSettings.max_trainer_award_per_session.amount}/session</span>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'settings', label: 'Reward Policies & Limits', icon: Sliders },
            { id: 'ledger', label: 'Complete Ledger', icon: Coins },
            { id: 'adjust', label: 'Manual Adjustment Workflow', icon: PlusCircle },
            { id: 'audit', label: 'Auditable Event Log', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: isActive ? '#0B0D0C' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: REWARD RULES & SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              className="card"
              style={{
                padding: '28px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                  FitCoin Economy Rules & Constraints
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  All rule modifications are logged to the audit ledger. Historical transactions are never mutated when settings are altered.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Referrer Reward */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Gift size={18} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Referrer Reward</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <input
                        type="checkbox"
                        checked={fitcoinSettings.referral_referrer_reward.enabled}
                        onChange={() => handleToggle('referral_referrer_reward', fitcoinSettings.referral_referrer_reward)}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    FitCoins credited to the referring user once the invitee satisfies eligibility requirements.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={fitcoinSettings.referral_referrer_reward.amount}
                      onChange={(e) => handleAmountChange('referral_referrer_reward', fitcoinSettings.referral_referrer_reward, Number(e.target.value))}
                      style={{ width: '100px', padding: '8px 12px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FitCoins per referral</span>
                  </div>
                </div>

                {/* Referred User Reward */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Gift size={18} color="#EC4899" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Invited User Welcome Reward</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <input
                        type="checkbox"
                        checked={fitcoinSettings.referral_referred_reward.enabled}
                        onChange={() => handleToggle('referral_referred_reward', fitcoinSettings.referral_referred_reward)}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Welcome bonus credited to the newly registered client joining with a verified code.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={fitcoinSettings.referral_referred_reward.amount}
                      onChange={(e) => handleAmountChange('referral_referred_reward', fitcoinSettings.referral_referred_reward, Number(e.target.value))}
                      style={{ width: '100px', padding: '8px 12px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FitCoins welcome reward</span>
                  </div>
                </div>

                {/* Referral Qualification Policy */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <ShieldCheck size={18} color="#60A5FA" />
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Referral Qualification Rule</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Criteria required before issuing referral rewards to prevent abuse and fake registrations.
                  </p>
                  <select
                    value={fitcoinSettings.referral_eligibility_criteria.rule}
                    onChange={(e) =>
                      updateFitcoinSetting('referral_eligibility_criteria', {
                        rule: e.target.value as any,
                        description: e.target.options[e.target.selectedIndex].text,
                      })
                    }
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <option value="verified_signup_and_first_login">Verified Signup & First Login</option>
                    <option value="verified_signup_and_profile">Verified Signup + Completed Profile</option>
                    <option value="first_workout">First Completed Workout</option>
                    <option value="first_session">First Attended Clinical Session</option>
                  </select>
                </div>

                {/* Default Workout Reward */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Dumbbell size={18} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Workout Completion Award</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <input
                        type="checkbox"
                        checked={fitcoinSettings.default_workout_reward.enabled}
                        onChange={() => handleToggle('default_workout_reward', fitcoinSettings.default_workout_reward)}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Standard reward issued when a client records their assigned gentle movement routine.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={fitcoinSettings.default_workout_reward.amount}
                      onChange={(e) => handleAmountChange('default_workout_reward', fitcoinSettings.default_workout_reward, Number(e.target.value))}
                      style={{ width: '100px', padding: '8px 12px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FitCoins per workout</span>
                  </div>
                </div>

                {/* Trainer Review Requirement for Workouts */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Stethoscope size={18} color="#FBBF24" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Require Trainer Review</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('workout_requires_trainer_review', fitcoinSettings.workout_requires_trainer_review)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: fitcoinSettings.workout_requires_trainer_review.value ? '#FBBF24' : 'var(--bg-card)',
                        color: fitcoinSettings.workout_requires_trainer_review.value ? '#0B0D0C' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                      }}
                    >
                      {fitcoinSettings.workout_requires_trainer_review.value ? 'Review Required' : 'Instant Auto-Reward'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    If enabled, workout completions transition to <code>completed_pending_review</code> and await faculty approval.
                  </p>
                </div>

                {/* Max Trainer Award Per Session */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Coins size={18} color="#60A5FA" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Max Trainer Session Limit</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <input
                        type="checkbox"
                        checked={fitcoinSettings.max_trainer_award_per_session.enabled}
                        onChange={() => handleToggle('max_trainer_award_per_session', fitcoinSettings.max_trainer_award_per_session)}
                      />
                      <span>Capped</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Upper boundary on FitCoins a coach can disburse for a single 1-on-1 session.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={fitcoinSettings.max_trainer_award_per_session.amount}
                      onChange={(e) => handleAmountChange('max_trainer_award_per_session', fitcoinSettings.max_trainer_award_per_session, Number(e.target.value))}
                      style={{ width: '100px', padding: '8px 12px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max FitCoins / Session</span>
                  </div>
                </div>

                {/* Manual Admin Adjustments Policy */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={18} color="#EF4444" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Admin Manual Adjustments</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <input
                        type="checkbox"
                        checked={fitcoinSettings.admin_manual_adjustments_enabled.enabled}
                        onChange={() => handleToggle('admin_manual_adjustments_enabled', fitcoinSettings.admin_manual_adjustments_enabled)}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Maximum credit/debit adjustment an administrator can execute with mandatory audit justification.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={fitcoinSettings.admin_manual_adjustments_enabled.max_amount}
                      onChange={(e) =>
                        updateFitcoinSetting('admin_manual_adjustments_enabled', {
                          ...fitcoinSettings.admin_manual_adjustments_enabled,
                          max_amount: Number(e.target.value),
                        })
                      }
                      style={{ width: '100px', padding: '8px 12px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max Adjustment Limit</span>
                  </div>
                </div>

                {/* Future Redemption Flag */}
                <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Coins size={18} color="var(--text-muted)" />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Store Redemption</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('redemption_enabled', fitcoinSettings.redemption_enabled)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: fitcoinSettings.redemption_enabled.enabled ? 'var(--accent-primary)' : 'var(--bg-card)',
                        color: fitcoinSettings.redemption_enabled.enabled ? '#0B0D0C' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                      }}
                    >
                      {fitcoinSettings.redemption_enabled.enabled ? 'Active' : 'Disabled (Future Feature)'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Controls whether clients can spend FitCoins on merchandise, discounts, or membership renewals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE TRANSACTION LEDGER */}
        {activeTab === 'ledger' && (
          <div
            className="card"
            style={{
              padding: '28px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                  Master FitCoin Transaction Ledger
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Comprehensive cryptographic-style ledger across all clients and coaches.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search by user or ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '36px', width: '220px', fontSize: '0.85rem' }}
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="all">All Transaction Types</option>
                  <option value="workout_reward">Workout Rewards</option>
                  <option value="trainer_session_reward">Trainer Sessions</option>
                  <option value="referral_reward">Referral Rewards</option>
                  <option value="admin_adjustment">Admin Adjustments</option>
                  <option value="reversal">Reversals</option>
                </select>

                <button
                  type="button"
                  onClick={exportLedgerCsv}
                  className="btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Date</th>
                    <th style={{ padding: '12px 14px' }}>Target User</th>
                    <th style={{ padding: '12px 14px' }}>Type</th>
                    <th style={{ padding: '12px 14px' }}>Description</th>
                    <th style={{ padding: '12px 14px' }}>Initiator</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => {
                    const isCredit = tx.amount >= 0;
                    const isReversed = fitcoinTransactions.some((t) => t.source_reference === `reversal:${tx.id}`);
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600, color: '#fff' }}>
                          {tx.user_name || tx.user_id}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              backgroundColor:
                                tx.transaction_type === 'workout_reward'
                                  ? 'rgba(183, 243, 74, 0.15)'
                                  : tx.transaction_type === 'trainer_session_reward'
                                  ? 'rgba(96, 165, 250, 0.15)'
                                  : tx.transaction_type === 'referral_reward'
                                  ? 'rgba(236, 72, 153, 0.15)'
                                  : tx.transaction_type === 'reversal'
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : 'rgba(245, 158, 11, 0.15)',
                              color:
                                tx.transaction_type === 'workout_reward'
                                  ? 'var(--accent-primary)'
                                  : tx.transaction_type === 'trainer_session_reward'
                                  ? '#60A5FA'
                                  : tx.transaction_type === 'referral_reward'
                                  ? '#EC4899'
                                  : tx.transaction_type === 'reversal'
                                  ? '#EF4444'
                                  : '#FBBF24',
                            }}
                          >
                            {tx.transaction_type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: '#fff' }}>
                          <span>{tx.description}</span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            Ref: {tx.source_reference}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {tx.creator_name || 'System Engine'}
                        </td>
                        <td
                          style={{
                            padding: '14px',
                            textAlign: 'right',
                            fontWeight: 800,
                            color: isCredit ? 'var(--accent-primary)' : '#EF4444',
                          }}
                        >
                          {isCredit ? `+${tx.amount}` : tx.amount} 🪙
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          {tx.transaction_type !== 'reversal' && !isReversed ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTxId(tx.id);
                                setReverseModalOpen(true);
                              }}
                              className="btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', padding: '4px 8px', color: '#EF4444' }}
                            >
                              Reverse
                            </button>
                          ) : isReversed ? (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              Reversed
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MANUAL ADJUSTMENT WORKFLOW */}
        {activeTab === 'adjust' && (
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              maxWidth: '640px',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', marginBottom: '6px' }}>
                <ShieldAlert size={20} />
                <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                  Privileged Manual FitCoin Adjustment
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Issue an authorized credit or debit adjustment to a user wallet. Every adjustment generates a persistent audit log record and an immutable ledger entry.
              </p>
            </div>

            <form onSubmit={handleAdjustmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Target User Account
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                >
                  {allProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.role.toUpperCase()} • {p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Adjustment Amount (Signed Whole Number)
                </label>
                <input
                  type="number"
                  required
                  placeholder="+50 (Credit) or -20 (Debit)"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Positive numbers credit FitCoins. Negative numbers debit FitCoins (up to max ±{fitcoinSettings.admin_manual_adjustments_enabled.max_amount}).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Audit Justification Reason (Mandatory)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Compensation for recorded app maintenance during scheduled workout window."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '14px', backgroundColor: '#FBBF24', color: '#0B0D0C', fontWeight: 700 }}
              >
                <span>Authorize & Execute Adjustment</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: AUDIT EVENT LOG */}
        {activeTab === 'audit' && (
          <div
            className="card"
            style={{
              padding: '28px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                System Audit Logs
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Persistent record of administrative policy updates, manual adjustments, and reversal operations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                        {log.action}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                        Target: {log.target_id}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Reason: {log.reason || 'Standard administrative action'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                      Actor: {log.actor_name}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: REVERSAL CONFIRMATION */}
        {reverseModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px',
            }}
          >
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '32px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
                  <RotateCcw size={20} />
                  <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Auditable Reversal</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReverseModalOpen(false)}
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                This creates a linked reversal entry in the ledger with the inverse amount. The original transaction will be preserved for complete auditability.
              </p>

              <form onSubmit={handleReversalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Reason for Reversal
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Duplicate session entered by trainer in error."
                    value={reversalReason}
                    onChange={(e) => setReversalReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setReverseModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ backgroundColor: '#EF4444', color: '#fff' }}
                  >
                    Confirm Reversal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
