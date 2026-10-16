'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  Save,
  Plus,
  Coins,
  Award,
  ShieldCheck,
  AlertCircle,
  X,
  History,
} from 'lucide-react';
import { Appointment } from '@/lib/types';

export default function TrainerCalendarPage() {
  const {
    currentUser,
    appointments,
    fitcoinTransactions,
    fitcoinSettings,
    trainerAwardSessionFitcoins,
    addToast,
  } = useStore();

  const [workingStart, setWorkingStart] = useState('09:00');
  const [workingEnd, setWorkingEnd] = useState('18:00');
  const [sessionDuration, setSessionDuration] = useState('45');
  const [bufferMins, setBufferMins] = useState('15');

  // Modal State for "Complete Session & Award FitCoins"
  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [awardAmount, setAwardAmount] = useState<number>(30);
  const [coachingReason, setCoachingReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Trainer awards history
  const trainerAwards = fitcoinTransactions.filter(
    (tx) => tx.created_by === currentUser.id && tx.transaction_type === 'trainer_session_reward'
  );
  const totalAwardedByTrainer = trainerAwards.reduce((acc, tx) => acc + tx.amount, 0);

  const handleOpenAwardModal = (apt: Appointment) => {
    setErrorMessage('');
    setSelectedAppointment(apt);
    setAwardAmount(Math.min(30, fitcoinSettings.max_trainer_award_per_session.amount));
    setCoachingReason('');
    setAwardModalOpen(true);
  };

  const handleConfirmAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = trainerAwardSessionFitcoins(
        selectedAppointment.id,
        Number(awardAmount),
        coachingReason.trim()
      );

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to complete session and award coins');
      } else {
        setAwardModalOpen(false);
        addToast(
          `Session marked completed! ${awardAmount} FitCoins awarded to ${selectedAppointment.client_name}.`,
          'success'
        );
      }
    }, 400);
  };

  const handleSaveAvailability = () => {
    addToast('Coach availability hours & booking rules updated successfully!', 'success');
  };

  return (
    <DashboardLayout
      title="Telehealth Schedule & Session Rewards"
      subtitle="Manage appointment bookings, conduct consultations, and award session FitCoins upon completion."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* TRAINER AWARD METRIC STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>FitCoins Awarded This Month</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: '#60A5FA' }}>
                {totalAwardedByTrainer.toLocaleString()} 🪙
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              From {trainerAwards.length} completed clinical sessions
            </span>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Session Award Limit</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: 'var(--accent-primary)' }}>
                {fitcoinSettings.max_trainer_award_per_session.amount} 🪙
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Configured upper limit per 1-on-1 consultation
            </span>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sessions Awaiting Review</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 850, color: '#FBBF24' }}>
                {appointments.filter((a) => a.status === 'confirmed').length}
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Eligible for completion & client award
            </span>
          </div>
        </div>

        {/* MAIN SPLIT: AVAILABILITY RULES & SCHEDULED APPOINTMENTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Scheduled Appointments Roster with FitCoin Award Action */}
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Consultation Sessions</h3>
              <CalendarIcon size={20} color="#60A5FA" />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Conduct tele-exercise consultations and issue FitCoins directly after a completed session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {appointments.map((apt) => {
                const isRewarded = fitcoinTransactions.some(
                  (tx) => tx.source_reference === `appointment:${apt.id}`
                );
                const isCompleted = apt.status === 'completed';

                return (
                  <div
                    key={apt.id}
                    style={{
                      padding: '18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{apt.client_name}</h4>
                          {isCompleted ? (
                            <span className="badge badge-lime" style={{ fontSize: '0.68rem' }}>
                              Completed {isRewarded && '• Rewarded 🪙'}
                            </span>
                          ) : (
                            <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                              Confirmed
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#60A5FA', marginTop: '2px' }}>{apt.session_type}</p>
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
                        <span>Join</span>
                      </a>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      {!isCompleted ? (
                        <button
                          type="button"
                          onClick={() => handleOpenAwardModal(apt)}
                          className="btn-primary btn-sm"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#60A5FA',
                            color: '#0B0D0C',
                            fontWeight: 700,
                          }}
                        >
                          <Coins size={14} />
                          <span>Complete Session & Award FitCoins</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} />
                          Session concluded & FitCoins issued
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Working Hours & Rules */}
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Availability Settings</h3>
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
        </div>

        {/* RECENT TRAINER REWARDS LEDGER */}
        <div
          className="card"
          style={{
            padding: '28px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <History size={20} color="#60A5FA" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
              Recent FitCoins Awarded by You
            </h3>
          </div>

          {trainerAwards.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              No coaching session rewards issued yet. Complete an appointment above to award client FitCoins.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px' }}>Date</th>
                    <th style={{ padding: '10px 14px' }}>Patient / Client</th>
                    <th style={{ padding: '10px 14px' }}>Clinical Reason</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Awarded</th>
                  </tr>
                </thead>
                <tbody>
                  {trainerAwards.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                        {new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 600, color: '#fff' }}>
                        {tx.user_name || tx.user_id}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                        {tx.description}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        +{tx.amount} 🪙
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL: COMPLETE SESSION & AWARD FITCOINS */}
        {awardModalOpen && selectedAppointment && (
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
                maxWidth: '500px',
                padding: '32px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA' }}>
                  <Award size={22} />
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                    Complete Session & Award
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAwardModalOpen(false)}
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '20px',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#fff' }}>{selectedAppointment.client_name}</div>
                <div style={{ color: '#60A5FA', fontSize: '0.8rem' }}>{selectedAppointment.session_type}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {selectedAppointment.session_date} • {selectedAppointment.start_time} - {selectedAppointment.end_time}
                </div>
              </div>

              {errorMessage && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    fontSize: '0.84rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={16} shrink-0 />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleConfirmAward} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      FitCoins Award Amount
                    </label>
                    <span style={{ fontSize: '0.78rem', color: '#60A5FA' }}>
                      Max allowed: {fitcoinSettings.max_trainer_award_per_session.amount} 🪙
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={1}
                    max={fitcoinSettings.max_trainer_award_per_session.amount}
                    value={awardAmount}
                    onChange={(e) => setAwardAmount(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Coaching Achievement Note or Reason (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Mastered chair squat form and maintained steady nasal breathing throughout."
                    value={coachingReason}
                    onChange={(e) => setCoachingReason(e.target.value)}
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
                    onClick={() => setAwardModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ backgroundColor: '#60A5FA', color: '#0B0D0C', fontWeight: 700 }}
                  >
                    <span>{isSubmitting ? 'Issuing Award...' : 'Confirm & Award FitCoins'}</span>
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
