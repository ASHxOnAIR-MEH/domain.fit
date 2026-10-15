'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { useStore } from '@/lib/store';
import { Program } from '@/lib/types';
import {
  HeartPulse,
  Activity,
  Baby,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Flame,
  ChevronDown,
  Droplets,
  Stethoscope,
  Sparkles,
  Home,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const { programs, trainers, glucoseLogs, bpLogs } = useStore();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Interactive dashboard preview active tab
  const [dashboardTab, setDashboardTab] = useState<'glucose' | 'workouts' | 'nutrition'>('glucose');

  const openEnrollment = (prog: Program) => {
    setSelectedProgram(prog);
    setEnrollModalOpen(true);
  };

  const faqs = [
    {
      q: 'Why is DomainFit designed specifically for home exercise rather than a gym?',
      a: 'Many individuals with chronic medical conditions, Type 2 Diabetes, post-surgery recovery, or postpartum physical changes cannot comfortably or safely train in crowded commercial gyms. DomainFit brings clinical exercise physiology, chair-supported movements, resistance bands, and doctor-coordinated pacing into your living room.',
    },
    {
      q: 'How does the platform help clients with Type 2 Diabetes manage blood sugar?',
      a: 'We implement light post-meal muscular contractions and Zone-1 walking protocols. Research proves that skeletal muscle contraction activates non-insulin GLUT-4 glucose transporters, clearing circulating glucose from the bloodstream naturally and dampening post-prandial spikes. Our portal includes fasting and post-meal glucose logging.',
    },
    {
      q: 'Is this safe for new mothers with Diastasis Recti or pelvic floor weakness?',
      a: 'Yes. Our postpartum curriculums are designed by certified Pre/Postnatal Corrective Specialists (PCES). We strictly avoid crunches, planks, and heavy intra-abdominal bearing down. Instead, we use 360-degree diaphragmatic breathing, transverse abdominis re-education, and pelvic floor coordination.',
    },
    {
      q: 'What if I have severe arthritis or cannot stand for long periods?',
      a: 'All exercises feature seated, chair-assisted, and bed-friendly regressions. You will never be asked to perform high-impact jumping, deep uncontrolled lunges, or heavy spinal loading.',
    },
    {
      q: 'Do your coaches coordinate with my primary physician or OB/GYN?',
      a: 'Yes. During your onboarding questionnaire, you can share your doctor’s exercise restrictions, recent lab values (such as HbA1c), and medical notes. Our faculty tailors every week of movement within those boundaries.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ============================================================== */}
        {/* HERO SECTION — MEDICAL & CLINICAL HOME FITNESS */}
        {/* ============================================================== */}
        <section
          style={{
            position: 'relative',
            minHeight: '88vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {/* Background Hero Image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          >
            <img
              src="/images/domainfit/home-fitness.jpg"
              alt="Safe Home Fitness for Medical Conditions"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center right',
              }}
            />
            {/* Dark editorial overlays ensuring high legibility */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #0B0D0C 0%, rgba(11, 13, 12, 0.95) 45%, rgba(11, 13, 12, 0.45) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(11, 13, 12, 0.3) 0%, transparent 60%, #0B0D0C 100%)',
              }}
            />
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '40px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '660px' }}>
              {/* Clinical Trust Statement Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '24px',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Specialized Clinical Care • 100% Home Adapted • Zero Gym Intimidation
                </span>
              </div>

              {/* Master Headline */}
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 4.8vw, 4.1rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  color: '#fff',
                }}
              >
                Clinical Movement. <br />
                Safe at Home. <br />
                <span style={{ color: 'var(--accent-primary)' }}>Your Health Domain.</span>
              </h1>

              {/* Master Supporting Copy */}
              <p
                style={{
                  fontSize: '1.18rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  marginBottom: '36px',
                  maxWidth: '580px',
                }}
              >
                Specialized online exercise and nutrition for clients managing <strong>Type 2 Diabetes</strong>, <strong>Postpartum recovery</strong>, <strong>prenatal care</strong>, and <strong>chronic medical conditions</strong> who cannot go to a commercial gym.
              </p>

              {/* Primary & Secondary CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <Link href="/programs" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  <span>Explore Medical Tracks</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="#clinical-pillars" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  <span>Why Clinical Home Fitness?</span>
                </Link>
              </div>

              {/* Quick Clinical Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  marginTop: '48px',
                  paddingTop: '32px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Glucose</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Post-Meal Clearing Protocols</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Postpartum</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Diastasis Recti & Pelvic Safe</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Zero Gym</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>100% Home & Chair Supported</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* CLINICAL PILLARS SECTION */}
        {/* ============================================================== */}
        <section id="clinical-pillars" style={{ padding: '96px 0', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 64px' }}>
              <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Clinical Methodology</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '16px' }}>
                Exercise Tailored for Your Medical Needs
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                When medical conditions prevent you from stepping inside a loud gym, our certified specialists bring gentle, restorative fitness into your living room.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  icon: HeartPulse,
                  title: 'Type 2 Diabetes & Glucose Control',
                  description: 'Gentle muscle activation and 15-minute post-meal walks stimulate insulin-independent glucose uptake, dampening blood sugar spikes naturally.',
                },
                {
                  icon: Baby,
                  title: 'Postpartum & Pelvic Floor Recovery',
                  description: 'Breath-synchronized core activation to heal diastasis recti, restore pelvic stability, and recover posture without harmful abdominal crunches.',
                },
                {
                  icon: Stethoscope,
                  title: 'Physician-Coordinated Pacing',
                  description: 'Our physical therapists and diabetes educators align program intensity with your doctor’s guidelines, recent lab work, and medication pacing.',
                },
                {
                  icon: Home,
                  title: '100% Home & Chair Supported',
                  description: 'Designed for living rooms. Uses soft resistance bands, chairs, and cushioned floor mats — zero intimidating weights or high-impact joint wear.',
                },
              ].map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="card"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '32px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--accent-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(183, 243, 74, 0.3)',
                      }}
                    >
                      <Icon size={26} color="var(--accent-primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{benefit.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* MEDICAL PROGRAMS SECTION */}
        {/* ============================================================== */}
        <section id="programs" style={{ padding: '96px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '56px' }}>
              <div>
                <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Specialized Syllabi</span>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '8px' }}>
                  Clinical Fitness Tracks
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px' }}>
                  Periodized home programs for blood sugar regulation, postpartum healing, arthritis relief, and safe maternal movement.
                </p>
              </div>
              <Link href="/programs" className="btn-secondary">
                <span>View All Specialized Programs</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Program Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '28px',
              }}
            >
              {programs.slice(0, 6).map((prog) => (
                <div
                  key={prog.id}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={prog.image_url}
                      alt={prog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
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
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#fff' }}>{prog.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                      {prog.description}
                    </p>

                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Focus:</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{prog.target_audience}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prog.duration_weeks} WEEKS PROTOCOL</span>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          ₹{prog.price.toLocaleString()}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/programs/${prog.slug}`} className="btn-secondary btn-sm">
                          Details
                        </Link>
                        <button onClick={() => openEnrollment(prog)} className="btn-primary btn-sm">
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

        {/* ============================================================== */}
        {/* INTERACTIVE DASHBOARD PREVIEW — DIABETES & POSTPARTUM */}
        {/* ============================================================== */}
        <section style={{ padding: '96px 0', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
              <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Interactive Clinical Portal</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '16px' }}>
                Explore the Client Health Dashboard
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                Test actual interactive tools. Experience how clients track daily blood glucose, gentle home movement, and low-glycemic nutrition.
              </p>
            </div>

            {/* Interactive Preview Container */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Preview Nav Tabs */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setDashboardTab('glucose')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: dashboardTab === 'glucose' ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: dashboardTab === 'glucose' ? '#0B0D0C' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Blood Sugar & Vitals
                  </button>
                  <button
                    onClick={() => setDashboardTab('workouts')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: dashboardTab === 'workouts' ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: dashboardTab === 'workouts' ? '#0B0D0C' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Gentle Home Movement
                  </button>
                  <button
                    onClick={() => setDashboardTab('nutrition')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: dashboardTab === 'nutrition' ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: dashboardTab === 'nutrition' ? '#0B0D0C' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Low-Glycemic Nutrition
                  </button>
                </div>

                <Link href="/dashboard" className="btn-primary btn-sm">
                  <span>Open Full Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Tab Content Display */}
              <div style={{ padding: '32px' }}>
                {dashboardTab === 'glucose' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="badge badge-lime">Fasting Glucose</span>
                        <span style={{ fontSize: '0.85rem', color: '#34D399' }}>Target: &lt; 100 mg/dL</span>
                      </div>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '4px' }}>
                        108 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>mg/dL</span>
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Down from 128 mg/dL at baseline. Demonstrates improved GLUT-4 insulin sensitivity.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {glucoseLogs.slice(0, 3).map((g) => (
                          <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                            <span>{g.date} • {g.reading_type}</span>
                            <strong style={{ color: 'var(--accent-primary)' }}>{g.glucose_mg_dl} mg/dL</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="badge badge-gray" style={{ color: '#60A5FA', borderColor: '#60A5FA' }}>Resting Blood Pressure</span>
                        <HeartPulse size={18} color="#60A5FA" />
                      </div>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                        120/78 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>mmHg</span>
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Optimal cardiac range with gentle Zone-2 movement.
                      </p>
                      <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          Doctor Coordination Note
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          "Patient cleared for gentle resistance band exercise. Blood sugars reacting favorably to post-meal walking."
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === 'workouts' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                      <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Today's Gentle Home Routine</span>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Seated & Supported Muscle Activation</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Chair squats & band presses designed to clear glucose without joint wear.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                          'Chair-Assisted Squat to Box (3 × 10 reps)',
                          'Seated Resistance Band Chest Press (3 × 12 reps)',
                          'Diaphragmatic 360 Breathing with Pelvic Release',
                        ].map((ex, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', padding: '10px 12px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                            <CheckCircle2 size={16} color="var(--accent-primary)" />
                            <span>{ex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                      <span className="badge badge-gray" style={{ color: '#FBBF24', borderColor: '#FBBF24', marginBottom: '12px' }}>
                        Postpartum & Diastasis Recti Safeguards
                      </span>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Deep Transverse Core Healing</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Strictly eliminates crunches, sit-ups, and forward coning. Focuses on gentle midline connective tissue restoration.
                      </p>
                      <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Active Separation: 1.5 cm (Improved from 2.8 cm)</span>
                        <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', margin: '10px 0' }}>
                          <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--accent-primary)' }} />
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Functional midline tension restored without surgery</p>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === 'nutrition' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Glycemic Load & Carbohydrate Pacing</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Soluble Fiber (35g target)</span>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>29g logged</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '82%', height: '100%', backgroundColor: 'var(--accent-primary)' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Carbohydrates (145g budget)</span>
                            <span style={{ color: '#60A5FA', fontWeight: 600 }}>110g logged</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '76%', height: '100%', backgroundColor: '#60A5FA' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Clean Protein (110g target)</span>
                            <span style={{ color: '#34D399', fontWeight: 600 }}>92g logged</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '84%', height: '100%', backgroundColor: '#34D399' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Hydration & Kidney Health</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Target: 2,500ml / day for optimal renal glucose clearance.
                      </p>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>2,250</span>
                        <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> / 2,500 ml</span>
                        <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden', margin: '12px 0' }}>
                          <div style={{ width: '90%', height: '100%', backgroundColor: '#38BDF8' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>90% of daily target reached</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* CLINICAL FACULTY SECTION */}
        {/* ============================================================== */}
        <section style={{ padding: '96px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '56px' }}>
              <div>
                <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Clinical Specialists</span>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '8px' }}>
                  Meet Our Clinical Care Faculty
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px' }}>
                  Physical therapists, pre/postnatal corrective specialists, and certified diabetes educators dedicated to safe home movement.
                </p>
              </div>
              <Link href="/trainers" className="btn-secondary">
                <span>View Full Faculty</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              {trainers.map((t) => {
                const name = t.id === 'trainer-1' ? 'Dr. Marcus Vance, PT, DPT' : t.id === 'trainer-2' ? 'Elena Rostova, PCES' : 'David Kim, RD, CDCES';
                const roleTitle = t.id === 'trainer-1' ? 'Doctor of Physical Therapy & ACSM-CEP' : t.id === 'trainer-2' ? 'Pre/Postnatal & Pelvic Floor Lead' : 'Certified Diabetes Care & Education Specialist';
                return (
                  <div
                    key={t.id}
                    className="card"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ height: '340px', width: '100%', position: 'relative' }}>
                      <img
                        src={t.image_url}
                        alt={name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent 40%, rgba(27, 33, 29, 0.95) 100%)',
                        }}
                      />
                      <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                        <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '4px' }}>{name}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{roleTitle}</p>
                      </div>
                    </div>

                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                        {t.bio}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {t.specialties.slice(0, 3).map((spec, i) => (
                          <span key={i} className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.rating}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({t.client_count} clinical patients)</span>
                        </div>

                        <Link href={`/trainers`} className="btn-secondary btn-sm">
                          View Credentials
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SUCCESS STORIES — REAL CLINICAL OUTCOMES */}
        {/* ============================================================== */}
        <section style={{ padding: '96px 0', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
              <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Clinical Case Studies</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '16px' }}>
                Restoring Health, Comfort & Mobility
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                Documented patient milestones managing diabetes, postpartum separation, and joint pain at home.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {[
                {
                  quote: 'As a diabetic with joint stiffness, going to a regular gym felt overwhelming and unsafe. David designed light 15-minute resistance band routines and post-meal walks. My fasting blood sugar dropped from 135 to 108 mg/dL.',
                  client: 'Alex C. (Type 2 Diabetes Patient, 42)',
                  program: 'Type 2 Diabetes & Insulin Sensitivity Protocol',
                  milestone: 'HbA1c Reduced 6.9% → 6.2% / Pain-Free',
                },
                {
                  quote: 'Four months postpartum, I had a 2.8cm diastasis recti separation and lower back ache. Elena taught me how to breathe properly and activate my transverse abs. My gap closed to 1.2cm and I can lift my baby pain-free.',
                  client: 'Priya M. (Postpartum Mother, 32)',
                  program: 'Postpartum Core & Pelvic Floor Recovery',
                  milestone: 'Diastasis Recti Repaired / Zero Coning',
                },
                {
                  quote: 'Severe osteoarthritis in both knees prevented me from doing normal exercises. Dr. Marcus gave me chair-assisted movements and isometric band work. I can now climb my home stairs without pain.',
                  client: 'Sunil K. (Osteoarthritis Client, 56)',
                  program: 'Arthritis & Joint-Friendly Home Conditioning',
                  milestone: 'Pain Scale: 7/10 down to 2/10',
                },
              ].map((story, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.98rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                    "{story.quote}"
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{story.client}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', marginBottom: '6px' }}>{story.program}</p>
                    <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                      {story.milestone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* FAQ SECTION */}
        {/* ============================================================== */}
        <section style={{ padding: '96px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Clinical FAQ</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '16px' }}>
                Frequently Asked Clinical Questions
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                Everything you need to know about medical fitness, doctor clearance, and home equipment adaptations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      style={{
                        width: '100%',
                        padding: '22px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '1.05rem',
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={20}
                        color="var(--accent-primary)"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          flexShrink: 0,
                          marginLeft: '12px',
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 24px 22px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* FINAL CONVERSION CTA */}
        {/* ============================================================== */}
        <section
          style={{
            padding: '110px 0',
            backgroundColor: 'var(--bg-secondary)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '720px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '16px' }}>Safe, Gentle & Supervised</span>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '20px',
                color: '#fff',
              }}
            >
              Take Control of Your Health at Home.
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '36px' }}>
              Gentle exercise designed around your medical history, glucose targets, and postpartum recovery.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <Link href="/programs" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                <span>Select Your Medical Track</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                <span>Explore Client Health Dashboard</span>
              </Link>
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
