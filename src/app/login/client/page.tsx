'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore, SEED_PROFILES } from '@/lib/store';
import {
  Dumbbell,
  Lock,
  Mail,
  ArrowRight,
  User,
  Gift,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  KeyRound,
} from 'lucide-react';

function ClientAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerClient, loginWithRole, addToast } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('alex.carter@domainfit.io');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Auto-fill referral code from URL query param ?ref=CODE
  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setMode('signup');
      addToast(`Referral code "${ref.toUpperCase()}" applied! Complete signup to receive welcome FitCoins.`, 'info');
    }
  }, [searchParams, addToast]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole(email, password, 'client');
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed');
      } else {
        router.push('/dashboard');
      }
    }, 500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = registerClient(fullName, email, password, referralCode);
      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed');
      } else {
        router.push('/dashboard');
      }
    }, 600);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessNotice(`Password recovery link and instructions sent to ${email}. Check your inbox!`);
      addToast(`Password recovery sent to ${email}`, 'success');
    }, 600);
  };

  const handleQuickClientLogin = (emailPreset: string) => {
    setEmail(emailPreset);
    setPassword('demo-password');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole(emailPreset, 'demo-password', 'client');
      if (res.success) {
        router.push('/dashboard');
      }
    }, 400);
  };

  return (
    <div
      className="card"
      style={{
        width: '100%',
        maxWidth: '480px',
        padding: '36px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 20px rgba(183, 243, 74, 0.35)',
          }}
        >
          <Dumbbell size={28} color="#0B0D0C" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '6px', fontWeight: 800 }}>
          Client Fitness Portal
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {mode === 'signin' && 'Sign in to access your workouts, FitCoin wallet & coaching calendar.'}
          {mode === 'signup' && 'Create your client account to earn welcome FitCoins & start training.'}
          {mode === 'forgot' && 'Reset your password with verified email confirmation.'}
        </p>
      </div>

      {/* Tabs */}
      {mode !== 'forgot' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: mode === 'signin' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'signin' ? '#0B0D0C' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: mode === 'signup' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'signup' ? '#0B0D0C' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            New Client Sign Up
          </button>
        </div>
      )}

      {/* Error alert */}
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

      {/* Success alert */}
      {successNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(52, 211, 153, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34D399',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} shrink-0 />
          <span>{successNotice}</span>
        </div>
      )}

      {/* SIGN IN FORM */}
      {mode === 'signin' && (
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Client Email Address
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
                placeholder="alex.carter@domainfit.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Password</label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
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
            style={{ marginTop: '8px', padding: '14px', width: '100%' }}
          >
            <span>{loading ? 'Authenticating Client...' : 'Sign In to Client Portal'}</span>
            <ArrowRight size={16} />
          </button>

          {/* Quick Demo Evaluation Buttons */}
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Instant Client Accounts for Evaluation
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickClientLogin('alex.carter@domainfit.io')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'space-between' }}
              >
                <span>Alex Carter (Active Client • 145 FitCoins)</span>
                <span style={{ color: 'var(--accent-primary)' }}>1-Click Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickClientLogin('anita.sharma@domainfit.io')}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'space-between' }}
              >
                <span>Anita Sharma (Referred Client • 40 FitCoins)</span>
                <span style={{ color: 'var(--accent-primary)' }}>1-Click Login</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SIGN UP FORM */}
      {mode === 'signup' && (
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                required
                style={{ paddingLeft: '40px' }}
                placeholder="Marcus Williams"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Email Address
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
                placeholder="marcus.w@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Create Password
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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gift size={14} color="var(--accent-primary)" />
                Referral Code (Optional)
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)' }}>+25 Welcome FitCoins</span>
            </div>
            <input
              type="text"
              placeholder="e.g. ALEX2026"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                borderColor: referralCode ? 'var(--accent-primary)' : 'var(--border-color)',
              }}
            />
            {referralCode && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '4px', display: 'block' }}>
                ✓ Referral code applied! Both you and your referrer receive rewards.
              </span>
            )}
          </div>

          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Role Notice:</span> Public registrations are securely assigned the <strong>Client</strong> role by default. Trainer and Admin accounts are provisioned via verified credentials.
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '8px', padding: '14px', width: '100%' }}
          >
            <span>{loading ? 'Creating Client Account...' : 'Complete Registration & Join'}</span>
            <Sparkles size={16} />
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD FORM */}
      {mode === 'forgot' && (
        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Registered Email Address
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
                placeholder="alex.carter@domainfit.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '14px', width: '100%' }}
          >
            <span>{loading ? 'Sending Recovery Link...' : 'Send Password Reset Link'}</span>
            <KeyRound size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMode('signin')}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            Back to Sign In
          </button>
        </form>
      )}

      {/* Footer Navigation */}
      <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          Are you a certified trainer?{' '}
          <Link href="/login/trainer" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Trainer Portal &rarr;
          </Link>
        </div>
        <div>
          Platform administrator?{' '}
          <Link href="/login/admin" style={{ color: '#60A5FA', fontWeight: 600 }}>
            Admin Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ClientLoginPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <Suspense fallback={<div style={{ color: '#fff' }}>Loading client portal...</div>}>
          <ClientAuthForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
