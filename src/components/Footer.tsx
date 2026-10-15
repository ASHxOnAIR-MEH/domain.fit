'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Shield, Award, Heart, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '64px',
        paddingBottom: '32px',
        marginTop: '80px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Dumbbell size={20} color="#0B0D0C" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                DOMAIN<span style={{ color: 'var(--accent-primary)' }}>FIT</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              The unified online fitness coaching and business management ecosystem. Designed for disciplined progression, science-grounded programming, and real lifestyle results.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
              <Shield size={16} />
              <span>Evidence-based coaching architecture</span>
            </div>
          </div>

          {/* Programs Col */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', marginBottom: '18px' }}>
              Fitness Programs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/programs/strength-foundation" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Hypertrophy & Strength
                </Link>
              </li>
              <li>
                <Link href="/programs/metabolic-fat-loss" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Metabolic Fat Loss
                </Link>
              </li>
              <li>
                <Link href="/programs/high-velocity-conditioning" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Endurance & Conditioning
                </Link>
              </li>
              <li>
                <Link href="/programs/mobility-posture-longevity" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Mobility & Joint Prehab
                </Link>
              </li>
              <li>
                <Link href="/programs/vip-personal-coaching" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  1-on-1 VIP Personal Coaching
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Col */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', marginBottom: '18px' }}>
              Platform & Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trainer" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Trainer Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Admin Suite
                </Link>
              </li>
              <li>
                <Link href="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Membership Tiers
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  How DomainFit Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies Col */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', marginBottom: '18px' }}>
              Trust & Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/terms" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/cancellation" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
          }}
        >
          <div>
            © {new Date().getFullYear()} DomainFit Platform Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>No exaggerated claims. No medical prescriptions. Sustainable lifestyle coaching.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
