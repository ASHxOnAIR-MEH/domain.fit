'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Users,
  CreditCard,
  Layers,
  Calendar,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const { programs, trainers, appointments, transactions } = useStore();

  const totalRevenue = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <DashboardLayout
      title="DomainFit Executive Management"
      subtitle="Platform governance, program publishing, financial reporting, and operational health."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* EXECUTIVE KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>Verified via Razorpay (Test)</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Coaches</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {trainers.length} Faculty
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>64 Total Assigned Clients</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Published Programs</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60A5FA', marginTop: '4px' }}>
              {programs.length} Curriculums
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% active</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upcoming Bookings</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
              {appointments.filter((a) => a.status === 'confirmed').length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#FBBF24' }}>Zero slot conflicts</span>
          </div>
        </div>

        {/* ADMIN SHORTCUT MODULES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>User & Coach Management</h4>
              <Users size={18} color="var(--accent-primary)" />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Assign client rosters to faculty, manage roles, and invite certified trainers.
            </p>
            <Link href="/admin/users" className="btn-secondary btn-sm" style={{ width: '100%' }}>
              Manage Users
            </Link>
          </div>

          <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>Program Architecture</h4>
              <Layers size={18} color="var(--accent-primary)" />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Create new training tracks, configure pricing, and manage syllabus assets.
            </p>
            <Link href="/admin/programs" className="btn-secondary btn-sm" style={{ width: '100%' }}>
              Manage Programs
            </Link>
          </div>

          <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>Financial Transactions</h4>
              <TrendingUp size={18} color="var(--accent-primary)" />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Inspect live transaction logs, refunds, and Razorpay payment webhook states.
            </p>
            <Link href="/admin/payments" className="btn-secondary btn-sm" style={{ width: '100%' }}>
              View Payments
            </Link>
          </div>
        </div>

        {/* RECENT FINANCIAL TRANSACTIONS */}
        <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Recent Platform Transactions</h3>
            <span className="badge badge-lime">Razorpay Test Gateway</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#fff' }}>{tx.item_name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Customer: {tx.user_name} • Ref: {tx.razorpay_payment_id}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ₹{tx.amount.toLocaleString()}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 700 }}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
