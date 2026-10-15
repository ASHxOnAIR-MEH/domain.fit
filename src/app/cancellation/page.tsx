'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';

export default function CancellationPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        <section style={{ padding: '80px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Policies</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '16px' }}>
              Cancellation & Refund Policy
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Fair, transparent, and respectful terms for our athletes and coaching faculty.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>1. Monthly Membership Subscriptions</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  You may cancel your recurring DomainFit Pro membership at any time with a single click inside your account settings. Once cancelled, you will retain full access until the end of your current billing period. No future automatic renewals will occur.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>2. 14-Day Scientific Coaching Guarantee</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  For multi-week specialized programs (Hypertrophy Foundation, Metabolic Fat Loss, etc.), we offer a 14-day money-back guarantee. If you complete your onboarding, log your first 2 weeks of assigned workouts, and determine our programming does not meet your expectations, contact coaching@domainfit.io for a full refund.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>3. 1-on-1 Appointment Rescheduling</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Client consultations can be rescheduled or cancelled directly in the dashboard calendar up to 12 hours prior to the scheduled start time at no charge. Cancellations with less than 12 hours notice may forfeit the session credit out of respect for your coach's schedule.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>4. Medical & Injury Accommodations</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  If you experience an unforeseen medical circumstance or acute injury outside of training, we provide complimentary program pauses for up to 60 days upon request.
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
