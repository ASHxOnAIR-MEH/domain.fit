'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { Program } from '@/lib/types';
import { Layers, Plus, Trash2, Edit3, CheckCircle2, Save, X } from 'lucide-react';

export default function AdminProgramsPage() {
  const { programs, createProgram, addToast } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<Program['category']>('Diabetes & Metabolic');
  const [difficulty, setDifficulty] = useState<Program['difficulty']>('Low Impact');
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [price, setPrice] = useState(3499);
  const [targetAudience, setTargetAudience] = useState('');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    createProgram({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      description: desc,
      image_url: '/images/domainfit/weight-management.jpg',
      category,
      difficulty,
      duration_weeks: Number(durationWeeks),
      price: Number(price),
      featured: false,
      included_services: ['Dedicated gentle home protocol', 'Biometric tracking', 'Clinical consultation review'],
      clinical_safeguards: [
        'Continuous Borg RPE exertion monitoring (RPE 3-5)',
        'Physician/OB-GYN clearance coordination before progression',
        'Chair and elastic resistance band non-impact regressions'
      ],
      target_audience: targetAudience || 'Clinical patients managing health conditions at home',
      trainer_id: 'trainer-1',
    });

    setModalOpen(false);
    setTitle('');
    setDesc('');
  };

  return (
    <DashboardLayout
      title="Fitness Programs Catalog Management"
      subtitle="Publish, modify, and configure pricing tiers for public marketing and enrolment."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Catalog Offerings ({programs.length})</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All published programs appear instantly on the public website</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ gap: '6px' }}>
            <Plus size={16} />
            <span>Create New Program</span>
          </button>
        </div>

        {/* Programs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="card"
              style={{
                padding: '24px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-lime">{prog.category}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ₹{prog.price.toLocaleString()}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>{prog.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {prog.description}
                </p>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Duration: <strong style={{ color: '#fff' }}>{prog.duration_weeks} Weeks</strong></span>
                  <span>Difficulty: <strong style={{ color: '#fff' }}>{prog.difficulty}</strong></span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-gray" style={{ color: 'var(--status-success)' }}>PUBLISHED</span>
                <button
                  onClick={() => addToast(`Program "${prog.title}" status: Active & Available.`, 'info')}
                  className="btn-secondary btn-sm"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE MODAL */}
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
                maxWidth: '600px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '32px',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Create New Fitness Track</h3>
                <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProgram} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Program Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olympic Lifting Mastery"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                    >
                      <option value="Diabetes & Metabolic">Diabetes & Metabolic</option>
                      <option value="Postpartum & Pelvic">Postpartum & Pelvic</option>
                      <option value="Prenatal">Prenatal</option>
                      <option value="Joint & Orthopedic">Joint & Orthopedic</option>
                      <option value="Cardiac & BP">Cardiac & BP</option>
                      <option value="Clinical Nutrition">Clinical Nutrition</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Clinical Intensity / Safety
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                    >
                      <option value="Gentle Rehabilitation">Gentle Rehabilitation</option>
                      <option value="Low Impact">Low Impact</option>
                      <option value="Gradual Progression">Gradual Progression</option>
                      <option value="Trimester Adapted">Trimester Adapted</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Duration (Weeks)
                    </label>
                    <input
                      type="number"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Syllabus Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the periodization structure and goals..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lifters with 1+ year barbell experience..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Publish to Public Site
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
