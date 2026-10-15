'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { useStore } from '@/lib/store';
import { Program } from '@/lib/types';
import { Search, Filter, ArrowRight, Check, Star } from 'lucide-react';

export default function ProgramsPage() {
  const { programs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const categories = ['All', 'Diabetes & Metabolic', 'Postpartum & Pelvic', 'Prenatal', 'Joint & Orthopedic', 'Cardiac & BP', 'Clinical Nutrition'];

  const filteredPrograms = programs.filter((prog) => {
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = (prog: Program) => {
    setSelectedProgram(prog);
    setEnrollModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Header */}
        <section style={{ padding: '72px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Clinical Movement Syllabi</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '16px' }}>
              Medical & Clinical Home Programs
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '680px' }}>
              Evidence-based home exercise and nutrition protocols engineered for individuals managing Type 2 Diabetes, postpartum core separation (diastasis recti), prenatal health, or medical conditions unable to train in commercial gyms.
            </p>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginTop: '36px' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '440px' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search diabetes, postpartum, arthritis, chair..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: selectedCategory === cat ? '#0B0D0C' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
              }}
            >
              {filteredPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div style={{ position: 'relative', height: '240px', width: '100%' }}>
                    <img
                      src={prog.image_url}
                      alt={prog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(27, 33, 29, 0.95) 100%)',
                      }}
                    />
                    <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                      <span className="badge badge-lime">{prog.category}</span>
                    </div>
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <span className="badge badge-gray">{prog.difficulty}</span>
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#fff' }}>{prog.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                      {prog.description}
                    </p>

                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Audience:</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{prog.target_audience}</p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prog.duration_weeks} WEEKS DURATION</span>
                        <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                          ₹{prog.price.toLocaleString()}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/programs/${prog.slug}`} className="btn-secondary btn-sm">
                          Details
                        </Link>
                        <button onClick={() => handleEnroll(prog)} className="btn-primary btn-sm">
                          Enroll
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selectedProgram && (
        <EnrollmentModal
          program={selectedProgram}
          isOpen={enrollModalOpen}
          onClose={() => setEnrollModalOpen(false)}
        />
      )}
    </div>
  );
}
