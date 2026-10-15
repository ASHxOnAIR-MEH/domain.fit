'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore } from '@/lib/store';
import { Star, ShieldCheck, Calendar, ArrowRight, Award, Dumbbell } from 'lucide-react';

export default function TrainersPage() {
  const { trainers } = useStore();

  const trainerDetails = [
    {
      id: 'trainer-1',
      name: 'Dr. Marcus Vance, PT, DPT, ACSM-CEP',
      title: 'Director of Clinical Exercise Physiology & Orthopedic Rehabilitation',
      image: '/images/domainfit/trainer-marcus.jpg',
      bio: 'Doctor of Physical Therapy and ACSM-Certified Clinical Exercise Physiologist specializing in safe home conditioning for patients with chronic medical conditions, arthritis, diabetic neuropathy, and joint limitations unable to attend commercial gyms.',
      credentials: ['Doctor of Physical Therapy (DPT)', 'ACSM-CEP (Certified Clinical Exercise Physiologist)', 'Board-Certified Orthopedic Specialist (OCS)'],
      specialties: ['Chronic Joint Disease & Osteoarthritis', 'Diabetic Neuropathy Movement Safeguards', 'Non-Gym Chair & Band Regressions', 'Blood Pressure Monitored Exercise'],
      rating: 4.97,
      clients: 28,
      philosophy: 'Movement is medicine when calibrated with clinical precision. For patients with medical conditions, the right gentle home exercises restore independence and vitality safely.',
    },
    {
      id: 'trainer-2',
      name: 'Elena Rostova, PCES, PRPC',
      title: 'Lead Pre/Postnatal Corrective Exercise Specialist & Pelvic Floor Educator',
      image: '/images/domainfit/trainer-elena.jpg',
      bio: 'Specialist in postpartum maternal rehabilitation, diastasis recti closure, pelvic organ prolapse management, and trimester-specific prenatal fitness. Helps mothers safely rebuild their core and pelvic stability from the privacy and comfort of home.',
      credentials: ['Postnatal Corrective Exercise Specialist (PCES)', 'Pelvic Floor Rehabilitation Educator (PRPC)', 'Certified Pregnancy & Postpartum Athleticism Coach'],
      specialties: ['Diastasis Recti Recovery', 'Pelvic Floor & 360 Diaphragmatic Breathwork', 'C-Section Recovery & Scar Mobility', 'Prenatal Trimester-Safe Movement'],
      rating: 4.99,
      clients: 24,
      philosophy: 'Postpartum recovery is not about bouncing back; it is about rebuilding functional stability from within. Every mother deserves safe, evidence-based guidance in her own living room.',
    },
    {
      id: 'trainer-3',
      name: 'David Kim, MS, RD, CDCES',
      title: 'Director of Medical Nutrition Therapy & Diabetes Education',
      image: '/images/domainfit/trainer-david.jpg',
      bio: 'Registered Dietitian and Certified Diabetes Care and Education Specialist (CDCES). Dedicated to helping clients with Type 2 Diabetes, Prediabetes, gestational diabetes, and metabolic syndrome achieve normal blood glucose through clinical nutrition and gentle post-meal movement.',
      credentials: ['Registered Dietitian (RD/RDN)', 'Certified Diabetes Care and Education Specialist (CDCES)', 'M.S. Clinical Nutrition & Metabolic Biology'],
      specialties: ['Type 2 Diabetes Glycemic Stabilization', 'Post-Meal Glucose-Clearing Pacing', 'Anti-Inflammatory Nutrition', 'Gestational & Postpartum Metabolic Support'],
      rating: 4.95,
      clients: 26,
      philosophy: 'Controlling blood sugar does not require chronic restriction. By synchronizing gentle muscle activation with smart glycemic sequencing, we normalize metabolic health sustainably.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Header */}
        <section style={{ padding: '80px 0 56px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Clinical Faculty & Specialists</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '16px' }}>
              Meet the DomainFit Medical Faculty
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Licensed Physical Therapists, Pre/Postnatal Corrective Specialists, and Certified Diabetes Educators providing evidence-based care in the safety of your home.
            </p>
          </div>
        </section>

        {/* Trainers Directory */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {trainerDetails.map((t) => (
                <div
                  key={t.id}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  {/* Portrait Column */}
                  <div style={{ position: 'relative', minHeight: '400px' }}>
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 50%, rgba(27, 33, 29, 0.95) 100%)',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                        <Star size={16} fill="var(--accent-primary)" />
                        <span style={{ fontWeight: 700 }}>{t.rating} Verified Rating</span>
                        <span style={{ color: 'var(--text-muted)' }}>• {t.clients} Active Clients</span>
                      </div>
                      <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{t.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.title}</p>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Background & Philosophy</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                        {t.bio}
                      </p>

                      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)', marginBottom: '24px' }}>
                        <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          "{t.philosophy}"
                        </p>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Verified Credentials & Certifications
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {t.credentials.map((cred, cIdx) => (
                            <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                              <ShieldCheck size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                              <span>{cred}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Primary Focus Areas
                        </h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {t.specialties.map((spec, sIdx) => (
                            <span key={sIdx} className="badge badge-gray">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
                      <Link href="/dashboard/bookings" className="btn-primary btn-sm">
                        <Calendar size={16} />
                        <span>Book 1-on-1 Session</span>
                      </Link>
                      <Link href="/programs" className="btn-secondary btn-sm">
                        <span>View Coached Programs</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
