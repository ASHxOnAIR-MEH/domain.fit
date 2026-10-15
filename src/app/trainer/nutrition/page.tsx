'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { MealPlan, MealPlanItem } from '@/lib/types';
import { Apple, Plus, Trash2, Save, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TrainerNutritionBuilderPage() {
  const { mealPlan, addToast } = useStore();

  const [planTitle, setPlanTitle] = useState(mealPlan.title);
  const [dailyCalories, setDailyCalories] = useState(mealPlan.daily_calories);
  const [proteinG, setProteinG] = useState(mealPlan.protein_g);
  const [carbsG, setCarbsG] = useState(mealPlan.carbs_g);
  const [fatsG, setFatsG] = useState(mealPlan.fats_g);

  const [items, setItems] = useState<MealPlanItem[]>(mealPlan.items);

  const handleAddItem = () => {
    const newItem: MealPlanItem = {
      id: `item-${Date.now()}`,
      meal_type: 'Snacks',
      title: 'Low-Glycemic Roasted Chickpeas & Walnuts',
      description: 'Crisp roasted chickpeas seasoned with turmeric and sea salt, paired with raw walnuts for omega-3 and smooth glycemic curve.',
      calories: 220,
      protein_g: 10,
      carbs_g: 18,
      fats_g: 12,
      glycemic_index: 'Low',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSavePlan = () => {
    addToast(`Clinical nutrition plan "${planTitle}" saved with ${dailyCalories} kcal daily glycemic target!`, 'success');
  };

  return (
    <DashboardLayout
      title="Clinical Nutrition & Glycemic Architect"
      subtitle="Configure low-glycemic carb sequencing, postpartum nutrient repletion, and clinical meal plans for patients."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* MACRONUTRIENT TARGET FORM */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-lime">Dietary Architecture</span>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '6px' }}>Target Macro Configuration</h3>
            </div>
            <button onClick={handleSavePlan} className="btn-primary" style={{ gap: '8px' }}>
              <Save size={16} />
              <span>Save & Assign Nutrition Plan</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Plan Name
              </label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Daily Calories (kcal)
              </label>
              <input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(Number(e.target.value))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Target Protein (g)
              </label>
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(Number(e.target.value))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Target Carbs (g)
              </label>
              <input
                type="number"
                value={carbsG}
                onChange={(e) => setCarbsG(Number(e.target.value))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Target Fats (g)
              </label>
              <input
                type="number"
                value={fatsG}
                onChange={(e) => setFatsG(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* MEAL TEMPLATES BUILDER */}
        <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Recommended Meal Templates ({items.length})</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Wholesome recipes provided to clients with pre-calculated nutritional profiles.
              </p>
            </div>
            <button onClick={handleAddItem} className="btn-secondary btn-sm" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Meal Template</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-lime">{it.meal_type}</span>
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>GI: {it.glycemic_index}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{it.title}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '520px', marginBottom: '8px' }}>
                    {it.description}
                  </p>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem' }}>
                    <span>Calories: <strong>{it.calories}</strong></span>
                    <span>P: <strong style={{ color: '#34D399' }}>{it.protein_g}g</strong></span>
                    <span>C: <strong style={{ color: '#60A5FA' }}>{it.carbs_g}g</strong></span>
                    <span>F: <strong style={{ color: '#FBBF24' }}>{it.fats_g}g</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(it.id)}
                  style={{ color: 'var(--status-error)', padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
