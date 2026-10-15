'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEED_BLOG_POSTS } from '@/lib/store';
import { Clock, User, ArrowRight, Search, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');

  const allTags = ['All', 'Hypertrophy', 'Strength', 'Nutrition', 'Mobility', 'Science'];

  const filteredPosts = SEED_BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === 'All' || post.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Header */}
        <section style={{ padding: '80px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>DomainFit Insights</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '16px' }}>
              Sports Science & Programming
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Evidence-based breakdowns on progressive overload, nutrient timing, and biomechanical recovery written by our coaching faculty.
            </p>

            {/* Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '32px' }}>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: activeTag === tag ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: activeTag === tag ? '#0B0D0C' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <span className="badge badge-gray" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        {post.read_time}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {post.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="badge badge-lime" style={{ fontSize: '0.7rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                      {post.excerpt}
                    </p>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', display: 'block' }}>{post.author}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.published_at}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>Read</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
