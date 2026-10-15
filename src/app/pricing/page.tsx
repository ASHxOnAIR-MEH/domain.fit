'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore } from '@/lib/store';
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PricingPage() {
  const router = useRouter();
  const { createPayment } = useStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const tiers = [
    {
      name: 'Clinical Home Track',
      desc: 'Self-paced medical fitness syllabi with daily biometric logging and doctor export reports.',
      monthlyPrice: 2999,
      annualPrice: 2399,
      features: [
        'Full access to all 6 Diabetes, Postpartum, Prenatal & Joint tracks',
        'Daily Fasting Blood Glucose (mg/dL) & Blood Pressure loggers',
        'Post-meal glucose-clearing walking pacing & reminders',
        'Diastasis recti safe core & pelvic floor video demonstrations',
        'Chair-supported & resistance band home exercise variations',
        'Printable Monthly Clinical Progress Report for your physician',
      ],
      notIncluded: [
        'Dedicated 1-on-1 telehealth video appointments',
        'Personalized form check video review by Clinical Specialist',
        'Bi-weekly custom glycemic or pelvic plan calibrations',
        'Direct specialist messaging portal',
      ],
      popular: false,
      cta: 'Choose Clinical Track',
    },
    {
      name: 'Coached Medical Care',
      desc: 'Our flagship clinical home coaching experience with assigned faculty oversight.',
      monthlyPrice: 4999,
      annualPrice: 3999,
      features: [
        'Everything in Clinical Home Track',
        'Assigned Clinical Specialist (Doctor of PT, CDCES, or PCES)',
        'Bi-weekly 45-minute 1-on-1 video clinical consultations',
        'Continuous blood glucose & blood pressure trend oversight',
        'Diastasis recti separation measurement & pelvic floor reviews',
        'Direct priority messaging inside the clinical portal',
        'Physician referral coordination & monthly lab trend sync',
      ],
      notIncluded: [
        '24/7 WhatsApp emergency clinical support line',
      ],
      popular: true,
      cta: 'Start Coached Medical Care',
    },
    {
      name: 'VIP Clinical Concierge',
      desc: 'All-inclusive clinical health stewardship for complex medical recovery at home.',
      monthlyPrice: 14999,
      annualPrice: 11999,
      features: [
        'Everything in Coached Medical Care',
        'Weekly 1-on-1 Zoom clinical consultations & movement checks',
        'Custom low-glycemic or postpartum lactation meal sequencing',
        'Daily meal log oversight & immediate glycemic micro-feedback',
        'Direct priority WhatsApp access with Clinical Director',
        'Quarterly HbA1c, metabolic panel & biomarker trajectory review',
        'Direct liaison with your Primary Care Physician or Obstetrician',
      ],
      notIncluded: [],
      popular: false,
      cta: 'Apply for VIP Concierge',
    },
  ];

  const handleCheckout = async (tierName: string, price: number) => {
    setIsProcessing(true);
    try {
      const res = await createPayment(price, `${tierName} (${billingCycle})`, 'membership');
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B7F34A', '#FFFFFF', '#34D399'],
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Header */}
        <section style={{ padding: '80px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Clinical Membership Plans</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '16px' }}>
              Specialized Care. Safe at Home.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Evidence-based exercise guidance and nutritional monitoring for clients managing diabetes, postpartum diastasis recti, pregnancy, or medical conditions unable to attend commercial gyms.
            </p>

            {/* Billing Toggle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '4px',
                gap: '4px',
              }}
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: billingCycle === 'monthly' ? 'var(--accent-primary)' : 'transparent',
                  color: billingCycle === 'monthly' ? '#0B0D0C' : 'var(--text-secondary)',
                }}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: billingCycle === 'annual' ? 'var(--accent-primary)' : 'transparent',
                  color: billingCycle === 'annual' ? '#0B0D0C' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Annual Billing</span>
                <span className="badge badge-lime" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Tiers Grid */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'stretch',
              }}
            >
              {tiers.map((tier) => {
                const currentPrice = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
                return (
                  <div
                    key={tier.name}
                    className="card"
                    style={{
                      padding: '40px 32px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: tier.popular ? 'var(--bg-elevated)' : 'var(--bg-card)',
                      border: tier.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      position: 'relative',
                    }}
                  >
                    {tier.popular && (
                      <div style={{ position: 'absolute', top: '-14px', right: '32px' }}>
                        <span className="badge badge-lime" style={{ backgroundColor: 'var(--accent-primary)', color: '#0B0D0C', fontWeight: 800 }}>
                          RECOMMENDED FOR SERIOUS ATHLETES
                        </span>
                      </div>
                    )}

                    <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>{tier.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
                      {tier.desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '2.75rem', fontWeight: 800, color: tier.popular ? 'var(--accent-primary)' : '#fff' }}>
                        ₹{currentPrice.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>/ month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '24px', display: 'block' }}>
                        Billed annually (₹{(currentPrice * 12).toLocaleString()} / yr)
                      </span>
                    )}

                    <button
                      onClick={() => handleCheckout(tier.name, currentPrice)}
                      className={tier.popular ? 'btn-primary' : 'btn-secondary'}
                      disabled={isProcessing}
                      style={{ width: '100%', padding: '14px', marginBottom: '32px' }}
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight size={16} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Included Capabilities:
                      </span>
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem' }}>
                          <CheckCircle2 size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                        </div>
                      ))}

                      {tier.notIncluded.length > 0 && (
                        <>
                          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '8px 0' }} />
                          {tier.notIncluded.map((notFeat, nIdx) => (
                            <div key={nIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                              <XCircle size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{notFeat}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Satisfaction Guarantee */}
            <div
              style={{
                marginTop: '64px',
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={28} color="var(--accent-primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>14-Day Scientific Coaching Guarantee</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px' }}>
                    If you complete your first 2 weeks of assigned workouts and feel our coaching methodology doesn't fit your lifestyle, request a full refund with zero friction.
                  </p>
                </div>
              </div>

              <Link href="/contact" className="btn-secondary btn-sm">
                <span>Contact Coaching Support</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
