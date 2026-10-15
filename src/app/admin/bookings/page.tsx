'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { Calendar, Video, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function AdminBookingsPage() {
  const { appointments, addToast } = useStore();

  return (
    <DashboardLayout
      title="Appointment & Booking Operations"
      subtitle="Comprehensive ledger of client coaching consultations and conflict validation logs."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldCheck size={28} color="var(--accent-primary)" />
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>Double-Booking Prevention Engine</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              All client bookings are evaluated in real time against coach working hours and existing slot allocations. Zero overlapping appointments are permitted.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 24px' }}>Client</th>
                  <th style={{ padding: '16px 24px' }}>Assigned Coach</th>
                  <th style={{ padding: '16px 24px' }}>Session Type</th>
                  <th style={{ padding: '16px 24px' }}>Date & Time</th>
                  <th style={{ padding: '16px 24px' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#fff' }}>
                      {apt.client_name}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {apt.trainer_name}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {apt.session_type}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.88rem', color: '#fff' }}>
                      {apt.session_date} ({apt.start_time} - {apt.end_time})
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-lime" style={{ fontSize: '0.72rem' }}>
                        {apt.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <a
                        href={apt.meeting_link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Join Room
                      </a>
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
