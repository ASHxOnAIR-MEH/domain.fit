'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { Users, Search, CheckCircle2, TrendingUp, Dumbbell, Apple, Award, MessageSquare } from 'lucide-react';

export default function TrainerClientsPage() {
  const { clientProfile, workoutLogs, mealLogs, addToast } = useStore();
  const [selectedClientId, setSelectedClientId] = useState('user-client-1');
  const [coachNote, setCoachNote] = useState('');

  const clients = [
    {
      id: 'user-client-1',
      name: 'Anita Sharma',
      email: 'anita.sharma@example.com',
      plan: 'Type 2 Diabetes & Insulin Sensitivity Protocol',
      streak: clientProfile.streak_days,
      weight: `${clientProfile.weight_kg} kg`,
      targetWeight: `${clientProfile.target_weight_kg} kg`,
      fitnessLevel: 'Low Impact Clinical',
      goal: 'Glycemic stabilization & fasting glucose reduction',
      injuries: 'Diabetic peripheral neuropathy in feet; avoid high-impact jumping',
      dietary: 'Low Glycemic Index, High Soluble Fiber, Carb Pacing',
      vitalsBadge: 'Fasting: 108 mg/dL',
      doctorClearance: 'Cleared by Endocrinologist (Dr. Roy)',
    },
    {
      id: 'user-client-2',
      name: 'Sarah Miller',
      email: 'sarah.m@example.com',
      plan: 'Postpartum Core & Pelvic Floor Rehabilitation',
      streak: 9,
      weight: '64.5 kg',
      targetWeight: '62.0 kg',
      fitnessLevel: 'Gentle Rehabilitation',
      goal: 'Diastasis recti closure & pelvic floor rebuilding',
      injuries: '14 weeks post C-section delivery; avoid crunches/planks',
      dietary: 'Postpartum Lactation Support & Anti-Inflammatory',
      vitalsBadge: 'DR Gap: 1.5 cm',
      doctorClearance: 'Cleared by OB-GYN (Dr. Harris)',
    },
    {
      id: 'user-client-3',
      name: 'Robert Kapoor',
      email: 'robert.k@example.com',
      plan: 'Arthritis & Joint-Friendly Home Conditioning',
      streak: 6,
      weight: '82.0 kg',
      targetWeight: '78.0 kg',
      fitnessLevel: 'Chair & Band Regressions',
      goal: 'Resting BP normalization & knee arthritis pain relief',
      injuries: 'Grade 3 medial knee osteoarthritis; zero axial jumping',
      dietary: 'Low Sodium, Mediterranean / Heart Healthy',
      vitalsBadge: 'BP: 120/78 mmHg',
      doctorClearance: 'Cleared by Cardiologist (Dr. Patel)',
    },
    {
      id: 'user-client-4',
      name: 'Maya Patel',
      email: 'maya.p@example.com',
      plan: 'Prenatal Safe Movement & Trimester Mobility',
      streak: 11,
      weight: '68.0 kg',
      targetWeight: 'N/A (Prenatal)',
      fitnessLevel: 'Trimester Adapted',
      goal: 'Gestational glucose control & pelvic comfort',
      injuries: '26 weeks gestation; no supine (flat-on-back) movements',
      dietary: 'Gestational Glucose Pacing, Nutrient-Dense',
      vitalsBadge: 'Gestational: Normal',
      doctorClearance: 'Cleared by OB-GYN (Dr. Lisa)',
    },
  ];

  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachNote) return;
    addToast(`Clinical note saved for ${currentClient.name}: "${coachNote}"`, 'success');
    setCoachNote('');
  };

  return (
    <DashboardLayout
      title="Clinical Patient Roster"
      subtitle="Review patient medical intake questionnaires, daily glucose/vitals logs, and prescribe clinical directives."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {/* Client Roster List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Clinical Patients ({clients.length})</h3>

          {clients.map((c) => {
            const isSelected = selectedClientId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedClientId(c.id)}
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{c.name}</h4>
                  <span className="badge badge-lime">{c.vitalsBadge}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{c.plan}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Clearance: <strong style={{ color: '#34D399' }}>Verified</strong></span>
                  <span>Safety: <strong style={{ color: 'var(--accent-primary)' }}>{c.fitnessLevel}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Client Dossier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-lime" style={{ marginBottom: '6px' }}>Clinical Patient Dossier</span>
                <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{currentClient.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentClient.email}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Protocol</span>
                <p style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{currentClient.plan}</p>
              </div>
            </div>

            {/* Baseline metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Status</span>
                <h5 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{currentClient.vitalsBadge}</h5>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Physician Status</span>
                <h5 style={{ fontSize: '0.95rem', color: '#34D399' }}>Cleared</h5>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Adherence Streak</span>
                <h5 style={{ fontSize: '1.1rem', color: '#fff' }}>{currentClient.streak} Days</h5>
              </div>
            </div>

            {/* Onboarding Responses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Physician Clearance & Medical Source:</span>
                <p style={{ fontSize: '0.92rem', color: '#34D399', marginTop: '2px', fontWeight: 600 }}>{currentClient.doctorClearance}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Clinical Focus:</span>
                <p style={{ fontSize: '0.92rem', color: '#fff', marginTop: '2px' }}>{currentClient.goal}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Safeguards & Contraindications:</span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{currentClient.injuries}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prescribed Medical Nutrition:</span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{currentClient.dietary}</p>
              </div>
            </div>

            {/* Coach Directive Form */}
            <form onSubmit={handleSaveNote} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                Add Clinical Specialist Directive / Home Exercise Note
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Fasting glucose stabilized at 108 mg/dL. Cleared for 20-min post-meal walk. Keep Borg RPE under 4 and monitor foot sensation..."
                value={coachNote}
                onChange={(e) => setCoachNote(e.target.value)}
                style={{ marginBottom: '14px' }}
              />
              <button type="submit" className="btn-primary btn-sm">
                Save Clinical Directive
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
