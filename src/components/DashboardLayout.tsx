'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  Dumbbell,
  LayoutDashboard,
  Calendar,
  Apple,
  TrendingUp,
  MessageSquare,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  CreditCard,
  FileText,
  Shield,
  Layers,
  CheckCircle,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentUser, 
    switchRole, 
    notifications, 
    markNotificationRead,
    clientStreak 
  } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Role-based Nav items
  const clientNav = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Gentle Home Workouts', href: '/dashboard/workouts', icon: Dumbbell },
    { name: 'Clinical Nutrition & Water', href: '/dashboard/nutrition', icon: Apple },
    { name: 'Vitals, Glucose & Biometrics', href: '/dashboard/progress', icon: TrendingUp },
    { name: 'Clinical Consultations', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Messages & Specialist Chat', href: '/dashboard/messages', icon: MessageSquare },
  ];

  const trainerNav = [
    { name: 'Clinical Overview', href: '/trainer', icon: LayoutDashboard },
    { name: 'Patient / Client Roster', href: '/trainer/clients', icon: Users },
    { name: 'Movement Protocol Builder', href: '/trainer/workouts', icon: Dumbbell },
    { name: 'Glycemic & Nutrition Builder', href: '/trainer/nutrition', icon: Apple },
    { name: 'Telehealth Schedule', href: '/trainer/calendar', icon: Calendar },
    { name: 'Patient Messages', href: '/trainer/messages', icon: MessageSquare },
  ];

  const adminNav = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Fitness Programs', href: '/admin/programs', icon: Layers },
    { name: 'Memberships & Pricing', href: '/admin/memberships', icon: CreditCard },
    { name: 'All Appointments', href: '/admin/bookings', icon: Calendar },
    { name: 'Payments & Revenue', href: '/admin/payments', icon: TrendingUp },
    { name: 'CMS & Content', href: '/admin/content', icon: FileText },
  ];

  const currentNav = 
    currentUser.role === 'admin' 
      ? adminNav 
      : currentUser.role === 'trainer' 
      ? trainerNav 
      : clientNav;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* SIDEBAR - DESKTOP */}
      <aside
        style={{
          width: '280px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.3s ease',
        }}
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand */}
        <div
          style={{
            height: '76px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                DOMAIN<span style={{ color: 'var(--accent-primary)' }}>FIT</span>
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="mobile-close-btn"
            style={{ display: 'none', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Active Role Indicator */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  boxShadow: '0 0 8px var(--accent-primary)',
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {currentUser.role} Portal
              </span>
            </div>
            {currentUser.role === 'client' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 700 }}>
                <Flame size={14} fill="var(--accent-primary)" />
                <span>{clientStreak}d Streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(183, 243, 74, 0.3)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Role Switcher Demo Bar + Public Link */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Switch Dashboard Persona:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {(['client', 'trainer', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    if (r === 'client') router.push('/dashboard');
                    else if (r === 'trainer') router.push('/trainer');
                    else if (r === 'admin') router.push('/admin');
                  }}
                  style={{
                    padding: '6px 4px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    backgroundColor: currentUser.role === r ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: currentUser.role === r ? '#0B0D0C' : 'var(--text-muted)',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span>Public Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="dashboard-content-wrapper">
        {/* TOPBAR */}
        <header
          style={{
            height: '76px',
            backgroundColor: 'rgba(11, 13, 12, 0.92)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 90,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="mobile-hamburger-btn"
              style={{
                display: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>{title}</h1>
              {subtitle && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
            </div>
          </div>

          {/* Right Topbar Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  position: 'relative',
                }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#0B0D0C',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '320px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
                    padding: '16px',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Activity Alerts</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>{unreadCount} new</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: n.is_read ? 'transparent' : 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: n.is_read ? 'var(--text-secondary)' : '#fff' }}>
                          {n.title}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--accent-primary)',
                }}
              >
                <img
                  src={currentUser.avatar_url || '/images/domainfit/hero.jpg'}
                  alt={currentUser.full_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                  {currentUser.full_name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', textTransform: 'capitalize' }}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main style={{ flex: 1, padding: '32px' }}>{children}</main>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-content-wrapper {
            margin-left: 0 !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
