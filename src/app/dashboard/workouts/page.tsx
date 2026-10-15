'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  HeartPulse,
  Home,
  CheckCircle2,
  Clock,
  Video,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  X,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseFormState {
  [exerciseId: string]: {
    sets: { weight: number; reps: number; completed: boolean }[];
  };
}

export default function ClientWorkoutsPage() {
  const { workoutPlan, logWorkout, workoutLogs, clientStreak } = useStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Day 1 default
  const [demoModalExercise, setDemoModalExercise] = useState<string | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [rpeScale, setRpeScale] = useState<number>(4);

  const currentDay = workoutPlan.days[selectedDayIndex] || workoutPlan.days[0];

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseFormState>(() => {
    const init: ExerciseFormState = {};
    currentDay.exercises.forEach((ex) => {
      init[ex.id] = {
        sets: Array.from({ length: ex.target_sets }, (_, i) => ({
          weight: 0, // bodyweight or light band
          reps: parseInt(ex.target_reps) || 10,
          completed: false,
        })),
      };
    });
    return init;
  });

  const handleUpdateSet = (exId: string, setIndex: number, field: 'weight' | 'reps' | 'completed', value: any) => {
    setExerciseLogs((prev) => {
      const current = prev[exId] || { sets: [] };
      const updatedSets = [...current.sets];
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        [field]: value,
      };
      return {
        ...prev,
        [exId]: { sets: updatedSets },
      };
    });
  };

  const handleFinishWorkout = () => {
    const completedExercises = currentDay.exercises.map((ex) => {
      const recorded = exerciseLogs[ex.id]?.sets || [];
      return {
        exercise_name: ex.exercise_name,
        sets: recorded.map((s, idx) => ({
          set_num: idx + 1,
          reps: Number(s.reps),
          weight_kg: Number(s.weight),
        })),
      };
    });

    logWorkout({
      client_id: 'user-client-1',
      workout_day_title: currentDay.day_name,
      date: new Date().toISOString().split('T')[0],
      duration_minutes: 25,
      rpe_scale: rpeScale,
      completed_exercises: completedExercises,
      notes: workoutNotes || 'Felt gentle and restorative. No joint irritation or dizziness.',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B7F34A', '#FFFFFF', '#34D399'],
    });
  };

  return (
    <DashboardLayout
      title="Gentle Home Movement & Rehabilitation"
      subtitle={`Medical Protocol: ${workoutPlan.title} • Active Streak: ${clientStreak} Days`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Day Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}
        >
          {workoutPlan.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(idx)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: isSelected ? '#0B0D0C' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.92rem',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Home size={16} />
                <span>{day.day_name}</span>
                {day.completed && (
                  <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>COMPLETED</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Exercises List & Set Logger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {currentDay.exercises.map((ex, exIdx) => {
            const currentExState = exerciseLogs[ex.id]?.sets || [];
            return (
              <div
                key={ex.id}
                className="card"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '28px',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-lime">Movement #{exIdx + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Rest: {ex.rest_seconds}s</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{ex.exercise_name}</h3>
                  </div>

                  <button
                    onClick={() => setDemoModalExercise(ex.exercise_name)}
                    className="btn-outline btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Play size={14} />
                    <span>Watch Clinical Form Video</span>
                  </button>
                </div>

                {/* Form coaching & clinical caution */}
                <div
                  style={{
                    padding: '14px 18px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--accent-primary)',
                    marginBottom: '16px',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <p style={{ marginBottom: '6px' }}><strong style={{ color: '#fff' }}>Specialist Cue:</strong> {ex.notes}</p>
                  {ex.clinical_caution && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontSize: '0.82rem' }}>
                      <ShieldAlert size={14} />
                      <span><strong>Clinical Safeguard:</strong> {ex.clinical_caution}</span>
                    </div>
                  )}
                </div>

                {/* Set Logging Matrix */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 12px' }}>Set</th>
                        <th style={{ padding: '8px 12px' }}>Prescribed Reps</th>
                        <th style={{ padding: '8px 12px' }}>Resistance Band / Load</th>
                        <th style={{ padding: '8px 12px' }}>Reps Completed</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center' }}>Mark Done</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: ex.target_sets }).map((_, setIdx) => {
                        const setRecord = currentExState[setIdx] || { weight: 0, reps: 10, completed: false };
                        return (
                          <tr key={setIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                              #{setIdx + 1}
                            </td>
                            <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {ex.target_reps}
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Light Band / Bodyweight</span>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="number"
                                value={setRecord.reps}
                                onChange={(e) => handleUpdateSet(ex.id, setIdx, 'reps', Number(e.target.value))}
                                style={{ width: '80px', padding: '6px 10px', backgroundColor: 'var(--bg-secondary)' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleUpdateSet(ex.id, setIdx, 'completed', !setRecord.completed)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  backgroundColor: setRecord.completed ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                  border: `1px solid ${setRecord.completed ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                  color: setRecord.completed ? '#0B0D0C' : 'transparent',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                ✓
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workout Complete Submission Box */}
        <div
          className="card"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '32px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                Perceived Exertion / Fatigue (Borg RPE 1–10)
              </label>
              <select
                value={rpeScale}
                onChange={(e) => setRpeScale(Number(e.target.value))}
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <option value={2}>2 / 10 — Very Easy (Minimal Breathing Change)</option>
                <option value={3}>3 / 10 — Easy (Conversational, Restorative)</option>
                <option value={4}>4 / 10 — Moderate (Ideal Clinical Range)</option>
                <option value={5}>5 / 10 — Somewhat Challenging (Safe Exertion)</option>
                <option value={6}>6 / 10 — Moderately Hard</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                Medical / Joint Notes for Doctor or PT
              </label>
              <input
                type="text"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="e.g. No knee pinching today. Fasting glucose was 108 mg/dL."
                style={{ backgroundColor: 'var(--bg-card)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleFinishWorkout} className="btn-primary" style={{ padding: '14px 32px' }}>
              <CheckCircle2 size={18} />
              <span>Log Completed Session & Submit to Specialist</span>
            </button>
          </div>
        </div>

        {/* DEMO VIDEO MODAL */}
        {demoModalExercise && (
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
                maxWidth: '600px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Clinical Guide: {demoModalExercise}</h4>
                <button onClick={() => setDemoModalExercise(null)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  height: '280px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#000',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <img
                  src="/images/domainfit/home-fitness.jpg"
                  alt="Clinical form guidance"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={24} color="#0B0D0C" style={{ marginLeft: '4px' }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Physiotherapist Guided Video (0:50)</span>
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong>Key Clinical Safeguards:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                  <li>Never hold your breath during resistance to avoid sudden blood pressure elevation.</li>
                  <li>Inhale as you lower gently into the chair; exhale through pursed lips as you stand.</li>
                  <li>Ensure knees remain stacked over second toe, avoiding inward collapse.</li>
                </ul>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setDemoModalExercise(null)} className="btn-secondary btn-sm">
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
