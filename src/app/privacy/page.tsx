'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '96px' }}>
        <section style={{ padding: '80px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Data Privacy</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '16px' }}>Privacy Policy & Security</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              How DomainFit encrypts, protects, and handles your personal fitness and progress data.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>1. Encrypted Storage of Biometric Media</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Progress photographs and bodyweight records are stored with private cryptographic access controls. Only authenticated coaching faculty assigned directly to your profile are authorized to view biometric images.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>2. Data Minimization & Retention</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  We collect only necessary information required to prescribe appropriate exercise volume and calorie targets: training history, height, body weight, joint restrictions, and dietary preferences.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>3. Third-Party Payment Processing</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Financial card information and UPI credentials are encrypted directly through certified PCI-DSS Level 1 compliant processors (such as Razorpay). DomainFit never stores raw card credentials or CVVs on application servers.
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
