'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Dumbbell, 
  Calendar, 
  Apple, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Video,
  FileCheck2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Hero */}
        <section style={{ padding: '80px 0 56px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>The DomainFit Clinical Methodology</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '16px' }}>
              How Clinical Home Coaching Works
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              A physician-aligned framework combining clinical exercise physiology, gentle home movement regressions, continuous blood sugar and vitals tracking, and doctor coordination.
            </p>
          </div>
        </section>

        {/* 4 Steps in Detail */}
        <section style={{ padding: '80px 0' }}>
          <div className="container" style={{ maxWidth: '960px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {[
                {
                  step: '01',
                  title: 'Clinical Medical Intake & Lab Baseline',
                  subtitle: 'We calibrate health safeguards before prescribing a single movement.',
                  points: [
                    'Medical condition review: Type 2 Diabetes, weeks postpartum, diastasis recti width, or arthritis status',
                    'Home environment audit: Sturdy chair, floor mat, and light resistance bands (zero commercial gym required)',
                    'Physician or OB-GYN clearance coordination and medical contraindication screening',
                  ],
                  icon: FileCheck2,
                },
                {
                  step: '02',
                  title: 'Bespoke Home Protocol & Glycemic Plan',
                  subtitle: 'Engineered specifically for your medical condition.',
                  points: [
                    '15-minute post-meal glucose-clearing walking pacing and chair-assisted strength routines',
                    'Diastasis recti core rehabilitation: 360 diaphragmatic breathing, pelvic floor rehab, zero crunches',
                    'Clinical low-glycemic dietary guidance supervised by Certified Diabetes Care & Education Specialists',
                  ],
                  icon: Dumbbell,
                },
                {
                  step: '03',
                  title: 'Gentle Home Execution & Daily Biometric Logging',
                  subtitle: 'Track your health response with immediate clinical feedback.',
                  points: [
                    'Log Fasting Blood Glucose (mg/dL) and Resting Blood Pressure directly into your portal',
                    'Borg RPE scale monitoring: keep exertion strictly in the comfortable, safe 3–5 zone without strain',
                    'Video form check submission for pelvic tilt, spinal posture, and joint tracking validation',
                  ],
                  icon: Video,
                },
                {
                  step: '04',
                  title: 'Clinical Consultations & Physician Reports',
                  subtitle: 'Continuous specialist oversight and shareable medical records.',
                  points: [
                    'Bi-weekly 1-on-1 telehealth consultations with licensed PTs or Diabetes Educators',
                    'Blood sugar and blood pressure trajectory graphs visualizing weekly glycemic stabilization',
                    'Exportable Monthly Clinical Summary to share directly with your primary care physician or OB-GYN',
                  ],
                  icon: TrendingUp,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '32px',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-card)',
                      padding: '40px',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                          {item.step}
                        </span>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--accent-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={20} color="var(--accent-primary)" />
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                        {item.subtitle}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {item.points.map((pt, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
                          <CheckCircle2 size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ color: 'var(--text-primary)' }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '64px' }}>
              <Link href="/programs" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                <span>Select a Fitness Program</span>
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
