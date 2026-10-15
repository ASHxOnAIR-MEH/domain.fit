'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { WorkoutPlan, WorkoutExercise } from '@/lib/types';
import { Dumbbell, Plus, Trash2, CheckCircle2, Save, Sparkles, Layers } from 'lucide-react';

export default function TrainerWorkoutBuilderPage() {
  const { workoutPlan, setWorkoutPlan, addToast } = useStore();

  const [planTitle, setPlanTitle] = useState(workoutPlan.title);
  const [planDesc, setPlanDesc] = useState(workoutPlan.description);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  // Editable copy of days
  const [days, setDays] = useState(workoutPlan.days);

  const handleAddExercise = () => {
    const newEx: WorkoutExercise = {
      id: `ex-${Date.now()}`,
      exercise_name: 'New Compound Exercise',
      target_sets: 3,
      target_reps: '8-10',
      rest_seconds: 90,
      notes: 'Controlled eccentric tempo, maintain brace throughout range of motion.',
    };

    setDays((prev) => {
      const updated = [...prev];
      updated[activeDayIdx] = {
        ...updated[activeDayIdx],
        exercises: [...updated[activeDayIdx].exercises, newEx],
      };
      return updated;
    });
  };

  const handleRemoveExercise = (exId: string) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[activeDayIdx] = {
        ...updated[activeDayIdx],
        exercises: updated[activeDayIdx].exercises.filter((e) => e.id !== exId),
      };
      return updated;
    });
  };

  const handleUpdateExercise = (exId: string, field: keyof WorkoutExercise, val: any) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[activeDayIdx] = {
        ...updated[activeDayIdx],
        exercises: updated[activeDayIdx].exercises.map((e) =>
          e.id === exId ? { ...e, [field]: val } : e
        ),
      };
      return updated;
    });
  };

  const handlePublishPlan = () => {
    const updatedPlan: WorkoutPlan = {
      ...workoutPlan,
      title: planTitle,
      description: planDesc,
      days,
    };
    setWorkoutPlan(updatedPlan);
    addToast(`Workout plan "${planTitle}" published and updated for assigned clients!`, 'success');
  };

  const currentDay = days[activeDayIdx];

  return (
    <DashboardLayout
      title="Workout Plan Builder & Periodizer"
      subtitle="Architect multi-day split routines, volume progressions, and biomechanical exercise instructions."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* PLAN METADATA HEADER */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-lime">Curriculum Editor</span>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '6px' }}>Periodization Configuration</h3>
            </div>
            <button onClick={handlePublishPlan} className="btn-primary" style={{ gap: '8px' }}>
              <Save size={16} />
              <span>Publish Official Plan</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Workout Plan Title
              </label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Progression Notes & Block Phase
              </label>
              <input
                type="text"
                value={planDesc}
                onChange={(e) => setPlanDesc(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* WORKOUT DAYS TABS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {days.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setActiveDayIdx(idx)}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeDayIdx === idx ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: activeDayIdx === idx ? '#0B0D0C' : 'var(--text-secondary)',
                fontWeight: activeDayIdx === idx ? 700 : 500,
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
              }}
            >
              {day.day_name}
            </button>
          ))}
        </div>

        {/* DAY EXERCISES BUILDER */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{currentDay.day_name} Exercises</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Configure working volume, rep targets, and rest intervals for this workout day.
              </p>
            </div>

            <button onClick={handleAddExercise} className="btn-secondary btn-sm" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Exercise</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentDay.exercises.map((ex, i) => (
              <div
                key={ex.id}
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-lime">#{i + 1}</span>
                    <input
                      type="text"
                      value={ex.exercise_name}
                      onChange={(e) => handleUpdateExercise(ex.id, 'exercise_name', e.target.value)}
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px dashed var(--border-color)',
                        borderRadius: 0,
                        padding: '4px 0',
                        color: '#fff',
                        width: '280px',
                      }}
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveExercise(ex.id)}
                    style={{ color: 'var(--status-error)', padding: '6px' }}
                    title="Remove Exercise"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Target Sets
                    </label>
                    <input
                      type="number"
                      value={ex.target_sets}
                      onChange={(e) => handleUpdateExercise(ex.id, 'target_sets', Number(e.target.value))}
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Target Reps
                    </label>
                    <input
                      type="text"
                      value={ex.target_reps}
                      onChange={(e) => handleUpdateExercise(ex.id, 'target_reps', e.target.value)}
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Rest Interval (seconds)
                    </label>
                    <input
                      type="number"
                      value={ex.rest_seconds}
                      onChange={(e) => handleUpdateExercise(ex.id, 'rest_seconds', Number(e.target.value))}
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Movement Form Cues & Biomechanics Instructions
                  </label>
                  <input
                    type="text"
                    value={ex.notes}
                    onChange={(e) => handleUpdateExercise(ex.id, 'notes', e.target.value)}
                    style={{ backgroundColor: 'var(--bg-card)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
