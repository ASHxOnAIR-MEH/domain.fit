'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore, SEED_PROFILES } from '@/lib/store';
import {
  Stethoscope,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function TrainerLoginPage() {
  const router = useRouter();
  const { loginWithRole, addToast } = useStore();

  const [email, setEmail] = useState('marcus.vance@domainfit.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrainerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole(email, password, 'trainer');
      if (!res.success) {
        setErrorMessage(res.error || 'Trainer authentication failed.');
      } else {
        router.push('/trainer');
      }
    }, 500);
  };

  const handleQuickTrainerLogin = (emailPreset: string) => {
    setEmail(emailPreset);
    setPassword('demo-faculty');
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole(emailPreset, 'demo-faculty', 'trainer');
      if (res.success) {
        router.push('/trainer');
      } else {
        setErrorMessage(res.error || 'Authentication error');
      }
    }, 400);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '36px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Faculty Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(96, 165, 250, 0.15)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 0 20px rgba(96, 165, 250, 0.25)',
              }}
            >
              <Stethoscope size={28} color="#60A5FA" strokeWidth={2.2} />
            </div>
            <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60A5FA', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Clinical Faculty Access
            </div>
            <h2 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '6px', fontWeight: 800 }}>
              Trainer Portal
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Accredited physical therapists, dietitians, and clinical coaches sign in here to manage patient rosters and award session FitCoins.
            </p>
          </div>

          {/* Security alert if invalid role */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontSize: '0.85rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertCircle size={18} shrink-0 />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Faculty Selector */}
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <UserCheck size={16} color="#60A5FA" />
              <span style={{ fontSize: '0.74rem', color: '#60A5FA', textTransform: 'uppercase', fontWeight: 700 }}>
                Instant Faculty Credentials for Testing
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickTrainerLogin('marcus.vance@domainfit.io')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'space-between' }}
              >
                <span>Dr. Marcus Vance, PT, DPT (Orthopedic Lead)</span>
                <span style={{ color: '#60A5FA' }}>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickTrainerLogin('david.kim@domainfit.io')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'space-between' }}
              >
                <span>David Kim, RD, CDCES (Diabetes & Nutrition)</span>
                <span style={{ color: '#60A5FA' }}>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickTrainerLogin('elena.rostova@domainfit.io')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'space-between' }}
              >
                <span>Elena Rostova, PCES (Pre/Postnatal Lead)</span>
                <span style={{ color: '#60A5FA' }}>Sign In</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleTrainerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Faculty Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  required
                  style={{ paddingLeft: '40px' }}
                  placeholder="marcus.vance@domainfit.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Faculty Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  required
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '14px',
                backgroundColor: '#60A5FA',
                color: '#0B0D0C',
                fontWeight: 700,
              }}
            >
              <span>{loading ? 'Verifying Faculty Credentials...' : 'Sign In as Trainer'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Role Navigation Notice */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div>
              Looking for client workouts?{' '}
              <Link href="/login/client" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                Client Portal &rarr;
              </Link>
            </div>
            <div>
              Platform administrator?{' '}
              <Link href="/login/admin" style={{ color: '#FBBF24', fontWeight: 600 }}>
                Admin Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
