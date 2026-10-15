'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore, SEED_BLOG_POSTS } from '@/lib/store';
import { FileText, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminContentPage() {
  const { addToast } = useStore();
  const [posts, setPosts] = useState(SEED_BLOG_POSTS);

  return (
    <DashboardLayout
      title="Content Management & Sports Science CMS"
      subtitle="Manage published educational articles, coach insights, and website FAQ announcements."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Published Articles ({posts.length})</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Articles written by faculty coaches published to /blog</p>
          </div>
          <button onClick={() => addToast('Article draft initialized.', 'info')} className="btn-primary" style={{ gap: '6px' }}>
            <Plus size={16} />
            <span>Write New Article</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                padding: '24px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  {p.tags.map((t, idx) => (
                    <span key={idx} className="badge badge-lime" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>{p.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  By {p.author} • Published on {p.published_at} • {p.read_time}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => addToast(`Opened editor for "${p.title}"`, 'info')}
                  className="btn-secondary btn-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
