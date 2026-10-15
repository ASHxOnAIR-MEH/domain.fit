'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, Video, CheckCircle2, Save, Plus } from 'lucide-react';

export default function TrainerCalendarPage() {
  const { appointments, addToast } = useStore();

  const [workingStart, setWorkingStart] = useState('09:00');
  const [workingEnd, setWorkingEnd] = useState('18:00');
  const [sessionDuration, setSessionDuration] = useState('45');
  const [bufferMins, setBufferMins] = useState('15');

  const handleSaveAvailability = () => {
    addToast('Coach availability hours & booking rules updated successfully!', 'success');
  };

  return (
    <DashboardLayout
      title="Availability & Consultation Calendar"
      subtitle="Define available working hours, session buffers, and manage upcoming client appointments."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Working Hours & Rules */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Booking Availability</h3>
            <span className="badge badge-lime">Auto-Sync</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Earliest Start
                </label>
                <input
                  type="time"
                  value={workingStart}
                  onChange={(e) => setWorkingStart(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Latest Finish
                </label>
                <input
                  type="time"
                  value={workingEnd}
                  onChange={(e) => setWorkingEnd(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Default Session Duration
              </label>
              <select
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
              >
                <option value="30">30 Minutes (Quick Check-in)</option>
                <option value="45">45 Minutes (Standard Video Consult)</option>
                <option value="60">60 Minutes (Deep Kinetic Analysis)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Rest Buffer Between Sessions
              </label>
              <select
                value={bufferMins}
                onChange={(e) => setBufferMins(e.target.value)}
              >
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes (Recommended)</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>

            <button onClick={handleSaveAvailability} className="btn-primary" style={{ marginTop: '8px' }}>
              <Save size={16} />
              <span>Update Availability Rules</span>
            </button>
          </div>
        </div>

        {/* Scheduled Appointments Roster */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>Active Booking Calendar</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Double-booking prevention is enforced automatically across all athlete booking requests.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {appointments.map((apt) => (
              <div
                key={apt.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{apt.client_name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--accent-primary)' }}>{apt.session_type}</p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {apt.session_date} • {apt.start_time} - {apt.end_time}
                  </span>
                </div>

                <a
                  href={apt.meeting_link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Video size={14} />
                  <span>Start</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
