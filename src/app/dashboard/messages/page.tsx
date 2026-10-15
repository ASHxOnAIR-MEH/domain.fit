'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/lib/store';
import { Send, User, Check, CheckCheck, Clock } from 'lucide-react';

export default function ClientMessagesPage() {
  const { messages, sendMessage, currentUser } = useStore();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage('user-trainer-1', inputText.trim());
    setInputText('');
  };

  return (
    <DashboardLayout
      title="Direct Coach Messaging"
      subtitle="Encrypted 1-on-1 communication channel with Head Strength Coach Marcus Vance."
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
        {/* Chat Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--accent-primary)',
              }}
            >
              <img
                src="/images/domainfit/trainer-marcus.jpg"
                alt="Marcus Vance"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '2px' }}>Marcus Vance, CSCS</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Online • Typical reply under 2 hrs</span>
              </div>
            </div>
          </div>
          <span className="badge badge-lime">VIP Direct Access</span>
        </div>

        {/* Message Thread */}
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
                    lineHeight: 1.5,
                    border: isMe ? 'none' : '1px solid var(--border-color)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {msg.content}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Type your message or exercise inquiry for Marcus..."
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
