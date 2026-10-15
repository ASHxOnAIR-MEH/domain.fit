'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useStore } from '@/lib/store';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

export default function ContactPage() {
  const { addToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Coaching Programs Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Thank you! Your inquiry has been sent to our coaching concierge.', 'success');
      setFormData({ name: '', email: '', topic: 'Coaching Programs Inquiry', message: '' });
    }, 800);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '96px' }}>
        {/* Header */}
        <section style={{ padding: '80px 0 48px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
            <span className="badge badge-lime" style={{ marginBottom: '14px' }}>Support & Concierge</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '16px' }}>
              Connect with DomainFit
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Have questions regarding our coaching programs, customized programming, or billing? Our team is here to assist.
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', maxWidth: '1040px', margin: '0 auto' }}>
              {/* Form Column */}
              <div
                className="card"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '40px',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Send Us a Message</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
                  We usually respond within 12 business hours.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Ross"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option value="Coaching Programs Inquiry">Coaching Programs Inquiry</option>
                      <option value="1-on-1 VIP Personal Training">1-on-1 VIP Personal Training</option>
                      <option value="Membership & Billing Support">Membership & Billing Support</option>
                      <option value="Trainer Faculty Application">Trainer Faculty Application</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your fitness background and goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ marginTop: '8px', padding: '14px' }}
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send size={16} />
                  </button>
                </form>
              </div>

              {/* Info Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Direct Channels</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={18} color="var(--accent-primary)" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Concierge Email</span>
                        <p style={{ fontWeight: 600, color: '#fff' }}>coaching@domainfit.io</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} color="var(--accent-primary)" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Operating Hours</span>
                        <p style={{ fontWeight: 600, color: '#fff' }}>Mon – Sat, 7:00 AM – 8:00 PM IST</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={18} color="var(--accent-primary)" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HQ Operations</span>
                        <p style={{ fontWeight: 600, color: '#fff' }}>DomainFit Performance Lab, Bengaluru / Mumbai</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <ShieldCheck size={22} color="var(--accent-primary)" />
                    <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Client Privacy Guarantee</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    All client progress images, weight logs, and intake questionnaires are encrypted and accessible only to your assigned coach and platform administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
