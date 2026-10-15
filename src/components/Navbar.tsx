'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Dumbbell, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, switchRole } = useStore();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Programs', href: '/programs' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Stories', href: '/stories' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  const getDashboardHref = () => {
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'trainer') return '/trainer';
    return '/dashboard';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(11, 13, 12, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(183, 243, 74, 0.4)',
            }}
          >
            <Dumbbell size={22} color="#0B0D0C" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
              DOMAIN<span style={{ color: 'var(--accent-primary)' }}>FIT</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '28px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  position: 'relative',
                  padding: '6px 0',
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Role Switcher + Dashboard Link */}
        <div style={{ display: 'none', alignItems: 'center', gap: '14px' }} className="desktop-actions">
          {/* Interactive Role Switcher for instant testing of all 3 portals */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '3px',
              fontSize: '0.78rem',
            }}
            title="Switch demo persona to test client, trainer, or admin areas"
          >
            {(['client', 'trainer', 'admin'] as const).map((r) => {
              const active = currentUser.role === r;
              return (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: active ? 'var(--accent-primary)' : 'transparent',
                    color: active ? '#0B0D0C' : 'var(--text-muted)',
                    fontWeight: active ? 700 : 500,
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <Link href={getDashboardHref()} className="btn-secondary btn-sm" style={{ padding: '8px 16px', gap: '6px' }}>
            {currentUser.role === 'client' && <Activity size={15} color="var(--accent-primary)" />}
            {currentUser.role === 'trainer' && <User size={15} color="var(--accent-primary)" />}
            {currentUser.role === 'admin' && <ShieldCheck size={15} color="var(--accent-primary)" />}
            <span>Portal</span>
          </Link>

          <Link href="/programs" className="btn-primary btn-sm">
            <span>Get Started</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: '#fff',
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: pathname === link.href ? 'var(--accent-primary)' : 'var(--text-primary)',
                padding: '8px 0',
              }}
            >
              {link.name}
            </Link>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Switch Demo Persona:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['client', 'trainer', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: currentUser.role === r ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: currentUser.role === r ? '#0B0D0C' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Link
              href={getDashboardHref()}
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Go to Dashboard
            </Link>
            <Link
              href="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
