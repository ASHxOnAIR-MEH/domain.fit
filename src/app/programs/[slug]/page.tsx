'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { useStore } from '@/lib/store';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  ArrowRight,
  Dumbbell,
  Apple,
  Star,
  Users,
} from 'lucide-react';

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { programs, trainers } = useStore();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const program = programs.find((p) => p.slug === slug) || programs[0];
  const trainer = trainers.find((t) => t.id === program.trainer_id) || trainers[0];

  const trainerName = trainer.id === 'trainer-1' ? 'Dr. Marcus Vance, PT, DPT' : trainer.id === 'trainer-2' ? 'Elena Rostova, PCES' : 'David Kim, MS, RD, CDCES';
  const trainerTitle = trainer.id === 'trainer-1' ? 'Doctor of Physical Therapy & Clinical Exercise Physiologist' : trainer.id === 'trainer-2' ? 'Pre/Postnatal Core & Pelvic Floor Specialist' : 'Certified Diabetes Care & Education Specialist';

  const weeklyPhases = [
    {
      phase: 'Weeks 1–4',
      title: 'Clinical Baseline & Safe Movement Calibration',
      description: 'Establish resting biometrics (fasting glucose, resting blood pressure, or diastasis recti width). Calibrate gentle chair/mat mechanics, 360 diaphragmatic breathwork, and safe low-impact pacing (Borg RPE 3–5).',
    },
    {
      phase: 'Weeks 5–8',
      title: 'Gentle Resistance & Post-Meal Glucose Progression',
      description: 'Introduce elastic band tension and 15-minute post-meal glucose clearing walks. Progress transverse abdominis stamina without intra-abdominal pressure spikes or joint shear.',
    },
    {
      phase: 'Weeks 9–12',
      title: 'Functional Autonomy & Metabolic Stabilization',
      description: 'Consolidate healthy glycemic response, pelvic floor confidence, and daily joint comfort. Export comprehensive physician progress summary for your doctor.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Hero Banner */}
        <section
          style={{
            position: 'relative',
            padding: '80px 0 64px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}
        >
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span className="badge badge-lime">{program.category}</span>
                  <span className="badge badge-gray">{program.difficulty}</span>
                </div>

                <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', lineHeight: 1.1, marginBottom: '20px' }}>
                  {program.title}
                </h1>

                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  {program.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program Duration</span>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{program.duration_weeks} Weeks</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Enrollment Fee</span>
                    <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      ₹{program.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <button onClick={() => setEnrollModalOpen(true)} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                    <span>Enroll Now in Program</span>
                    <ArrowRight size={18} />
                  </button>
                  <Link href="/programs" className="btn-secondary" style={{ padding: '14px 24px' }}>
                    Browse Other Tracks
                  </Link>
                </div>
              </div>

              {/* Cover Image */}
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  height: '420px',
                  position: 'relative',
                }}
              >
                <img
                  src={program.image_url}
                  alt={program.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Breakdown Section */}
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
              {/* Left Column: Weekly Structure & Included Services */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>What’s Included</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {program.included_services.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '16px 20px',
                          backgroundColor: 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '20px' }}>Weekly Periodization Structure</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {weeklyPhases.map((phase, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '24px',
                          backgroundColor: 'var(--bg-card)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span className="badge badge-lime">{phase.phase}</span>
                          <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>{phase.title}</h4>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                          {phase.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Safeguards */}
                {program.clinical_safeguards && program.clinical_safeguards.length > 0 && (
                  <div
                    style={{
                      padding: '24px',
                      backgroundColor: 'rgba(239, 68, 68, 0.04)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <ShieldCheck size={22} color="#F87171" />
                      <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Medical Safeguards & Clinical Protections</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {program.clinical_safeguards.map((safeguard, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: '#F87171', fontWeight: 800 }}>•</span>
                          <span>{safeguard}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust & Scientific Statement */}
                <div
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(183, 243, 74, 0.05)',
                    border: '1px solid rgba(183, 243, 74, 0.2)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <ShieldCheck size={24} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: '#fff' }}>Clinical Guidance Notice:</strong> DomainFit is designed specifically for individuals with chronic metabolic conditions (Type 2 Diabetes), postpartum recovery (diastasis recti), prenatal care, or joint limitations who cannot safely exercise in commercial gyms. All protocols are designed under licensed clinical exercise physiologists and physician coordination.
                  </p>
                </div>
              </div>

              {/* Right Column: Lead Coach Profile & Enrollment Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '32px',
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Lead Program Coach
                  </span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '16px 0 20px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-primary)' }}>
                      <img
                        src={trainer.image_url}
                        alt={trainerName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{trainerName}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{trainerTitle}</p>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {trainer.bio}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {trainer.qualifications.map((q, idx) => (
                      <span key={idx} className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                        {q}
                      </span>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <button onClick={() => setEnrollModalOpen(true)} className="btn-primary" style={{ width: '100%' }}>
                      Enroll & Start with {trainerName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <EnrollmentModal
        program={program}
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
      />
    </div>
  );
}
