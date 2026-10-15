'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  TrendingUp,
  Plus,
  ShieldCheck,
  Calendar,
  Lock,
  HeartPulse,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';

export default function ClientProgressPage() {
  const { progressRecords, addProgressRecord, clientProfile } = useStore();

  const [newWeight, setNewWeight] = useState<number>(clientProfile.weight_kg);
  const [newGlucose, setNewGlucose] = useState<number>(108);
  const [newSystolic, setNewSystolic] = useState<number>(120);
  const [newDiastolic, setNewDiastolic] = useState<number>(78);
  const [newNotes, setNewNotes] = useState<string>('');

  const handleRecordProgress = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressRecord({
      client_id: 'user-client-1',
      date: new Date().toISOString().split('T')[0],
      weight_kg: Number(newWeight),
      fasting_glucose_mg_dl: Number(newGlucose),
      systolic_bp: Number(newSystolic),
      diastolic_bp: Number(newDiastolic),
      notes: newNotes || 'Routine morning clinical check-in',
    });
    setNewNotes('');
  };

  const chartData = progressRecords.map((r) => ({
    date: r.date.substring(5),
    glucose: r.fasting_glucose_mg_dl || 115,
    weight: r.weight_kg,
    bp: r.systolic_bp || 122,
  }));

  return (
    <DashboardLayout
      title="Clinical Biomarkers & Health Trajectory"
      subtitle="Track fasting blood glucose reductions, blood pressure stability, and gentle body composition changes."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fasting Blood Glucose</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
              108 mg/dL
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>-20 mg/dL since baseline (128)</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resting Blood Pressure</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60A5FA', marginTop: '4px' }}>
              120/78 mmHg
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#60A5FA' }}>Resting cardiac baseline normal</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Weight</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {clientProfile.weight_kg} kg
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>Gentle fat loss & water reduction</span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diastasis Recti Status</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
              1.5 cm
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34D399' }}>Functional midline closure</span>
          </div>
        </div>

        {/* INTERACTIVE RECHARTS GRAPH — FASTING BLOOD GLUCOSE */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Fasting Blood Glucose Trajectory (mg/dL)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Demonstrating insulin sensitivity gains from post-meal walks and low-impact resistance band exercise
              </p>
            </div>
            <span className="badge badge-lime">Metabolic Improvement</span>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="glucGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B7F34A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#B7F34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#303830" vertical={false} />
                <XAxis dataKey="date" stroke="#6B776D" tick={{ fill: '#A3ADA4', fontSize: 12 }} />
                <YAxis domain={[90, 140]} stroke="#6B776D" tick={{ fill: '#A3ADA4', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B211D',
                    border: '1px solid #303830',
                    borderRadius: '8px',
                    color: '#F5F7F2',
                  }}
                  formatter={(val: any) => [`${val} mg/dL`, 'Fasting Glucose']}
                />
                <Area type="monotone" dataKey="glucose" stroke="#B7F34A" strokeWidth={3} fillOpacity={1} fill="url(#glucGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOG NEW CLINICAL BIOMARKERS ENTRY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Form */}
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>Log Morning Biomarkers</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Record fasting glucose upon waking for Certified Diabetes Care review.
            </p>

            <form onSubmit={handleRecordProgress} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Fasting Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    required
                    value={newGlucose}
                    onChange={(e) => setNewGlucose(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Body Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={newSystolic}
                    onChange={(e) => setNewSystolic(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={newDiastolic}
                    onChange={(e) => setNewDiastolic(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Symptoms, Joint Sensations or Postpartum Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Energy steady, no pelvic heaviness, walked 20 mins after dinner"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                <Plus size={16} />
                <span>Save Biomarker Entry</span>
              </button>
            </form>
          </div>

          {/* Clinical Disclaimers Card */}
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <ShieldCheck size={22} color="var(--accent-primary)" />
              <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Physician Coordination & Safety</h4>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Biomarker entries logged in DomainFit are shared directly with your assigned Registered Dietitian (CDCES) and Physical Therapist to ensure exercise is calibrated safely.
            </p>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Safety Guidelines
              </span>
              <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Do not exercise if fasting glucose is below 70 mg/dL or above 250 mg/dL without doctor review.</li>
                <li>Postpartum mothers should pause movement if experiencing unexpected vaginal bleeding or pelvic pain.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
