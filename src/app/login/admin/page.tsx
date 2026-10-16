'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore } from '@/lib/store';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertCircle,
  KeyRound,
  FileText,
  Sliders,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithRole, addToast } = useStore();

  const [email, setEmail] = useState('admin@domainfit.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole(email, password, 'admin');
      if (!res.success) {
        setErrorMessage(res.error || 'Administrator authentication failed');
      } else {
        router.push('/admin');
      }
    }, 500);
  };

  const handleQuickAdminLogin = () => {
    setEmail('admin@domainfit.io');
    setPassword('admin-master');
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      const res = loginWithRole('admin@domainfit.io', 'admin-master', 'admin');
      if (res.success) {
        router.push('/admin');
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
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
              }}
            >
              <ShieldAlert size={28} color="#FBBF24" strokeWidth={2.2} />
            </div>
            <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#FBBF24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Restricted Executive Access
            </div>
            <h2 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '6px', fontWeight: 800 }}>
              Administrator Console
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Executive governance cockpit for FitCoin economy settings, ledger reversals, audit logs, and trainer account provisioning.
            </p>
          </div>

          {/* Strict Security Notice Banner */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: '20px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontWeight: 700, marginBottom: '2px' }}>
              <ShieldCheck size={16} />
              <span>Strict Security Provisioning</span>
            </div>
            Public registration for administrator accounts is prohibited by design. Privileged access requires pre-authorized cryptographic credentials.
          </div>

          {/* Error Alert */}
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

          {/* Quick Demo Admin Credentials */}
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <UserCheck size={16} color="#FBBF24" />
              <span style={{ fontSize: '0.74rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 700 }}>
                Instant Executive Credentials for Review
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.78rem', justifyContent: 'space-between' }}
            >
              <span>Elena Vance (Clinical Director & Executive Admin)</span>
              <span style={{ color: '#FBBF24' }}>1-Click Login</span>
            </button>
          </div>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Administrator Email
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
                  placeholder="admin@domainfit.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Master Passphrase
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
                backgroundColor: '#FBBF24',
                color: '#0B0D0C',
                fontWeight: 700,
              }}
            >
              <span>{loading ? 'Authenticating Executive...' : 'Sign In as Administrator'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Navigation to Other Portals */}
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
              Looking for client dashboard?{' '}
              <Link href="/login/client" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                Client Portal &rarr;
              </Link>
            </div>
            <div>
              Coaching faculty login?{' '}
              <Link href="/login/trainer" style={{ color: '#60A5FA', fontWeight: 600 }}>
                Trainer Portal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
