'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Program } from '@/lib/types';
import { useStore } from '@/lib/store';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Dumbbell,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnrollmentModalProps {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ program, isOpen, onClose }) => {
  const router = useRouter();
  const { createPayment, updateClientProfile } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [medicalCondition, setMedicalCondition] = useState<string>('Type 2 Diabetes / Prediabetes');
  const [doctorClearance, setDoctorClearance] = useState<string>('Cleared by Physician / OB-GYN');
  const [workoutDays, setWorkoutDays] = useState<number>(3);
  const [equipmentAccess, setEquipmentAccess] = useState<string>('Chair & Resistance Bands (Home Setup)');
  const [dietary, setDietary] = useState<string[]>(['Low Glycemic Index (Diabetes Support)']);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');

  if (!isOpen) return null;

  const handleDietaryToggle = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleCompletePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await createPayment(program.price, `${program.title} (${program.duration_weeks} Weeks)`, 'program');
      if (res.success) {
        setTransactionId(res.transactionId);
        updateClientProfile({
          fitness_level: 'Gentle / Rehabilitation',
          goal: medicalCondition,
          dietary_preferences: dietary,
          current_program_id: program.id,
          onboarding_completed: true,
          physician_clearance_status: doctorClearance === 'Cleared by Physician / OB-GYN' ? 'Cleared' : 'Under Review',
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B7F34A', '#FFFFFF', '#34D399'],
        });

        setStep(4);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-lime">Step {step} of 4</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clinical Intake & Enrollment</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{program.title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* STEP 1: Program Confirmation */}
          {step === 1 && (
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Confirm Clinical Track</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
                Review medical safeguards and home protocol deliverables before completing your intake questionnaire.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program Length</span>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{program.duration_weeks} Weeks</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Intensity / Safety</span>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{program.difficulty}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</span>
                    <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent-primary)' }}>
                      ₹{program.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Included Clinical Deliverables
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {program.included_services.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <Check size={16} color="var(--accent-primary)" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(2)} className="btn-primary">
                  <span>Continue to Medical Intake</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Clinical Intake Questionnaire */}
          {step === 2 && (
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Medical & Clinical Intake</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
                Our clinical exercise physiologists and diabetes specialists calibrate safe volume and safe regressions around your health condition.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Primary Medical Condition or Focus Area:
                  </label>
                  <select
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-secondary)', width: '100%', padding: '12px', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Type 2 Diabetes / Prediabetes">Type 2 Diabetes / Prediabetes (Glycemic Control)</option>
                    <option value="Postpartum Recovery & Diastasis Recti">Postpartum Recovery & Diastasis Recti (Core / Pelvic Rehab)</option>
                    <option value="Prenatal Safe Movement">Prenatal Safe Movement (2nd & 3rd Trimester Home Conditioning)</option>
                    <option value="Severe Osteoarthritis / Joint Limitations">Severe Osteoarthritis & Knee/Hip Joint Limitations</option>
                    <option value="Hypertension & Cardiovascular Pacing">Hypertension & Cardiac Pacing (Low-Intensity)</option>
                    <option value="Non-Gym General Medical Recovery">Non-Gym Medical Conditioning & Low-Impact Mobility</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Doctor / Obstetrician Clearance Status:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {[
                      'Cleared by Physician / OB-GYN',
                      'Awaiting Review / Need Doctor Packet',
                      'Under Ongoing Clinical Care'
                    ].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setDoctorClearance(status)}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${doctorClearance === status ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          backgroundColor: doctorClearance === status ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                          color: doctorClearance === status ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          textAlign: 'left',
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Target Gentle Sessions per Week:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[2, 3, 4, 5].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setWorkoutDays(days)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${workoutDays === days ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          backgroundColor: workoutDays === days ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                          color: workoutDays === days ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontWeight: 700,
                        }}
                      >
                        {days} Days / Wk
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Available Equipment at Home (Zero Gym Access Required):
                  </label>
                  <select
                    value={equipmentAccess}
                    onChange={(e) => setEquipmentAccess(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-secondary)', width: '100%', padding: '12px', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="Chair & Resistance Bands (Home Setup)">Sturdy Chair & Light Resistance Bands (Standard Home Protocol)</option>
                    <option value="Floor Mat & Chair Only">Floor Mat & Chair Only (Zero Equipment)</option>
                    <option value="Light Dumbbells (1-3kg) & Resistance Bands">Light Dumbbells (1-3kg) & Elastic Bands</option>
                    <option value="Walking Shoes & Household Step">Walking Shoes & Household Step / Mat</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Clinical Nutrition & Metabolic Support Needs:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      'Low Glycemic Index (Diabetes Support)',
                      'Postpartum Lactation & Tissue Repair',
                      'Gestational Blood Sugar Balance',
                      'Anti-Inflammatory Joint Support',
                      'Heart Healthy / Low Sodium',
                      'High Soluble Fiber'
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleDietaryToggle(item)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          border: `1px solid ${dietary.includes(item) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          backgroundColor: dietary.includes(item) ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                          color: dietary.includes(item) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {item} {dietary.includes(item) ? '✓' : '+'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} className="btn-secondary">
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button onClick={() => setStep(3)} className="btn-primary">
                  <span>Proceed to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Razorpay Test Checkout */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <CreditCard size={24} color="var(--accent-primary)" />
                <h4 style={{ fontSize: '1.25rem' }}>Secure Checkout & Enrolment</h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                Test mode enabled. Seamless payment processing via Razorpay test simulator.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Item:</span>
                  <span style={{ fontWeight: 600 }}>{program.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
                  <span>{program.duration_weeks} Weeks Full Coaching</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Billing Currency:</span>
                  <span>INR (₹)</span>
                </div>
                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Amount:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>
                    ₹{program.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(183, 243, 74, 0.08)',
                  border: '1px dashed var(--accent-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <ShieldCheck size={28} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fff' }}>Razorpay Sandbox / Test Mode:</strong> Click "Confirm & Pay" to test the verified server-side transaction flow. No real financial charge will occur.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} className="btn-secondary" disabled={isProcessing}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleCompletePayment}
                  className="btn-primary"
                  disabled={isProcessing}
                  style={{ opacity: isProcessing ? 0.7 : 1 }}
                >
                  {isProcessing ? 'Processing Payment...' : `Confirm & Pay ₹${program.price.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Dashboard Access */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h4 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Welcome to DomainFit!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 20px' }}>
                Your enrollment in <strong>{program.title}</strong> is verified. Your assigned coach has received your intake questionnaire.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '24px',
                }}
              >
                Transaction Ref: <code style={{ color: 'var(--accent-primary)' }}>{transactionId}</code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/dashboard');
                  }}
                  className="btn-primary"
                  style={{ padding: '12px 28px' }}
                >
                  <span>Go to Client Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
