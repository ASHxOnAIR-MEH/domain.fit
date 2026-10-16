'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore, SEED_PROFILES } from '@/lib/store';
import {
  Dumbbell,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Coins,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, allProfiles, loginWithRole, addToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSmartLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole(email, password);
      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Authentication failed');
      } else {
        if (res.user.role === 'admin') router.push('/admin');
        else if (res.user.role === 'trainer') router.push('/trainer');
        else router.push('/dashboard');
      }
    }, 500);
  };

  const handleQuickDemoLogin = (role: 'client' | 'trainer' | 'admin') => {
    const user = allProfiles.find((p) => p.role === role) || SEED_PROFILES.find((p) => p.role === role) || SEED_PROFILES[0];
    setCurrentUser(user);
    addToast(`Quick logged in as ${user.full_name} (${role.toUpperCase()})`, 'success');
    if (role === 'admin') router.push('/admin');
    else if (role === 'trainer') router.push('/trainer');
    else router.push('/dashboard');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px', textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(183, 243, 74, 0.1)',
              border: '1px solid rgba(183, 243, 74, 0.3)',
              color: 'var(--accent-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            <Coins size={16} />
            <span>Role-Based Authentication Portals</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 850, color: '#fff', letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Choose Your DomainFit Gateway
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Select your specialized portal below or log in with verified credentials to enter your role-specific dashboard.
          </p>
        </div>

        {/* 3 Dedicated Portal Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '960px',
            marginBottom: '48px',
          }}
        >
          {/* CLIENT PORTAL CARD */}
          <Link
            href="/login/client"
            className="card"
            style={{
              padding: '32px 28px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--accent-primary)' }} />
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(183, 243, 74, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Dumbbell size={24} color="var(--accent-primary)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>Client Portal</h3>
                <span className="badge badge-lime" style={{ fontSize: '0.68rem' }}>Public Sign Up</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Access gentle workouts, track glycemic and BP vitals, earn FitCoins, and share your referral link.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <span>Enter Client Portal</span>
              <ChevronRight size={18} />
            </div>
          </Link>

          {/* TRAINER PORTAL CARD */}
          <Link
            href="/login/trainer"
            className="card"
            style={{
              padding: '32px 28px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#60A5FA' }} />
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(96, 165, 250, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Stethoscope size={24} color="#60A5FA" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>Trainer Portal</h3>
                <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '10px', backgroundColor: 'rgba(96, 165, 250, 0.2)', color: '#60A5FA', fontWeight: 700 }}>
                  Faculty Only
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Manage assigned patient rosters, review completed workouts, and award session FitCoins.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                color: '#60A5FA',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <span>Faculty Login</span>
              <ChevronRight size={18} />
            </div>
          </Link>

          {/* ADMIN PORTAL CARD */}
          <Link
            href="/login/admin"
            className="card"
            style={{
              padding: '32px 28px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#FBBF24' }} />
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <ShieldAlert size={24} color="#FBBF24" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>Admin Portal</h3>
                <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', fontWeight: 700 }}>
                  Restricted
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Executive governance, FitCoin reward rules, full transaction ledger, and auditable reversals.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                color: '#FBBF24',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <span>Executive Console</span>
              <ChevronRight size={18} />
            </div>
          </Link>
        </div>

        {/* Quick Instant Evaluation Bar */}
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '640px',
            padding: '24px 28px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
            <UserCheck size={18} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.84rem', color: '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Instant 1-Click Evaluation Logins
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('client')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.82rem', padding: '10px 8px', borderColor: 'var(--accent-primary)' }}
            >
              Client (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('trainer')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.82rem', padding: '10px 8px', borderColor: '#60A5FA' }}
            >
              Trainer (Dr. Marcus)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.82rem', padding: '10px 8px', borderColor: '#FBBF24' }}
            >
              Admin (Elena)
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
