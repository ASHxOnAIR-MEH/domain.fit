'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore, SEED_PROFILES } from '@/lib/store';
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, addToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Find matching user or fallback to Alex Carter
      const matched = SEED_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase()) || SEED_PROFILES[0];
      setCurrentUser(matched);
      addToast(`Logged in as ${matched.full_name} (${matched.role.toUpperCase()})`, 'success');

      if (matched.role === 'admin') router.push('/admin');
      else if (matched.role === 'trainer') router.push('/trainer');
      else router.push('/dashboard');
    }, 600);
  };

  const handleQuickDemoLogin = (role: 'client' | 'trainer' | 'admin') => {
    const user = SEED_PROFILES.find((p) => p.role === role) || SEED_PROFILES[0];
    setCurrentUser(user);
    addToast(`Quick logged in as ${user.full_name} (${role.toUpperCase()})`, 'success');
    if (role === 'admin') router.push('/admin');
    else if (role === 'trainer') router.push('/trainer');
    else router.push('/dashboard');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '40px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Dumbbell size={24} color="#0B0D0C" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '6px' }}>Access Your Domain</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Sign in to your client dashboard or coaching faculty portal.
            </p>
          </div>

          {/* Quick 1-Click Demo Login Presets */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <UserCheck size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Instant Evaluation Demo Logins
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '8px 4px' }}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('trainer')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '8px 4px' }}
              >
                Trainer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '8px 4px' }}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex.carter@domainfit.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            New to DomainFit?{' '}
            <Link href="/programs" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              Explore Programs & Enroll
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
