'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Users,
  Calendar,
  Dumbbell,
  Apple,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

export default function TrainerDashboardOverview() {
  const { currentUser, appointments, workoutLogs, mealLogs, trainers } = useStore();

  const myTrainer = trainers.find((t) => t.id === 'trainer-1') || trainers[0];
  const pendingMealReviews = mealLogs.filter((m) => m.trainer_feedback?.includes('pending')).length;

  return (
    <DashboardLayout
      title={`Clinical Specialist Portal • ${currentUser.full_name}`}
      subtitle="Faculty cockpit for clinical patient oversight, safe home movement prescription, and blood glucose/vitals review."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* METRICS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Patients</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
              {myTrainer.client_count}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>100% active retention</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Telehealth Consultations</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60A5FA', marginTop: '4px' }}>
              {appointments.filter((a) => a.status === 'confirmed').length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>This week</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Meal & Glucose Reviews</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
              {pendingMealReviews || 1}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#FBBF24' }}>Requires review</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Rating</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {myTrainer.rating} / 5.0
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Verified patient reviews</span>
          </div>
        </div>

        {/* QUICK ACTION HUBS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Client Oversight */}
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Assigned Clinical Patients</h3>
              <Users size={20} color="var(--accent-primary)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Review patient glucose logs, diastasis recti width, vitals, and physician clearance records.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { name: 'Anita Sharma', plan: 'Type 2 Diabetes Protocol', streak: 'Fasting 108 mg/dL', status: 'Glucose logged today' },
                { name: 'Sarah Miller', plan: 'Postpartum Core & Pelvic Rehab', streak: 'DR: 1.5 cm gap', status: 'Week 8 C-section safe' },
                { name: 'Robert Kapoor', plan: 'Arthritis & BP Conditioning', streak: 'BP: 120/78 mmHg', status: 'Chair protocol active' },
              ].map((client, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '0.95rem', color: '#fff' }}>{client.name}</h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{client.plan}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-lime" style={{ fontSize: '0.7rem' }}>{client.streak}</span>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{client.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/trainer/clients" className="btn-secondary btn-sm" style={{ width: '100%' }}>
              <span>Manage All Clinical Patients</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Plan Builder Shortcuts */}
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Curriculum Architect</h3>
              <Dumbbell size={20} color="var(--accent-primary)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Design periodized workout splits, target sets, rep tempos, and precision macronutrient assignments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/trainer/workouts" className="btn-primary" style={{ padding: '12px' }}>
                <Dumbbell size={16} />
                <span>Open Workout Plan Builder</span>
              </Link>
              <Link href="/trainer/nutrition" className="btn-secondary" style={{ padding: '12px' }}>
                <Apple size={16} />
                <span>Open Nutrition Plan Builder</span>
              </Link>
              <Link href="/trainer/calendar" className="btn-secondary" style={{ padding: '12px' }}>
                <Calendar size={16} />
                <span>Manage Availability & Hours</span>
              </Link>
            </div>
          </div>
        </div>

        {/* UPCOMING COACHING CONSULTATIONS */}
        <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '16px' }}>Upcoming Athlete Appointments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.map((apt) => (
              <div
                key={apt.id}
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
                  <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{apt.client_name}</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)' }}>{apt.session_type}</span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Focus: {apt.notes}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{apt.session_date}</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.start_time} - {apt.end_time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
