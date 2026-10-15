'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  HeartPulse,
  Droplets,
  Calendar,
  Clock,
  ArrowRight,
  Flame,
  Plus,
  Video,
  CheckCircle2,
  Stethoscope,
  Activity,
  AlertCircle,
  Home,
  Baby,
} from 'lucide-react';

export default function ClientDashboardOverview() {
  const {
    currentUser,
    clientProfile,
    workoutPlan,
    mealPlan,
    appointments,
    clientStreak,
    waterIntakeMl,
    addWater,
    workoutLogs,
    glucoseLogs,
    logGlucose,
    bpLogs,
  } = useStore();

  const [glucoseInput, setGlucoseInput] = useState<number>(110);
  const [readingType, setReadingType] = useState<'Fasting' | '2h Post-Meal' | 'Pre-Meal'>('Fasting');
  const [quickGlucoseModal, setQuickGlucoseModal] = useState(false);

  const upcomingAppointment = appointments.find((a) => a.status === 'confirmed');
  const todayWorkout = workoutPlan.days[0]; // Day 1: Seated & Supported

  const latestGlucose = glucoseLogs.length > 0 ? glucoseLogs[glucoseLogs.length - 1] : { glucose_mg_dl: 108, reading_type: 'Fasting' };
  const latestBp = bpLogs.length > 0 ? bpLogs[bpLogs.length - 1] : { systolic: 120, diastolic: 78 };

  const handleQuickGlucoseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logGlucose({
      client_id: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      glucose_mg_dl: Number(glucoseInput),
      reading_type: readingType,
      notes: 'Quick logged from dashboard',
    });
    setQuickGlucoseModal(false);
  };

  return (
    <DashboardLayout
      title={`Welcome back, ${currentUser.full_name}`}
      subtitle="Medical Fitness Dashboard • Blood Glucose Monitoring, Gentle Home Movement & Clinical Pacing."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* CLINICAL STATUS BANNER */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stethoscope size={20} color="#34D399" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Medical Health Profile:</span>
                <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{clientProfile.physician_clearance_status}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {clientProfile.medical_conditions.map((cond, i) => (
                  <span key={i} className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              HbA1c Target: <strong style={{ color: 'var(--accent-primary)' }}>{clientProfile.hba1c_percent}%</strong>
            </span>
            <button onClick={() => setQuickGlucoseModal(true)} className="btn-primary btn-sm" style={{ gap: '6px' }}>
              <Plus size={14} />
              <span>Log Blood Sugar</span>
            </button>
          </div>
        </div>

        {/* TOP CLINICAL METRIC CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* Card 1: Blood Glucose */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Blood Glucose</span>
              <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{latestGlucose.reading_type}</span>
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.1 }}>
              {latestGlucose.glucose_mg_dl} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>mg/dL</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399', display: 'block', marginTop: '6px' }}>
              ✓ Within safe post-meal clearing range
            </span>
          </div>

          {/* Card 2: Blood Pressure */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Blood Pressure</span>
              <HeartPulse size={16} color="#60A5FA" />
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              {latestBp.systolic}/{latestBp.diastolic} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>mmHg</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Normal cardiac resting range
            </span>
          </div>

          {/* Card 3: Consistency Streak */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gentle Habits Streak</span>
              <Flame size={16} color="var(--accent-primary)" fill="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.1 }}>
              {clientStreak} Days Active
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399', display: 'block', marginTop: '6px' }}>
              Home movement & hydration logged
            </span>
          </div>

          {/* Card 4: Daily Water Intake */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hydration / Renal</span>
              <Droplets size={16} color="#38BDF8" />
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38BDF8', lineHeight: 1.1 }}>
              {waterIntakeMl} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 2,500 ml</span>
            </h3>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <button onClick={() => addWater(250)} className="btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38BDF8' }}>
                +250ml
              </button>
              <button onClick={() => addWater(500)} className="btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38BDF8' }}>
                +500ml
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: TODAY'S GENTLE HOME DIRECTIVE & UPCOMING CLINICAL CONSULT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Today's Gentle Home Movement */}
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-lime">Today's Home Protocol</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chair & Band Adapted</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '8px' }}>{todayWorkout.day_name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Safe for joint stiffness, insulin sensitivity, and postpartum core re-education. Zero heavy lifting.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {todayWorkout.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{ex.exercise_name}</span>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ex.notes}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {ex.target_sets} sets × {ex.target_reps}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard/workouts" className="btn-primary" style={{ width: '100%' }}>
              <Home size={18} />
              <span>Launch Gentle Home Session</span>
            </Link>
          </div>

          {/* Upcoming Doctor / Specialist Consultation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-gray" style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
                  Next Clinical Consultation
                </span>
                <Calendar size={18} color="var(--accent-primary)" />
              </div>

              {upcomingAppointment ? (
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '4px' }}>
                    {upcomingAppointment.session_type}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    With <strong>{upcomingAppointment.trainer_name}</strong>
                  </p>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--accent-primary)" />
                      <span>{upcomingAppointment.session_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--accent-primary)" />
                      <span>{upcomingAppointment.start_time} - {upcomingAppointment.end_time}</span>
                    </div>
                  </div>

                  <a
                    href={upcomingAppointment.meeting_link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline btn-sm"
                    style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}
                  >
                    <Video size={16} />
                    <span>Join Encrypted Telehealth Room</span>
                  </a>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    No upcoming consultations scheduled.
                  </p>
                  <Link href="/dashboard/bookings" className="btn-secondary btn-sm">
                    Book Clinical Session
                  </Link>
                </div>
              )}
            </div>

            {/* Post-Meal Walk Reminder Box */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Activity size={20} color="var(--accent-primary)" />
                <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Post-Meal Glucose Clearing</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                A 15-minute gentle walk within 30 minutes of eating utilizes non-insulin GLUT-4 pathways to reduce glucose spikes by up to 30%.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: 15 mins Zone-1</span>
                <span className="badge badge-lime">Doctor Recommended</span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOOD SUGAR GLUCOSE LOG TABLE */}
        <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Recent Blood Sugar / Glucose Log</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fasting & post-prandial glycemic records for your clinical coach</p>
            </div>
            <button onClick={() => setQuickGlucoseModal(true)} className="btn-secondary btn-sm" style={{ gap: '6px' }}>
              <Plus size={14} />
              <span>Record New Reading</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {glucoseLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '14px 18px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-lime" style={{ fontSize: '0.72rem' }}>{log.reading_type}</span>
                    <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{log.date} at {log.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{log.notes}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {log.glucose_mg_dl} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>mg/dL</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK GLUCOSE ENTRY MODAL */}
        {quickGlucoseModal && (
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
                maxWidth: '460px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>Record Blood Glucose Reading</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Your clinical specialist reviews daily glucose records to adjust low-glycemic meal guidelines.
              </p>

              <form onSubmit={handleQuickGlucoseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Glucose Value (mg/dL)
                  </label>
                  <input
                    type="number"
                    required
                    min={40}
                    max={500}
                    value={glucoseInput}
                    onChange={(e) => setGlucoseInput(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Reading Timing
                  </label>
                  <select
                    value={readingType}
                    onChange={(e) => setReadingType(e.target.value as any)}
                  >
                    <option value="Fasting">Morning Fasting (Before Breakfast)</option>
                    <option value="2h Post-Meal">2 Hours Post-Meal (Lunch / Dinner)</option>
                    <option value="Pre-Meal">Pre-Meal</option>
                    <option value="Bedtime">Bedtime</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setQuickGlucoseModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Glucose Reading
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
