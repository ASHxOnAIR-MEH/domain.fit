'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  XCircle,
  CheckCircle2,
  AlertCircle,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function ClientBookingsPage() {
  const { appointments, bookAppointment, cancelAppointment, trainers, currentUser } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState(trainers[0].id);
  const [sessionDate, setSessionDate] = useState('2026-10-24');
  const [startTime, setStartTime] = useState('11:00');
  const [sessionType, setSessionType] = useState<'1-on-1 Clinical Exercise Consultation' | 'Postpartum Diastasis & Pelvic Floor Check' | 'Diabetic Glucose & Nutrition Review'>('1-on-1 Clinical Exercise Consultation');
  const [bookingNotes, setBookingNotes] = useState('');
  const [formError, setFormError] = useState('');

  const activeAppointments = appointments.filter((a) => a.status === 'confirmed');
  const pastAppointments = appointments.filter((a) => a.status !== 'confirmed');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const targetTrainer = trainers.find((t) => t.id === selectedTrainerId);
    const trainerName = targetTrainer?.id === 'trainer-1' ? 'Dr. Marcus Vance, PT' : targetTrainer?.id === 'trainer-2' ? 'Elena Rostova, PCES' : 'David Kim, CDCES';

    const res = bookAppointment({
      client_id: currentUser.id,
      client_name: currentUser.full_name,
      trainer_id: selectedTrainerId,
      trainer_name: trainerName,
      session_date: sessionDate,
      start_time: startTime,
      end_time: `${parseInt(startTime.split(':')[0]) + 1}:00`,
      session_type: sessionType,
      notes: bookingNotes,
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to book session');
    } else {
      setModalOpen(false);
      setBookingNotes('');
    }
  };

  return (
    <DashboardLayout
      title="Coaching Appointments & Schedule"
      subtitle="Book 1-on-1 video consultations, form assessments, and nutrition check-ins."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* TOP ACTION BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Scheduled Sessions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              All appointments include secure high-definition video room links
            </p>
          </div>

          <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ gap: '8px' }}>
            <Plus size={16} />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* ACTIVE UPCOMING SESSIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeAppointments.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No upcoming sessions scheduled. Book a 1-on-1 consult with your coach above.</p>
            </div>
          ) : (
            activeAppointments.map((apt) => (
              <div
                key={apt.id}
                className="card"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '28px',
                  borderRadius: 'var(--radius-xl)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '24px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-lime">CONFIRMED</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{apt.session_type}</span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '4px' }}>
                    Coach {apt.trainer_name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{apt.notes}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#fff' }}>
                    <CalendarIcon size={16} color="var(--accent-primary)" />
                    <span>{apt.session_date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#fff' }}>
                    <Clock size={16} color="var(--accent-primary)" />
                    <span>{apt.start_time} – {apt.end_time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <a
                    href={apt.meeting_link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Video size={14} />
                    <span>Join Video Room</span>
                  </a>
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="btn-secondary btn-sm"
                    style={{ color: 'var(--status-error)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAST OR CANCELLED SESSIONS */}
        {pastAppointments.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Past / Cancelled Sessions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  <div>
                    <span>{apt.session_date} • {apt.session_type} with {apt.trainer_name}</span>
                  </div>
                  <span className="badge badge-gray" style={{ textTransform: 'uppercase' }}>{apt.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKING MODAL */}
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '32px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Schedule Coach Consultation</h3>
                <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <XCircle size={22} />
                </button>
              </div>

              {formError && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--status-error)',
                    color: 'var(--status-error)',
                    fontSize: '0.88rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Select Coach
                  </label>
                  <select
                    value={selectedTrainerId}
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id === 'trainer-1' ? 'Dr. Marcus Vance (PT / Ortho Rehab)' : t.id === 'trainer-2' ? 'Elena Rostova (Postpartum & Pelvic)' : 'David Kim (Diabetes RD/CDCES)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Clinical Consultation Type
                  </label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as any)}
                  >
                    <option value="1-on-1 Clinical Exercise Consultation">1-on-1 Clinical Exercise Consultation</option>
                    <option value="Postpartum Diastasis & Pelvic Floor Check">Postpartum Diastasis & Pelvic Floor Check</option>
                    <option value="Diabetic Glucose & Nutrition Review">Diabetic Glucose & Nutrition Review</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Time Slot
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Session Focus / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Review squat knee tracking and discuss calorie adjustments..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Confirm & Reserve Slot
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
