'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { Send, User } from 'lucide-react';

export default function TrainerMessagesPage() {
  const { messages, sendMessage, currentUser } = useStore();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage('user-client-1', inputText.trim());
    setInputText('');
  };

  return (
    <DashboardLayout
      title="Athlete Communication Hub"
      subtitle="Direct coach messaging with assigned client Alex Carter."
    >
      <div
        className="card"
        style={{
          padding: 0,
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 220px)',
          minHeight: '520px',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-primary)' }}>
              <img
                src="/images/domainfit/hero.jpg"
                alt="Alex Carter"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Alex Carter</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)' }}>Active Athlete • Hypertrophy Track</span>
            </div>
          </div>
          <span className="badge badge-lime">Direct Coach Channel</span>
        </div>

        <div
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: isMe ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: isMe ? '#0B0D0C' : 'var(--text-primary)',
                    fontSize: '0.92rem',
                    border: isMe ? 'none' : '1px solid var(--border-color)',
                  }}
                >
                  {msg.content}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSend}
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '12px',
          }}
        >
          <input
            type="text"
            placeholder="Type directive response to Alex..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, backgroundColor: 'var(--bg-card)' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px 20px', gap: '8px' }}>
            <span>Send</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
