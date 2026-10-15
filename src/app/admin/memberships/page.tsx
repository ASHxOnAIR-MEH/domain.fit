'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { CreditCard, Plus, CheckCircle2, Save, Sparkles } from 'lucide-react';

export default function AdminMembershipsPage() {
  const { addToast } = useStore();

  const [tiers, setTiers] = useState([
    {
      name: 'Curriculum Self-Paced',
      price: 2999,
      features: 'Full access to 7 workout tracks, video exercise demos, community forum',
      activeMembers: 32,
    },
    {
      name: 'DomainFit Pro (Coached)',
      price: 4999,
      features: 'Assigned coach, bi-weekly video consults, video form reviews, nutrition targets',
      activeMembers: 48,
    },
    {
      name: 'VIP 1-on-1 Concierge',
      price: 14999,
      features: 'Weekly Zoom check-ins, daily meal oversight, travel protocols, 24/7 WhatsApp priority',
      activeMembers: 12,
    },
  ]);

  const handleSaveTiers = () => {
    addToast('Membership tiers configuration updated successfully!', 'success');
  };

  return (
    <DashboardLayout
      title="Membership Tiers & Subscriptions"
      subtitle="Configure pricing tiers, active subscription limits, and included service matrices."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Configured Membership Tiers</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All tiers are billed via Razorpay automated subscription charges</p>
          </div>
          <button onClick={handleSaveTiers} className="btn-primary" style={{ gap: '6px' }}>
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '28px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="badge badge-lime" style={{ marginBottom: '8px' }}>Tier #{idx + 1}</span>
                <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>{t.name}</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ₹{t.price.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ month</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {t.features}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Active Athletes: <strong style={{ color: '#fff' }}>{t.activeMembers}</strong>
                </span>
                <button
                  onClick={() => addToast(`Editing tier ${t.name}`, 'info')}
                  className="btn-secondary btn-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
