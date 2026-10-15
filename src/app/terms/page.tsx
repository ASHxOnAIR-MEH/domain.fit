'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '96px' }}>
        <section style={{ padding: '80px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Legal Terms</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '16px' }}>Terms of Service</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Please review the terms governing use of the DomainFit platform and coaching services.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>1. Scope of Coaching Services</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  DomainFit provides online fitness instruction, resistance training periodization, and generalized nutritional guidance. Our coaches are certified strength and conditioning specialists and sports dietitians. Coaching does not constitute medical advice or physical therapy rehabilitation for acute medical pathologies.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>2. Client Physical Responsibility</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Clients affirm that they are medically cleared to engage in physical exercise. You must inform your assigned coach of any pre-existing musculoskeletal conditions or medical restrictions during your onboarding questionnaire.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>3. Subscription & Billing Terms</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Membership fees are billed on a recurring monthly or annual basis via our secure payment processors. You may cancel subscriptions at any time via your account settings.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
