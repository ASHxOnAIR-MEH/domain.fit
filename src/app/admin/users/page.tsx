'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore, SEED_PROFILES } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { Users, Search, Plus, ShieldCheck, Mail, CheckCircle2, UserPlus } from 'lucide-react';

export default function AdminUsersPage() {
  const { addToast } = useStore();
  const [usersList, setUsersList] = useState<UserProfile[]>(SEED_PROFILES);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('trainer');

  const filteredUsers = usersList.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: newEmail,
      full_name: newName,
      role: newRole,
      avatar_url: '/images/domainfit/hero.jpg',
      created_at: new Date().toISOString(),
    };

    setUsersList((prev) => [newUser, ...prev]);
    addToast(`User ${newName} invited as ${newRole.toUpperCase()}!`, 'success');
    setModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <DashboardLayout
      title="User & Faculty Management"
      subtitle="Manage registered clients, coaching faculty, and administrator access privileges."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ gap: '6px' }}>
            <UserPlus size={16} />
            <span>Invite New Coach / Admin</span>
          </button>
        </div>

        {/* Users Table */}
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 24px' }}>User</th>
                  <th style={{ padding: '16px 24px' }}>Role</th>
                  <th style={{ padding: '16px 24px' }}>Status</th>
                  <th style={{ padding: '16px 24px' }}>Joined Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-primary)' }}>
                          <img
                            src={u.avatar_url || '/images/domainfit/hero.jpg'}
                            alt={u.full_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#fff' }}>{u.full_name}</p>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px' }}>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'trainer' ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                          color: u.role === 'admin' ? 'var(--status-error)' : u.role === 'trainer' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-gray" style={{ color: 'var(--status-success)' }}>
                        ACTIVE
                      </span>
                    </td>

                    <td style={{ padding: '16px 24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => addToast(`Permissions verified for ${u.full_name}`, 'info')}
                        className="btn-secondary btn-sm"
                      >
                        Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVITE MODAL */}
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '16px' }}>Invite Coach or Administrator</h3>
              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams, CSCS"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@domainfit.io"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Role Assignment
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                  >
                    <option value="trainer">Trainer (Coach)</option>
                    <option value="admin">Administrator</option>
                    <option value="client">Client (Athlete)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
