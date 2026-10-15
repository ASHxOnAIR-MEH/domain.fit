'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import {
  Apple,
  Droplets,
  Plus,
  Camera,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';

export default function ClientNutritionPage() {
  const { mealPlan, mealLogs, logMeal, waterIntakeMl, addWater, resetWater } = useStore();

  const [newMealType, setNewMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [newMealName, setNewMealName] = useState('');
  const [newCalories, setNewCalories] = useState<number>(650);
  const [newProtein, setNewProtein] = useState<number>(45);
  const [newCarbs, setNewCarbs] = useState<number>(60);
  const [newFats, setNewFats] = useState<number>(18);
  const [photoAdded, setPhotoAdded] = useState(false);

  const handleLogMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName) return;

    logMeal({
      client_id: 'user-client-1',
      date: new Date().toISOString().split('T')[0],
      meal_type: newMealType,
      meal_name: newMealName,
      photo_url: photoAdded ? '/images/domainfit/nutrition.jpg' : '',
      calories: Number(newCalories),
      protein_g: Number(newProtein),
      carbs_g: Number(newCarbs),
      fats_g: Number(newFats),
      trainer_feedback: 'Meal logged and pending coach review.',
    });

    setNewMealName('');
    setPhotoAdded(false);
  };

  // Calculate daily totals from logs
  const totalCaloriesLogged = mealLogs.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinLogged = mealLogs.reduce((acc, m) => acc + m.protein_g, 0);
  const totalCarbsLogged = mealLogs.reduce((acc, m) => acc + m.carbs_g, 0);
  const totalFatsLogged = mealLogs.reduce((acc, m) => acc + m.fats_g, 0);

  const proteinPct = Math.min(100, Math.round((totalProteinLogged / mealPlan.protein_g) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbsLogged / mealPlan.carbs_g) * 100));
  const fatsPct = Math.min(100, Math.round((totalFatsLogged / mealPlan.fats_g) * 100));
  const caloriesPct = Math.min(100, Math.round((totalCaloriesLogged / mealPlan.daily_calories) * 100));

  return (
    <DashboardLayout
      title="Nutrition & Dietary Management"
      subtitle={`Assigned Plan: ${mealPlan.title} • Target: ${mealPlan.daily_calories} kcal / day`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* TOP MACRONUTRIENT BREAKDOWN CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* Calories */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Calories</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{caloriesPct}%</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              {totalCaloriesLogged} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {mealPlan.daily_calories} kcal</span>
            </h3>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${caloriesPct}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }} />
            </div>
          </div>

          {/* Protein */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protein</span>
              <span style={{ fontWeight: 700, color: '#34D399' }}>{proteinPct}%</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399' }}>
              {totalProteinLogged}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {mealPlan.protein_g}g</span>
            </h3>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${proteinPct}%`, height: '100%', backgroundColor: '#34D399' }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carbohydrates</span>
              <span style={{ fontWeight: 700, color: '#60A5FA' }}>{carbsPct}%</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60A5FA' }}>
              {totalCarbsLogged}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {mealPlan.carbs_g}g</span>
            </h3>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${carbsPct}%`, height: '100%', backgroundColor: '#60A5FA' }} />
            </div>
          </div>

          {/* Fats */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fats</span>
              <span style={{ fontWeight: 700, color: '#FBBF24' }}>{fatsPct}%</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FBBF24' }}>
              {totalFatsLogged}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {mealPlan.fats_g}g</span>
            </h3>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${fatsPct}%`, height: '100%', backgroundColor: '#FBBF24' }} />
            </div>
          </div>
        </div>

        {/* WATER TRACKER SECTION */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <Droplets size={32} color="#38BDF8" />
            </div>
            <div>
              <span className="badge badge-gray" style={{ color: '#38BDF8', borderColor: '#38BDF8', marginBottom: '4px' }}>
                Hydration Monitor
              </span>
              <h3 style={{ fontSize: '1.6rem', color: '#fff' }}>
                {waterIntakeMl} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 3,000 ml</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Targeting 35ml per kg bodyweight for optimal tissue recovery.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => addWater(250)} className="btn-secondary btn-sm" style={{ color: '#38BDF8', borderColor: '#38BDF8' }}>
              +250 ml (Glass)
            </button>
            <button onClick={() => addWater(500)} className="btn-secondary btn-sm" style={{ color: '#38BDF8', borderColor: '#38BDF8' }}>
              +500 ml (Bottle)
            </button>
            <button onClick={() => addWater(1000)} className="btn-secondary btn-sm" style={{ color: '#38BDF8', borderColor: '#38BDF8' }}>
              +1,000 ml
            </button>
            <button onClick={resetWater} title="Reset Water" style={{ padding: '8px', color: 'var(--text-muted)' }}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* CLINICAL GLYCEMIC PROTOCOL & POST-MEAL GLUCOSE CLEARING */}
        <div
          style={{
            backgroundColor: 'rgba(183, 243, 74, 0.05)',
            border: '1px solid rgba(183, 243, 74, 0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-lime">Metabolic Safeguard</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Post-Meal Glucose Clearing Protocol</span>
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
              15-Minute Gentle Post-Meal Walk
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Beginning a gentle walk 20–30 minutes after your meal triggers non-insulin mediated GLUT-4 glucose uptake in leg muscles, suppressing postprandial blood sugar spikes by 22–38%.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Clinical Food Sequencing Rule:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>1st</span>
                <span style={{ color: '#fff' }}>Fiber & Greens (coats intestine to slow sugar absorption)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>2nd</span>
                <span style={{ color: '#34D399' }}>Proteins & Healthy Fats (stabilizes satiety hormones)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>3rd</span>
                <span style={{ color: '#60A5FA' }}>Complex Carbs (prevents sharp insulin spikes)</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOG A NEW MEAL & ASSIGNED MEAL TEMPLATES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Meal Entry Form */}
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>Log Today's Meal</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Record items consumed and submit for your coach to review:
            </p>

            <form onSubmit={handleLogMealSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewMealType(t)}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: newMealType === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: newMealType === t ? '#0B0D0C' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Meal Name & Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken, Sweet Potatoes & Avocado"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Calories</label>
                  <input
                    type="number"
                    value={newCalories}
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Protein (g)</label>
                  <input
                    type="number"
                    value={newProtein}
                    onChange={(e) => setNewProtein(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Carbs (g)</label>
                  <input
                    type="number"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Fats (g)</label>
                  <input
                    type="number"
                    value={newFats}
                    onChange={(e) => setNewFats(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Photo Upload Simulator */}
              <div
                onClick={() => setPhotoAdded(!photoAdded)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1px dashed ${photoAdded ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <Camera size={18} color={photoAdded ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.85rem', color: photoAdded ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                  {photoAdded ? '✓ Meal photo attached (nutrition.jpg)' : 'Attach meal photograph for coach'}
                </span>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '8px' }}>
                <Plus size={16} />
                <span>Save to Meal Log</span>
              </button>
            </form>
          </div>

          {/* Assigned Meal Plan Templates */}
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>Assigned Meal Plan</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Suggested high-protein meal templates formulated by your coach:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mealPlan.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{item.meal_type}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {item.calories} kcal
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>P: <strong style={{ color: '#34D399' }}>{item.protein_g}g</strong></span>
                    <span>C: <strong style={{ color: '#60A5FA' }}>{item.carbs_g}g</strong></span>
                    <span>F: <strong style={{ color: '#FBBF24' }}>{item.fats_g}g</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGGED MEALS HISTORY & COACH FEEDBACK */}
        <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '16px' }}>Today's Food Entries & Feedback</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mealLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-lime">{log.meal_type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.date}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>{log.meal_name}</h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                    <span><strong>{log.calories}</strong> kcal</span>
                    <span>P: <strong style={{ color: '#34D399' }}>{log.protein_g}g</strong></span>
                    <span>C: <strong style={{ color: '#60A5FA' }}>{log.carbs_g}g</strong></span>
                    <span>F: <strong style={{ color: '#FBBF24' }}>{log.fats_g}g</strong></span>
                  </div>
                </div>

                {log.trainer_feedback && (
                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Coach Feedback
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      "{log.trainer_feedback}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
