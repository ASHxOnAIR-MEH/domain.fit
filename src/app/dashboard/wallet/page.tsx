'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Copy,
  Check,
  Filter,
  Search,
  Sparkles,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Award,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function ClientWalletPage() {
  const {
    currentUser,
    getCurrentUserWallet,
    fitcoinTransactions,
    referralCodes,
    referrals,
    fitcoinSettings,
    addToast,
  } = useStore();

  const wallet = getCurrentUserWallet();
  const myReferralCode = referralCodes.find((rc) => rc.user_id === currentUser.id);
  const myTransactions = fitcoinTransactions.filter((tx) => tx.user_id === currentUser.id);
  const myReferrals = referrals.filter((r) => r.referrer_id === currentUser.id);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate Referral URL based on current host or domain
  const referralCodeString = myReferralCode?.code || 'FIT2026';
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/login/client?ref=${referralCodeString}`
    : `https://domainfit.io/login/client?ref=${referralCodeString}`;

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      addToast('Referral link copied to clipboard!', 'success');
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      addToast('Referral code copied to clipboard!', 'success');
    }
  };

  // Filter transactions
  const filteredTransactions = myTransactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.transaction_type === filterType;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.source_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.idempotency_key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <DashboardLayout
      title="FitCoin Fitness Wallet"
      subtitle="Your verified ledger of fitness rewards, workout completion points, and coaching incentives."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* WALLET HERO BALANCE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {/* Main Available Balance */}
          <div
            className="card"
            style={{
              padding: '28px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(183, 243, 74, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'rgba(183, 243, 74, 0.08)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Available Balance
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Coins size={20} color="#0B0D0C" strokeWidth={2.5} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 850, color: 'var(--accent-primary)' }}>
                {wallet.balance.toLocaleString()}
              </h2>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>FitCoins</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Internal fitness rewards points • Non-monetary health incentive
            </p>
          </div>

          {/* Total Earned */}
          <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Lifetime Earned
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowUpRight size={20} color="#34D399" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 850, color: '#34D399' }}>
                {wallet.total_earned.toLocaleString()}
              </h2>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Earned</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              From workouts, clinical consultations & verified referrals
            </p>
          </div>

          {/* Total Spent */}
          <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Redeemed / Spent
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(156, 163, 175, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowDownLeft size={20} color="#9CA3AF" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 850, color: '#fff' }}>
                {wallet.total_spent.toLocaleString()}
              </h2>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Spent</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {fitcoinSettings.redemption_enabled.enabled
                ? 'Available for merchandise & subscriptions'
                : 'Marketplace redemption opens soon'}
            </p>
          </div>
        </div>

        {/* REFERRAL REWARDS SECTION */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(183, 243, 74, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Gift size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 700 }}>
                  Refer Friends & Earn FitCoins
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Give friends <strong>+{fitcoinSettings.referral_referred_reward.amount} FitCoins</strong> on signup, and receive <strong>+{fitcoinSettings.referral_referrer_reward.amount} FitCoins</strong> when they qualify.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Copy Code */}
              <button
                type="button"
                onClick={() => copyToClipboard(referralCodeString, false)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {copiedCode ? <Check size={16} color="var(--accent-primary)" /> : <Copy size={16} />}
                <span>Code: <strong>{referralCodeString}</strong></span>
              </button>

              {/* Copy Link */}
              <button
                type="button"
                onClick={() => copyToClipboard(referralUrl, true)}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {copiedLink ? <Check size={16} color="#0B0D0C" /> : <Copy size={16} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Referral Link'}</span>
              </button>
            </div>
          </div>

          {/* Referral Stats Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Invited Friends</span>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {myReferrals.length}
              </h4>
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Qualified Referrals</span>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
                {myReferrals.filter((r) => r.status === 'rewarded' || r.status === 'qualified').length}
              </h4>
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>FitCoins Earned from Referrals</span>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34D399', marginTop: '2px' }}>
                +{myReferrals.reduce((acc, r) => acc + r.referrer_reward_amount, 0)} 🪙
              </h4>
            </div>
          </div>
        </div>

        {/* TRANSACTION LEDGER TABLE */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 700 }}>
                Transaction History & Ledger
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Immutable, auditable ledger of all credits, debits and session bonuses.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Search ledger..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px', width: '200px', fontSize: '0.85rem' }}
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="all">All Reward Types</option>
                <option value="workout_reward">Workout Rewards</option>
                <option value="trainer_session_reward">Trainer Sessions</option>
                <option value="referral_reward">Referral Rewards</option>
                <option value="referral_first_workout_bonus">First Workout Bonus</option>
                <option value="admin_adjustment">Admin Adjustments</option>
                <option value="reversal">Reversals</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Coins size={28} color="var(--text-muted)" />
              </div>
              <h4 style={{ color: '#fff', marginBottom: '6px' }}>No FitCoin Transactions Found</h4>
              <p style={{ fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto' }}>
                Complete your daily gentle workout or invite friends using your referral link to earn your first FitCoins!
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date & Time</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Description</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Reference</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => {
                    const isCredit = tx.amount >= 0;
                    return (
                      <tr
                        key={tx.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={14} color="var(--text-muted)" />
                            <span>{new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontWeight: 600, color: '#fff', display: 'block' }}>
                            {tx.description}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Initiated by: {tx.creator_name || 'System Engine'}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '4px 8px',
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
                        <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                          {tx.source_reference}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            textAlign: 'right',
                            fontWeight: 800,
                            fontSize: '1rem',
                            color: isCredit ? 'var(--accent-primary)' : '#EF4444',
                          }}
                        >
                          {isCredit ? `+${tx.amount}` : tx.amount} 🪙
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
