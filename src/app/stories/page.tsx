'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Star, ArrowRight, Quote, Dumbbell } from 'lucide-react';

export default function StoriesPage() {
  const caseStudies = [
    {
      name: 'Anita S.',
      role: 'High School Teacher, 54 • Managing Type 2 Diabetes',
      track: 'Type 2 Diabetes & Insulin Sensitivity Protocol',
      coach: 'David Kim, MS, RD, CDCES & Dr. Marcus Vance, PT',
      duration: '12 Weeks',
      metricChange: 'Fasting Glucose 158 → 104 mg/dL • HbA1c 8.2% → 6.3%',
      quote: 'I was intimidated by commercial gyms because of diabetic neuropathy in my feet and unpredictable energy slumps. DomainFit’s gentle post-dinner walking routines and seated resistance bands brought my morning blood sugars into the normal range without exhaustion.',
      highlights: [
        'Eliminated post-meal glucose spikes via structured 15-minute gentle pacing routines',
        'Built muscular glucose sink capacity using seated resistance bands with zero foot trauma',
        'Endocrinologist successfully reduced oral diabetes medication dosage at 12-week review',
      ],
    },
    {
      name: 'Sarah M.',
      role: 'Mother of Two, 32 • 14 Weeks Post C-Section Delivery',
      track: 'Postpartum Core & Pelvic Floor Rehabilitation',
      coach: 'Elena Rostova, PCES, PRPC',
      duration: '12 Weeks',
      metricChange: '3.5-Finger Diastasis Recti → 1-Finger Stable Gap • Zero Pelvic Heaviness',
      quote: 'After my C-section, regular gym workouts were impossible. I could not even pick up my baby stroller without lower back ache and pelvic heaviness. Elena taught me 360 diaphragmatic breathing and deep core reconnection right from my living room rug.',
      highlights: [
        'Repaired severe abdominal wall separation safely with zero crunches or planks',
        'Completely resolved pelvic floor weakness and lower back postural fatigue',
        '100% completed at home during baby nap windows without commute or childcare stress',
      ],
    },
    {
      name: 'Robert K.',
      role: 'Retired Accountant, 62 • Severe Knee Osteoarthritis & Hypertension',
      track: 'Arthritis & Joint-Friendly Home Conditioning',
      coach: 'Dr. Marcus Vance, PT, DPT',
      duration: '10 Weeks',
      metricChange: 'Resting BP 144/92 → 118/78 mmHg • Knee Pain Scale 8/10 → 1/10',
      quote: 'High-impact fitness clubs always caused knee flare-ups that put me in bed for days. Dr. Vance designed isometric chair routines and synovial lubrication movements. My blood pressure dropped into normal ranges and I can walk upstairs pain-free.',
      highlights: [
        'Gentle isometric tension increased joint stability without harmful cartilage compression',
        'Continuous pre- and post-session blood pressure monitoring ensured total cardiac safety',
        'Restored daily independence, stair climbing, and gardening without joint swelling',
      ],
    },
    {
      name: 'Maya P.',
      role: 'Graphic Designer, 29 • Prenatal 2nd & 3rd Trimester',
      track: 'Prenatal Safe Movement & Trimester Mobility',
      coach: 'Elena Rostova, PCES, PRPC',
      duration: '8 Weeks',
      metricChange: 'Controlled Gestational Sugars • Maintained Pelvic Alignment',
      quote: 'Staying active during pregnancy was stressful because so many gym classes do dangerous high-impact moves. DomainFit gave me trimester-safe movements that relieved my round ligament pain and kept my gestational blood sugars beautifully stable.',
      highlights: [
        'Completely avoided flat-on-back exercises and pelvic instability risks',
        'Balanced gestational blood sugars through post-meal gentle walking guidance',
        'Received full sign-off and commendation from her personal OB-GYN',
      ],
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Header */}
        <section style={{ padding: '80px 0 56px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Clinical Recovery Journeys</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '16px' }}>
              Real Patients. Measured Health.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Documented home recovery journeys demonstrating how physician-coordinated movement, blood glucose monitoring, and gentle postpartum rehabilitation transform clinical health.
            </p>
          </div>
        </section>

        {/* Stories Grid */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            {/* Disclaimer Notice */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                marginBottom: '48px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <ShieldCheck size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Clinical Case Study Records:</strong> The following case profiles illustrate real client adaptations, glycemic improvements, and diastasis recti recoveries managed through the DomainFit clinical ecosystem.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {caseStudies.map((study, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '40px',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span className="badge badge-lime">{study.track}</span>
                      <span className="badge badge-gray">{study.duration}</span>
                    </div>

                    <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>{study.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{study.role}</p>

                    <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)', marginBottom: '20px' }}>
                      <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        "{study.quote}"
                      </p>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Assigned Coach: <strong style={{ color: 'var(--accent-primary)' }}>{study.coach}</strong>
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
                      Key Progress Milestones
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      {study.highlights.map((h, hIdx) => (
                        <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Documented Outcome:</span>
                      <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
                        {study.metricChange}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '64px' }}>
              <Link href="/programs" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                <span>Begin Your Own Journey</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
